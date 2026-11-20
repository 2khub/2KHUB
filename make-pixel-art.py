"""Convert the site's artwork into small palette-limited pixel art.
Run `python make-pixel-art.py` after adding wrestlers or belts; output goes to images/px and belts_images/px.
Needs Pillow (pip install pillow). The site falls back to the original photo when a pixel version is missing."""
from PIL import Image, ImageEnhance
import json, os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
BG = (24, 24, 40)          # portrait backdrop, matches the UI surface colour
os.chdir(ROOT)
os.makedirs('images/px', exist_ok=True)
os.makedirs('belts_images/px', exist_ok=True)

def _quant(rgb, colors):
    return rgb.quantize(colors=colors, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')

def portrait(src, dst, grid=48, colors=32):
    im = Image.open(src).convert('RGBA')
    w, h = im.size
    if h != w:
        side = min(w, h)
        im = im.crop(((w - side) // 2, 0, (w - side) // 2 + side, side))
    base = Image.new('RGBA', im.size, BG + (255,))
    base.alpha_composite(im)
    rgb = base.convert('RGB')
    rgb = ImageEnhance.Color(ImageEnhance.Contrast(rgb).enhance(1.15)).enhance(1.15)
    rgb = rgb.resize((grid, grid), Image.BOX)
    q = rgb.quantize(colors=colors, method=Image.MEDIANCUT, dither=Image.NONE)
    q.save(dst, optimize=True)

def sprite(src, dst, size, colors=16, box=None, bg=None, boost=1.1):
    """size = (w, h) with one side None to keep the aspect. Keeps transparency (hard edged)."""
    im = Image.open(src).convert('RGBA')
    if box: im = im.crop(box)
    w, h = im.size
    tw, th = size
    if tw is None: tw = max(1, round(w * th / h))
    if th is None: th = max(1, round(h * tw / w))
    if bg:
        b = Image.new('RGBA', im.size, bg + (255,)); b.alpha_composite(im); im = b
    im = im.resize((tw, th), Image.BOX)
    a = im.getchannel('A').point(lambda v: 255 if v >= 110 else 0)
    rgb = ImageEnhance.Color(ImageEnhance.Contrast(im.convert('RGB')).enhance(boost)).enhance(boost)
    rgb = _quant(rgb, colors)
    out = rgb.convert('RGBA'); out.putalpha(a)
    out.save(dst, optimize=True)

n = 0
# ---- wrestler portraits ----
d = json.load(open('data/superstars.json', encoding='utf-8'))
imgs = set()
for s in d['superstars']:
    imgs.add(s['img'])
    for o in s.get('overrides', {}).values():
        if 'img' in o: imgs.add(o['img'])
for p in sorted(imgs):
    portrait(p, 'images/px/' + os.path.basename(p).rsplit('.', 1)[0] + '.png'); n += 1
print('portraits', n)

# ---- logos ----
sprite('logo.png', 'images/px/logo.png', (None, 36), 16, boost=1.0)
# ---- title belts ----
m = 0
for f in glob.glob('belts_images/*.png'):
    sprite(f, 'belts_images/px/' + os.path.basename(f), (None, 32), 24, boost=1.05); m += 1
print('belts', m)

tot = sum(os.path.getsize(f) for f in glob.glob('images/px/*.png')) + sum(os.path.getsize(f) for f in glob.glob('belts_images/px/*.png'))
print('files', len(glob.glob('images/px/*.png')) + m, 'total KB', tot // 1024)
