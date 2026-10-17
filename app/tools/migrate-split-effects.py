import re,os,sys
p='work/src/effects.ts'; s=open(p).read().split('\n')
start=next(i for i,l in enumerate(s) if l.startswith('export const EFFECTS={'))
end=next(i for i in range(start,len(s)) if s[i]=='};')
pre=s[:start]; post=s[end+1:]; lit=s[start+1:end]
names={'3D':'objects3d','shapes':'shapes','generators':'generators','media':'media','filters (input & output premultiplied)':'filters','worlds':'worlds','world building blocks':'worldBlocks','motion':'motionText','motion design':'motionDesign','particles (drawn as GL points, see drawPoints)':'particles'}
groups=[];cur=None
for l in lit:
    m=re.match(r'/\* ---------- (.+?) ---------- \*/',l)
    if m: cur=[names[m.group(1)],m.group(1),[]]; groups.append(cur); continue
    cur[2].append(l)
os.makedirs('work/src/effects',exist_ok=True)
NL='\n'
helpers=NL.join(pre[1:]).replace("from './","from '../")
open('work/src/effects/helpers.ts','w').write('// @ts-nocheck'+NL+helpers+NL)
imp_names=re.findall(r'^export (?:const|function) (\w+)',helpers,re.M)
for key,title,body in groups:
    txt=NL.join(body).rstrip().rstrip(',')
    used=[n for n in imp_names if re.search(r'\b'+n+r'\b',txt)]
    head='// @ts-nocheck'+NL
    if used: head+='import { '+', '.join(used)+" } from './helpers';"+NL
    if 'EASE_NAMES' in txt: head+="import { EASE_NAMES } from '../palettes';"+NL
    open('work/src/effects/'+key+'.ts','w').write(head+NL+'/** '+title+' */'+NL+'export const '+key+'={'+NL+txt+NL+'};'+NL)
idx='// @ts-nocheck'+NL+''.join("import { "+k+" } from './"+k+"';"+NL for k,_,_ in groups)
rest=NL.join(post)
used=[n for n in imp_names if re.search(r'\b'+n+r'\b',rest)]
idx+='import { '+', '.join(used)+" } from './helpers';"+NL+"export * from './helpers';"+NL+NL
idx+='/** All layer types. Key = layer.type. Each: kind, name, desc, params, main, code (GLSL `vec4 fx()`), optional lib/passes/feedback/points/setU. */'+NL
idx+='export const EFFECTS={'+','.join('...'+k for k,_,_ in groups)+'};'+NL+rest+NL
open('work/src/effects/index.ts','w').write(idx)
os.remove(p)
print([g[0] for g in groups])
