#!/usr/bin/env python3
"""Generate Photoshop render jobs from six Calder design masters."""
import argparse, itertools, json
from pathlib import Path

DESIGNS = (201, 202, 203, 205, 206, 207)
def main():
    p=argparse.ArgumentParser()
    p.add_argument("--root", type=Path, required=True)
    p.add_argument("--design", type=int, choices=DESIGNS)
    args=p.parse_args()
    root=args.root.expanduser().resolve()
    jobs=[]
    for design in ([args.design] if args.design else DESIGNS):
        master=root/"masters"/f"calder-{design}-master.psd"
        if not master.is_file():
            raise SystemExit(f"Missing master PSD: {master}")
        for center, barrel, hardware in itertools.product(("ti","bt","gb"),("gb","gbl"),("bk","ch")):
            jobs.append({
                "design":design,
                "master":str(master),
                "center":f"disk-{center}",
                "barrel":f"barrel-{barrel}",
                "hardware":f"{30 if design in (203,205) else 24}pcs-{hardware}",
                "output":str(root/"output"/f"calder-{design}-{center}-{barrel}-{hardware}.png")
            })
    (root/"output").mkdir(parents=True,exist_ok=True)
    target=root/"jobs.json"
    target.write_text(json.dumps({"jobs":jobs},indent=2))
    print(f"Created {len(jobs)} jobs at {target}")
if __name__=="__main__": main()
