/* 2UHub Draft board.
   Setup comes from tools.html (sessionStorage 'draftSetup'); progress autosaves to localStorage
   so a refresh never loses a draft. Requires hardcore.js + tagteams.js. */
(function () {
  'use strict';
  var HC = window.HC, TT = window.TagTeams;
  var $ = function (id) { return document.getElementById(id); };
  var esc = HC.esc;
  var TIERS = HC.TIERS;
  var STATE_KEY = '2khub_draft_state';
  var LAST_KEY = '2khub_last_draft';
  var ANIM_KEY = '2khub_draft_anim';

  var S = null; // persistent draft state (see newState)
  var UI = { q: '', view: 'all', sel: null, selTeam: null, active: null, fresh: null, anim: animPref() };

  // ------------------------------------------------------------------ helpers
  function animPref() {
    var v = HC.sget(ANIM_KEY);
    if (v === '1') return true;
    if (v === '0') return false;
    return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function ord(n) {
    var m = n % 100;
    if (m >= 11 && m <= 13) return n + 'th';
    return n + (['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  }
  function byName(a, b) { return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }); }
  function key(s) { return HC.keyOf(s.name); }
  function showById(id) { for (var i = 0; i < S.shows.length; i++) if (S.shows[i].id === id) return S.shows[i]; return null; }
  function poolFind(k) { for (var i = 0; i < S.pool.length; i++) if (key(S.pool[i]) === k) return S.pool[i]; return null; }
  function totalPicks() { var n = 0; S.shows.forEach(function (sh) { n += S.picks[sh.id].length; }); return n; }
  function slim(s) { return { name: s.name, img: s.img, sex: s.sex, tier: s.tier }; }
  function isOpenModal() { return !!document.querySelector('.hc-modal'); }
  function sameKeys(a, b) { return a.length === b.length && a.every(function (k, i) { return k === b[i]; }); }
  function ink(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
    if (!m) return '#fff';
    var n = parseInt(m[1], 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.62 ? '#111' : '#fff';
  }

  // ------------------------------------------------------------------ state
  function newState(setup, data) {
    var shows = (setup.shows && setup.shows.length >= 2 ? setup.shows : HC.DEFAULT_BRANDS)
      .slice(0, 4).map(function (s, i) { return { id: s.id || 'show' + i + Date.now().toString(36), name: s.name, color: s.color }; });
    var order = shows.map(function (s) { return s.id; });
    if (setup.mode === 'turns' && setup.randomFirst) HC.shuffle(order);
    var picks = {};
    shows.forEach(function (s) { picks[s.id] = []; });
    return {
      v: 2, setupId: setup.setupId || Date.now(),
      rosterId: data.id, rosterName: setup.rosterName || data.id,
      mode: setup.mode === 'turns' ? 'turns' : 'free',
      order: setup.order === 'snake' ? 'snake' : 'alt',
      cap: setup.cap || 0,
      excluded: setup.excluded || [], custom: setup.custom || [],
      shows: shows, turnOrder: order, turn: { round: 1, pos: 0 },
      pool: HC.buildPool(data, setup).map(slim).sort(byName),
      picks: picks, history: []
    };
  }

  function save() {
    HC.jset(STATE_KEY, S);
    if (totalPicks() > 0) {
      HC.jset(LAST_KEY, {
        rosterId: S.rosterId,
        shows: S.shows.map(function (sh) { return { id: sh.id, name: sh.name, color: sh.color, members: S.picks[sh.id].map(slim) }; })
      });
    }
  }

  // ------------------------------------------------------------------ turn engine
  function counts() { var c = {}; S.shows.forEach(function (sh) { c[sh.id] = S.picks[sh.id].length; }); return c; }
  function orderFor(round) {
    var ids = S.turnOrder.slice();
    if (S.order === 'snake' && round % 2 === 0) ids.reverse();
    return ids;
  }
  function nextTurnFrom(turn, cnt) {
    var round = turn.round, pos = turn.pos;
    for (var guard = 0; guard < S.shows.length * 3 + 3; guard++) {
      var ids = orderFor(round);
      if (pos >= ids.length) { round++; pos = 0; continue; }
      var id = ids[pos];
      if (!S.cap || cnt[id] < S.cap) return { round: round, pos: pos, showId: id };
      pos++;
    }
    return null;
  }
  function upcoming(n) {
    var cnt = counts(), left = S.pool.length, out = [], t = S.turn;
    while (out.length < n && left > 0) {
      var c = nextTurnFrom(t, cnt);
      if (!c) break;
      out.push(c); cnt[c.showId]++; left--;
      t = { round: c.round, pos: c.pos + 1 };
    }
    return out;
  }
  function clock() { if (S.mode !== 'turns') return null; return upcoming(1)[0] || null; }
  function showFull(id, extra) { return S.cap > 0 && S.picks[id].length + (extra || 1) > S.cap; }

  // ------------------------------------------------------------------ pool / selection
  function filteredPool() {
    var q = UI.q.trim().toLowerCase();
    var list = S.pool.filter(function (s) {
      return (!q || s.name.toLowerCase().indexOf(q) >= 0) && (UI.view === 'man' ? s.sex === 'man' : UI.view === 'woman' ? s.sex === 'woman' : true);
    });
    list.sort(function (a, b) { return (TIERS[b.tier].rank - TIERS[a.tier].rank) || byName(a, b); });
    return list;
  }

  function selectedPick() {
    if (UI.view === 'teams') {
      var t = UI.selTeam && TT.find(S.rosterId, UI.selTeam);
      if (!t) return null;
      var keys = t.members.map(function (m) { return HC.keyOf(m.name); });
      return { keys: keys, label: TT.displayName(t), team: t, avail: keys.every(function (k) { return !!poolFind(k); }) };
    }
    var s = UI.sel && poolFind(UI.sel);
    return s ? { keys: [UI.sel], label: null, star: s, avail: true } : null;
  }

  function selectionAfter(draftedKeys) {
    if (draftedKeys.indexOf(UI.sel) < 0) return;
    var list = filteredPool(), idx = -1;
    list.forEach(function (s, i) { if (key(s) === UI.sel) idx = i; });
    var rest = list.filter(function (s) { return draftedKeys.indexOf(key(s)) < 0; });
    UI.sel = rest.length ? key(rest[Math.min(Math.max(idx, 0), rest.length - 1)]) : null;
  }

  // ------------------------------------------------------------------ drafting
  function validate(keys, showId) {
    var show = showById(showId);
    if (!show) { HC.toast('Pick a show to draft to.', 'warning'); return null; }
    var members = keys.map(poolFind);
    if (members.some(function (m) { return !m; })) { HC.toast('That pick is no longer available.', 'warning'); renderAll(); return null; }
    if (S.mode === 'turns') {
      var c = clock();
      if (!c) { HC.toast('The draft is complete.', 'warning'); return null; }
      if (c.showId !== showId) { HC.toast("It's " + showById(c.showId).name + "'s turn to pick.", 'warning'); return null; }
    }
    if (showFull(showId, members.length)) { HC.toast(show.name + ' roster is full (' + S.cap + ').', 'warning'); return null; }
    return { show: show, members: members };
  }

  // keys: superstar keys to draft together. In take-turns mode the show on the clock always gets the pick.
  function draftKeys(keys, showId, label, strict) {
    if (tvCur) {
      if (sameKeys(tvCur.keys, keys)) return false; // double click on the same pick
      flushTV();
    }
    if (S.mode === 'turns' && !strict) { var c = clock(); if (c) showId = c.showId; }
    var v = validate(keys, showId);
    if (!v) return false;
    if (UI.anim) {
      playTV(v.members, v.show, label, keys, function () { commit(keys, showId, label, false); });
    } else {
      commit(keys, showId, label, true);
    }
    return true;
  }

  function commit(keys, showId, label, toast) {
    var show = showById(showId);
    var members = keys.map(poolFind);
    if (!show || members.some(function (m) { return !m; })) { renderAll(); return; }
    var c = S.mode === 'turns' ? clock() : null;
    var prevTurn = c ? { round: S.turn.round, pos: S.turn.pos } : null;
    if (c) S.turn = { round: c.round, pos: c.pos + 1 };
    selectionAfter(keys);
    UI.fresh = { showId: showId, from: S.picks[showId].length, n: members.length };
    members.forEach(function (m) {
      S.pool.splice(S.pool.indexOf(m), 1);
      S.picks[showId].push(m);
    });
    S.history.push({ showId: showId, keys: keys.slice(), prevTurn: prevTurn });
    var nc = clock();
    UI.active = nc ? nc.showId : showId;
    save();
    renderAll();
    if (toast) HC.toast((label || members.map(function (m) { return m.name; }).join(' & ')) + ' drafted to ' + show.name, 'success');
  }

  function undo() {
    flushTV();
    while (S.history.length) {
      var h = S.history.pop();
      var moved = [];
      var pairs = h.bulk ? h.bulk : h.keys.map(function (k) { return { showId: h.showId, key: k }; });
      pairs.forEach(function (p) {
        var arr = S.picks[p.showId] || [];
        for (var i = 0; i < arr.length; i++) {
          if (key(arr[i]) === p.key) { moved.push(arr[i]); S.pool.push(arr[i]); arr.splice(i, 1); break; }
        }
      });
      if (h.prevTurn) S.turn = h.prevTurn;
      if (moved.length) {
        S.pool.sort(byName);
        UI.sel = key(moved[0]);
        if (UI.view === 'teams') UI.view = 'all';
        var nc = clock();
        if (nc) UI.active = nc.showId;
        hideTV();
        save(); renderAll();
        HC.toast('Undid ' + (moved.length > 1 ? moved.length + ' picks' : moved[0].name));
        return;
      }
    }
    HC.toast('Nothing to undo.', 'warning');
  }

  function release(showId, k) {
    var arr = S.picks[showId] || [];
    for (var i = 0; i < arr.length; i++) {
      if (key(arr[i]) === k) {
        S.pool.push(arr[i]); S.pool.sort(byName);
        UI.sel = k;
        arr.splice(i, 1);
        save(); renderAll();
        return;
      }
    }
  }

  // which show should a random pick go to?
  function randomTarget() {
    if (S.mode === 'turns') { var c = clock(); return c ? c.showId : null; }
    var best = null;
    S.shows.forEach(function (sh) {
      if (showFull(sh.id)) return;
      if (!best || S.picks[sh.id].length < S.picks[best].length) best = sh.id;
    });
    return best;
  }

  function randomPick() {
    flushTV();
    var tid = randomTarget();
    if (!tid) { HC.toast(S.mode === 'turns' ? 'The draft is complete.' : 'Every roster is full.', 'warning'); return; }
    var saved = UI.view;
    if (UI.view === 'teams') UI.view = 'all';
    var cands = filteredPool();
    UI.view = saved;
    if (!cands.length) { HC.toast('No superstars match the current filter.', 'warning'); return; }
    draftKeys([key(cands[Math.floor(Math.random() * cands.length)])], tid, null, true);
  }

  function autoDraft() {
    flushTV();
    if (!S.pool.length) { HC.toast('The pool is empty.', 'info'); return; }
    HC.confirm({
      title: 'Auto-draft the rest?',
      message: 'Shuffles the remaining ' + S.pool.length + ' superstars across your shows, keeping tiers and men/women balanced. You can undo it.',
      okLabel: 'Auto-draft'
    }).then(function (ok) {
      if (!ok) return;
      var groups = {};
      S.pool.forEach(function (s) { var g = s.sex + '-' + s.tier; (groups[g] = groups[g] || []).push(s); });
      var list = [];
      ['man-high', 'woman-high', 'man-mid', 'woman-mid', 'man-low', 'woman-low'].forEach(function (g) { if (groups[g]) list = list.concat(HC.shuffle(groups[g])); });
      var ids = S.mode === 'turns' ? S.turnOrder.slice() : S.shows.map(function (s) { return s.id; });
      var cnt = counts(), idx = 0, bulk = [];
      var c0 = clock();
      if (c0) idx = Math.max(0, ids.indexOf(c0.showId));
      list.forEach(function (s) {
        for (var t = 0; t < ids.length; t++) {
          var sid = ids[(idx + t) % ids.length];
          if (!S.cap || cnt[sid] < S.cap) {
            S.picks[sid].push(s); cnt[sid]++;
            bulk.push({ showId: sid, key: key(s) });
            idx = (idx + t + 1) % ids.length;
            return;
          }
        }
      });
      var taken = {};
      bulk.forEach(function (b) { taken[b.key] = 1; });
      S.pool = S.pool.filter(function (s) { return !taken[key(s)]; });
      S.history.push({ bulk: bulk, prevTurn: S.mode === 'turns' ? { round: S.turn.round, pos: S.turn.pos } : null });
      UI.sel = S.pool.length ? key(S.pool[0]) : null;
      save(); renderAll();
      HC.toast(bulk.length + ' superstars drafted' + (S.pool.length ? ' — ' + S.pool.length + ' left (shows are full).' : '.'), 'success');
    });
  }

  function resetDraft() {
    flushTV();
    HC.confirm({ title: 'Reset the draft?', message: 'Every superstar goes back to the pool and your picks are cleared.', okLabel: 'Reset', kind: 'danger' }).then(function (ok) {
      if (!ok) return;
      HC.loadRoster(S.rosterId).then(function (data) {
        var setup = { setupId: S.setupId, rosterName: S.rosterName, shows: S.shows, mode: S.mode, order: S.order, cap: S.cap, randomFirst: false, excluded: S.excluded, custom: S.custom };
        var order = S.turnOrder.slice();
        S = newState(setup, data);
        S.turnOrder = order;
        hideTV();
        UI.active = S.turnOrder[0];
        var list = filteredPool();
        UI.sel = list.length ? key(list[0]) : null;
        save(); renderAll();
        HC.toast('Draft reset.', 'success');
      });
    });
  }

  // ------------------------------------------------------------------ corner broadcast box
  // Superstars flip past very fast, slow down, then the real pick lands. The pick is saved at the
  // moment it lands; the box stays a moment longer, and never blocks the screen.
  var tvCur = null, tvTimer = null, tvHide = null;

  var tvOut = null;
  function hideTV(now) {
    clearTimeout(tvHide); clearTimeout(tvOut);
    var tv = $('tv');
    if (now === true || tv.hidden) { tv.hidden = true; tv.className = 'pip'; return; }
    tv.classList.add('out');
    tvOut = setTimeout(function () { tv.hidden = true; tv.className = 'pip'; }, 260);
  }
  function flushTV() { if (tvCur) tvCur.finish(); }

  function playTV(members, show, label, keys, done) {
    var tv = $('tv'), finished = false;
    clearTimeout(tvHide); clearTimeout(tvTimer); clearTimeout(tvOut);
    tv.style.setProperty('--c', show.color);
    tv.style.setProperty('--ink', ink(show.color));
    $('tv-title').textContent = S.rosterName + ' Draft';
    $('tv-pick').textContent = 'Pick ' + (totalPicks() + 1);
    $('tv-k').textContent = 'Selecting…';
    $('tv-name').textContent = '';
    $('tv-show').textContent = show.name;

    var N = 18, SLOW = 7;
    var others = S.pool.filter(function (s) { return members.indexOf(s) < 0; });
    if (!others.length) others = S.pool.slice();
    HC.shuffle(others);
    var frames = [];
    for (var i = 0; i < N - 1; i++) frames.push(others[i % others.length]);
    frames.push(members[0]);

    function cardHTML(m) { return '<div class="pip-card"><img src="' + esc(m.img) + '" alt=""><div class="flash"></div></div>'; }
    $('tv-cards').innerHTML = cardHTML(frames[0]);
    tv.className = 'pip rolling fast';
    tv.hidden = false;

    function land() {
      if (finished) return;
      finished = true;
      clearTimeout(tvTimer);
      tvCur = null;
      tv.classList.remove('rolling', 'fast');
      tv.classList.add('land');
      if (members.length > 1) {
        $('tv-cards').innerHTML = members.slice(0, 4).map(cardHTML).join('');
        tv.classList.add('multi');
      }
      $('tv-k').textContent = members.length > 1 ? 'Tag team' : 'Your pick';
      $('tv-name').textContent = label || members.map(function (m) { return m.name; }).join(' & ');
      done();
      tvHide = setTimeout(hideTV, 2200);
    }
    tvCur = { keys: keys, finish: land };
    tv.onclick = function () { if (tvCur) land(); else hideTV(); };

    function delay(i) {
      var k = i - (N - 1 - SLOW);
      return k > 0 ? 45 + 7 * k * k : 45;
    }
    function showFrame(i) {
      var f = frames[i], img = tv.querySelector('.pip-card img');
      if (!img) return;
      img.src = f.img;
      $('tv-name').textContent = f.name;
      if (i === N - 1 - SLOW) tv.classList.remove('fast');
      var card = tv.querySelector('.pip-card');
      card.classList.remove('tick'); void card.offsetWidth; card.classList.add('tick');
    }
    function roll(i) {
      if (finished) return;
      showFrame(i);
      if (i >= N - 1) { land(); return; }
      tvTimer = setTimeout(function () { roll(i + 1); }, delay(i));
    }

    // preload so no frame flashes empty (but never wait long)
    var started = false;
    Promise.race([
      Promise.all(frames.map(function (f) { return new Promise(function (r) { var im = new Image(); im.onload = im.onerror = r; im.src = f.img; }); })),
      new Promise(function (r) { setTimeout(r, 600); })
    ]).then(function () { if (!started && !finished) { started = true; roll(0); } });
  }

  // ------------------------------------------------------------------ rendering: guide banner
  function renderGuide() {
    var el = $('guide'), c = clock(), html;
    if (S.mode === 'turns') {
      if (c) {
        var sh = showById(c.showId);
        var next = upcoming(4).slice(1).map(function (u) { return esc(HC.abbr(showById(u.showId).name)); }).join(' &rsaquo; ');
        html = '<span class="gclock" style="--c:' + esc(sh.color) + '">' + esc(sh.name) + '</span>' +
          '<span class="gtxt"><b>is on the clock</b> &middot; Round ' + c.round + ' &middot; Pick ' + (totalPicks() + 1) + '</span>' +
          '<span class="gstep"><i>1</i>Select a superstar</span><span class="gstep"><i>2</i>Press <b>Draft</b></span>' +
          (next ? '<span class="gnext">Next: ' + next + '</span>' : '');
      } else {
        html = '<span class="gtxt"><b>Draft complete.</b> Press <b>Finalize draft</b> to see your results.</span>';
      }
    } else if (!S.pool.length) {
      html = '<span class="gtxt"><b>Everyone is drafted.</b> Press <b>Finalize draft</b> to see your results.</span>';
    } else {
      html = '<span class="gstep"><i>1</i>Select a superstar</span><span class="gstep"><i>2</i>Press a show button to draft them</span><span class="gstep opt"><i>3</i>Press <b>Finalize draft</b> when you\'re done</span>';
    }
    el.innerHTML = html;
  }

  // ------------------------------------------------------------------ rendering: pool
  function renderPool() {
    var el = $('pool');
    var teamCount = TT.list(S.rosterId).length;
    document.querySelectorAll('#view-seg button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.v === UI.view);
      if (b.dataset.v === 'teams') b.textContent = 'Teams' + (teamCount ? ' (' + teamCount + ')' : '');
    });
    if (UI.view === 'teams') {
      var q = UI.q.trim().toLowerCase();
      var teams = TT.list(S.rosterId).filter(function (t) {
        return !q || TT.displayName(t).toLowerCase().indexOf(q) >= 0 || t.members.some(function (m) { return m.name.toLowerCase().indexOf(q) >= 0; });
      });
      $('pool-count').textContent = teams.length + ' team' + (teams.length === 1 ? '' : 's');
      if (UI.selTeam && !teams.some(function (t) { return t.id === UI.selTeam; })) UI.selTeam = null;
      if (!UI.selTeam && teams.length) UI.selTeam = teams[0].id;
      el.innerHTML = '<div class="pool-new"><button type="button" class="btn btn-primary btn-sm" data-act="team-new">+ New tag team</button></div>' +
        (teams.length ? teams.map(teamRowHTML).join('') : '<div class="empty"><b>No tag teams yet</b>Pick 2 or more superstars, name the team, and draft them together.</div>');
      return;
    }
    var list = filteredPool();
    $('pool-count').textContent = S.pool.length;
    if (!list.length) {
      el.innerHTML = '<div class="empty"><b>' + (S.pool.length ? 'No matches' : 'Pool is empty') + '</b>' +
        (S.pool.length ? 'Try clearing the search.' : 'Everyone has been drafted. Press Finalize draft to see your results.') + '</div>';
      return;
    }
    if (!UI.sel || !poolFind(UI.sel)) UI.sel = key(list[0]);
    el.innerHTML = list.map(function (s) {
      var k = key(s);
      return '<div class="row t-' + s.tier + (k === UI.sel ? ' sel' : '') + '" role="listitem" draggable="true" data-k="' + esc(k) + '">' +
        '<img class="face" src="' + esc(s.img) + '" alt="" loading="lazy" decoding="async" draggable="false">' +
        '<span class="nm">' + esc(s.name) + '</span>' +
        '<span class="tag t-' + s.tier + '">' + TIERS[s.tier].short + '</span></div>';
    }).join('');
  }

  function teamRowHTML(t) {
    var avail = t.members.every(function (m) { return !!poolFind(HC.keyOf(m.name)); });
    return '<div class="team-row' + (avail ? '' : ' broken') + (t.id === UI.selTeam ? ' sel' : '') + '" role="listitem" data-team="' + esc(t.id) + '"' + (avail ? ' draggable="true"' : '') + '>' +
      TT.facesHTML(t) +
      '<div class="team-info"><div class="team-name">' + esc(TT.displayName(t)) + '</div>' +
      '<div class="team-members">' + (avail ? t.members.map(function (m) { return esc(m.name); }).join(' · ') : 'A member is not available (drafted or not in the pool)') + '</div></div>' +
      '<button type="button" class="icon-btn edit" data-act="team-edit" title="Edit team" aria-label="Edit team">&#9998;</button>' +
      '<button type="button" class="icon-btn" data-act="team-del" title="Delete team" aria-label="Delete team">&times;</button></div>';
  }

  // the buttons that draft the selected row: shown right under it, so the list keeps the whole panel
  function renderInfo() {
    var host = $('pool');
    host.querySelectorAll('.rdraft').forEach(function (n) { n.remove(); });
    var row = host.querySelector('.row.sel, .team-row.sel'), sel = selectedPick();
    if (!row || !sel) return;
    var buttons;
    if (!sel.avail) {
      buttons = '<span class="muted">A member of this team is not available.</span>';
    } else if (S.mode === 'turns') {
      var c = clock();
      if (!c) buttons = '<span class="muted">Draft complete &mdash; press Finalize draft.</span>';
      else {
        var sh = showById(c.showId);
        buttons = '<button type="button" class="dbtn go" data-act="draft" data-show="' + sh.id + '" style="--c:' + esc(sh.color) + '"' + (showFull(sh.id, sel.keys.length) ? ' disabled' : '') + '>Draft to ' + esc(sh.name) + ' &#9654;</button>';
      }
    } else {
      buttons = S.shows.map(function (sh, i) {
        return '<button type="button" class="dbtn" data-act="draft" data-show="' + sh.id + '" style="--c:' + esc(sh.color) + '" title="Draft to ' + esc(sh.name) + ' (key ' + (i + 1) + ')"' +
          (showFull(sh.id, sel.keys.length) ? ' disabled' : '') + '>' + esc(sh.name) + '</button>';
      }).join('');
    }
    var strip = document.createElement('div');
    strip.className = 'rdraft';
    strip.innerHTML = buttons;
    row.appendChild(strip);
  }

  // ------------------------------------------------------------------ rendering: shows
  function showPanelHTML(sh, c) {
    var picks = S.picks[sh.id];
    var rows = S.cap ? Math.max(S.cap, picks.length) : Math.max(12, picks.length + 2);
    var fresh = UI.fresh && UI.fresh.showId === sh.id ? UI.fresh : null;
    var list = '';
    for (var i = 0; i < rows; i++) {
      var p = picks[i];
      var isFresh = fresh && i >= fresh.from && i < fresh.from + fresh.n;
      list += '<li class="slot' + (p ? ' filled' : '') + (isFresh ? ' fresh' : '') + '"><span class="ord">' + ord(i + 1) + '</span>' +
        '<span class="nm">' + (p ? esc(p.name) : '') + '</span>' +
        (p ? '<span class="tg">' + TIERS[p.tier].short + '</span>' : '') +
        (p && S.mode === 'free' ? '<button type="button" class="rel" data-act="release" data-show="' + sh.id + '" data-k="' + esc(key(p)) + '" title="Return to pool" aria-label="Return ' + esc(p.name) + ' to pool">&times;</button>' : '') + '</li>';
    }
    var flag = S.mode === 'turns' && c && c.showId === sh.id ? '<span class="sp-flag clock">On the clock</span>' : '';
    return '<div class="show-panel' + (c && c.showId === sh.id ? ' onclock' : '') + (UI.active === sh.id ? ' viewing' : '') + '" data-show="' + sh.id + '" data-drop="' + sh.id + '" style="--c:' + esc(sh.color) + '">' +
      '<div class="sp-head"><span class="sp-name">' + esc(sh.name) + '</span>' + flag + '</div>' +
      '<ol class="sp-list">' + list + '</ol>' +
      '<div class="sp-foot"><span>Roster</span><b>' + picks.length + (S.cap ? ' / ' + S.cap : '') + '</b></div></div>';
  }

  function renderShows() {
    var c = clock();
    var tabs = S.shows.map(function (sh) {
      return '<button type="button" class="stab' + (sh.id === UI.active ? ' on' : '') + '" data-act="tab" data-show="' + sh.id + '" style="--c:' + esc(sh.color) + '">' +
        esc(sh.name) + '<i>' + S.picks[sh.id].length + '</i></button>';
    }).join('');
    $('shows').innerHTML = '<div class="show-tabs">' + tabs + '</div><div class="show-grid n' + S.shows.length + '">' + S.shows.map(function (sh) { return showPanelHTML(sh, c); }).join('') + '</div>';
    if (UI.fresh) {
      var f = $('shows').querySelector('.slot.fresh');
      if (f) f.scrollIntoView({ block: 'nearest' });
      UI.fresh = null;
    }
  }

  // ------------------------------------------------------------------ rendering: action bar
  function renderBar() {
    $('prompts').innerHTML =
      '<button type="button" class="btn btn-steel btn-sm" data-act="undo"' + (S.history.length ? '' : ' disabled') + '>&#8630; Undo</button>' +
      '<button type="button" class="btn btn-steel btn-sm" data-act="random" title="Pick a random superstar for you">Random pick</button>' +
      '<button type="button" class="btn btn-steel btn-sm" data-act="auto"' + (S.pool.length ? '' : ' disabled') + ' title="Fill every show evenly with everyone left">Auto-draft rest</button>' +
      '<span class="gap"></span>' +
      '<span class="stat">Drafted <b>' + totalPicks() + '</b> / ' + (totalPicks() + S.pool.length) + '</span>' +
      '<button type="button" class="btn btn-steel btn-sm" data-act="anim" title="Corner animation for each pick">Animation: ' + (UI.anim ? 'On' : 'Off') + '</button>' +
      '<button type="button" class="btn btn-steel btn-sm" data-act="reset">Reset</button>' +
      '<button type="button" class="btn btn-steel btn-sm" data-act="excel">Excel</button>' +
      '<button type="button" class="btn btn-primary" data-act="finalize">Finalize draft</button>';
  }

  function renderHeader() {
    $('page-title').textContent = S.rosterName + ' Draft';
    document.title = S.rosterName + ' Draft - 2UHub';
  }

  function renderAll() { renderHeader(); renderGuide(); renderPool(); renderInfo(); renderShows(); renderBar(); }

  // -------------------------------------------------------------- custom superstar
  function openCustom() {
    var body = document.createElement('div');
    body.className = 'form-grid';
    body.innerHTML =
      '<div><label class="lbl" for="cs-name">Name</label><input id="cs-name" class="field" maxlength="40" placeholder="e.g. My Created Wrestler"></div>' +
      '<div><label class="lbl" for="cs-img">Image URL (optional)</label><input id="cs-img" class="field" placeholder="https://..."></div>' +
      '<div class="form-grid two"><div><label class="lbl" for="cs-sex">Gender</label><select id="cs-sex" class="hc-select"><option value="man">Man</option><option value="woman">Woman</option></select></div>' +
      '<div><label class="lbl" for="cs-tier">Tier</label><select id="cs-tier" class="hc-select"><option value="high">Main Event</option><option value="mid" selected>Mid Card</option><option value="low">Jobber</option></select></div></div>';
    var m = HC.openModal({
      title: 'Add custom superstar', body: body,
      actions: [
        { label: 'Cancel', kind: 'steel' },
        { label: 'Add to pool', kind: 'primary', onClick: function () {
          var name = body.querySelector('#cs-name').value.trim();
          if (!name) { HC.toast('Give them a name first.', 'warning'); return false; }
          var k = HC.keyOf(name);
          var exists = poolFind(k) || S.shows.some(function (sh) { return S.picks[sh.id].some(function (p) { return key(p) === k; }); });
          if (exists) { HC.toast(name + ' is already in this draft.', 'warning'); return false; }
          var s = { name: name, img: body.querySelector('#cs-img').value.trim() || HC.FALLBACK_IMG, sex: body.querySelector('#cs-sex').value, tier: body.querySelector('#cs-tier').value };
          S.pool.push(s); S.pool.sort(byName);
          UI.view = 'all'; UI.sel = key(s); UI.q = ''; $('q').value = '';
          save(); renderAll();
          HC.toast(name + ' added to the pool.', 'success');
        } }
      ]
    });
    body.querySelector('#cs-name').addEventListener('keydown', function (e) { if (e.key === 'Enter') m.el.querySelector('.btn-primary').click(); });
  }

  // -------------------------------------------------------------- results / exports
  function exportHTML() {
    var cols = S.shows.map(function (sh) {
      var items = S.picks[sh.id].map(function (s, i) {
        return '<div class="xp-item"><span class="xp-n">' + ord(i + 1) + '</span><img src="' + esc(s.img) + '" crossorigin="anonymous" alt=""><span class="xp-nm">' + esc(s.name) + '</span></div>';
      }).join('') || '<div class="xp-none">No picks</div>';
      return '<div class="xp-col" style="--c:' + esc(sh.color) + '"><div class="xp-show">' + esc(sh.name) + '</div><div class="xp-list">' + items + '</div>' +
        '<div class="xp-cnt"><span>Roster</span><b>' + S.picks[sh.id].length + '</b></div></div>';
    }).join('');
    return '<div class="xp"><div class="xp-head">' +
      '<div class="xp-title">' + esc(S.rosterName) + ' Draft Results</div>' +
      '<div class="xp-wm">Generated on <img src="images/px/logo.png" crossorigin="anonymous" alt="2UHub">.com</div></div>' +
      '<div class="xp-grid">' + cols + '</div></div>';
  }

  function waitImages(root) {
    var imgs = Array.prototype.slice.call(root.querySelectorAll('img'));
    return Promise.all(imgs.map(function (im) {
      return im.complete ? Promise.resolve() : new Promise(function (res) { im.onload = im.onerror = res; });
    }));
  }

  function downloadImage(btn) {
    if (typeof html2canvas === 'undefined') { HC.toast('Image library is still loading — try again in a moment.', 'warning'); return; }
    var board = $('draft-export-board');
    board.innerHTML = exportHTML();
    if (btn) btn.disabled = true;
    HC.toast('Generating image…');
    waitImages(board).then(function () { return HC.crispImages(board, 2); }).then(function () {
      return html2canvas(board, { backgroundColor: '#0a0a14', scale: 2, useCORS: true, allowTaint: true });
    }).then(function (canvas) {
      var a = document.createElement('a');
      a.download = S.rosterId + '_draft_results.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      HC.toast('Image saved to your device.', 'success');
    }).catch(function (err) {
      console.error(err);
      HC.toast('Could not create the image. If you opened this file locally, use the hosted site.', 'error');
    }).then(function () { board.innerHTML = ''; if (btn) btn.disabled = false; });
  }

  function exportExcel() {
    if (typeof XLSX === 'undefined') { HC.toast('Excel library is still loading — try again in a moment.', 'warning'); return; }
    if (!totalPicks()) { HC.toast('Draft at least one superstar first.', 'warning'); return; }
    var wb = XLSX.utils.book_new(), used = {};
    S.shows.forEach(function (sh) {
      if (!S.picks[sh.id].length) return;
      var rows = [['#', 'Superstar', 'Gender', 'Tier']].concat(S.picks[sh.id].map(function (s, i) {
        return [i + 1, s.name, s.sex === 'woman' ? 'Woman' : 'Man', TIERS[s.tier].label];
      }));
      var nm = sh.name.replace(/[\[\]:*?\/\\]/g, '').slice(0, 28) || 'Show', base = nm, n = 2;
      while (used[nm.toLowerCase()]) nm = base + ' ' + (n++);
      used[nm.toLowerCase()] = 1;
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), nm);
    });
    XLSX.writeFile(wb, S.rosterId + '_draft_results.xlsx');
  }

  function finalize() {
    flushTV();
    if (!totalPicks()) { HC.toast('Draft at least one superstar first.', 'warning'); return; }
    var body = document.createElement('div');
    body.className = 'xp-preview';
    body.innerHTML = exportHTML();
    var m = HC.openModal({
      title: 'Draft results', body: body, wide: true, focus: false,
      actions: [
        { label: 'Close', kind: 'steel' },
        { label: 'Export Excel', kind: 'steel', close: false, onClick: function () { exportExcel(); return false; } },
        { id: 'img', label: 'Download image', kind: 'primary', close: false, onClick: function (h) { downloadImage(h.buttons.img); return false; } }
      ]
    });
    if (S.pool.length) {
      var note = document.createElement('p');
      note.className = 'muted';
      note.style.margin = '0 0 10px';
      note.textContent = S.pool.length + ' superstars are still undrafted.';
      m.body.insertBefore(note, m.body.firstChild);
    }
  }

  function openHelp() {
    HC.openModal({
      title: 'How the draft works',
      body:
        '<p><b>1. Select</b> a superstar in the list on the left. Use the tabs to see Men, Women or your tag Teams, or search by name.</p>' +
        '<p><b>2. Draft.</b> In <b>free draft</b>, press the button of the show you want (keys <b>1&ndash;4</b> work too) or drag the superstar onto a show. In <b>take turns</b>, press <b>Draft</b> &mdash; the show on the clock gets the pick.</p>' +
        '<p><b>3. Finish.</b> <b>Random pick</b> chooses for you, <b>Auto-draft rest</b> fills every show evenly, <b>Undo</b> takes back the last pick (Ctrl+Z / Backspace). Press <b>Finalize draft</b> for a shareable image and an Excel sheet.</p>' +
        '<p>Every pick plays a short broadcast animation in the bottom-right corner. Click it to skip, or switch it off in the bottom bar. Tag teams you create in Setup (or on the Teams tab) are drafted together as one pick. Your draft autosaves.</p>',
      actions: [{ label: 'Got it', kind: 'primary' }]
    });
    HC.sset('2khub_draft_help_seen', '1');
  }

  // -------------------------------------------------------------- events
  function rowKeys(row) {
    if (row.dataset.team) {
      var t = TT.find(S.rosterId, row.dataset.team);
      return t ? { keys: t.members.map(function (m) { return HC.keyOf(m.name); }), label: TT.displayName(t) } : null;
    }
    return { keys: [row.dataset.k], label: null };
  }

  function selectRow(row) {
    if (row.dataset.team) UI.selTeam = row.dataset.team; else UI.sel = row.dataset.k;
    document.querySelectorAll('#pool .row.sel, #pool .team-row.sel').forEach(function (r) { r.classList.remove('sel'); });
    row.classList.add('sel');
    renderInfo();
  }

  // draft whatever is selected to a given show
  function draftSelected(showId) {
    var sel = selectedPick();
    if (!sel) { HC.toast('Select someone to draft first.', 'warning'); return; }
    if (!sel.avail) { HC.toast('A member of that team is not available.', 'warning'); return; }
    draftKeys(sel.keys, showId, sel.label, false);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) {
      var row = e.target.closest('#pool .row, #pool .team-row');
      if (row) selectRow(row);
      return;
    }
    if (btn.disabled) return;
    var act = btn.dataset.act;
    var row2 = btn.closest('[data-team]');
    switch (act) {
      case 'draft': draftSelected(btn.dataset.show); break;
      case 'release': release(btn.dataset.show, btn.dataset.k); break;
      case 'tab': UI.active = btn.dataset.show; renderShows(); break;
      case 'view': UI.view = btn.dataset.v; renderPool(); renderInfo(); break;
      case 'tier': {
        var s = UI.sel && poolFind(UI.sel);
        if (s) { s.tier = btn.dataset.v; save(); renderAll(); }
        break;
      }
      case 'remove-pool': {
        var p = UI.sel && poolFind(UI.sel);
        if (p) { selectionAfter([key(p)]); S.pool.splice(S.pool.indexOf(p), 1); save(); renderAll(); HC.toast(p.name + ' removed from the pool.'); }
        break;
      }
      case 'random': randomPick(); break;
      case 'auto': autoDraft(); break;
      case 'undo': undo(); break;
      case 'reset': resetDraft(); break;
      case 'finalize': finalize(); break;
      case 'excel': exportExcel(); break;
      case 'custom': openCustom(); break;
      case 'help': openHelp(); break;
      case 'anim':
        UI.anim = !UI.anim; HC.sset(ANIM_KEY, UI.anim ? '1' : '0'); if (!UI.anim) flushTV(); renderBar();
        HC.toast('Pick animation ' + (UI.anim ? 'on' : 'off') + '.');
        break;
      case 'team-new':
        TT.openBuilder({ rosterId: S.rosterId, pool: S.pool, onSave: function (team) { UI.view = 'teams'; UI.selTeam = team.id; renderAll(); } });
        break;
      case 'team-edit': {
        var t = row2 && TT.find(S.rosterId, row2.dataset.team);
        if (t) TT.openBuilder({ rosterId: S.rosterId, pool: S.pool, team: t, onSave: function () { renderAll(); } });
        break;
      }
      case 'team-del': {
        var td = row2 && TT.find(S.rosterId, row2.dataset.team);
        if (td) HC.confirm({ title: 'Delete tag team?', message: 'Delete "' + TT.displayName(td) + '"? The wrestlers themselves are not affected.', okLabel: 'Delete', kind: 'danger' }).then(function (ok) {
          if (ok) { TT.remove(S.rosterId, td.id); renderAll(); }
        });
        break;
      }
    }
  });

  // double-click only in take-turns mode, where the show is unambiguous
  document.addEventListener('dblclick', function (e) {
    var row = e.target.closest('#pool .row, #pool .team-row');
    if (!row || e.target.closest('[data-act]') || S.mode !== 'turns') return;
    selectRow(row);
    var c = clock();
    if (c) draftSelected(c.showId);
  });

  $('q').addEventListener('input', function (e) { UI.q = e.target.value; renderPool(); renderInfo(); });

  document.addEventListener('keydown', function (e) {
    if (isOpenModal()) return;
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'select' || tag === 'textarea';
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); undo(); return; }
    if (typing) return;
    if (e.key === 'Backspace') { e.preventDefault(); undo(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (UI.view === 'teams') return;
      var list = filteredPool();
      if (!list.length) return;
      e.preventDefault();
      var idx = -1;
      list.forEach(function (s, i) { if (key(s) === UI.sel) idx = i; });
      idx = Math.max(0, Math.min(list.length - 1, idx + (e.key === 'ArrowDown' ? 1 : -1)));
      UI.sel = key(list[idx]);
      renderPool(); renderInfo();
      var rowEl = document.querySelector('#pool .row.sel');
      if (rowEl) rowEl.scrollIntoView({ block: 'nearest' });
    } else if (/^[1-4]$/.test(e.key) && S.mode === 'free' && S.shows[+e.key - 1]) {
      draftSelected(S.shows[+e.key - 1].id);
    } else if (e.key === 'Enter' && S.mode === 'turns' && !e.target.closest('button')) {
      var c = clock();
      if (c) draftSelected(c.showId);
    }
  });

  // drag & drop (desktop): drop on any show to draft there
  var dragPayload = null;
  document.addEventListener('dragstart', function (e) {
    var row = e.target.closest && e.target.closest('#pool .row, #pool .team-row');
    if (!row) return;
    var r = rowKeys(row);
    if (!r) return;
    dragPayload = r;
    e.dataTransfer.setData('text/plain', row.dataset.k || row.dataset.team);
    e.dataTransfer.effectAllowed = 'move';
    row.classList.add('dragging');
    document.body.classList.add('dragging');
  });
  document.addEventListener('dragend', function () {
    dragPayload = null;
    document.body.classList.remove('dragging');
    document.querySelectorAll('.dragging, .drag-over').forEach(function (x) { x.classList.remove('dragging', 'drag-over'); });
  });
  document.addEventListener('dragover', function (e) {
    var z = e.target.closest && e.target.closest('[data-drop]');
    if (!z || !dragPayload) return;
    e.preventDefault();
    document.querySelectorAll('.drag-over').forEach(function (x) { if (x !== z) x.classList.remove('drag-over'); });
    z.classList.add('drag-over');
  });
  document.addEventListener('drop', function (e) {
    var z = e.target.closest && e.target.closest('[data-drop]');
    if (!z || !dragPayload) return;
    e.preventDefault();
    var p = dragPayload;
    dragPayload = null;
    document.querySelectorAll('.drag-over').forEach(function (x) { x.classList.remove('drag-over'); });
    draftKeys(p.keys, z.dataset.drop, p.label, true);
  });

  // mobile panel switcher
  $('mtabs').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    $('board').dataset.mp = b.dataset.mp;
    $('mtabs').querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
  });

  // -------------------------------------------------------------- boot
  function start() {
    UI.active = S.turnOrder[0] || S.shows[0].id;
    var c = clock();
    if (c) UI.active = c.showId;
    var list = filteredPool();
    UI.sel = list.length ? key(list[0]) : null;
    save();
    renderAll();
    if (!HC.sget('2khub_draft_help_seen')) openHelp();
  }

  function boot() {
    var session = HC.jget('draftSetup', null, true);
    var saved = HC.jget(STATE_KEY, null);
    if (saved && saved.v === 2 && saved.shows && saved.pool && (!session || session.setupId === saved.setupId)) {
      S = saved;
      S.excluded = S.excluded || []; S.custom = S.custom || [];
      S.pool.forEach(function (p) { p.img = HC.px(p.img); });
      S.shows.forEach(function (sh) { S.picks[sh.id].forEach(function (p) { p.img = HC.px(p.img); }); });
      start();
      return;
    }
    var setup = session || HC.jget('2khub_setup', null) || {};
    var rosterId = setup.rosterId || HC.currentRosterId();
    if (!rosterId) { window.location.replace('tools.html'); return; }   // nothing set up yet: go pick a roster
    HC.loadRoster(rosterId).then(function (data) {
      S = newState(setup, data);
      start();
    }).catch(function (err) {
      console.error(err);
      $('pool').innerHTML = '<div class="empty"><b>Could not load the roster</b>Go back to Setup and pick a roster.<br><a class="btn btn-primary btn-sm" href="tools.html">Open setup</a></div>';
    });
  }

  boot();
})();
