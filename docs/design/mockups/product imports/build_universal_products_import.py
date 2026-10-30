import csv, os

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, 'calder_universal_products_import_10-29-2026.csv')

# 2026-10-29 fixes vs the 10-28 -SAVE draft:
#   - 'Template suffix' = 'calder'  -> universal products render the universal PDP
#     template (product.calder.json); without it they get the default template
#     and the design experience never boots.
#   - design_code metafield is DASHED ('CLM-01') to match the live legacy
#     products ('CLB-06'); the theme gates normalize both forms.
#   - design_nickname carries the design number ('201'), matching legacy.
# SKU-first purchase lookup (registry + calder-config-resolver.js) resolves the
# exact sellable LEGACY variant by part_number; CFG- SKUs here are config
# anchors with qty 0 and are never submitted to the cart.

HEADER = ['Handle','Title','Body (HTML)','Vendor','Product Category','Type','Tags','Published','Option1 Name','Option1 Value','Option1 Linked To','Option2 Name','Option2 Value','Option2 Linked To','Option3 Name','Option3 Value','Option3 Linked To','Variant SKU','Variant Grams','Variant Inventory Tracker','Variant Inventory Qty','Variant Inventory Policy','Variant Fulfillment Service','Variant Price','Variant Compare At Price','Variant Requires Shipping','Variant Taxable','Unit Price Total Measure','Unit Price Total Measure Unit','Unit Price Base Measure','Unit Price Base Measure Unit','Variant Barcodes','Image Src','Image Position','Image Alt Text','Gift Card','SEO Title','SEO Description','bolt_pattern (product.metafields.custom.bolt_pattern)','construction (product.metafields.custom.construction)','dealer_moq (product.metafields.custom.dealer_moq)','dealer_tier_1_price (product.metafields.custom.dealer_tier_1_price)','dealer_tier_2_price (product.metafields.custom.dealer_tier_2_price)','dealer_tier_3_price (product.metafields.custom.dealer_tier_3_price)','design_code (product.metafields.custom.design_code)','design_nickname (product.metafields.custom.design_nickname)','hardware_rivet_finish_options (product.metafields.custom.hardware_rivet_finish_options)','is_configurable (product.metafields.custom.is_configurable)','lead_time_days (product.metafields.custom.lead_time_days)','load_rating (product.metafields.custom.load_rating)','series (product.metafields.custom.series)','Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)','Related products (product.metafields.shopify--discovery--product_recommendation.related_products)','Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)','Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)','Variant Image','Variant Weight Unit','Variant Tax Code','Cost per item','Template','Template suffix','Status','Variant Packed Length','Variant Packed Width','Variant Packed Height','Variant Packed Dimension Unit']

# Verified from SUV Data Sheet revised 10-21-26 + products_export_10-27-2026
# design display code -> (number tag, legacy design_code metafield, msrp by diameter, bolt patterns)
DESIGNS = [
    ('CLM-01', '201', 'CLM01', {22: '1000.00', 24: '1200.00', 26: '1400.00'}, ['6x135', '6x139']),
    ('CLM-02', '202', 'CLM02', {22: '1000.00', 24: '1200.00', 26: '1400.00'}, ['5x120', '5x130', '6x135', '6x139']),
    ('CLM-03', '203', 'CLM03', {22: '1000.00', 24: '1200.00', 26: '1400.00'}, ['6x135', '6x139']),
    ('CLM-05', '205', 'CLM05', {22: '1000.00', 24: '1200.00', 26: '1400.00'}, ['6x135', '6x139']),
    ('CLB-06', '206', 'CLB06', {22: '1100.00', 24: '1300.00', 26: '1500.00'}, ['5x120', '5x130', '6x135', '6x139']),
    ('CLB-07', '207', 'CLB07', {22: '1100.00', 24: '1300.00', 26: '1500.00'}, ['5x120', '5x130', '6x135', '6x139']),
]
DIAMETERS = [(22, '22"'), (24, '24"'), (26, '26"')]
CENTERS = [('Gloss Black', 'GB'), ('Black Titanium', 'BT'), ('Titanium Tint', 'TT')]
# Option3 combined label -> (lip display, lip code, bolt display, bolt code)  [verified from data sheet sheets]
# NOTE: ' / ' is forbidden in Shopify option names/values (variant-title separator)
LIP_BOLT = [
    ('Gloss Black Lip - Chrome Bolts', 'GBL', 'Chrome Bolts', 'CH'),
    ('Gloss Black Lip - Black Bolts', 'GBL', 'Black Bolts', 'BK'),
    ('Polished Lip - Chrome Bolts', 'POL', 'Chrome Bolts', 'CH'),
    ('Polished Lip - Black Bolts', 'POL', 'Black Bolts', 'BK'),
]

rows = []
for display, number, code, msrp, patterns in DESIGNS:
    handle = 'calder-' + display.lower() + '-wheel'  # calder-clm-01-wheel — matches registry canonical_handle
    body = ('<p>Calder {} is a spun forged SUV wheel built to order. '
            'Choose your diameter (22x10, 24x10 or 26x10), center finish (Gloss Black, Black Titanium or Titanium Tint), '
            'lip finish (Gloss Black or Polished) and hardware finish (Chrome or Black Bolts), '
            'then configure your exact build directly on this page.</p>').format(display)
    tags = ', '.join([number, 'Universal Design', 'Spun Forged', 'SUV', 'Wheel', 'Load Rating 2650 lbs'])
    seo_title = 'Calder {} Spun Forged SUV Wheel'.format(display)
    seo_desc = ('Calder {} spun forged SUV wheel in 22x10, 24x10 and 26x10. '
                'Configure center, lip and hardware finishes and order your exact build.').format(display)
    base = {
        'Handle': handle, 'Title': 'Calder ' + display, 'Body (HTML)': body,
        'Vendor': 'Calder Wheels', 'Product Category': '', 'Type': 'SUV Wheel - Spun Forged',
        'Tags': tags, 'Published': 'true',
        'Option1 Name': 'Diameter', 'Option1 Linked To': '',
        'Option2 Name': 'Center Finish', 'Option2 Linked To': '',
        'Option3 Name': 'Barrel & Lip - Hardware', 'Option3 Linked To': '',
        'Variant Grams': '0.0', 'Variant Inventory Tracker': 'shopify',
        'Variant Inventory Policy': 'deny', 'Variant Fulfillment Service': 'manual',
        'Variant Compare At Price': '', 'Variant Requires Shipping': 'true', 'Variant Taxable': 'true',
        'Gift Card': 'false', 'SEO Title': seo_title, 'SEO Description': seo_desc,
        'bolt_pattern (product.metafields.custom.bolt_pattern)': ', '.join(patterns),
        'construction (product.metafields.custom.construction)': 'Spun Forged',
        'dealer_moq (product.metafields.custom.dealer_moq)': "'4",
        'dealer_tier_1_price (product.metafields.custom.dealer_tier_1_price)': '',
        'dealer_tier_2_price (product.metafields.custom.dealer_tier_2_price)': '',
        'dealer_tier_3_price (product.metafields.custom.dealer_tier_3_price)': '',
        'design_code (product.metafields.custom.design_code)': display,
        'design_nickname (product.metafields.custom.design_nickname)': number,
        'hardware_rivet_finish_options (product.metafields.custom.hardware_rivet_finish_options)': 'Black Bolts, Chrome Bolts',
        'is_configurable (product.metafields.custom.is_configurable)': 'TRUE',
        'lead_time_days (product.metafields.custom.lead_time_days)': "'15",
        'load_rating (product.metafields.custom.load_rating)': "'2650",
        'series (product.metafields.custom.series)': 'SUV Wheel - Spun Forged',
        'Variant Weight Unit': 'g', 'Template': 'product', 'Template suffix': 'calder', 'Status': 'active',
    }
    for dia, dia_label in DIAMETERS:
        for center, center_code in CENTERS:
            for label, lip_code, bolt_disp, bolt_code in LIP_BOLT:
                sku = 'CFG-{}-{}-{}-{}-{}'.format(code, dia, center_code, lip_code, bolt_code)
                r = dict(base)
                r['Option1 Value'] = dia_label
                r['Option2 Value'] = center
                r['Option3 Value'] = label
                r['Variant SKU'] = sku
                r['Variant Inventory Qty'] = '0'
                r['Variant Price'] = msrp[dia]
                rows.append(r)

with open(OUT, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=HEADER)
    w.writeheader()
    w.writerows(rows)
print('wrote', OUT, '| products:', len(DESIGNS), '| variant rows:', len(rows))
