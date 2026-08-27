import urllib.request
from rembg import remove
from PIL import Image

URL = "https://static.prod-images.emergentagent.com/jobs/70bf3d25-78e6-4068-8c2d-84dc73376afb/images/b1ab4e0acc23a8df3b7ae20e3bc1962f0f921bdd0aa1cb3496f1491ae558ec38.jpeg"
urllib.request.urlretrieve(URL, "/tmp/moto.jpg")
inp = Image.open("/tmp/moto.jpg")
out = remove(inp)
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)
out.save("/app/frontend/public/moto.png")
print("saved", out.mode, out.size)
