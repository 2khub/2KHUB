/* Roster community: browse the site's rosters and rosters people shared, make your own, and upload it.
   Shared rosters come from community.js; people's own rosters live in this browser and, when signed in, in their account. */
(function () {
  'use strict';
  var esc = HC.esc, $ = function (id) { return document.getElementById(id); };
  var AUTHOR_KEY = '2uhub_author', REPORTED_KEY = '2uhub_reported';

  var R = { community: [], cState: 'loading', filter: 'community', sort: 'featured', q: '' };
  var B = null;

  function slug(s) { return String(s || 'roster').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'roster'; }
  function imgSrc(p) { return HC.px(p) || HC.FALLBACK_IMG; }
  function tierTag(t) { return '<span class="tag t-' + t + '">' + HC.TIERS[t].short + '</span>'; }
  function mine() { return HC.library(); }
  function reported() { return HC.jget(REPORTED_KEY, []) || []; }

  // ------------------------------------------------------------------ rosters kept in your account (private until you share them)
  function cloudOn() { return !!(Community.accounts && window.Auth && Auth.user && Auth.profile); }
  function localOnly() { return mine().filter(function (r) { return !r.cloudId && !r.key; }); }
  var syncing = false;

  // brings the account and this browser level: new ones come down, edited ones go up, deleted ones are noticed
  function syncAccount() {
    if (!cloudOn() || syncing) return Promise.resolve();
    syncing = true;
    return Community.mine().then(function (rows) {
      var byCloud = {}, ids = {}, jobs = [];
      mine().forEach(function (r) { if (r.cloudId) byCloud[r.cloudId] = r; });
      rows.forEach(function (row) {
        ids[row.id] = 1;
        var local = byCloud[row.id], cloudT = Date.parse(row.updated_at) || 0;
        var c = HC.cleanRoster({ name: row.name, description: row.description, superstars: row.superstars, author: Auth.profile.display_name });
        if (!c.ok) return;
        if (!local) {
          HC.saveToLibrary(Object.assign({}, c.roster, { id: 'a-' + row.id, cloudId: row.id, uploadedKey: row.is_public ? row.id : undefined, updated: cloudT || Date.now() }));
        } else if ((local.updated || 0) > cloudT + 2000) {
          jobs.push(Community.saveMine(local).catch(function () { /* tried again next time */ }));
        } else if (cloudT > (local.updated || 0) + 2000) {
          HC.saveToLibrary(Object.assign({}, local, c.roster, { id: local.id, cloudId: row.id, uploadedKey: row.is_public ? row.id : undefined, updated: cloudT }));
        } else if (!!local.uploadedKey !== !!row.is_public) {
          HC.saveToLibrary(Object.assign({}, local, { uploadedKey: row.is_public ? row.id : undefined }));
        }
      });
      // a changed display name is carried over to the copies kept in this browser
      mine().forEach(function (r) { if ((r.cloudId || r.uploadedKey) && r.author !== Auth.profile.display_name) HC.saveToLibrary(Object.assign({}, r, { author: Auth.profile.display_name })); });
      // deleted from the account somewhere else: keep it here, and it can be moved again
      mine().forEach(function (r) { if (r.cloudId && !ids[r.cloudId]) { var c = Object.assign({}, r); delete c.cloudId; delete c.uploadedKey; HC.saveToLibrary(c); } });
      return Promise.all(jobs);
    }).catch(function (e) { console.error(e); }).then(function () { syncing = false; renderGrid(); });
  }

  // saves one roster into the account (private) and remembers its account id; the local copy is always kept
  function cloudPush(entry) {
    if (!cloudOn()) return Promise.resolve(entry);
    return Community.saveMine(entry).then(function (id) {
      var cur = mine().filter(function (r) { return r.id === entry.id; })[0] || entry, up = Object.assign({}, cur, { cloudId: id });
      HC.saveToLibrary(up);
      return up;
    }).catch(function (e) { HC.toast('Saved on this device. Could not reach your account: ' + e.message, 'warning'); return entry; });
  }

  function moveAll() {
    var list = localOnly(), n = 0, chain = Promise.resolve();
    list.forEach(function (r) {
      chain = chain.then(function () { return Community.saveMine(r).then(function (id) { HC.saveToLibrary(Object.assign({}, r, { cloudId: id })); n++; }); });
    });
    chain.then(function () { HC.toast(n + (n === 1 ? ' roster' : ' rosters') + ' moved to your account.', 'success'); })
      .catch(function (e) { HC.toast((n ? n + ' moved. ' : '') + (e.message || 'Could not move them.'), 'error'); })
      .then(renderGrid);
  }
  function moveOne(el) {
    var r = mine().filter(function (x) { return x.id === el.dataset.id; })[0];
    if (!r) return;
    Community.saveMine(r).then(function (id) { HC.saveToLibrary(Object.assign({}, r, { cloudId: id })); HC.toast('Moved to your account.', 'success'); renderGrid(); }).catch(fail);
  }
  function previewOf(r) {
    return (r.superstars || []).filter(function (s) { return s.img; }).sort(function (a, b) { return (b.tier === 'high') - (a.tier === 'high'); }).slice(0, 5).map(function (s) { return s.img; });
  }

  // ------------------------------------------------------------------ the cards
  function cards() {
    var out = [], lib = mine(), libByKey = {};
    lib.forEach(function (r) { if (r.key) libByKey[r.key] = r; });
    var hidden = reported();
    R.community.forEach(function (r) {
      if (hidden.indexOf(r.key) >= 0) return;
      var own = libByKey[r.key];
      out.push({ kind: 'community', key: r.key, owner: r.owner || '', id: own ? own.id : '', saved: !!own, name: r.name, author: r.author, desc: r.description, count: r.count, preview: r.preview || [], created: r.created || 0 });
    });
    lib.forEach(function (r) {
      var inList = r.key && R.community.some(function (c) { return c.key === r.key; });
      out.push({ kind: 'mine', id: r.id, key: r.key || '', uploaded: r.uploadedKey || '', name: r.name, author: (cloudOn() && (r.cloudId || r.uploadedKey)) ? Auth.profile.display_name : (r.author || 'You'), desc: r.description, count: (r.superstars || []).length,
        preview: previewOf(r), created: r.updated || 1, hideInAll: !!inList || (!!r.uploadedKey && R.community.some(function (c) { return c.key === r.uploadedKey; })), fromCommunity: !!r.key, cloud: !!r.cloudId, local: !r.cloudId && !r.key });
    });
    return out;
  }

  function visible() {
    var q = R.q.trim().toLowerCase(), list = cards().filter(function (c) {
      if (R.filter === 'community' && c.kind !== 'community') return false;
      if (R.filter === 'mine' && c.kind !== 'mine') return false;
      if (R.filter === 'all' && c.kind === 'mine' && c.hideInAll) return false;
      if (q && (c.name + ' ' + c.author + ' ' + (c.desc || '')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    list.sort(function (a, b) {
      if (R.sort === 'az') return a.name.localeCompare(b.name);
      if (R.sort === 'size') return b.count - a.count;
      if (R.sort === 'new') return b.created - a.created;
      return b.created - a.created;
    });
    return list;
  }

  function iOwn(c) { return !!(window.Auth && Auth.user && c.owner && c.owner === Auth.user.id); }

  function cardHTML(c) {
    var badge = c.kind === 'community' ? '<span class="rc-badge">Community</span>' : '<span class="rc-badge mine">' + (c.uploaded ? 'Shared' : c.cloud ? 'In account' : c.fromCommunity ? 'Saved' : 'Mine') + '</span>';
    var prev = c.preview.slice(0, 5).map(function (p) { return '<img src="' + esc(imgSrc(p)) + '" alt="" loading="lazy" decoding="async">'; }).join('');
    var act = [];
    var k = c.kind === 'community' ? 'data-key="' + esc(c.key) + '" data-id="' + esc(c.id) + '"' : 'data-id="' + esc(c.id) + '"';
    act.push('<button type="button" class="btn btn-primary btn-sm" data-act="use">Use roster</button>');
    act.push('<button type="button" class="btn btn-steel btn-sm" data-act="preview">Preview</button>');
    act.push('<button type="button" class="btn btn-steel btn-sm" data-act="download">Download</button>');
    if (c.kind === 'mine') {
      if (!c.fromCommunity) act.push('<button type="button" class="btn btn-steel btn-sm" data-act="edit">Edit</button>');
      if (!c.fromCommunity && !c.uploaded) act.push('<button type="button" class="btn btn-steel btn-sm" data-act="share">Share</button>');
      if (cloudOn() && c.local) act.push('<button type="button" class="btn btn-steel btn-sm" data-act="move">Move to account</button>');
      act.push('<button type="button" class="btn btn-danger btn-sm" data-act="remove">Remove</button>');
    }
    if (c.kind === 'community') {
      if (c.saved) act.push('<button type="button" class="btn btn-danger btn-sm" data-act="remove">Remove</button>');
      if (iOwn(c)) act.push('<button type="button" class="btn btn-danger btn-sm" data-act="unshare">Make private</button>');
      else act.push('<button type="button" class="link-btn" data-act="report">Report</button>');
    }
    return '<article class="rcard" ' + k + ' data-kind="' + c.kind + '"><div class="rc-top"><h3>' + esc(c.name) + '</h3>' + badge + '</div>' +
      '<div class="rc-by">by ' + esc(c.author || 'Anonymous') + ' &middot; ' + c.count + ' superstars</div>' +
      '<div class="rc-prev">' + prev + '</div>' +
      (c.desc ? '<p class="rc-desc">' + esc(c.desc) + '</p>' : '') +
      '<div class="rc-act">' + act.join('') + '</div></article>';
  }

  function renderGrid() {
    var list = visible();
    var none = R.filter === 'mine' ? ['No rosters of your own yet', 'Press <b>+ Create roster</b> to make one, or import a roster file.']
      : (!R.q.trim() && R.cState === 'ok') ? ['Nothing shared yet', 'Be the first: press <b>+ Create roster</b>, then Share.']
      : ['No rosters match', 'Try another tab or clear the search.'];
    $('rc-grid').innerHTML = list.length ? list.map(cardHTML).join('') : '<div class="rc-empty"><b>' + none[0] + '</b>' + none[1] + '</div>';
    var note = '';
    if (R.cState === 'loading') note = 'Loading rosters from the community&hellip;';
    else if (R.cState === 'error') note = 'The community list could not be reached. The site rosters and your own rosters still work.';
    var loc = cloudOn() ? localOnly().length : 0;
    if (loc) note = 'You have ' + loc + (loc === 1 ? ' roster' : ' rosters') + ' saved only in this browser. <button type="button" class="btn btn-primary btn-sm" data-act="move-all">Move ' + (loc === 1 ? 'it' : 'them') + ' to my account</button>' + (note ? '<br>' + note : '');
    $('rc-note').innerHTML = note;
    $('rc-note').hidden = !note;
    document.querySelectorAll('#rc-filter button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === R.filter); });
  }

  // ------------------------------------------------------------------ getting one roster's data
  function rosterOf(el) {
    var id = el.dataset.id, key = el.dataset.key, kind = el.dataset.kind;
    var inLib = mine().filter(function (r) { return r.id === id; })[0];
    if (inLib) return Promise.resolve({ roster: inLib, entry: inLib });
    return Community.get(key).then(function (raw) {
      var c = HC.cleanRoster(raw);
      if (!c.ok) throw new Error(c.error);
      return { roster: c.roster, fresh: true };
    });
  }

  function addToLibrary(el, got) {
    var key = el.dataset.key, id = 'c-' + key;
    var entry = Object.assign({}, got.roster, { id: id, key: key, updated: Date.now() });
    HC.saveToLibrary(entry);
    return id;
  }

  function fail(e) { console.error(e); HC.toast(e && e.message ? e.message : 'Something went wrong.', 'error'); }

  // ------------------------------------------------------------------ actions on a card
  function use(el) {
    var kind = el.dataset.kind;
    rosterOf(el).then(function (got) {
      var id = el.dataset.id;
      if (kind === 'community') id = got.fresh ? addToLibrary(el, got) : id;
      // Browse rosters goes back to the page it was opened from: draft setup (default), multiplayer or the match card maker
      var from = new URLSearchParams(location.search).get('for');
      if (from === 'matchcard') HC.jset('2uhub_mc_roster', id);
      else if (from !== 'multiplayer') {
        var setup = HC.jget('2khub_setup', {}) || {};
        HC.jset('2khub_setup', Object.assign({}, setup, { rosterId: id }));
        HC.sset('draftRoster', id, true);
      }
      HC.touchRecent(id);
      window.location.href = from === 'matchcard' ? 'matchcard-generator.html' : from === 'multiplayer' ? 'multiplayer.html' : 'tools.html';
    }).catch(fail);
  }

  function preview(el) {
    rosterOf(el).then(function (got) {
      var r = got.roster, body = document.createElement('div');
      body.className = 'rc-modal';
      body.innerHTML = (r.description ? '<p class="muted">' + esc(r.description) + '</p>' : '') +
        '<div class="rc-list">' + r.superstars.map(function (s) {
          return '<div class="ptile"><img src="' + esc(imgSrc(s.img)) + '" alt="" loading="lazy" decoding="async"><span class="nm">' + esc(s.name) + '</span>' + tierTag(s.tier) + '</div>';
        }).join('') + '</div>';
      HC.openModal({ title: r.name + ' (' + r.superstars.length + ')', body: body, wide: true, focus: false, actions: [{ label: 'Close', kind: 'steel' }] });
    }).catch(fail);
  }

  function download(el) {
    rosterOf(el).then(function (got) {
      var r = got.roster, out = { format: '2uhub-roster', version: 1, name: r.name, author: r.author || '', description: r.description || '', superstars: r.superstars };
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
      a.download = slug(r.name) + '.roster.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }).catch(fail);
  }

  function removeRoster(el) {
    var entry = mine().filter(function (r) { return r.id === el.dataset.id; })[0], inCloud = !!(entry && entry.cloudId && cloudOn());
    var msg = inCloud ? 'It is deleted from your account and from this device. If it is shared, it leaves the community too.'
      : entry && entry.cloudId ? 'It is removed from this device. It stays in your account and comes back when you sign in.'
      : 'It is removed from My rosters on this device. A shared copy in the community stays.';
    HC.confirm({ title: 'Remove this roster?', message: msg, okLabel: 'Remove', kind: 'danger' }).then(function (ok) {
      if (!ok) return;
      (inCloud ? Community.deleteMine(entry.cloudId) : Promise.resolve()).then(function () {
        HC.removeFromLibrary(el.dataset.id);
        renderGrid();
        if (inCloud) loadCommunity();
      }).catch(fail);
    });
  }

  function unshare(el) {
    HC.confirm({ title: 'Make this roster private?', message: 'It leaves the community and only you can see it. Copies people already saved stay with them. It stays in your account and in My rosters.', okLabel: 'Make private' }).then(function (ok) {
      if (!ok) return;
      Community.setPublic(el.dataset.key, false).then(function () {
        mine().forEach(function (r) { if (r.cloudId === el.dataset.key || r.uploadedKey === el.dataset.key) { var c = Object.assign({}, r); delete c.uploadedKey; HC.saveToLibrary(c); } });
        HC.toast('The roster is private now.', 'success');
        loadCommunity();
      }).catch(fail);
    });
  }

  function report(el) {
    HC.confirm({ title: 'Report this roster?', message: 'Use this for offensive or spam rosters. Rosters with several reports are hidden.', okLabel: 'Report', kind: 'danger' }).then(function (ok) {
      if (!ok) return;
      Community.report(el.dataset.key).then(function () {
        var l = reported(); l.push(el.dataset.key); HC.jset(REPORTED_KEY, l);
        HC.toast('Thanks. The roster was reported.', 'success');
        renderGrid();
      }).catch(fail);
    });
  }

  // asks for a name and a yes, then uploads a roster that is in My rosters
  // with accounts you share under your display name and can delete it later; without them the name is typed and it stays
  function shareFlow(entry) {
    if (Community.accounts) return Auth.requireUser().then(function () { return shareDialog(entry, Auth.profile.display_name); }, function (e) { fail(e); return false; });
    return shareDialog(entry, '');
  }

  function shareDialog(entry, accountName) {
    return new Promise(function (resolve) {
      var body = document.createElement('div');
      body.innerHTML = (accountName ? '<p>Everyone will be able to see and use <b>' + esc(entry.name) + '</b>, shared as <b>' + esc(accountName) + '</b>. You can delete it from the Community tab later.</p>'
        : '<p>Everyone will be able to see and use <b>' + esc(entry.name) + '</b>. It cannot be deleted from the community by you, so check it first.</p>' +
        '<label class="lbl" for="sh-author">Your name (shown on the roster)</label><input id="sh-author" class="field" maxlength="' + HC.LIMITS.author + '" value="' + esc(entry.author || HC.sget(AUTHOR_KEY) || '') + '" autocomplete="off">') +
        '<label class="rc-check"><input type="checkbox" id="sh-ok"> I made this roster, and it has nothing offensive in it.</label>';
      var m = HC.openModal({ title: 'Share with the community', body: body, focus: false, onClose: function () { resolve(false); }, actions: [
        { label: 'Cancel', kind: 'steel' },
        { id: 'go', label: 'Upload', kind: 'primary', close: false, onClick: function () {
          var author = accountName || $('sh-author').value.trim();
          if (!author) { HC.toast('Add your name first.', 'warning'); return false; }
          if (!$('sh-ok').checked) { HC.toast('Tick the box to confirm.', 'warning'); return false; }
          m.buttons.go.disabled = true;
          upload(entry, author).then(function () { resolve(true); m.close(); }).catch(function (e) { m.buttons.go.disabled = false; fail(e); });
          return false;
        } }
      ] });
    });
  }

  function upload(entry, author) {
    var c = HC.cleanRoster(Object.assign({}, entry, { author: author }));
    if (!c.ok) return Promise.reject(new Error(c.error));
    HC.sset(AUTHOR_KEY, author);
    if (Community.accounts && entry.cloudId) {
      return Community.setPublic(entry.cloudId, true).then(function () {
        HC.saveToLibrary(Object.assign({}, entry, { author: author, uploadedKey: entry.cloudId, updated: Date.now() }));
        HC.toast('Shared. Your roster is in the community now.', 'success');
        loadCommunity();
        renderGrid();
      });
    }
    var r = c.roster, meta = { name: r.name, author: r.author, description: r.description, count: r.superstars.length, preview: previewOf(r).filter(function (p) { return /^images\//.test(p); }) };
    var data = { format: r.format, version: 1, name: r.name, author: r.author, description: r.description, superstars: r.superstars };
    return Community.upload(meta, data).then(function (key) {
      HC.saveToLibrary(Object.assign({}, entry, { author: author, uploadedKey: key, cloudId: Community.accounts ? key : entry.cloudId, updated: Date.now() }));
      HC.toast('Uploaded. Your roster is in the community now.', 'success');
      loadCommunity();
      renderGrid();
    });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'move-all') { moveAll(); return; }
    var card = b.closest('.rcard');
    if (!card) return;
    var act = b.dataset.act;
    if (act === 'use') use(card);
    else if (act === 'preview') preview(card);
    else if (act === 'download') download(card);
    else if (act === 'remove') removeRoster(card);
    else if (act === 'report') report(card);
    else if (act === 'unshare') unshare(card);
    else if (act === 'move') moveOne(card);
    else if (act === 'edit') openBuilder(mine().filter(function (r) { return r.id === card.dataset.id; })[0]);
    else if (act === 'share') shareFlow(mine().filter(function (r) { return r.id === card.dataset.id; })[0]);
  });

  // ------------------------------------------------------------------ the builder
  function newBuilder(entry) {
    if (entry) return { id: entry.id, key: entry.key, uploadedKey: entry.uploadedKey, cloudId: entry.cloudId, name: entry.name, author: entry.author || HC.sget(AUTHOR_KEY) || '', description: entry.description || '',
      stars: entry.superstars.map(function (s) { return Object.assign({}, s); }) };
    return { id: '', name: '', author: HC.sget(AUTHOR_KEY) || '', description: '', stars: [] };
  }
  function openBuilder(entry) {
    B = newBuilder(entry);
    $('b-title').textContent = entry ? 'Edit roster' : 'Create a roster';
    $('list-view').hidden = true; $('builder').hidden = false;
    $('b-name').value = B.name; $('b-author').value = B.author; $('b-desc').value = B.description;
    $('b-msg').textContent = '';
    $('c-name').value = ''; $('c-file').value = ''; cPick = null; showPick(); renderSug();
    renderBuilderStars();
    window.scrollTo(0, 0);
  }
  function closeBuilder() { B = null; $('builder').hidden = true; $('list-view').hidden = false; renderGrid(); }

  function inRoster(name) { var k = HC.keyOf(name); return B.stars.some(function (s) { return HC.keyOf(s.name) === k; }); }
  function renderBuilderStars() {
    $('b-count').textContent = B.stars.length;
    $('b-stars').innerHTML = B.stars.length ? B.stars.map(function (s, i) {
      return '<div class="ptile on" data-i="' + i + '"><img src="' + esc(imgSrc(s.img)) + '" alt=""><span class="nm">' + esc(s.name) + '</span>' +
        '<button type="button" class="tier-btn" data-tier="' + i + '" title="Change tier" aria-label="Change tier of ' + esc(s.name) + '">' + tierTag(s.tier) + '</button>' +
        '<button type="button" class="icon-btn" data-sdel="' + i + '" aria-label="Remove ' + esc(s.name) + '">&times;</button></div>';
    }).join('') : '<div class="rc-empty">Nobody yet. Add superstars with the form above.</div>';
  }
  // a photo becomes a small pixel portrait, so every roster looks the same and stays tiny
  function pixelate(file) {
    return new Promise(function (resolve, reject) {
      var rd = new FileReader();
      rd.onerror = function () { reject(new Error('Could not read that image.')); };
      rd.onload = function () {
        var im = new Image();
        im.onerror = function () { reject(new Error('That file is not an image.')); };
        im.onload = function () {
          var c = document.createElement('canvas'); c.width = c.height = 48;
          var x = c.getContext('2d');
          x.fillStyle = '#181828'; x.fillRect(0, 0, 48, 48);
          var side = Math.min(im.width, im.height), sx = (im.width - side) / 2, sy = (im.height - side) / 4;
          x.imageSmoothingEnabled = true; x.drawImage(im, sx, Math.max(0, sy), side, side, 0, 0, 48, 48);
          var step = 24, data, out;
          for (var tries = 0; tries < 4; tries++) {
            var d = x.getImageData(0, 0, 48, 48), p = d.data;
            for (var i = 0; i < p.length; i += 4) { p[i] = Math.round(p[i] / step) * step; p[i + 1] = Math.round(p[i + 1] / step) * step; p[i + 2] = Math.round(p[i + 2] / step) * step; p[i + 3] = 255; }
            x.putImageData(d, 0, 0);
            out = c.toDataURL('image/png');
            if (out.length <= HC.LIMITS.dataImg) return resolve(out);
            step += 16;
          }
          reject(new Error('That image is too detailed. Try a simpler picture.'));
        };
        im.src = rd.result;
      };
      rd.readAsDataURL(file);
    });
  }

  function addCustom() {
    var name = $('c-name').value.trim();
    if (!name) { HC.toast('Give the superstar a name.', 'warning'); return; }
    if (inRoster(name)) { HC.toast(name + ' is already in the roster.', 'warning'); return; }
    var f = $('c-file').files[0], known = cPick || allTime.filter(function (s) { return HC.keyOf(s.name) === HC.keyOf(name); })[0];
    var sex = document.querySelector('#c-sex .on').dataset.v, tier = document.querySelector('#c-tier .on').dataset.v;
    if (known && !cPick) { sex = known.sex; tier = known.tier; }
    var done = function (img) {
      B.stars.push({ name: (known && !f ? known.name : name).slice(0, HC.LIMITS.name), img: img || '', sex: sex, tier: tier });
      $('c-name').value = ''; $('c-file').value = ''; cPick = null; showPick(); renderSug(); setSeg('c-sex', 'man'); setSeg('c-tier', 'mid');
      renderBuilderStars(); $('c-name').focus();
    };
    if (f) pixelate(f).then(done).catch(fail); else done(known ? known.img : '');
  }

  function readBuilderFields() { B.name = $('b-name').value; B.author = $('b-author').value; B.description = $('b-desc').value; }
  function collectBuilder() {
    readBuilderFields();
    var c = HC.cleanRoster({ name: B.name, author: B.author, description: B.description, superstars: B.stars });
    return c;
  }
  function saveBuilder() {
    var c = collectBuilder();
    if (!c.ok) { $('b-msg').textContent = c.error; $('b-msg').className = 'muted bad'; return null; }
    $('b-msg').textContent = '';
    if (c.roster.author) HC.sset(AUTHOR_KEY, c.roster.author);
    var entry = Object.assign({}, c.roster, { id: B.id || HC.newRosterId(), key: B.key, uploadedKey: B.uploadedKey, cloudId: B.cloudId, updated: Date.now() });
    HC.saveToLibrary(entry);
    B.id = entry.id;
    return entry;
  }

  document.addEventListener('click', function (e) {
    if (!B) return;
    var t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.sdel !== undefined) {
      B.stars.splice(+t.dataset.sdel, 1); renderBuilderStars();
    } else if (t.dataset.tier !== undefined) {
      var st = B.stars[+t.dataset.tier]; st.tier = st.tier === 'high' ? 'mid' : st.tier === 'mid' ? 'low' : 'high'; renderBuilderStars();
    }
  });
  $('b-clear').addEventListener('click', function () { B.stars = []; renderBuilderStars(); });

  // ------------------------------------------------------------------ name suggestions from the all-time roster
  var allTime = [], cPick = null, sugList = [], sugActive = -1;
  function setSeg(id, v) { document.querySelectorAll('#' + id + ' button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === v); }); }
  function suggestFor(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    var starts = [], words = [], has = [];
    allTime.forEach(function (s) {
      var n = s.name.toLowerCase();
      if (n.indexOf(q) === 0) starts.push(s);
      else if (n.split(/[\s.\-']+/).some(function (w) { return w.indexOf(q) === 0; })) words.push(s);
      else if (n.indexOf(q) >= 0) has.push(s);
    });
    return starts.concat(words, has).slice(0, 8);
  }
  function renderSug() {
    var box = $('c-sug'), q = $('c-name').value.trim();
    sugList = cPick ? [] : suggestFor(q);
    if (!sugList.length) { box.hidden = true; $('c-name').setAttribute('aria-expanded', 'false'); return; }
    sugActive = sugActive < 0 ? 0 : Math.min(sugActive, sugList.length - 1);
    box.innerHTML = sugList.map(function (s, i) {
      var at = s.name.toLowerCase().indexOf(q.toLowerCase()), nm = at >= 0 ? esc(s.name.slice(0, at)) + '<b>' + esc(s.name.slice(at, at + q.length)) + '</b>' + esc(s.name.slice(at + q.length)) : esc(s.name), here = inRoster(s.name);
      return '<div class="ac-item' + (i === sugActive ? ' on' : '') + (here ? ' dim' : '') + '" role="option" data-sug="' + i + '"><img src="' + esc(imgSrc(s.img)) + '" alt=""><span class="nm">' + nm + '</span>' +
        (here ? '<span class="added">in roster</span>' : tierTag(s.tier)) + '</div>';
    }).join('');
    box.hidden = false; $('c-name').setAttribute('aria-expanded', 'true');
  }
  function showPick() {
    var el = $('c-prev');
    if (!cPick) { el.hidden = true; el.innerHTML = ''; return; }
    el.innerHTML = '<img src="' + esc(imgSrc(cPick.img)) + '" alt=""><span class="nm"><b>' + esc(cPick.name) + '</b>Portrait, side and level from the all-time roster</span><button type="button" class="link-btn" id="c-unpick">Change</button>';
    el.hidden = false;
  }
  function pickSug(s) {
    cPick = s; sugActive = -1;
    $('c-name').value = s.name; setSeg('c-sex', s.sex); setSeg('c-tier', s.tier);
    renderSug(); showPick();
  }
  $('c-name').addEventListener('input', function () { cPick = null; sugActive = -1; showPick(); renderSug(); });
  $('c-name').addEventListener('keydown', function (e) {
    var open = !$('c-sug').hidden;
    if (e.key === 'ArrowDown' && open) { e.preventDefault(); sugActive = (sugActive + 1) % sugList.length; renderSug(); }
    else if (e.key === 'ArrowUp' && open) { e.preventDefault(); sugActive = (sugActive - 1 + sugList.length) % sugList.length; renderSug(); }
    else if (e.key === 'Escape' && open) { $('c-sug').hidden = true; }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && sugActive >= 0) pickSug(sugList[sugActive]); else addCustom();
    }
  });
  $('c-name').addEventListener('blur', function () { setTimeout(function () { $('c-sug').hidden = true; }, 150); });
  $('c-name').addEventListener('focus', function () { if (!cPick) renderSug(); });
  $('c-sug').addEventListener('mousedown', function (e) {
    var it = e.target.closest('.ac-item'); if (!it) return;
    e.preventDefault(); pickSug(sugList[+it.dataset.sug]);
  });
  $('c-prev').addEventListener('click', function (e) { if (e.target.id === 'c-unpick') { cPick = null; showPick(); $('c-name').focus(); renderSug(); } });
  $('c-file').addEventListener('change', function () { if (this.files[0] && cPick) { cPick = null; showPick(); } });

  document.querySelectorAll('#c-sex button, #c-tier button').forEach(function (b) {
    b.addEventListener('click', function () { b.parentNode.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); });
  });
  $('c-add').addEventListener('click', addCustom);
  $('b-cancel').addEventListener('click', closeBuilder);
  $('b-save').addEventListener('click', function () {
    var e = saveBuilder();
    if (e) cloudPush(e).then(function (cur) { HC.toast(cur.cloudId ? 'Saved to your account.' : 'Saved to My rosters.', 'success'); closeBuilder(); R.filter = 'mine'; renderGrid(); });
  });
  $('b-share').addEventListener('click', function () {
    var e = saveBuilder();
    if (!e) return;
    cloudPush(e).then(function (cur) { return shareFlow(cur); }).then(function (ok) { closeBuilder(); R.filter = ok ? 'community' : 'mine'; renderGrid(); });
  });

  // ------------------------------------------------------------------ toolbar, import, start
  $('rc-search').addEventListener('input', function () { R.q = this.value; renderGrid(); });
  $('rc-sort').addEventListener('change', function () { R.sort = this.value; renderGrid(); });
  $('rc-filter').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { R.filter = b.dataset.v; renderGrid(); } });
  $('rc-create').addEventListener('click', function () { openBuilder(null); });
  $('rc-import').addEventListener('change', function () {
    var f = this.files[0]; this.value = '';
    if (!f) return;
    if (f.size > 1500000) { HC.toast('That file is too big.', 'error'); return; }
    var rd = new FileReader();
    rd.onload = function () {
      var raw; try { raw = JSON.parse(rd.result); } catch (e) { HC.toast('That is not a roster file.', 'error'); return; }
      var c = HC.cleanRoster(raw);
      if (!c.ok) { HC.toast(c.error, 'error'); return; }
      HC.saveToLibrary(Object.assign({}, c.roster, { id: HC.newRosterId(), updated: Date.now() }));
      R.filter = 'mine'; renderGrid(); HC.toast('Imported ' + c.roster.name + '.', 'success');
    };
    rd.readAsText(f);
  });

  function loadCommunity() {
    R.cState = 'loading'; renderGrid();
    return Community.list().then(function (list) { R.community = list; R.cState = 'ok'; renderGrid(); }).catch(function (e) { console.error(e); R.cState = 'error'; renderGrid(); });
  }

  function start() {
    renderGrid();
    if (location.hash === '#create') openBuilder(null);
    fetch('data/rosters/all_time_roster.json').then(function (r) { return r.json(); }).then(function (raw) {
      var c = HC.cleanRoster(raw, { official: true });
      if (c.ok) allTime = c.roster.superstars;
    }).catch(function () { allTime = []; });
    if (location.hash === '#mine') { R.filter = 'mine'; renderGrid(); }
    if (window.Auth && Auth.enabled) { Auth.onChange(function () { renderGrid(); syncAccount(); }); syncAccount(); }
    loadCommunity();
  }
  if (window.Community) start(); else window.addEventListener('community-ready', start, { once: true });
})();
