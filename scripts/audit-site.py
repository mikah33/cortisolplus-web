#!/usr/bin/env python3
"""Audit built canonical pages for broken links, orphan pages and metadata collisions.
Run after npm run build. Uses only Python's standard library.
"""
import collections
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids, self.metadata = [], set(), {}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'meta':
            self.metadata[attrs.get('name')] = attrs.get('content')

root = Path('dist')
routes = json.loads((root / 'release.json').read_text())['routes']
pages, titles, descriptions = {}, collections.defaultdict(list), collections.defaultdict(list)
for route in routes:
    page = Page()
    page.feed((root / route['path'].strip('/') / 'index.html').read_text())
    pages[route['path']] = page
    titles[route['title']].append(route['path'])
    descriptions[page.metadata.get('description')].append(route['path'])
incoming, errors = collections.Counter(), []
for path, page in pages.items():
    for href in set(page.links):
        if not href.startswith('/') or href.startswith('//'):
            continue
        url = urlsplit(href)
        target = url.path.rstrip('/') + '/'
        if target in pages:
            if target != path:
                incoming[target] += 1
            if url.fragment and unquote(url.fragment) not in pages[target].ids:
                errors.append({'source': path, 'href': href, 'reason': 'missing fragment'})
        elif not (root / url.path.lstrip('/')).exists():
            errors.append({'source': path, 'href': href, 'reason': 'missing target'})
result = {
    'canonical_pages': len(pages), 'broken_internal_links': errors,
    'orphan_pages': sorted(p for p in pages if p != '/' and incoming[p] == 0),
    'duplicate_titles': [v for v in titles.values() if len(v) > 1],
    'duplicate_descriptions': [v for v in descriptions.values() if len(v) > 1],
    'missing_descriptions': descriptions.get(None, []),
    'inbound_linking_pages': dict(sorted(incoming.items())),
}
print(json.dumps(result, indent=2))
raise SystemExit(1 if errors or result['duplicate_titles'] or result['missing_descriptions'] else 0)
