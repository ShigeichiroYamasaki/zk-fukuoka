"""Educational byte/work accounting, NOT a STARK implementation or security estimator.
Run: python3 scripts/stark-cost-model.py
Assumes independent binary Merkle paths, paired FRI leaves, full terminal table.
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/public/data/stark-cost'

def estimate(n=2**16, q=30, b=8, w=8, base_bytes=8, extension_bytes=16,
             digest_bytes=32, terminal_size=256, composition_columns=1):
    for name, value in [('n',n),('b',b),('terminal_size',terminal_size)]:
        if not isinstance(value,int) or value <= 0 or value & (value-1):
            raise ValueError(f'{name} must be a positive power of two')
    for value in [q,w,base_bytes,extension_bytes,digest_bytes,composition_columns]:
        if not isinstance(value,int) or value <= 0:
            raise ValueError('Counts and byte widths must be positive integers')
    N=n*b
    if N <= terminal_size:
        raise ValueError('This model requires N > terminal_size')
    k=N.bit_length()-1
    r=k-(terminal_size.bit_length()-1)
    # Layer l has N / 2**l evaluations grouped in pairs in N / 2**(l+1) leaves.
    path_hashes=q*(3*k + r*k-r*(r+1)//2)
    evaluation_bytes=q*(2*w*base_bytes+composition_columns*extension_bytes+2*r*extension_bytes)
    authentication_bytes=path_hashes*digest_bytes
    terminal_bytes=terminal_size*extension_bytes
    # Three committed base tables (trace columns are packed into row leaves,
    # plus composition and constraint data) and one root per FRI round.
    root_bytes=(3+r)*digest_bytes
    return dict(trace_length=n,queries=q,lde_size=N,fri_rounds=r,
                evaluation_bytes=evaluation_bytes,authentication_bytes=authentication_bytes,
                terminal_bytes=terminal_bytes,root_bytes=root_bytes,
                total_bytes=evaluation_bytes+authentication_bytes+terminal_bytes+root_bytes,
                internal_hashes=path_hashes,leaf_hashes=q*(3+r),fold_checks=q*r)

def verify():
    # Independent traversal / serialization accounting for each tree, without the closed-form sum.
    for n in [1024,65536,2**24]:
        for q in [1,30,60]:
            e=estimate(n=n,q=q); N=n*8
            payload=bytearray((3+e['fri_rounds'])*32+256*16)
            hashes=folds=leaves=0
            for _ in range(q):
                for width in [8*8,8*8,16]:
                    payload.extend(bytes(width)); leaves+=1
                    nodes=N
                    while nodes>1:
                        payload.extend(bytes(32)); hashes+=1; nodes//=2
                domain=N
                while domain>256:
                    payload.extend(bytes(2*16)); folds+=1; leaves+=1
                    nodes=domain//2
                    while nodes>1:
                        payload.extend(bytes(32)); hashes+=1; nodes//=2
                    domain//=2
            assert len(payload)==e['total_bytes']
            assert (hashes,leaves,folds)==(e['internal_hashes'],e['leaf_hashes'],e['fold_checks'])
    e=estimate()
    assert (e['total_bytes'],e['internal_hashes'],e['fold_checks'])==(211424,6000,330)
    for args in [dict(n=1000),dict(q=0),dict(n=1),dict(b=3)]:
        try: estimate(**args)
        except ValueError: pass
        else: raise AssertionError(args)

if __name__=='__main__':
    verify(); OUT.mkdir(parents=True,exist_ok=True)
    rows=[estimate(n=2**k,q=q) for q in [20,30,40,60] for k in range(10,25,2)]
    with (OUT/'model.csv').open('w',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=rows[0].keys(),lineterminator='\n');writer.writeheader();writer.writerows(rows)
    print(json.dumps(estimate(),indent=2))
    print('Independent tree traversal and byte counts verified; model.csv written.')
