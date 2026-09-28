"""Render reproducible, bilingual SVG plots from the checked-in STARK cost CSVs."""
from pathlib import Path
import csv
import html

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'docs/public/data/stark-cost'
OUT = ROOT / 'docs/public/figures'
OUT.mkdir(parents=True, exist_ok=True)

rows = list(csv.DictReader((DATA / 'model.csv').open()))
bench = list(csv.DictReader((DATA / 'winterfell-lamport.csv').open()))
COLORS = ['#00796b', '#285bbb', '#ac4e00']
W, H = 960, 550

def esc(s):
    return html.escape(str(s), quote=True)

def svg_start(title, desc):
    return [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">',
            '<style>text{font-family:system-ui,-apple-system,"Noto Sans JP",sans-serif;fill:#243449}.grid{stroke:#cbd5df;stroke-width:1}.axis{stroke:#34495e;stroke-width:1.5}.line{fill:none;stroke-width:3}.dot{stroke:#fff;stroke-width:1.5}.small{font-size:14px}.label{font-size:16px}.title{font-size:22px;font-weight:700}</style>',
            f'<title id="title">{esc(title)}</title><desc id="desc">{esc(desc)}</desc>',
            '<rect width="100%" height="100%" fill="#fff"/>']

def text(x, y, value, cls='label', anchor='middle', rotate=None):
    transform = f' transform="rotate({rotate} {x} {y})"' if rotate else ''
    return f'<text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}"{transform}>{esc(value)}</text>'

def panel(lines, x, y, width, height, xs, series, xticks, yticks, xlabel, ylabel, title, yformat=lambda n: str(n)):
    left, right, top, bottom = x + 76, x + width - 24, y + 56, y + height - 68
    out = [text(x + width / 2, y + 27, title, 'title')]
    ymin = min(yticks); ymax = max(yticks)
    for v in yticks:
        yy = bottom - (v - ymin) / (ymax - ymin) * (bottom - top)
        out.extend([f'<line x1="{left}" y1="{yy:.1f}" x2="{right}" y2="{yy:.1f}" class="grid"/>', text(left - 10, yy + 5, yformat(v), 'small', 'end')])
    out.extend([f'<line x1="{left}" y1="{top}" x2="{left}" y2="{bottom}" class="axis"/>', f'<line x1="{left}" y1="{bottom}" x2="{right}" y2="{bottom}" class="axis"/>'])
    xmin, xmax = min(xs), max(xs)
    for xv, label in xticks:
        xx = left + (xv - xmin) / (xmax - xmin) * (right - left)
        out.extend([f'<line x1="{xx:.1f}" y1="{top}" x2="{xx:.1f}" y2="{bottom}" class="grid"/>', text(xx, bottom + 23, label, 'small')])
    out.extend([text((left + right) / 2, y + height - 15, xlabel, 'label'), text(x + 17, (top + bottom) / 2, ylabel, 'label', rotate=-90)])
    for j, vals in enumerate(series):
        pts = []
        for xv, yv in zip(xs, vals):
            xx = left + (xv - xmin) / (xmax - xmin) * (right - left)
            yy = bottom - (yv - ymin) / (ymax - ymin) * (bottom - top)
            pts.append((xx, yy))
        out.append(f'<polyline class="line" stroke="{COLORS[j % len(COLORS)]}" points="' + ' '.join(f'{a:.1f},{b:.1f}' for a,b in pts) + '"/>')
        out.extend(f'<circle class="dot" fill="{COLORS[j % len(COLORS)]}" cx="{a:.1f}" cy="{b:.1f}" r="5"/>' for a,b in pts)
    return out

exponents = sorted({int(r['trace_length']).bit_length()-1 for r in rows})
xs = exponents
xticks = [(v, f'2^{v}') for v in exponents]
qvals = [20, 40, 60]
size_series = [[next(int(r['total_bytes']) / 1024 for r in rows if int(r['queries']) == q and int(r['trace_length']).bit_length()-1 == k) for k in xs] for q in qvals]
lines = svg_start('STARK proof-size model | STARK証明サイズモデル', 'Estimate from an explicit independent-Merkle-path byte model; not a measurement.')
lines += panel(lines, 10, 5, 940, 475, xs, size_series, xticks, [0,100,200,300,400,500], 'Trace length n (log₂) / トレース長 n (log₂)', 'Counted payload (KiB) / 算定通信量 (KiB)', 'Model only / モデル値のみ')
for j,q in enumerate(qvals):
    x=160+j*220
    lines.append(f'<line x1="{x}" y1="520" x2="{x+28}" y2="520" stroke="{COLORS[j]}" stroke-width="3"/>')
    lines.append(text(x+36,525,f'q = {q} queries / 問い合わせ', 'small','start'))
lines.append('</svg>')
(OUT/'stark-size-model.svg').write_text('\n'.join(lines))

q = 30
subset = [r for r in rows if int(r['queries']) == q]
work_x = [int(r['trace_length']).bit_length()-1 for r in subset]
work_ticks = [(v,f'2^{v}') for v in work_x]
lines = svg_start('STARK verification-work model | STARK検証作業モデル', 'Counts of Merkle sibling digests and FRI folds, not verification time.')
lines += panel(lines, 0, 0, 480, 490, work_x, [[int(r['internal_hashes']) for r in subset]], work_ticks, [0,3000,6000,9000,12000], 'Trace length n (log₂) / トレース長 n (log₂)', 'Merkle sibling digests / 認証ハッシュ数', 'q = 30 / 問い合わせ30回',lambda n:f'{n:,}')
lines += panel(lines, 480, 0, 480, 490, work_x, [[int(r['fold_checks']) for r in subset]], work_ticks, [0,150,300,450,600], 'Trace length n (log₂) / トレース長 n (log₂)', 'FRI fold checks / FRI折り畳み検査数', 'Operation counts / 操作回数',lambda n:f'{n:,}')
lines.append('</svg>')
(OUT/'stark-verifier-model.svg').write_text('\n'.join(lines))

sig = [int(r['signatures']) for r in bench]
inds = list(range(len(sig)))
indticks = list(zip(inds, [str(x) for x in sig]))
lines = svg_start('Winterfell published benchmark | Winterfell公開実測値', 'Historical published measurements for Lamport+ signature verification, 123-bit security, Intel Core i9-9980KH, eight cores.')
lines += panel(lines, 0, 0, 480, 490, inds, [[float(r['proof_size_KB_as_reported']) for r in bench]], indticks, [0,40,80,120,160], '# signatures / 署名の数', 'Proof size (KB, as reported) / 証明サイズ (KB, 原資料表記)', 'Published proof sizes / 公開証明サイズ')
lines += panel(lines, 480, 0, 480, 490, inds, [[float(r['verifier_ms']) for r in bench]], indticks, [0,1.5,3,4.5,6], '# signatures / 署名の数', 'Verifier time (ms) / 検証時間 (ms)', 'Published verifier times / 公開検証時間',lambda n:f'{n:g}')
lines.append(text(W/2, 505, 'Historical workload-specific results; not a current speed ranking. / 過去の特定計算例であり，現在の速度順位ではない．','small'))
lines.append('</svg>')
(OUT/'stark-winterfell-published.svg').write_text('\n'.join(lines))
print('Generated three bilingual SVG graphs in docs/public/figures/.')
