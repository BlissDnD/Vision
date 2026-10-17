"""Runs every tests/*.js against dist/latomas.test.html and fails on errors.
A test fails when its output contains 'ERR', a page error, a console error, or a non-empty "bad" list."""
import subprocess, sys, glob, os, re
here=os.path.dirname(os.path.abspath(__file__)); root=os.path.dirname(here)
html=os.path.join(root,'dist','latomas.test.html'); failed=[]
for t in sorted(glob.glob(os.path.join(here,'*.js'))):
    name=os.path.basename(t)[:-3]
    p=subprocess.run([sys.executable,os.path.join(here,'run.py'),html,t],capture_output=True,text=True,timeout=900)
    out=p.stdout+p.stderr
    bad=(p.returncode!=0 or 'ERR ' in out or '[pageerror]' in out or '[error]' in out or re.search(r'"bad":\s*\[\s*"',out))
    print(('FAIL ' if bad else 'ok   ')+name)
    if bad: failed.append(name); print(out[-2000:])
print(f'{len(failed)} failed' if failed else 'all tests passed'); sys.exit(1 if failed else 0)
