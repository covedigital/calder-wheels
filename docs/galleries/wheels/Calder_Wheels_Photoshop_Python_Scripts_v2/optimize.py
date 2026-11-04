#!/usr/bin/env python3
"""Convert approved transparent PNG composites to 1600px WebP."""
import argparse
from pathlib import Path
from PIL import Image
def main():
    p=argparse.ArgumentParser()
    p.add_argument("--root",required=True,type=Path)
    p.add_argument("--size",type=int,default=1600)
    args=p.parse_args()
    source=args.root.expanduser().resolve()/"output"
    dest=args.root.expanduser().resolve()/"webp"
    dest.mkdir(parents=True,exist_ok=True)
    files=sorted(source.glob("calder-*.png"))
    if not files: raise SystemExit(f"No PNG files in {source}")
    for path in files:
        with Image.open(path) as im:
            im=im.convert("RGBA")
            im.thumbnail((args.size,args.size),Image.Resampling.LANCZOS)
            canvas=Image.new("RGBA",(args.size,args.size),(0,0,0,0))
            canvas.alpha_composite(im,((args.size-im.width)//2,(args.size-im.height)//2))
            canvas.save(dest/(path.stem+".webp"),"WEBP",quality=90,method=6)
    print(f"Exported {len(files)} WebP images to {dest}")
if __name__=="__main__":main()
