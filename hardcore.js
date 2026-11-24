/* 2UHub shared helpers: storage, toasts, modals, roster loading. No dependencies. */
(function () {
  'use strict';

  var FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1a2030"/>' +
    '<circle cx="50" cy="38" r="18" fill="#3a4560"/><path d="M14 100c2-26 18-40 36-40s34 14 36 40z" fill="#3a4560"/></svg>');

  var LOGO = 'images/px/logo.png';

  // images/john-cena.png -> images/px/john-cena.png (pixel-art portrait). Anything else is returned as is.
  // Set to false to replace every game portrait on the site with a plain silhouette (for example after a takedown request).
  var SHOW_GAME_ARTWORK = true;
  function px(src) {
    if (!SHOW_GAME_ARTWORK && /^(?:\.\/)?images\/(?!px\/(?:logo|art))/i.test(String(src || ''))) return FALLBACK_IMG;
    var m = /^(?:\.\/)?images\/([^\/]+)\.(?:png|jpe?g|webp)$/i.exec(String(src || ''));
    return m ? 'images/px/' + m[1] + '.png' : src;
  }
  // Every roster starts with these three editable shows (rosters themselves carry no show names)
  var DEFAULT_BRANDS = [
    { name: 'Red Show', color: '#e10600' },
    { name: 'Blue Show', color: '#1f7fe5' },
    { name: 'Gold Show', color: '#ffc72c' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---- safe storage (private mode / blocked storage must never break the app) ----
  function area(session) { try { return session ? window.sessionStorage : window.localStorage; } catch (e) { return null; } }
  function sget(k, session) { try { var a = area(session); return a ? a.getItem(k) : null; } catch (e) { return null; } }
  function sset(k, v, session) { try { var a = area(session); if (a) a.setItem(k, v); return !!a; } catch (e) { return false; } }
  function sdel(k, session) { try { var a = area(session); if (a) a.removeItem(k); } catch (e) { /* ignore */ } }
  function jget(k, def, session) { try { var v = sget(k, session); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function jset(k, v, session) { try { return sset(k, JSON.stringify(v), session); } catch (e) { return false; } }

  // ---- toasts ----
  function toast(msg, type) {
    var box = document.getElementById('hc-toasts');
    if (!box) { box = document.createElement('div'); box.id = 'hc-toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    var t = document.createElement('div');
    t.className = 'hc-toast' + (type ? ' ' + type : '');
    t.textContent = msg;
    box.appendChild(t);
    while (box.children.length > 2) box.removeChild(box.firstChild);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2800);
  }

  // ---- modal ----
  // openModal({title, body: html|Node, actions:[{label, kind, onClick, close}], wide, onClose}) -> {el, close}
  function openModal(opts) {
    var wrap = document.createElement('div');
    wrap.className = 'hc-modal';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML =
      '<div class="hc-modal-back"></div>' +
      '<div class="hc-modal-box' + (opts.wide ? ' wide' : '') + '">' +
      '<div class="hc-modal-head"><h3>' + esc(opts.title || '') + '</h3><button type="button" class="x" aria-label="Close">&times;</button></div>' +
      '<div class="hc-modal-body"></div>' +
      (opts.actions && opts.actions.length ? '<div class="hc-modal-foot"></div>' : '') +
      '</div>';
    var body = wrap.querySelector('.hc-modal-body');
    if (typeof opts.body === 'string') body.innerHTML = opts.body; else if (opts.body) body.appendChild(opts.body);

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey, true);
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      if (opts.onClose) opts.onClose();
    }
    function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
    document.addEventListener('keydown', onKey, true);
    wrap.querySelector('.hc-modal-back').addEventListener('click', close);
    wrap.querySelector('.x').addEventListener('click', close);

    var handle = { el: wrap, body: body, close: close, buttons: {} };
    if (opts.actions) {
      var foot = wrap.querySelector('.hc-modal-foot');
      opts.actions.forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn btn-sm ' + (a.kind === 'primary' ? 'btn-primary' : a.kind === 'danger' ? 'btn-danger' : 'btn-steel');
        b.textContent = a.label;
        b.addEventListener('click', function () {
          if (b.disabled) return;
          var keep = a.onClick ? a.onClick(handle) === false : false;
          if (a.close !== false && !keep) close();
        });
        foot.appendChild(b);
        if (a.id) handle.buttons[a.id] = b;
      });
    }
    document.body.appendChild(wrap);
    var first = wrap.querySelector('input:not([type=hidden]), select, textarea');
    if (first && opts.focus !== false) setTimeout(function () { try { first.focus(); } catch (e) { /* ignore */ } }, 30);
    return handle;
  }

  // confirm({title, message, okLabel, kind}) -> Promise<boolean>
  function confirmBox(opts) {
    return new Promise(function (resolve) {
      var done = false;
      function fin(v) { if (!done) { done = true; resolve(v); } }
      openModal({
        title: opts.title || 'Are you sure?',
        body: '<p>' + esc(opts.message || '') + '</p>',
        onClose: function () { fin(false); },
        actions: [
          { label: opts.cancelLabel || 'Cancel', kind: 'steel', onClick: function () { fin(false); } },
          { label: opts.okLabel || 'OK', kind: opts.kind || 'primary', onClick: function () { fin(true); } }
        ]
      });
    });
  }

  // ---- rosters ----
  function normTier(t) { t = String(t || 'mid').toLowerCase(); return (t === 'high' || t === 'mid' || t === 'low') ? t : 'mid'; }
  function normSex(s) { return String(s || 'man').toLowerCase() === 'woman' ? 'woman' : 'man'; }
  function keyOf(name) { return String(name || '').trim().toLowerCase(); }

  function normalizeRoster(raw) {
    var seen = {};
    var out = [];
    (raw || []).forEach(function (s) {
      if (!s || !s.name) return;
      var k = keyOf(s.name);
      if (seen[k]) return;
      seen[k] = 1;
      out.push({ name: String(s.name).trim(), img: s.img || '', sex: normSex(s.sex), tier: normTier(s.tier) });
    });
    return out;
  }

  // ---------------------------------------------------------------- rosters
  // A roster is one JSON file: {format:'2uhub-roster', id, name, author, description, superstars:[{name,img,sex,tier}]}.
  // The all-time roster (data/rosters/all_time_roster.json) feeds the name suggestions. Rosters people make are kept
  // in this browser ("My rosters") and can be shared through the roster community (rosters.html).
  var LIB_KEY = '2uhub_rosters';
  var IMG_OK = /^images\/[\w .\-]+\.(png|jpe?g|webp)$/i;
  var DATA_OK = /^data:image\/png;base64,[A-Za-z0-9+\/=]+$/;
  var LIMITS = { name: 40, desc: 300, author: 24, brand: 20, stars: 500, officialStars: 1000, dataImg: 9000 };

  // -> {ok:true, roster} with every field cleaned, or {ok:false, error}. Used for imports, uploads and downloads.
  function cleanRoster(raw, opts) {
    opts = opts || {};
    if (!raw || typeof raw !== 'object') return { ok: false, error: 'That is not a roster file.' };
    var name = String(raw.name || '').trim().slice(0, LIMITS.name);
    if (!name) return { ok: false, error: 'The roster needs a name.' };
    var max = opts.official ? LIMITS.officialStars : LIMITS.stars, seen = {}, stars = [];
    (Array.isArray(raw.superstars) ? raw.superstars : []).forEach(function (s) {
      if (!s) return;
      var nm = String(s.name || '').trim().slice(0, LIMITS.name), k = keyOf(nm);
      if (!nm || seen[k]) return;
      seen[k] = 1;
      var img = String(s.img || '');
      if (img && !(IMG_OK.test(img) || (DATA_OK.test(img) && img.length <= LIMITS.dataImg))) img = '';
      stars.push({ name: nm, img: img, sex: normSex(s.sex), tier: normTier(s.tier) });
    });
    if (stars.length < 2) return { ok: false, error: 'A roster needs at least 2 superstars.' };
    if (stars.length > max) return { ok: false, error: 'A roster can have at most ' + max + ' superstars.' };
    return { ok: true, roster: {
      format: '2uhub-roster', version: 1, id: String(raw.id || ''), name: name, author: String(raw.author || '').trim().slice(0, LIMITS.author),
      description: String(raw.description || '').trim().slice(0, LIMITS.desc), superstars: stars
    } };
  }

  // My rosters: full copies kept in this browser (made here, imported, or added from the community)
  function library() { var l = jget(LIB_KEY, []); return Array.isArray(l) ? l : []; }
  function saveToLibrary(r) {
    var l = library().filter(function (x) { return x.id !== r.id; });
    l.unshift(r);
    return jset(LIB_KEY, l);
  }
  function removeFromLibrary(id) { return jset(LIB_KEY, library().filter(function (x) { return x.id !== id; })); }
  function newRosterId() { return 'u-' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); }

  function build(r, id) {
    return { id: id, name: r.name, author: r.author || '', description: r.description || '',
      roster: normalizeRoster(r.superstars.map(function (s) { return { name: s.name, img: px(s.img), sex: s.sex, tier: s.tier }; })) };
  }

  var rosterCache = {};
  // -> Promise<{id, name, author, description, roster:[{name,img,sex,tier}]}>
  function loadRoster(id) {
    if (rosterCache[id]) return Promise.resolve(rosterCache[id]);
    var mine = library().filter(function (x) { return x.id === id; })[0];
    if (mine) {
      var c = cleanRoster(mine);
      if (!c.ok) return Promise.reject(new Error(c.error));
      return Promise.resolve(build(c.roster, id));
    }
    return fetch('data/rosters/' + encodeURIComponent(id) + '.json').then(function (r) {
      if (!r.ok) throw new Error('Unknown roster: ' + id);
      return r.json();
    }).then(function (raw) {
      var c = cleanRoster(raw, { official: true });
      if (!c.ok) throw new Error(c.error);
      rosterCache[id] = build(c.roster, id);
      return rosterCache[id];
    });
  }

  // only the rosters in My rosters (made here, imported, or added from the community), most recently used first
  function loadMyRosterList() {
    var recent = recentRosters();
    var lib = library().filter(function (r) { return r && r.id && r.name; }).map(function (r) { return { id: r.id, name: r.name, author: r.author || '' }; });
    lib.sort(function (a, b) { var x = recent.indexOf(a.id), y = recent.indexOf(b.id); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y); });
    return Promise.resolve(lib);
  }

  // the last 5 rosters a draft was started with (or picked in the roster community), newest first
  var RECENT_KEY = '2uhub_recent_rosters';
  function recentRosters() { var l = jget(RECENT_KEY, []); return Array.isArray(l) ? l.slice(0, 5) : []; }
  function touchRecent(id) {
    if (!id) return;
    var l = recentRosters().filter(function (x) { return x !== id; });
    l.unshift(id);
    jset(RECENT_KEY, l.slice(0, 5));
  }

  // current game id: session choice -> last setup -> default
  function currentRosterId() {
    var s = sget('draftRoster', true);
    if (s) return s;
    var setup = jget('2khub_setup', null);
    return (setup && setup.rosterId) || '';
  }

  // The superstars that are actually in a draft: the game's roster minus anyone switched off in
  // setup, plus any custom superstars added there.
  function buildPool(data, setup) {
    var ex = {};
    ((setup && setup.excluded) || []).forEach(function (k) { ex[k] = 1; });
    var out = data.roster.filter(function (s) { return !ex[keyOf(s.name)]; });
    var seen = {};
    out.forEach(function (s) { seen[keyOf(s.name)] = 1; });
    normalizeRoster((setup && setup.custom) || []).forEach(function (s) {
      if (seen[keyOf(s.name)]) return;
      seen[keyOf(s.name)] = 1;
      out.push({ name: s.name, img: s.img || FALLBACK_IMG, sex: s.sex, tier: s.tier });
    });
    return out;
  }

  // html2canvas smooths images when it scales them. Before an export, blow pixel art up by a whole
  // multiple with nearest-neighbour so the saved PNG keeps hard pixels.
  function upscale(img, targetW) {
    var k = Math.max(1, Math.round(targetW / img.naturalWidth));
    var c = document.createElement('canvas');
    c.width = img.naturalWidth * k; c.height = img.naturalHeight * k;
    var x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    x.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/png');
  }
  function crispImages(root, scale) {
    return Promise.all([].slice.call(root.querySelectorAll('img[src*="/px/"], img[src^="belts/"]')).map(function (im) {
      return new Promise(function (res) {
        function go() {
          try { var w = im.getBoundingClientRect().width * (scale || 1); if (im.naturalWidth && w) im.src = upscale(im, w); } catch (e) { /* keep original */ }
          res();
        }
        if (im.complete) go(); else { im.onload = go; im.onerror = res; }
      });
    }));
  }
  // short label for show chips
  // short label for show chips: initials of a few words, or the first letters of one word
  function abbr(name) {
    var w = String(name || '').trim().toUpperCase().split(/\s+/).filter(Boolean);
    if (!w.length) return '';
    if (w.length > 1) return w.slice(0, 3).map(function (x) { return x.charAt(0); }).join('');
    return w[0].length <= 4 ? w[0] : w[0].slice(0, 3);
  }

  var TIERS = {
    high: { label: 'Main Event', short: 'ME', rank: 3 },
    mid: { label: 'Mid Card', short: 'MC', rank: 2 },
    low: { label: 'Jobber', short: 'JOB', rank: 1 }
  };

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // broken portraits -> silhouette (capture phase: 'error' does not bubble)
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (!t || t.tagName !== 'IMG' || t.dataset.fb === '2') return;
    var m = /^(.*?)images\/px\/([^\/]+)\.png(?:\?.*)?$/.exec(t.src);
    if (!t.dataset.fb && m && !/^(g-|art-|home-|bg-|logo$)/.test(m[2])) { t.dataset.fb = '1'; t.src = m[1] + 'images/' + m[2] + '.png'; return; }
    t.dataset.fb = '2'; t.src = FALLBACK_IMG;
  }, true);

  // page exit fade for internal links
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || a.target === '_blank' || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;
    if (!document.body.classList.contains('enter')) return;
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(function () { window.location.assign(a.href); }, 200);
  });
  // bfcache: coming back via the browser's back button must not stay faded out
  window.addEventListener('pageshow', function () { document.body.classList.remove('page-exit'); });

  window.HC = {
    FALLBACK_IMG: FALLBACK_IMG, LOGO: LOGO, px: px, crispImages: crispImages, DEFAULT_BRANDS: DEFAULT_BRANDS, TIERS: TIERS,
    esc: esc, sget: sget, sset: sset, sdel: sdel, jget: jget, jset: jset,
    toast: toast, openModal: openModal, confirm: confirmBox,
    loadRoster: loadRoster, recentRosters: recentRosters, loadMyRosterList: loadMyRosterList, touchRecent: touchRecent, buildPool: buildPool, currentRosterId: currentRosterId,
    cleanRoster: cleanRoster, library: library, saveToLibrary: saveToLibrary, removeFromLibrary: removeFromLibrary, newRosterId: newRosterId, LIMITS: LIMITS,
    keyOf: keyOf, normTier: normTier, normSex: normSex, normalizeRoster: normalizeRoster,
    abbr: abbr, hash: hash, shuffle: shuffle
  };
})();
