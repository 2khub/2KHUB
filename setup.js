/* Draft Setup page logic: game, superstar pool, tag teams, shows, style.
   Saves the chosen setup, then hands off to draft.html. */
(function () {
  'use strict';
  var HC = window.HC, TT = window.TagTeams;
  var $ = function (id) { return document.getElementById(id); };
  var esc = HC.esc;
  var PALETTE = ['#b3121c', '#c8cdd8', '#1f5fc4', '#f2b705', '#2ecc71', '#9b59b6', '#ff7a00', '#e84393'];
  var MAX_SHOWS = 4, MIN_SHOWS = 2;

  var saved = HC.jget('2khub_setup', null);
  var st = {
    rosterId: (saved && saved.rosterId) || '',
    shows: [],
    mode: (saved && saved.mode === 'turns') ? 'turns' : 'free',
    order: (saved && saved.order === 'snake') ? 'snake' : 'alt',
    randomFirst: !!(saved && saved.randomFirst),
    cap: (saved && saved.cap) || 0,
    excluded: {},   // key -> 1 for superstars switched OFF
    custom: [],     // extra superstars added here
    poolQuery: ''
  };
  var rosterList = [];
  var rosterInfo = null; // {id, roster}
  var rosterNames = {};

  function newShowId() { return 'show' + Date.now().toString(36) + Math.floor(Math.random() * 1e5).toString(36); }
  function key(s) { return HC.keyOf(s.name); }

  // everything shown in the pool grid: the roster + custom superstars
  function allCandidates() {
    if (!rosterInfo) return [];
    var seen = {}, out = [];
    rosterInfo.roster.forEach(function (s) { seen[key(s)] = 1; out.push(s); });
    HC.normalizeRoster(st.custom).forEach(function (s) {
      if (!seen[key(s)]) { seen[key(s)] = 1; out.push({ name: s.name, img: s.img || HC.FALLBACK_IMG, sex: s.sex, tier: s.tier, custom: true }); }
    });
    return out;
  }
  function inPool() { return allCandidates().filter(function (s) { return !st.excluded[key(s)]; }); }

  // ---------- 1: game ----------
  // the rosters you used most recently (up to 5) and a Browse rosters tile. Nothing used yet: just Browse rosters.
  function renderGames() {
    var byId = {};
    rosterList.forEach(function (r) { byId[r.id] = r; });
    var recent = HC.recentRosters().filter(function (id) { return byId[id]; }), ids = recent.slice(0, 5);
    if (st.rosterId && ids.indexOf(st.rosterId) < 0 && byId[st.rosterId]) ids = [st.rosterId].concat(ids.slice(0, 4));
    $('s1').textContent = recent.length ? 'Recent rosters' : 'Browse rosters';
    $('game-grid').innerHTML = ids.map(function (id) {
      var r = byId[id];
      return '<button type="button" class="game-tile' + (r.id === st.rosterId ? ' on' : '') + '" data-id="' + esc(r.id) + '" role="radio" aria-checked="' + (r.id === st.rosterId) + '">' +
        '<span>' + esc(r.name) + '</span></button>';
    }).join('') + '<a class="browse-tile" href="rosters?for=draft"><span>+ Browse rosters</span></a>';
  }

  // no roster picked yet: the page stays usable and says what to do
  function noRoster() {
    rosterInfo = null;
    st.excluded = {}; st.custom = [];
    $('roster-info').textContent = 'No roster yet. Browse the roster community or create your own.';
    defaultShows();
    renderPool(); renderTeams(); renderShows(); renderSummary();
  }

  function selectRoster(id, keepSaved) {
    st.rosterId = id;
    renderGames();
    $('roster-info').textContent = 'Loading roster…';
    return HC.loadRoster(id).then(function (data) {
      if (st.rosterId !== id) return; // user clicked something else meanwhile
      rosterInfo = data;
      var men = data.roster.filter(function (s) { return s.sex === 'man'; }).length;
      $('roster-info').textContent = data.roster.length + ' superstars · ' + men + ' men · ' + (data.roster.length - men) + ' women';
      var same = keepSaved && saved && saved.rosterId === id;
      st.excluded = {}; st.custom = [];
      if (same) {
        (saved.excluded || []).forEach(function (k) { st.excluded[k] = 1; });
        st.custom = Array.isArray(saved.custom) ? saved.custom : [];
      }
      if (same && saved.shows && saved.shows.length >= MIN_SHOWS) {
        st.shows = saved.shows.slice(0, MAX_SHOWS).map(function (s) { return { id: s.id || newShowId(), name: s.name, color: s.color }; });
      } else {
        defaultShows();
      }
      renderPool(); renderTeams(); renderShows(); renderSummary();
    }).catch(function () {
      $('roster-info').textContent = 'Could not load this roster.';
      HC.toast('Could not load that roster file.', 'error');
    });
  }

  // ---------- 2: superstar pool ----------
  function renderPool() {
    var all = allCandidates();
    var q = st.poolQuery.trim().toLowerCase();
    var on = all.filter(function (s) { return !st.excluded[key(s)]; }).length;
    $('pool-info').textContent = on + ' of ' + all.length + ' in the draft';
    var shown = q ? all.filter(function (s) { return s.name.toLowerCase().indexOf(q) >= 0; }) : all;
    $('pool-grid').innerHTML = shown.length ? shown.map(function (s) {
      var off = st.excluded[key(s)];
      return '<button type="button" class="ptile' + (off ? ' off' : '') + '" data-k="' + esc(key(s)) + '" aria-pressed="' + (!off) + '" title="' + (off ? 'Click to add to the draft' : 'Click to remove from the draft') + '">' +
        '<img src="' + esc(s.img) + '" alt="" loading="lazy" decoding="async"><span class="nm">' + esc(s.name) + '</span>' +
        '<span class="tag t-' + s.tier + '">' + HC.TIERS[s.tier].short + '</span><i class="ck">' + (off ? '' : '&#10003;') + '</i></button>';
    }).join('') : '<div class="empty-note">No superstars match.</div>';
  }

  $('pool-grid').addEventListener('click', function (e) {
    var t = e.target.closest('.ptile');
    if (!t) return;
    var k = t.dataset.k;
    if (st.excluded[k]) delete st.excluded[k]; else st.excluded[k] = 1;
    var off = !!st.excluded[k];
    t.classList.toggle('off', off);
    t.setAttribute('aria-pressed', String(!off));
    t.querySelector('.ck').innerHTML = off ? '' : '&#10003;';
    var all = allCandidates();
    $('pool-info').textContent = all.filter(function (s) { return !st.excluded[key(s)]; }).length + ' of ' + all.length + ' in the draft';
    renderTeams(); renderSummary();
  });
  $('pool-search').addEventListener('input', function (e) { st.poolQuery = e.target.value; renderPool(); });
  $('pool-quick').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || !rosterInfo) return;
    var q = b.dataset.q;
    st.excluded = {};
    allCandidates().forEach(function (s) {
      var drop = (q === 'men' && s.sex !== 'man') || (q === 'women' && s.sex !== 'woman') || (q === 'nojob' && s.tier === 'low') ||
        (q === 'top' && s.tier !== 'high') || q === 'none';
      if (drop) st.excluded[key(s)] = 1;
    });
    renderPool(); renderTeams(); renderSummary();
  });

  $('pool-custom').addEventListener('click', function () {
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
          if (allCandidates().some(function (s) { return key(s) === HC.keyOf(name); })) { HC.toast(name + ' is already in the list.', 'warning'); return false; }
          st.custom.push({ name: name, img: body.querySelector('#cs-img').value.trim(), sex: body.querySelector('#cs-sex').value, tier: body.querySelector('#cs-tier').value });
          renderPool(); renderSummary();
          HC.toast(name + ' added to the pool.', 'success');
        } }
      ]
    });
    body.querySelector('#cs-name').addEventListener('keydown', function (e) { if (e.key === 'Enter') m.el.querySelector('.btn-primary').click(); });
  });

  // ---------- 3: tag teams ----------
  function renderTeams() {
    var teams = TT.list(st.rosterId);
    var have = {};
    inPool().forEach(function (s) { have[key(s)] = 1; });
    $('team-list').innerHTML = teams.length ? teams.map(function (t) {
      var out = t.members.filter(function (m) { return !have[HC.keyOf(m.name)]; });
      return '<div class="team-row' + (out.length ? ' broken' : '') + '" data-team="' + esc(t.id) + '">' + TT.facesHTML(t) +
        '<div class="team-info"><div class="team-name">' + esc(TT.displayName(t)) + ' <span class="tcount">' + t.members.length + ' members</span></div>' +
        '<div class="team-members">' + (out.length ? 'Not in your pool: ' + esc(out.map(function (m) { return m.name; }).join(', ')) : t.members.map(function (m) { return esc(m.name); }).join(' · ')) + '</div></div>' +
        '<button type="button" class="icon-btn edit" data-act="team-edit" title="Edit team" aria-label="Edit team">&#9998;</button>' +
        '<button type="button" class="icon-btn" data-act="team-del" title="Delete team" aria-label="Delete team">&times;</button></div>';
    }).join('') : '<div class="empty-note">No tag teams yet. Press <b>+ Create tag team</b> to make your first one.</div>';
  }
  $('team-new').addEventListener('click', function () {
    if (!rosterInfo) return;
    TT.openBuilder({ rosterId: st.rosterId, pool: inPool(), onSave: function () { renderTeams(); renderSummary(); } });
  });
  $('team-list').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    var row = e.target.closest('.team-row');
    if (!btn || !row) return;
    var t = TT.find(st.rosterId, row.dataset.team);
    if (!t) return;
    if (btn.dataset.act === 'team-edit') {
      TT.openBuilder({ rosterId: st.rosterId, pool: inPool(), team: t, onSave: function () { renderTeams(); renderSummary(); } });
    } else {
      HC.confirm({ title: 'Delete tag team?', message: 'Delete "' + TT.displayName(t) + '"? The superstars themselves are not affected.', okLabel: 'Delete', kind: 'danger' }).then(function (ok) {
        if (ok) { TT.remove(st.rosterId, t.id); renderTeams(); renderSummary(); }
      });
    }
  });

  // ---------- 4: shows ----------
  function defaultShows() {
    st.shows = HC.DEFAULT_BRANDS.slice(0, MAX_SHOWS).map(function (b) { return { id: newShowId(), name: b.name, color: b.color }; });
    while (st.shows.length < MIN_SHOWS) st.shows.push({ id: newShowId(), name: 'Show ' + (st.shows.length + 1), color: PALETTE[st.shows.length] });
  }

  function renderShows() {
    var html = st.shows.map(function (s, i) {
      var sw = PALETTE.map(function (c) {
        return '<button type="button" class="swatch' + (c.toLowerCase() === String(s.color).toLowerCase() ? ' on' : '') + '" style="--s:' + c + '" data-c="' + c + '" aria-label="Color ' + c + '"></button>';
      }).join('');
      return '<div class="show-card" data-i="' + i + '" style="--c:' + esc(s.color) + '">' +
        '<div class="show-top"><span class="show-n">Show ' + (i + 1) + '</span>' +
        (st.shows.length > MIN_SHOWS ? '<button type="button" class="icon-btn rm" aria-label="Remove show" title="Remove show">&times;</button>' : '') + '</div>' +
        '<input class="field show-name" maxlength="18" value="' + esc(s.name) + '" aria-label="Show ' + (i + 1) + ' name">' +
        '<div class="swatches">' + sw + '<label class="swatch swatch-custom" title="Custom color"><input type="color" value="' + esc(/^#[0-9a-f]{6}$/i.test(s.color) ? s.color : '#ffffff') + '"></label></div>' +
        '</div>';
    }).join('');
    if (st.shows.length < MAX_SHOWS) html += '<button type="button" class="add-show" id="add-show">+ Add show</button>';
    $('show-grid').innerHTML = html;
  }

  $('show-grid').addEventListener('input', function (e) {
    var card = e.target.closest('.show-card');
    if (!card) return;
    var s = st.shows[+card.dataset.i];
    if (e.target.classList.contains('show-name')) { s.name = e.target.value; renderSummary(); }
    else if (e.target.type === 'color') { s.color = e.target.value; card.style.setProperty('--c', s.color); card.querySelectorAll('.swatch').forEach(function (x) { x.classList.remove('on'); }); }
  });
  $('show-grid').addEventListener('click', function (e) {
    if (e.target.id === 'add-show') {
      var used = st.shows.map(function (s) { return s.color.toLowerCase(); });
      var color = PALETTE.filter(function (c) { return used.indexOf(c) < 0; })[0] || '#c8cdd8';
      st.shows.push({ id: newShowId(), name: 'Show ' + (st.shows.length + 1), color: color });
      renderShows(); renderSummary();
      return;
    }
    var card = e.target.closest('.show-card');
    if (!card) return;
    var i = +card.dataset.i;
    if (e.target.closest('.rm')) { st.shows.splice(i, 1); renderShows(); renderSummary(); return; }
    var sw = e.target.closest('button.swatch');
    if (sw) {
      st.shows[i].color = sw.dataset.c;
      card.style.setProperty('--c', sw.dataset.c);
      card.querySelectorAll('.swatch').forEach(function (x) { x.classList.toggle('on', x === sw); });
    }
  });
  $('reset-shows').addEventListener('click', function () { defaultShows(); renderShows(); renderSummary(); });
  $('game-grid').addEventListener('click', function (e) {
    var t = e.target.closest('.game-tile');
    if (t && t.dataset.id !== st.rosterId) selectRoster(t.dataset.id, false);
  });

  // ---------- 5: style ----------
  function renderStyle() {
    document.querySelectorAll('.style-card').forEach(function (c) {
      var on = c.dataset.mode === st.mode;
      c.classList.toggle('on', on);
      c.setAttribute('aria-checked', on);
    });
    $('opt-order').hidden = st.mode !== 'turns';
    $('opt-random').hidden = st.mode !== 'turns';
    $('order-seg').querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === st.order); });
    $('random-seg').querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', (b.dataset.v === '1') === st.randomFirst); });
    $('cap-select').value = String(st.cap);
    renderSummary();
  }
  document.querySelector('.style-grid').addEventListener('click', function (e) {
    var c = e.target.closest('.style-card');
    if (c) { st.mode = c.dataset.mode; renderStyle(); }
  });
  $('order-seg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { st.order = b.dataset.v; renderStyle(); } });
  $('random-seg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { st.randomFirst = b.dataset.v === '1'; renderStyle(); } });
  $('cap-select').addEventListener('change', function (e) { st.cap = parseInt(e.target.value, 10) || 0; renderSummary(); });

  // ---------- summary + launch ----------
  function rosterName() { return rosterNames[st.rosterId] || st.rosterId; }
  function renderSummary() {
    var n = rosterInfo ? inPool().length : '…';
    var teams = TT.list(st.rosterId).length;
    var style = st.mode === 'turns' ? 'Take turns' : 'Free draft';
    $('summary').innerHTML = '<b>' + esc(rosterName()) + '</b> · ' + n + ' in pool · ' + st.shows.length + ' shows · ' + style +
      (teams ? ' · ' + teams + ' tag team' + (teams === 1 ? '' : 's') : '') + (st.cap ? ' · ' + st.cap + ' per show' : '');
  }

  function cleanShows() {
    var used = {};
    return st.shows.map(function (s, i) {
      var name = (s.name || '').trim() || ('Show ' + (i + 1));
      var base = name, n = 2;
      while (used[name.toLowerCase()]) name = base + ' ' + (n++);
      used[name.toLowerCase()] = 1;
      return { id: s.id, name: name, color: s.color };
    });
  }

  $('start').addEventListener('click', function () {
    if (!rosterInfo) { HC.toast(st.rosterId ? 'Roster is still loading…' : 'Browse rosters and pick one first.', 'warning'); return; }
    var pool = inPool();
    if (pool.length < 2) { HC.toast('Put at least 2 superstars in the pool first.', 'warning'); return; }
    var setup = {
      setupId: Date.now(),
      rosterId: st.rosterId,
      rosterName: rosterName(),
      shows: cleanShows(),
      mode: st.mode,
      order: st.order,
      randomFirst: st.randomFirst,
      cap: st.cap,
      excluded: Object.keys(st.excluded),
      custom: st.custom
    };
    HC.jset('2khub_setup', setup);
    HC.jset('draftSetup', setup, true);
    HC.sset('draftRoster', st.rosterId, true);
    HC.touchRecent(st.rosterId);
    HC.sdel('2khub_draft_state');
    window.location.href = 'draft';
  });

  $('to-matchcard').addEventListener('click', function () {
    HC.sset('draftRoster', st.rosterId, true);
    HC.touchRecent(st.rosterId);
    HC.jset('2khub_setup', Object.assign({}, saved || {}, { rosterId: st.rosterId }));
  });

  // ---------- resume banner ----------
  function initResume() {
    var d = HC.jget('2khub_draft_state', null);
    if (!d || !d.picks) return;
    var n = 0;
    Object.keys(d.picks).forEach(function (k) { n += (d.picks[k] || []).length; });
    if (!n) return;
    $('resume').hidden = false;
    $('resume-info').textContent = (d.rosterName || d.rosterId) + ' · ' + n + ' picks across ' + (d.shows ? d.shows.length : '?') + ' shows';
    $('resume-go').addEventListener('click', function () {
      HC.sdel('draftSetup', true);
      HC.sset('draftRoster', d.rosterId, true);
      window.location.href = 'draft';
    });
    $('resume-drop').addEventListener('click', function () {
      HC.confirm({ title: 'Discard draft?', message: 'This deletes your saved draft progress.', okLabel: 'Discard', kind: 'danger' }).then(function (ok) {
        if (ok) { HC.sdel('2khub_draft_state'); $('resume').hidden = true; }
      });
    });
  }

  // ---------- boot ----------
  renderStyle();
  initResume();
  HC.loadMyRosterList().then(function (list) {
    rosterList = list;
    list.forEach(function (r) { rosterNames[r.id] = r.name; });
    if (!list.some(function (r) { return r.id === st.rosterId; })) st.rosterId = list.length ? list[0].id : '';
    renderGames();
    if (!st.rosterId) return noRoster();
    return selectRoster(st.rosterId, true);
  });
})();
