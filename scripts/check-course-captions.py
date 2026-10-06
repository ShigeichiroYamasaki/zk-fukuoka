"""Audit captions in the built bilingual lessons; run after docs:build."""
from html.parser import HTMLParser
from pathlib import Path
import re

class Node:
    def __init__(self, tag='', attrs=(), parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []
    def text(self):
        return ' '.join(c if isinstance(c, str) else c.text() for c in self.children)
    def find(self, tag=None, cls=None):
        for c in self.children:
            if isinstance(c, Node):
                if (tag is None or c.tag == tag) and (cls is None or cls in c.attrs.get('class','').split()):
                    yield c
                yield from c.find(tag, cls)

class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(); self.root = self.current = Node(); self.feed(html)
    def handle_starttag(self, tag, attrs):
        n=Node(tag, attrs, self.current); self.current.children.append(n)
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:
            self.current=n
    def handle_endtag(self, tag):
        n=self.current
        while n.parent and n.tag!=tag: n=n.parent
        if n.parent: self.current=n.parent
    def handle_data(self, data): self.current.children.append(data)

base=Path(__file__).resolve().parents[1]/'docs/.vitepress/dist'
totals=[0,0]
for session in [f'{n:02}' for n in range(1,16)]+['01-illustrated']:
    ids=[]
    for locale in ['', 'en/']:
        file=base/locale/'learn'/f'session-{session}.html'
        doc=Document(file.read_text()).root
        source=(base.parents[1]/locale/'learn'/f'session-{session}.md').read_text()
        markdown_tables=len(re.findall(r'^\|\s*:?-{3,}', source, re.M))
        assert markdown_tables==len(list(doc.find('table'))), (file, 'every table must originate in Markdown')
        assert '<CaptionedTable' not in source and '<table' not in source, (file, 'component or HTML table in lesson source')
        found=[]
        for kind in ['figure','table']:
            numbers=[]
            for node in doc.find(kind):
                cap=next(node.find('figcaption' if kind=='figure' else 'caption'),None)
                if cap is None and kind=='table':
                    parent=node.parent
                    while parent and 'captioned-table' not in parent.attrs.get('class','').split(): parent=parent.parent
                    if parent: cap=next(parent.find(cls='table-caption'),None)
                assert cap is not None, f'{file}: uncaptioned {kind}'
                label=cap.text().strip()
                m=re.match(r'(?:Figure|図)\s+(\d\d-\d+)\s*[:：]?\s*(.+)' if kind=='figure' else r'(?:Table|表)\s+(\d\d-\d+)\s*[:：]?\s*(.+)',label)
                assert m and m[1].startswith(session[:2]+'-'), (file,kind,label)
                numbers.append(m[1])
            assert len(numbers)==len(set(numbers)), (file,kind,'duplicate numbers')
            if session=='02':
                assert numbers==[f'02-{i}' for i in range(1,len(numbers)+1)], (file,kind,'numbers must follow reading order',numbers)
            found.append(numbers)
        ids.append(found)
        if locale=='' and session!='01-illustrated':
            totals=[a+len(b) for a,b in zip(totals,found)]
    assert ids[0]==ids[1], (session,'locale numbering mismatch')
assert totals==[15,72], totals
print(f'15 bilingual lessons: {totals[0]} figures and {totals[1]} tables per locale have unique numbered captions; illustrated Session 1 also checked.')
