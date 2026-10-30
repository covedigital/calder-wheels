# Calder Gallery — Metaobject Setup

To enable the full gallery system, create a **Gallery Build** metaobject in Shopify Admin:

**Admin Path:** Settings → Custom Data → Metaobjects → Add Definition

## Definition: Gallery Build

| Field | Type | Description |
|-------|------|-------------|
| `title` | Single Line Text | Display title for the build |
| `slug` / `handle` | Single Line Text | URL handle for the detail page |
| `gallery_type` | Single Line Text or Select | `vehicle` or `wheel` |
| `featured_image` | File (Image) | Primary card image |
| `gallery_images` | File (List of Images) | Multiple gallery images for detail page |
| `vehicle_year` | Single Line Text | e.g. `2024` |
| `vehicle_make` | Single Line Text | e.g. `Cadillac` |
| `vehicle_model` | Single Line Text | e.g. `Escalade` |
| `vehicle_trim` | Single Line Text | e.g. `Premium Luxury` |
| `wheel_model` | Single Line Text | e.g. `C1-01` |
| `wheel_series` | Single Line Text | e.g. `Forged Series` |
| `wheel_product` | Product | Link to the Shopify product |
| `front_wheel_size` | Single Line Text | e.g. `24"` |
| `rear_wheel_size` | Single Line Text | e.g. `24"` |
| `center_finish` | Single Line Text | e.g. `Gloss Black` |
| `lip_finish` | Single Line Text | e.g. `Polished` |
| `bolt_finish` | Single Line Text | e.g. `Chrome` |
| `overall_finish` | Single Line Text | e.g. `Brushed Clear` |
| `construction` | Single Line Text | e.g. `Forged Monoblock` |
| `tire_brand` | Single Line Text | e.g. `Michelin` |
| `front_tire_size` | Single Line Text | e.g. `275/35ZR20` |
| `rear_tire_size` | Single Line Text | e.g. `315/30ZR22` |
| `fitment_notes` | Multi Line Text | Free-text fitment description |
| `featured` | Boolean | Show in featured sections |
| `sort_order` | Number | Manual sort ordering |
| `seo_title` | Single Line Text | Meta title |
| `seo_description` | Multi Line Text | Meta description |

## How it works

1. Create the metaobject definition in Shopify Admin  
2. Add entries for each gallery build  
3. Set `gallery_type` to `vehicle` or `wheel`  
4. Upload images for each entry  
5. Link to products where applicable  
6. The gallery pages auto-detect and render metaobject entries  

## Fallback

If metaobjects are not yet set up, gallery entries can be added via section blocks in the theme editor (Add Block → Gallery Build / Wheel Gallery Entry).