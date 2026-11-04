# Calder Wheels — Photoshop Batch Rendering

## Requirements
- macOS with Adobe Photoshop supporting File > Scripts > Browse and ExtendScript JSX.
- Python 3.9+; `python3 -m pip install Pillow` for WebP conversion.
- Six manually calibrated PSD masters, one per design. **The scripts do not align source PNGs automatically.**

## Folder layout
```
~/CalderRender/
  masters/
    calder-201-master.psd
    calder-202-master.psd
    calder-203-master.psd
    calder-205-master.psd
    calder-206-master.psd
    calder-207-master.psd
  output/
```
Copy `build_jobs.py`, `render.jsx`, and `optimize.py` into `"/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/galleries/wheels/CalderRender"`.

## PSD structure (exact case-sensitive names)
Each master PSD needs three **top-level layer groups**:
- `CENTER` with `disk-ti`, `disk-bt`, `disk-gb`
- `BARREL` with `barrel-gb`, `barrel-gbl`
- `HARDWARE` with `24pcs-bk`, `24pcs-ch` for designs 201, 202, 206, 207; `30pcs-bk`, `30pcs-ch` for 203, 205.

Optional `FRONT_LIP` and `BACKGROUND` groups may remain visible. Calibrate all component layers, masking, perspective, and overlap manually. The renderer only switches visibility and exports. Use transparent backgrounds for transparent output.

**Important:** Source filenames with `.1.png` suffixes should be imported into Photoshop and renamed to the exact layer names above. The source files themselves need not be renamed.

## First design pilot
```
cd "/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/galleries/wheels/CalderRender"
python3 build_jobs.py --root "/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/galleries/wheels/CalderRender" --design 201
```
In Photoshop: **File > Scripts > Browse > render.jsx**. When prompted, select `"/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/galleries/wheels/CalderRender/jobs.json"`.
Inspect all 12 PNGs and `render-log.txt` before expanding.

## All six designs
```
python3 build_jobs.py --root "/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/galleries/wheels/CalderRender"
```
Run `render.jsx` again. Expect 72 PNGs if all masters are valid.

## Shopify WebP
```
python3 -m pip install Pillow
python3 optimize.py --root "/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/galleries/wheels/CalderRender"
```
Optimized WebP files appear in `"/Users/admin/Projects/Autonomous Agent/1 - Projects/Calder Wheels/docs/galleries/wheels/CalderRender/webp/"`.

## Quality / launch checks
- Inspect source alpha transparency; white previews may indicate opaque backgrounds.
- Verify matching wheel geometry, disk perspective, barrel front-lip occlusion, and bolt placement.
- Approve a contact sheet of each design before publishing.
- Do not infer sellable inventory from these 72 visual combinations.
- Maintain a separate inventory/variant mapping for the Shopify configurator.
- Render jobs do not edit/save PSD masters; Photoshop closes them without saving.
