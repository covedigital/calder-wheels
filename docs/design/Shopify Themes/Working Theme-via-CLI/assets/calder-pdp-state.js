/*!
 * Calder Wheels — universal PDP state manager (Prompt 04, amendment 2026-10-28)
 * Single source of PDP selection state across URL, UI, and history.
 * Depends on: CALDER_CONFIG_RESOLVER (assets/calder-config-resolver.js) +
 *             CALDER_DESIGN_REGISTRY slice (assets/calder-design-registry-<code>.js)
 *
 * create({ designCode, resolver, history?, location?, addEventListener?, removeEventListener?, onState? })
 *   getState() -> frozen snapshot {designCode, tokens, requested, complete, modified, invalid[], source, seq}
 *   setOption(dim, token, {source?='user'})   pushState when complete, replaceState while incomplete
 *   applyConfig(tokens, {source?='programmatic', replace?=true})
 *   urlFor(tokens) -> '/products/<handle>?diameter=..&center=..&barrel=..&hardware=..'
 *   destroy()
 * Sources: 'init' | 'init-default' | 'user' | 'popstate' | 'programmatic'
 * UI contract: treat 'popstate' (and 'init*') as history restores — do not re-fire analytics.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.CALDER_PDP_STATE = factory(); }
}(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  var DIMS = ['diameter', 'center', 'barrel', 'hardware'];
  var PARAM_BY_DIM = { diameter: 'diameter', center: 'center', barrel: 'barrel', hardware: 'hardware' };

  function create(opts) {
    if (!opts || !opts.resolver) { throw new Error('CALDER_PDP_STATE: resolver instance required'); }
    var resolver = opts.resolver;
    var designCode = opts.designCode || resolver.design.designCode;
    var env = {
      location: opts.location || (typeof window !== 'undefined' ? window.location : null),
      history: opts.history || (typeof window !== 'undefined' ? window.history : null),
      addEventListener: opts.addEventListener || (typeof window !== 'undefined' ? window.addEventListener.bind(window) : null),
      removeEventListener: opts.removeEventListener || (typeof window !== 'undefined' ? window.removeEventListener.bind(window) : null)
    };
    if (!env.location || !env.history) { throw new Error('CALDER_PDP_STATE: location/history unavailable'); }

    var defaults = (resolver.design && resolver.design.defaultConfig) || null;
    var listeners = [];
    var seq = 0;
    var state = null;
    var suppressPop = false;

    function urlFor(tokens) {
      var base = env.location.pathname;
      var qs = DIMS.map(function (d) { return PARAM_BY_DIM[d] + '=' + encodeURIComponent(tokens[d]); }).join('&');
      /* pcd carry (2026-11-02 C): the bolt pattern transferred from style-mode
         listings rides along on every builder URL update (refresh, back/
         forward, pushState) so the selection context survives interactions.
         parseUrl ignores unknown params; calder-universal-cta.js validates
         pcd against the design's fitment groups and ignores invalid values. */
      try {
        var carry = new URLSearchParams(env.location.search).get('pcd');
        if (carry) { qs += '&pcd=' + encodeURIComponent(carry); }
      } catch (e) { /* URLSearchParams unavailable — skip carry */ }
      return base + '?' + qs;
    }

    function parseUrl(search) {
      var params = new URLSearchParams(search || '');
      var raw = {}, tokens = {}, invalid = [];
      DIMS.forEach(function (dim) {
        var v = params.get(PARAM_BY_DIM[dim]);
        raw[dim] = v == null ? null : v;
        if (v == null) { tokens[dim] = null; return; }
        var t = resolver.normalizeToken(dim, v);
        var valid = t && resolver.options[dim].indexOf(t) !== -1;
        tokens[dim] = valid ? t : null;
        if (!valid) { invalid.push(dim); }
      });
      var modified = DIMS.some(function (d) { return raw[d] != null; });
      var complete = DIMS.every(function (d) { return tokens[d] != null; });
      return { raw: raw, tokens: tokens, invalid: invalid, modified: modified, complete: complete };
    }

    function snapshot(tokens, requested, invalid, source, modified) {
      return Object.freeze({
        designCode: designCode,
        tokens: Object.freeze(Object.assign({}, tokens)),
        requested: Object.freeze(Object.assign({}, requested)),
        invalid: Object.freeze(invalid.slice()),
        complete: DIMS.every(function (d) { return tokens[d] != null; }),
        modified: !!modified,
        source: source,
        seq: ++seq
      });
    }

    function emit(snap) { listeners.forEach(function (fn) { try { fn(snap); } catch (e) {} }); }

    function replaceUrl(tokens, extraState) {
      if (!env.history || typeof env.history.replaceState !== 'function') { return; }
      env.history.replaceState(Object.assign({ calderPdp: designCode }, extraState || {}), '', urlFor(tokens));
    }
    function pushUrl(tokens) {
      if (!env.history || typeof env.history.pushState !== 'function') { return; }
      env.history.pushState({ calderPdp: designCode }, '', urlFor(tokens));
    }

    function onPop() {
      if (suppressPop) { suppressPop = false; return; }
      var p = parseUrl(env.location.search);
      var tokens;
      if (!p.modified && defaults) { tokens = Object.assign({}, defaults); }
      else { tokens = Object.assign({}, p.tokens); }
      state = snapshot(tokens, p.raw, p.invalid, 'popstate', p.modified);
      if (p.complete) { replaceUrl(p.tokens, { calderPdpRestore: true }); }
      emit(state);
    }

    function setOption(dim, token, sourceOpts) {
      if (DIMS.indexOf(dim) === -1) { throw new Error('CALDER_PDP_STATE: unknown dimension ' + dim); }
      var source = (sourceOpts && typeof sourceOpts === 'object') ? (sourceOpts.source || 'user') : (sourceOpts || 'user');
      var t = token == null ? null : resolver.normalizeToken(dim, token);
      if (t != null && resolver.options[dim].indexOf(t) === -1) { t = null; }
      var tokens = Object.assign({}, state.tokens);
      tokens[dim] = t;
      var p = parseUrl('');
      var requested = Object.assign({}, state.requested);
      requested[dim] = token == null ? null : String(token);
      var invalid = state.invalid.filter(function (d) { return d !== dim; });
      if (t == null && requested[dim] != null) { invalid.push(dim); }
      state = snapshot(tokens, requested, invalid, source, true);
      if (state.complete) { pushUrl(tokens); } else { replaceUrl(tokens); }
      emit(state);
      return state;
    }

    function applyConfig(tokens, sourceOpts) {
      var source = (sourceOpts && sourceOpts.source) || 'programmatic';
      var clean = {};
      var invalid = [];
      DIMS.forEach(function (d) {
        var t = tokens && tokens[d] != null ? resolver.normalizeToken(d, tokens[d]) : null;
        if (t && resolver.options[d].indexOf(t) !== -1) { clean[d] = t; } else { clean[d] = null; invalid.push(d); }
      });
      var requested = {};
      DIMS.forEach(function (d) { requested[d] = clean[d] == null ? (tokens ? tokens[d] : null) : tokens[d]; });
      state = snapshot(clean, requested, invalid, source, true);
      if (!sourceOpts || sourceOpts.replace !== false) { replaceUrl(clean); }
      emit(state);
      return state;
    }

    function init() {
      var p = parseUrl(env.location.search);
      var tokens, source;
      if (!p.modified && defaults) {
        tokens = Object.assign({}, defaults);
        source = 'init-default';
      } else if (p.complete) {
        tokens = Object.assign({}, p.tokens);
        source = 'init';
        replaceUrl(p.tokens, { calderPdpInit: true });
      } else {
        tokens = Object.assign({}, p.tokens);
        if (!p.modified && !defaults) { DIMS.forEach(function (d) { tokens[d] = null; }); }
        source = 'init';
      }
      state = snapshot(tokens, p.raw, p.invalid, source, p.modified);
      emit(state);
      return state;
    }

    if (env.addEventListener) {
      env.addEventListener('popstate', onPop);
    }

    var api = {
      getState: function () { return state; },
      setOption: setOption,
      applyConfig: applyConfig,
      urlFor: urlFor,
      defaultConfig: defaults ? Object.freeze(Object.assign({}, defaults)) : null,
      subscribe: function (fn) {
        listeners.push(fn);
        return function () {
          var i = listeners.indexOf(fn);
          if (i !== -1) { listeners.splice(i, 1); }
        };
      },
      destroy: function () {
        if (env.removeEventListener) { env.removeEventListener('popstate', onPop); }
        listeners = [];
      },
      resolver: resolver
    };
    init();
    return Object.freeze(api);
  }

  return Object.freeze({ create: create, DIMS: Object.freeze(DIMS.slice()) });
}));
