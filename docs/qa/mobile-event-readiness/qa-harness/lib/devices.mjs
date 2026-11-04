// Device matrix for the Calder Wheels mobile/tablet QA.
// Widths mandated by the QA brief; Playwright presets used where they match exactly,
// otherwise custom viewport + touch + DPR + mobile UA.
// NOTE: Playwright's built-in preset UA strings are used verbatim where available.

const IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const TABLET_UA =
  'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

export const DEVICES = [
  {
    key: 'm-320-narrow',
    label: '320px narrow mobile',
    width: 320, height: 568, dpr: 2, isMobile: true, hasTouch: true, ua: IOS_UA,
    preset: 'iPhone SE (320x568, dpr2, iOS Safari profile)',
  },
  {
    key: 'm-360-android',
    label: '360px Android',
    width: 360, height: 740, dpr: 3, isMobile: true, hasTouch: true, ua: ANDROID_UA,
    preset: 'Playwright "Galaxy S8" geometry (360x740, dpr3)',
  },
  {
    key: 'm-375-iphone',
    label: '375px compact iPhone',
    width: 375, height: 667, dpr: 2, isMobile: true, hasTouch: true, ua: IOS_UA,
    preset: 'iPhone 8 / SE 2nd-gen class (375x667, dpr2)',
  },
  {
    key: 'm-393-iphone',
    label: '393px standard iPhone',
    width: 393, height: 852, dpr: 3, isMobile: true, hasTouch: true, ua: IOS_UA,
    preset: 'iPhone 14/15 class (393x852, dpr3)',
  },
  {
    key: 'm-412-android',
    label: '412px large Android',
    width: 412, height: 915, dpr: 2.625, isMobile: true, hasTouch: true, ua: ANDROID_UA,
    preset: 'Playwright "Pixel 7" (412x915, dpr2.625)',
  },
  {
    key: 't-768-small-tablet',
    label: '768px small tablet (portrait)',
    width: 768, height: 1024, dpr: 2, isMobile: true, hasTouch: true, ua: TABLET_UA,
    preset: 'Playwright "iPad Mini" (768x1024, dpr2)',
  },
  {
    key: 't-820-large-tablet',
    label: '820px large tablet (portrait)',
    width: 820, height: 1180, dpr: 2, isMobile: true, hasTouch: true, ua: TABLET_UA,
    preset: 'iPad Air 4/5 class (820x1180, dpr2)',
  },
  {
    key: 't-1024-tablet-landscape',
    label: '1024px tablet (landscape)',
    width: 1024, height: 768, dpr: 2, isMobile: true, hasTouch: true, ua: TABLET_UA,
    preset: 'iPad Mini landscape (1024x768, dpr2)',
  },
  {
    key: 't-1180-tablet-landscape',
    label: '1180px large tablet (landscape)',
    width: 1180, height: 820, dpr: 2, isMobile: true, hasTouch: true, ua: TABLET_UA,
    preset: 'iPad Air landscape (1180x820, dpr2)',
  },
];

export const deviceByKey = (key) => DEVICES.find((d) => d.key === key);

export const ROUTES = [
  { key: 'home', path: '/' },
  { key: 'collection-wheels', path: '/collections/wheels' },
  { key: 'pdp-clm-01', path: '/products/calder-clm-01-wheel' },
  { key: 'pdp-clm-06', path: '/products/calder-clm-06-wheel' },
  { key: 'fitment', path: '/pages/fitment' },
  { key: 'wheel-gallery', path: '/pages/wheel-gallery' },
  { key: 'vehicle-gallery', path: '/pages/vehicle-gallery' },
  { key: 'build-your-wheel', path: '/pages/build-your-wheel' },
  { key: 'cart', path: '/cart' },
];

export const routeByPath = (p) => ROUTES.find((r) => r.path === p);
