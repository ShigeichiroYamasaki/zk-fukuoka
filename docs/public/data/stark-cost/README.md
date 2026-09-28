# Session 13: STARK cost data

`model.csv`: educational accounting from `scripts/stark-cost-model.py`, not measurements and not security estimates. n=2^10..2^24; q=20,30,40,60; b=8; w=8; one composition column; base/extension/digest widths=8/16/32 bytes; binary FRI; terminal evaluation table of 256 elements; independent, uncompressed Merkle paths. Excludes protocol metadata, out-of-domain openings, masking overhead and other scheme-specific messages. KiB = 1024 bytes.

`winterfell-lamport.csv`: published Winterfell README data, inspected September 28, 2026. Snapshot:
https://github.com/facebook/winterfell/blob/2f78ee9bf667a561bdfcdfa68668d0f9b18b8315/README.md#performance

Lamport+ signature verification; 22 trace columns; source-labeled 123-bit security; Intel Core i9-9980KH @ 2.4 GHz, 32 GB RAM, eight-core machine. KB is retained as reported, not reinterpreted as KiB. The table does not fully specify the measurement revision, date, verifier threading, hash/FRI parameters, warm-up or timing boundaries. The snapshot revision is a citation anchor, not an assertion that the measurements used that revision. These are published historical results, not a benchmark run by ZK Fukuoka, and not a 2026 performance ranking.

The byte model counts, for each query, three committed-table authentication paths and one paired-leaf authentication path per FRI round, independently (without shared-path compression). It then adds queried field elements, the full terminal table, and commitment roots. For trace length `n`, blowup `b`, query count `q`, digest width `H`, base-field element width `B`, extension-field element width `E`, trace width `w`, composition-column count `c`, LDE size `N=n*b`, and binary FRI rounds `r=log2(N/terminal_size)`, the counted payload is:

`q·(2wB + cE + 2rE) + qH·(3log2(N) + Σ[j=1..r](log2(N)-j)) + terminal_size·E + (3+r)H`

The matching hash-work count is the digest count in the second term; FRI fold checks are `q·r`. These are operation counts, not wall-clock verifier time. This deliberately simplified model omits protocol-specific openings, deduplication, transcript/serialization metadata, zero-knowledge masking overhead, and optimizations. It is a teaching aid, not a general STARK proof-size estimator.

Generate the CSV and graphs, with Python standard library only: `python3 scripts/stark-cost-model.py && python3 scripts/generate-stark-cost-plots.py`. Numerical model generation includes independent serialization checks.
