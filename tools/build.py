import os,glob,sys
def cat(d): return '\n'.join(open(f,encoding='utf-8').read() for f in sorted(glob.glob(d+'/*')))
head='<title>EOS 1 – G4 Maths Revision Trail</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@600;700;800;900&display=swap">\n<style>'
out='\n'.join([head,cat('src/css'),'</style>\n<div id="app"></div>\n<script>',cat('src/js'),'</script>'])
dst=sys.argv[1] if len(sys.argv)>1 else 'dist/index.html'
os.makedirs(os.path.dirname(dst) or '.',exist_ok=True); open(dst,'w',encoding='utf-8').write(out); print(dst,len(out))
