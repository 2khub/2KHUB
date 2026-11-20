/* 2KHUB shared helpers: storage, toasts, modals, roster loading. No dependencies. */
(function () {
  'use strict';

  var FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1a2030"/>' +
    '<circle cx="50" cy="38" r="18" fill="#3a4560"/><path d="M14 100c2-26 18-40 36-40s34 14 36 40z" fill="#3a4560"/></svg>');

  var LOGO = 'images/px/logo.png';

  // images/john-cena.png -> images/px/john-cena.png (pixel-art portrait). Anything else is returned as is.
  function px(src) {
    var m = /^(?:\.\/)?images\/([^\/]+)\.(?:png|jpe?g|webp)$/i.exec(String(src || ''));
    return m ? 'images/px/' + m[1] + '.png' : src;
  }
  var DEFAULT_BRANDS = [
    { name: 'RAW', color: '#e10600' },
    { name: 'SmackDown', color: '#1f7fe5' },
    { name: 'NXT', color: '#ffc72c' }
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

  // One file holds every game and every superstar: data/superstars.json
  //   games:      [{id, name, brands}]
  //   superstars: [{name, img, sex, tier, games:[ids], overrides?:{id:{name?,img?,tier?}}}]
  // Choosing a game keeps the superstars whose `games` contains it, using that game's
  // own name / image / tier where they differ from the defaults.
  var dataPromise = null;
  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch('data/superstars.json').then(function (r) {
        if (!r.ok) throw new Error('data/superstars.json not found');
        return r.json();
      }).catch(function (e) { dataPromise = null; throw e; });
    }
    return dataPromise;
  }

  var rosterCache = {};
  // -> Promise<{id, brands:[{name,color}], roster:[...]}>
  function loadRoster(id) {
    if (rosterCache[id]) return Promise.resolve(rosterCache[id]);
    return loadData().then(function (data) {
      var game = null;
      (data.games || []).forEach(function (g) { if (g.id === id) game = g; });
      if (!game) throw new Error('Unknown game: ' + id);
      var roster = [];
      (data.superstars || []).forEach(function (s) {
        if ((s.games || []).indexOf(id) < 0) return;
        var o = (s.overrides && s.overrides[id]) || {};
        roster.push({ name: o.name || s.name, img: px(o.img || s.img), sex: s.sex, tier: o.tier || s.tier });
      });
      var brands = (game.brands && game.brands.length) ? game.brands : DEFAULT_BRANDS;
      var res = { id: id, brands: brands.slice(0, 4).map(function (b) { return { name: b.name, color: b.color || '#ffffff' }; }), roster: normalizeRoster(roster) };
      rosterCache[id] = res;
      return res;
    });
  }

  function loadRosterList() {
    return loadData().then(function (data) {
      var list = (data.games || []).map(function (g) { return { id: g.id, name: g.name }; });
      return list.length ? list : [{ id: 'wwe2k26', name: 'WWE 2K26' }];
    }).catch(function () { return [{ id: 'wwe2k26', name: 'WWE 2K26' }]; });
  }

  // current game id: session choice -> last setup -> default
  function currentRosterId() {
    var s = sget('draftRoster', true);
    if (s) return s;
    var setup = jget('2khub_setup', null);
    return (setup && setup.rosterId) || 'wwe2k26';
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
    return Promise.all([].slice.call(root.querySelectorAll('img[src*="/px/"]')).map(function (im) {
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
  var ABBR = { raw: 'RAW', smackdown: 'SD', 'smackdown live': 'SD', nxt: 'NXT', dynamite: 'DYN', collision: 'COL', rampage: 'RAM', ecw: 'ECW', 'new show': 'NEW' };
  function abbr(name) {
    var n = String(name || '').trim().toLowerCase();
    if (ABBR[n]) return ABBR[n];
    var up = String(name || '').trim().toUpperCase();
    return up.length <= 4 ? up : up.slice(0, 3);
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
    loadRoster: loadRoster, loadRosterList: loadRosterList, buildPool: buildPool, currentRosterId: currentRosterId,
    keyOf: keyOf, normTier: normTier, normSex: normSex, normalizeRoster: normalizeRoster,
    abbr: abbr, hash: hash, shuffle: shuffle
  };
})();
