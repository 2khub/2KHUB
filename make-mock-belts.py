"""Draws the made-up title belts used by the match card maker (belts/*.png).
Every belt is invented here, pixel by pixel: no real championship artwork is used.
Run `python make-mock-belts.py` to rebuild them."""
import os
from PIL import Image

W, H = 68, 32
OUT = 'belts'
os.makedirs(OUT, exist_ok=True)


def hexc(h, a=255):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def shade(c, k):
    return (max(0, min(255, int(c[0] * k))), max(0, min(255, int(c[1] * k))), max(0, min(255, int(c[2] * k))), 255)


class Canvas:
    def __init__(self):
        self.im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        self.px = self.im.load()

    def dot(self, x, y, c):
        if 0 <= x < W and 0 <= y < H:
            self.px[x, y] = c

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.dot(x, y, c)

    def ellipse(self, cx, cy, rx, ry, c):
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1:
                    self.dot(x, y, c)

    def outline(self, c):
        """one pixel dark edge around everything drawn so far"""
        src = self.im.copy().load()
        for y in range(H):
            for x in range(W):
                if src[x, y][3] == 0:
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < W and 0 <= ny < H and src[nx, ny][3] > 0:
                            self.px[x, y] = c
                            break


def strap(cv, c, edge):
    # the leather band across the whole belt, with stitching
    cv.rect(2, 9, W - 3, 22, c)
    cv.rect(2, 9, W - 3, 9, shade(c, 1.25))
    cv.rect(2, 22, W - 3, 22, shade(c, .7))
    for x in range(5, W - 5, 4):
        cv.dot(x, 11, edge)
        cv.dot(x, 20, edge)
    cv.rect(0, 11, 1, 20, c)
    cv.rect(W - 2, 11, W - 1, 20, c)


def plate(cv, cx, cy, rx, ry, metal, gem, shape='oval', studs=True):
    dark, light = shade(metal, .62), shade(metal, 1.15)
    cv.ellipse(cx, cy, rx, ry, dark)
    cv.ellipse(cx, cy, rx - 1, ry - 1, metal)
    cv.ellipse(cx, cy - .6, rx - 2.6, ry - 2.6, light)
    cv.ellipse(cx, cy, rx - 3.4, ry - 3.4, shade(metal, .9))
    if shape == 'star':
        for d in range(-3, 4):
            cv.dot(cx + d, cy, light)
            cv.dot(cx, cy + d, light)
    # gem
    g = max(2, min(rx, ry) // 3)
    cv.ellipse(cx, cy, g, g, shade(gem, .6))
    cv.ellipse(cx, cy, g - 1, g - 1, gem)
    cv.dot(cx - 1, cy - 1, shade(gem, 1.7))
    if studs:
        for a, b in ((cx - rx + 2, cy), (cx + rx - 2, cy), (cx, cy - ry + 2), (cx, cy + ry - 2)):
            cv.dot(a, b, light)


def side_plate(cv, cx, cy, metal, gem):
    cv.rect(cx - 4, cy - 5, cx + 4, cy + 5, shade(metal, .62))
    cv.rect(cx - 3, cy - 4, cx + 3, cy + 4, metal)
    cv.rect(cx - 3, cy - 4, cx + 3, cy - 4, shade(metal, 1.3))
    cv.rect(cx - 1, cy - 1, cx + 1, cy + 1, gem)
    cv.dot(cx - 1, cy - 1, shade(gem, 1.7))


# id: (strap, stitch, metal, gem, layout)
BELTS = {
    'world':   ('#17171f', '#8a8ab4', '#e8b923', '#d8202c', 'big'),
    'heavy':   ('#6a1620', '#d9a0a0', '#d9d9e4', '#2e6fd9', 'big'),
    'mid':     ('#5a3a1a', '#c9a070', '#c0c4cc', '#2fa34a', 'mid'),
    'rising':  ('#3a4560', '#9fb0d0', '#c97a3a', '#e8b923', 'mid'),
    'tag':     ('#14284f', '#8fa6d8', '#d9d9e4', '#d8202c', 'twin'),
    'trios':   ('#3a1a5a', '#b890e0', '#e8b923', '#35c0e0', 'trio'),
    'w_world': ('#7a1a4a', '#f0a0c8', '#e8b923', '#ff5fa8', 'big'),
    'w_mid':   ('#0f5a5a', '#80d8d0', '#d9d9e4', '#ff9a3a', 'mid'),
    'w_tag':   ('#a02a6a', '#f4b0d4', '#d9d9e4', '#35c0e0', 'twin'),
}

for name, (s, st, m, g, layout) in BELTS.items():
    cv = Canvas()
    strap_c, stitch, metal, gem = hexc(s), hexc(st), hexc(m), hexc(g)
    strap(cv, strap_c, stitch)
    if layout == 'big':
        side_plate(cv, 9, 16, metal, gem)
        side_plate(cv, W - 10, 16, metal, gem)
        plate(cv, W // 2, 16, 15, 14, metal, gem, 'star')
    elif layout == 'mid':
        side_plate(cv, 11, 16, metal, gem)
        side_plate(cv, W - 12, 16, metal, gem)
        plate(cv, W // 2, 16, 12, 11, metal, gem)
    elif layout == 'twin':
        plate(cv, 19, 16, 10, 10, metal, gem)
        plate(cv, W - 20, 16, 10, 10, metal, gem)
        side_plate(cv, W // 2, 16, metal, gem)
    else:  # trio
        plate(cv, 15, 16, 8, 9, metal, gem)
        plate(cv, W // 2, 16, 11, 12, metal, gem, 'star')
        plate(cv, W - 16, 16, 8, 9, metal, gem)
    cv.outline((10, 10, 16, 255))
    cv.im.save(os.path.join(OUT, name + '.png'))
print('belts', len(BELTS))
