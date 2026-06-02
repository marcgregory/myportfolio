"""Split stacked dark/light background composite into two assets."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/backgrounds"
src = OUT / "bg-source.png"
if not src.is_file():
    raise SystemExit(f"Place composite at {src} (or run from repo after copying source).")
OUT.mkdir(parents=True, exist_ok=True)

img = Image.open(src).convert("RGB")
w, h = img.size
mid = h // 2

dark = img.crop((0, 0, w, mid))
light = img.crop((0, mid, w, h))

dark_path = OUT / "lower-sections-dark.jpg"
light_path = OUT / "lower-sections-light.jpg"

dark.save(dark_path, quality=92, optimize=True)
light.save(light_path, quality=92, optimize=True)

print(f"source: {src.name} ({w}x{h})")
print(f"dark:   {dark_path.relative_to(ROOT)} ({dark.size[0]}x{dark.size[1]})")
print(f"light:  {light_path.relative_to(ROOT)} ({light.size[0]}x{light.size[1]})")
