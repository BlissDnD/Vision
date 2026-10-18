"""Create a local, documented context ZIP. No upload, dependencies, .git or production dist."""
from pathlib import Path
import json,zipfile,hashlib
BASE=Path(__file__).resolve().parents[1]
ROOT=BASE.parents[1]
DEST=ROOT/'docs/vel-claude-handoff-2026-10-18.zip'
index=json.loads((BASE/'data/source-index.json').read_text())
with zipfile.ZipFile(DEST,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    prefix='vel-claude-handoff/'
    for f in sorted(BASE.rglob('*')):
        if f.is_file() and '__pycache__' not in f.parts:
            z.write(f,prefix+f.relative_to(ROOT).as_posix())
    for entry in index['files']:
        f=ROOT/entry['path']
        if hashlib.sha256(f.read_bytes()).hexdigest()!=entry['sha256']:
            raise RuntimeError('Source changed, refresh package snapshot: '+entry['path'])
        z.write(f,prefix+entry['path'])
    z.write(Path(index['externalInstructionFile']),prefix+'AGENTS.md')
    z.writestr(prefix+'00-README.md','''# Vel Claude handoff – context snapshot

Start: docs/claude-handoff/00-START-HERE.md

This ZIP contains the preparation package plus selected source, prototype, license and specification snapshots at their original repository-relative paths. It is not a complete, installable application checkout. No node_modules, .git, production dist or browser own-library data is included. The live Vel repository and current human approvals remain authoritative. Use the matching live repo for implementation; do not overwrite newer files with these snapshots. AGENTS.md here is a copy of the common parent instruction file.

The source-index records hashes and untracked/dirty source status. Work only on the agreed task write-set. The full inventory and addon sources are references, not required initial reading for every agent.
''')
with zipfile.ZipFile(DEST) as z:
    assert z.testzip() is None
    for entry in index['files']:
        assert hashlib.sha256(z.read('vel-claude-handoff/'+entry['path'])).hexdigest()==entry['sha256']
print(f'{DEST}\n{DEST.stat().st_size} bytes; {len(index["files"])} context sources verified')
