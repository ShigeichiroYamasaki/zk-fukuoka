"""Check Japanese course prose; leave code, math and legacy link IDs intact."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PROTECTED = re.compile(
    r'(^```[^\n]*\n.*?^```[^\n]*$|^~~~[^\n]*\n.*?^~~~[^\n]*$|'
    r'<script\b.*?</script>|`+[^`\n]*`+|\$\$.*?\$\$|'
    r'(?<!\\)\$(?!\$).*?(?<!\\)\$|\]\([^\n]*?\)|'
    r'https?://[^\s<>]+|\{#[^}]+\})', re.M | re.S)
VARIANTS = re.compile(r'[、。]|証人|信頼設定|知識健全性|知識抽出|special 健全性|binding性|hiding性|qSDH|list decoding|List Decoding|List decoding')
errors = []
files = sorted(p for folder in ('learn', 'exercises', 'rollup', 'zkml')
               for p in (ROOT / 'docs' / folder).rglob('*.md'))
for path in files:
    text = PROTECTED.sub(lambda m: '\n' * m.group().count('\n'), path.read_text())
    for num, line in enumerate(text.splitlines(), 1):
        if VARIANTS.search(line):
            errors.append(f'{path.relative_to(ROOT)}:{num}: {line}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'{len(files)} Japanese educational documents: punctuation and terminology variants checked.')
