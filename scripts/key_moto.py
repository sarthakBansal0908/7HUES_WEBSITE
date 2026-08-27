import urllib.request
from PIL import Image

URL = "https://static.prod-images.emergentagent.com/jobs/70bf3d25-78e6-4068-8c2d-84dc73376afb/images/68160a1b01875e9acbed717398d97489d7f441af921f1c9cfd1681c515320001.jpeg"
urllib.request.urlretrieve(URL, "/tmp/moto_green.jpg")
im = Image.open("/tmp/moto_green.jpg").convert("RGBA")
px = im.load()
w, h = im.size
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        # green dominant -> transparent
        if g > 95 and g > r * 1.35 and g > b * 1.35:
            px[x, y] = (r, g, b, 0)
        elif g > r and g > b and (g - max(r, b)) > 25:
            # soft edge de-spill: reduce green fringe
            ng = int((r + b) / 2)
            px[x, y] = (r, ng, b, a)
im = Image.alpha_composite(Image.new("RGBA", im.size, (0, 0, 0, 0)), im)
bbox = im.getbbox()
if bbox:
    im = im.crop(bbox)
im.save("/app/frontend/public/moto.png")
print("saved", im.mode, im.size)
