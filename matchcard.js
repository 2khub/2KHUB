/* 2UHub Match Card Maker. Requires hardcore.js + tagteams.js (+ html2canvas for downloads). */
(function () {
  'use strict';
  var HC = window.HC, TT = window.TagTeams;
  var $ = function (id) { return document.getElementById(id); };
  var esc = HC.esc;
  var SAVE_KEY = '2khub_matchcard';

  // ------------------------------------------------------------------ config
  // Made-up titles, one set per spot on the card. The belt pictures in belts/ are drawn for the site (make-mock-belts.py).
  var TITLE_GROUPS = [
    ['Main card', [['world', 'World Title'], ['heavy', 'Heavyweight Title']]],
    ['Mid card', [['mid', 'Midcard Title'], ['rising', 'Rising Title']]],
    ['Tag teams', [['tag', 'Tag Team Titles'], ['trios', 'Trios Titles']]],
    ['Women', [['w_world', "Women's World Title"], ['w_mid', "Women's Midcard Title"], ['w_tag', "Women's Tag Titles"]]]
  ];
  var TITLE_LABEL = {};
  TITLE_GROUPS.forEach(function (g) { g[1].forEach(function (o) { TITLE_LABEL[o[0]] = o[1]; }); });
  // the name shown next to a belt: whatever the user typed, else the title's own name
  function titleOf(ev) { return (ev.titleName || '').trim() || TITLE_LABEL[ev.champ] || ''; }
  function beltImg(id) { return TITLE_LABEL[id] ? 'belts/' + id + '.png' : ''; }

  var FORMATS = {
    '1v1': { slots: 2, layout: 'team', teamSplit: [1, 1], label: '1 vs 1' },
    '2v2': { slots: 4, layout: 'team', teamSplit: [2, 2], label: '2 vs 2 (Tag Team)' },
    '3v3': { slots: 6, layout: 'team', teamSplit: [3, 3], label: '3 vs 3 (6-Man Tag)' },
    '4v4': { slots: 8, layout: 'team', teamSplit: [4, 4], label: '4 vs 4 (8-Man Tag)' },
    triple: { slots: 3, layout: 'free', label: 'Triple Threat' },
    fatal4: { slots: 4, layout: 'free', label: 'Fatal 4-Way' },
    '5way': { slots: 5, layout: 'free', label: '5-Way' },
    '6way': { slots: 6, layout: 'free', label: '6-Way' },
    handicap1on2: { slots: 3, layout: 'team', teamSplit: [1, 2], label: 'Handicap 1 on 2' },
    handicap1on3: { slots: 4, layout: 'team', teamSplit: [1, 3], label: 'Handicap 1 on 3' },
    handicap2on3: { slots: 5, layout: 'team', teamSplit: [2, 3], label: 'Handicap 2 on 3' }
  };
  var STIP_GROUPS = [
    ['Standard Matches', [['normal', 'Normal Match'], ['submission', 'Submission Match'], ['ironman', 'Iron Man Match'], ['2of3', '2 out of 3 Falls'], ['lastman', 'Last Man Standing'], ['iquit', 'I Quit Match'], ['firstblood', 'First Blood']]],
    ['No Disqualification', [['noholds', 'No Holds Barred'], ['extreme', 'Extreme Rules'], ['fallsanywhere', 'Falls Count Anywhere'], ['backstage', 'Backstage Brawl']]],
    ['Weapon-Based Matches', [['tlc', 'TLC Match'], ['ladder', 'Ladder Match'], ['tables', 'Table Match'], ['chairs', 'Chairs Match']]],
    ['Enclosed Environments', [['steelcage', 'Steel Cage Match'], ['hellinacell', 'Hell in a Cell'], ['chamber', 'Elimination Chamber'], ['wargames', 'WarGames'], ['fightpit', 'Fight Pit']]],
    ['Specialty Matches', [['ambulance', 'Ambulance Match'], ['casket', 'Casket Match'], ['guestref', 'Special Guest Referee'], ['buriedalive', 'Buried Alive Match'], ['inferno', 'Inferno Match'],
      ['lumberjack', 'Lumberjack Match'], ['scramble', 'Championship Scramble'], ['gauntlet', 'Gauntlet Match']]]
  ];
  var STIP_LABEL = {};
  STIP_GROUPS.forEach(function (g) { g[1].forEach(function (o) { STIP_LABEL[o[0]] = o[1]; }); });

  // ------------------------------------------------------------------ state
  var S = {
    mode: '',            // '' (not chosen yet) | 'roster' (a roster from Browse rosters) | 'free' (type names and add photos)
    rosterId: '', rosterName: '', roster: [], source: 'all', free: [],
    events: [], nextId: 1, active: null, sex: 'all', tab: 'stars', showName: '', color: '#e0202c'
  };
  function pool() { return S.mode === 'free' ? S.free : S.roster; }
  function tid() { return S.mode === 'free' ? 'free' : S.rosterId; }

  function slim(s) { return { name: s.name, img: HC.px(s.img || '') || HC.FALLBACK_IMG, sex: s.sex || 'man', tier: s.tier || 'mid' }; }
  function key(s) { return HC.keyOf(s.name); }
  function fmt(ev) { return FORMATS[ev.type] || FORMATS['1v1']; }
  function newEvent(type) {
    type = FORMATS[type] ? type : '1v1';
    var n = FORMATS[type].slots, slots = [];
    for (var i = 0; i < n; i++) slots.push(null);
    return { id: S.nextId++, type: type, champ: 'none', stip: 'normal', slots: slots, sideTeams: [null, null] };
  }
  function getEvent(id) { for (var i = 0; i < S.events.length; i++) if (S.events[i].id === id) return S.events[i]; return null; }
  function sidesOf(ev) {
    var f = fmt(ev);
    if (f.layout !== 'team') return null;
    return [{ start: 0, end: f.teamSplit[0] }, { start: f.teamSplit[0], end: f.slots }];
  }
  function sideIndex(ev, i) { var s = sidesOf(ev); return s ? (i < s[0].end ? 0 : 1) : -1; }
  function isMobile() { return window.matchMedia && window.matchMedia('(max-width: 900px)').matches; }

  function save() {
    HC.jset(SAVE_KEY, { v: 1, showName: S.showName, color: S.color, nextId: S.nextId, events: S.events, mode: S.mode, rosterId: S.rosterId, rosterName: S.rosterName, free: S.free });
  }
  function restore() {
    var d = HC.jget(SAVE_KEY, null);
    if (d && d.v === 1 && Array.isArray(d.events) && d.events.length) {
      S.events = d.events.filter(function (ev) { return ev && FORMATS[ev.type] && Array.isArray(ev.slots); }).map(function (ev) {
        var n = FORMATS[ev.type].slots;
        ev.slots = ev.slots.slice(0, n);
        while (ev.slots.length < n) ev.slots.push(null);
        ev.sideTeams = Array.isArray(ev.sideTeams) ? ev.sideTeams : [null, null];
        ev.slots = ev.slots.map(function (x) { return x ? slim(x) : x; });
        if (!TITLE_LABEL[ev.champ]) ev.champ = 'none';
        ev.titleName = typeof ev.titleName === 'string' ? ev.titleName.slice(0, 28) : '';   // cards saved before the made-up titles
        return ev;
      });
      S.nextId = Math.max(d.nextId || 1, S.events.reduce(function (m, e) { return Math.max(m, e.id + 1); }, 1));
      S.showName = typeof d.showName === 'string' ? d.showName.slice(0, 28) : '';
      S.color = /^#[0-9a-f]{6}$/i.test(d.color || '') ? d.color : S.color;
    }
    if (d && (d.mode === 'roster' || d.mode === 'free')) S.mode = d.mode;
    if (d && typeof d.rosterId === 'string') { S.rosterId = d.rosterId; S.rosterName = typeof d.rosterName === 'string' ? d.rosterName : ''; }
    if (d && Array.isArray(d.free)) S.free = d.free.filter(function (x) { return x && x.name; }).slice(0, 80).map(slim);
    if (!S.events.length) S.events = [newEvent('1v1')];
  }

  // ------------------------------------------------------------------ slot targeting
  function orderedSlots() {
    var out = [];
    S.events.forEach(function (ev) { ev.slots.forEach(function (_, i) { out.push({ e: ev.id, i: i }); }); });
    return out;
  }
  function targetSlot() {
    if (S.active) {
      var ev = getEvent(S.active.e);
      if (ev && S.active.i < ev.slots.length) return S.active;
      S.active = null;
    }
    var all = orderedSlots();
    for (var k = 0; k < all.length; k++) if (!getEvent(all[k].e).slots[all[k].i]) return all[k];
    return null;
  }
  function advanceFrom(pos) {
    var all = orderedSlots(), start = 0;
    all.forEach(function (p, idx) { if (p.e === pos.e && p.i === pos.i) start = idx + 1; });
    for (var k = 0; k < all.length; k++) {
      var p = all[(start + k) % all.length];
      if (!getEvent(p.e).slots[p.i]) { S.active = p; return; }
    }
    S.active = null;
  }

  // ------------------------------------------------------------------ card mutations
  // is this superstar already somewhere in the match (ignoring slots in [from, to))?
  function inMatch(ev, ss, from, to) {
    var k = key(ss);
    return ev.slots.some(function (s, i) { return s && key(s) === k && !(i >= from && i < to); });
  }

  function fill(eid, idx, ss) {
    var ev = getEvent(eid);
    if (!ev || idx < 0 || idx >= ev.slots.length) return;
    if (inMatch(ev, ss, idx, idx + 1)) { HC.toast(ss.name + ' is already in this match.', 'warning'); return; }
    ev.slots[idx] = slim(ss);
    var sd = sideIndex(ev, idx);
    if (sd >= 0) ev.sideTeams[sd] = null;
    advanceFrom({ e: eid, i: idx });
    render();
  }

  function addSuperstar(ss) {
    var t = targetSlot();
    if (!t) { HC.toast('The card is full — add another match first.', 'warning'); return; }
    fill(t.e, t.i, ss);
  }

  function placeOnSide(ev, side, team) {
    var sd = sidesOf(ev);
    if (!sd) return false;
    var range = sd[side], size = range.end - range.start;
    if (team.members.length > size) { HC.toast('That side only has ' + size + ' slot' + (size === 1 ? '' : 's') + '.', 'warning'); return false; }
    var clash = team.members.filter(function (m) { return inMatch(ev, m, range.start, range.end); })[0];
    if (clash) { HC.toast(clash.name + ' is already in this match.', 'warning'); return false; }
    for (var i = range.start; i < range.end; i++) ev.slots[i] = null;
    team.members.forEach(function (m, k) { ev.slots[range.start + k] = slim(m); });
    ev.sideTeams[side] = { id: team.id, name: TT.displayName(team) };
    advanceFrom({ e: ev.id, i: range.start + team.members.length - 1 });
    return true;
  }

  function placeTeam(team) {
    var n = team.members.length, ev, sd, side = -1, target = null;
    var t = S.active && getEvent(S.active.e) ? S.active : null;
    if (t) {
      ev = getEvent(t.e); side = sideIndex(ev, t.i);
      if (side >= 0) { sd = sidesOf(ev)[side]; if (sd.end - sd.start >= n) target = { ev: ev, side: side }; }
    }
    if (!target) {
      S.events.some(function (e) {
        var s = sidesOf(e);
        if (!s) return false;
        return [0, 1].some(function (k) {
          var size = s[k].end - s[k].start, empty = 0;
          for (var i = s[k].start; i < s[k].end; i++) if (!e.slots[i]) empty++;
          var clashes = team.members.some(function (m) { return inMatch(e, m, 0, 0); });
          if (size >= n && empty === size && !clashes) { target = { ev: e, side: k }; return true; }
          return false;
        });
      });
    }
    if (!target) {
      if (n > 4) { HC.toast('That team has ' + n + ' members — a side holds at most 4. Draft it, but a match needs a smaller team.', 'warning'); return; }
      var type = n === 4 ? '4v4' : n === 3 ? '3v3' : '2v2';
      var made = newEvent(type);
      S.events.push(made);
      target = { ev: made, side: 0 };
      HC.toast('Added a ' + FORMATS[type].label + ' for them.');
    }
    if (placeOnSide(target.ev, target.side, team)) render();
  }

  function changeType(ev, type) {
    ev.type = type;
    var n = FORMATS[type].slots;
    while (ev.slots.length < n) ev.slots.push(null);
    ev.slots.length = n;
    ev.sideTeams = [null, null];
    if (S.active && S.active.e === ev.id && S.active.i >= n) S.active = null;
  }

  // ------------------------------------------------------------------ rendering: card
  function optionsHTML(groups, selected) {
    return groups.map(function (g) {
      return '<optgroup label="' + esc(g[0]) + '">' + g[1].map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === selected ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
  }
  var FORMAT_OPTS = Object.keys(FORMATS);

  function slotHTML(ev, i, tgt) {
    var s = ev.slots[i];
    var isNext = tgt && tgt.e === ev.id && tgt.i === i;
    if (s) {
      return '<div class="mc-slot filled" data-e="' + ev.id + '" data-i="' + i + '" title="' + (S.mode === 'free' ? 'Click to edit' : 'Click to remove') + '"><img src="' + esc(s.img) + '" alt=""><span class="mc-slot-name">' + esc(s.name) + '</span><b class="mc-x">&times;</b></div>';
    }
    return '<div class="mc-slot empty' + (isNext ? ' next' : '') + '" data-e="' + ev.id + '" data-i="' + i + '"><span class="plus">+</span><span class="mc-slot-label">' + (S.mode === 'free' ? 'Name and photo' : isNext ? 'Pick a superstar' : 'Add superstar') + '</span></div>';
  }

  function eventHTML(ev, idx, tgt) {
    var f = fmt(ev), sd = sidesOf(ev), main = S.events.length > 1 && idx === S.events.length - 1;
    var belt = beltImg(ev.champ);
    var body = '';
    if (sd) {
      body = [0, 1].map(function (k) {
        var r = sd[k], size = r.end - r.start, slots = '';
        for (var i = r.start; i < r.end; i++) slots += slotHTML(ev, i, tgt);
        var tm = ev.sideTeams[k];
        return '<div class="mc-side-box' + (tm ? ' is-team' : '') + '">' +
          '<div class="mc-side-head"><span class="mc-side-name">' + (tm ? esc(tm.name) : (size === 1 ? 'Competitor' : 'Team ' + (k ? 'B' : 'A'))) + '</span>' +
          (size >= 2 ? '<button type="button" class="mini hi" data-act="side-team" data-e="' + ev.id + '" data-side="' + k + '">Tag team</button>' : '') +
          '<button type="button" class="mini" data-act="side-clear" data-e="' + ev.id + '" data-side="' + k + '">Clear</button></div>' +
          '<div class="mc-side-slots n' + size + '">' + slots + '</div></div>';
      }).join('<div class="mc-vs"><span>VS</span></div>');
    } else {
      var s = '';
      for (var j = 0; j < ev.slots.length; j++) s += slotHTML(ev, j, tgt);
      body = '<div class="mc-free n' + ev.slots.length + '">' + s + '</div>';
    }
    return '<section class="mc-event panel" data-e="' + ev.id + '">' +
      '<div class="mc-ev-head"><span class="mc-ev-n">Match ' + (idx + 1) + (main ? ' <em>Main event</em>' : '') + '</span>' +
      '<div class="mc-ev-sel">' +
      '<select class="hc-select" data-f="type" aria-label="Match type">' + FORMAT_OPTS.map(function (k) { return '<option value="' + k + '"' + (k === ev.type ? ' selected' : '') + '>' + FORMATS[k].label + '</option>'; }).join('') + '</select>' +
      '<select class="hc-select" data-f="stip" aria-label="Stipulation">' + optionsHTML(STIP_GROUPS, ev.stip) + '</select>' +
      '<select class="hc-select" data-f="champ" aria-label="Title"><option value="none">Non-title match</option>' + optionsHTML(TITLE_GROUPS, ev.champ) + '</select>' +
      '</div>' +
      '<div class="mc-ev-tools">' +
      '<button type="button" class="icon-btn" data-act="up" data-e="' + ev.id + '" title="Move up" aria-label="Move match up"' + (idx === 0 ? ' disabled' : '') + '>&#9650;</button>' +
      '<button type="button" class="icon-btn" data-act="down" data-e="' + ev.id + '" title="Move down" aria-label="Move match down"' + (idx === S.events.length - 1 ? ' disabled' : '') + '>&#9660;</button>' +
      '<button type="button" class="icon-btn" data-act="del" data-e="' + ev.id + '" title="Remove match" aria-label="Remove match">&times;</button></div></div>' +
      (belt ? '<div class="mc-belt"><img src="' + esc(belt) + '" alt=""><input class="mc-belt-name" data-f="tname" maxlength="28" value="' + esc(ev.titleName || '') + '" placeholder="' + esc(TITLE_LABEL[ev.champ]) + '" autocomplete="off" aria-label="Title name" title="Click to rename this title"></div>' : '') +
      '<div class="mc-ev-body ' + (sd ? 'is-team' : 'is-free') + '">' + body + '</div></section>';
  }

  function renderEvents() {
    var tgt = targetSlot();
    $('events').innerHTML = S.events.map(function (ev, i) { return eventHTML(ev, i, tgt); }).join('');
  }

  // ------------------------------------------------------------------ rendering: sidebar
  function onCardKeys() {
    var m = {};
    S.events.forEach(function (ev) { ev.slots.forEach(function (s) { if (s) m[key(s)] = 1; }); });
    return m;
  }
  function filteredRoster() {
    var base = S.roster;
    if (S.source !== 'all') {
      var last = HC.jget('2khub_last_draft', null);
      var show = last && last.rosterId === S.rosterId ? last.shows.filter(function (s) { return s.id === S.source; })[0] : null;
      if (show) {
        var keys = {};
        show.members.forEach(function (m) { keys[key(m)] = 1; });
        base = S.roster.filter(function (s) { return keys[key(s)]; });
      }
    }
    return base.filter(function (s) { return S.sex === 'all' || s.sex === S.sex; });
  }

  function rowHTML(s, on, del) {
    var k = key(s);
    return '<div class="mrow' + (on[k] ? ' on-card' : '') + '" role="listitem" draggable="true" data-k="' + esc(k) + '">' +
      '<img src="' + esc(s.img) + '" alt="" loading="lazy" decoding="async" draggable="false"><span class="nm">' + esc(s.name) + '</span>' +
      (del ? '<button type="button" class="icon-btn" data-act="free-del" data-k="' + esc(k) + '" title="Remove from the list" aria-label="Remove from the list">&times;</button>'
        : on[k] ? '<span class="tag">On card</span>' : '<span class="tag t-' + s.tier + '">' + HC.TIERS[s.tier].short + '</span>') + '</div>';
  }

  function renderRoster() {
    var on = onCardKeys(), list;
    if (S.mode === 'free') {
      $('roster-count').innerHTML = '<span>' + S.free.length + ' added</span><button type="button" class="mini hi" data-act="free-new">+ New superstar</button>';
      $('roster-list').innerHTML = S.free.length ? S.free.map(function (s) { return rowHTML(s, on, true); }).join('')
        : '<div class="empty-note"><b>Free mode</b>Click a slot on the card, type a name and add a photo.</div>';
      return;
    }
    if (S.mode !== 'roster') {
      $('roster-count').textContent = '';
      $('roster-list').innerHTML = '<div class="empty-note"><b>Choose how to start</b>Browse a roster, or use free mode and type your own names.</div>';
      return;
    }
    list = filteredRoster();
    $('roster-count').textContent = list.length + ' superstar' + (list.length === 1 ? '' : 's');
    $('roster-list').innerHTML = list.length ? list.map(function (s) { return rowHTML(s, on, false); }).join('') : '<div class="empty-note">No superstars here.</div>';
  }

  function renderTeams() {
    var teams = TT.list(tid());
    $('team-count').textContent = teams.length || '';
    $('team-list').innerHTML = teams.length ? teams.map(function (t) {
      return '<div class="team-row" draggable="true" data-team="' + esc(t.id) + '">' + TT.facesHTML(t) +
        '<div class="team-info"><div class="team-name">' + esc(TT.displayName(t)) + '</div><div class="team-members">' + t.members.map(function (m) { return esc(m.name); }).join(' · ') + '</div></div>' +
        '<button type="button" class="icon-btn edit" data-act="team-edit" title="Edit team" aria-label="Edit team">&#9998;</button>' +
        '<button type="button" class="icon-btn" data-act="team-del" title="Delete team" aria-label="Delete team">&times;</button></div>';
    }).join('') : '<div class="empty-note"><b>No tag teams yet</b>Create one and it will be saved for next time.</div>';
  }

  function renderSide() {
    $('side-stars').hidden = S.tab !== 'stars';
    $('side-teams').hidden = S.tab !== 'teams';
    document.querySelectorAll('#side-tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === S.tab); });
    document.querySelectorAll('#sex-seg button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === S.sex); });
    $('sex-seg').hidden = S.mode !== 'roster';
    var rt = $('mode-roster');
    rt.classList.toggle('on', S.mode === 'roster');
    rt.innerHTML = '<span>' + esc(S.rosterId ? (S.rosterName || 'Roster') : 'Browse a roster') + '</span>' + (S.mode === 'roster' ? '<em>Change roster</em>' : '');
    $('mode-free').classList.toggle('on', S.mode === 'free');
    $('card-hint').textContent = S.mode === 'free' ? 'Click a slot, type a name and add a photo if you like.'
      : S.mode === 'roster' ? 'Click a slot, then a superstar \u2014 or just click superstars to fill the card top to bottom.'
      : 'Browse a roster or use free mode to fill the card.';
  }

  // phone bottom-sheet covers the lower part of the card: keep the slot being filled in the visible strip
  function scrollToTarget() {
    var el = document.querySelector('.mc-slot.next'), main = document.querySelector('.mc-main');
    if (!el || !main) return;
    var r = el.getBoundingClientRect(), m = main.getBoundingClientRect();
    main.scrollBy({ top: r.top - m.top - 10, behavior: 'smooth' });
  }

  function render() {
    renderEvents(); renderRoster(); renderTeams(); renderSide(); buildPoolSelect(); save();
    if (isMobile() && document.body.classList.contains('sheet-open')) scrollToTarget();
  }

  function buildPoolSelect() {
    var sel = $('pool-select');
    var last = HC.jget('2khub_last_draft', null);
    if (S.mode !== 'roster' || !last || last.rosterId !== S.rosterId) { sel.hidden = true; S.source = 'all'; return; }
    var shows = last.shows.filter(function (s) { return s.members && s.members.length; });
    if (!shows.length) { sel.hidden = true; S.source = 'all'; return; }
    if (sel.dataset.for === S.rosterId + '|' + shows.length) { sel.hidden = false; sel.value = S.source; return; }
    sel.dataset.for = S.rosterId + '|' + shows.length;
    sel.innerHTML = '<option value="all">Full roster</option>' + shows.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc(s.name) + ' (' + s.members.length + ' drafted)</option>'; }).join('');
    sel.hidden = false;
    sel.value = S.source;
    if (sel.value !== S.source) S.source = sel.value = 'all';
  }

  // ------------------------------------------------------------------ roster loading
  function loadRoster(id) {
    S.rosterId = id;
    $('roster-list').innerHTML = '<div class="empty-note">Loading roster\u2026</div>';
    return HC.loadRoster(id).then(function (data) {
      if (S.rosterId !== id) return;
      S.rosterName = data.name || 'Roster';
      S.roster = data.roster.slice().sort(function (a, b) { return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }); });
      S.source = 'all';
      render();
    }).catch(function () {
      if (S.rosterId !== id) return;
      S.roster = []; S.rosterId = ''; S.rosterName = ''; S.mode = '';
      HC.toast('That roster could not be loaded. Browse rosters again.', 'warning');
      render();
    });
  }

  // ------------------------------------------------------------------ free mode: a name and an optional photo for each superstar
  // A photo is cut to a square, shrunk and blown back up with hard edges, so it looks like the pixel portraits.
  function photoToSprite(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type)) { reject(new Error('That file is not a picture.')); return; }
      var fr = new FileReader();
      fr.onerror = function () { reject(new Error('Could not read that file.')); };
      fr.onload = function () {
        var im = new Image();
        im.onerror = function () { reject(new Error('Could not read that picture.')); };
        im.onload = function () {
          var side = Math.min(im.width, im.height), sx = (im.width - side) / 2, sy = (im.height - side) * 0.2;
          var small = document.createElement('canvas'); small.width = small.height = 32;
          var sc = small.getContext('2d'); sc.imageSmoothingEnabled = true; sc.drawImage(im, sx, sy, side, side, 0, 0, 32, 32);
          var big = document.createElement('canvas'); big.width = big.height = 96;
          var bc = big.getContext('2d'); bc.imageSmoothingEnabled = false; bc.drawImage(small, 0, 0, 96, 96);
          resolve(big.toDataURL('image/png'));
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  // target: {e, i} to fill/edit that slot, or null to just add to the list
  function openFreeEditor(target) {
    var ev = target ? getEvent(target.e) : null, cur = ev ? ev.slots[target.i] : null;
    var img = cur && cur.img !== HC.FALLBACK_IMG ? cur.img : '';
    var body = document.createElement('div');
    body.className = 'fe';
    body.innerHTML = '<label class="lbl" for="fe-name">Name</label><input id="fe-name" class="field" maxlength="24" autocomplete="off" placeholder="Superstar name">' +
      '<label class="lbl" for="fe-file">Photo (optional)</label>' +
      '<div class="fe-photo"><img id="fe-prev" alt="" src="' + esc(img || HC.FALLBACK_IMG) + '"><div class="fe-pick"><input id="fe-file" type="file" accept="image/*">' +
      '<button type="button" class="btn btn-steel btn-sm" id="fe-clear">No photo</button></div></div>';
    body.querySelector('#fe-name').value = cur ? cur.name : '';
    var actions = [{ label: 'Cancel', kind: 'steel' }];
    if (cur) actions.push({ label: 'Remove', kind: 'danger', onClick: function () { ev.slots[target.i] = null; var sd = sideIndex(ev, target.i); if (sd >= 0) ev.sideTeams[sd] = null; S.active = target; render(); } });
    actions.push({ label: 'Save', kind: 'primary', close: false, onClick: function (h) {
      var name = body.querySelector('#fe-name').value.trim().replace(/\s+/g, ' ');
      if (!name) { HC.toast('Type a name first.', 'warning'); return false; }
      var star = { name: name, img: img || HC.FALLBACK_IMG, sex: 'man', tier: 'mid' }, k = key(star);
      var at = S.free.map(key).indexOf(k);
      if (at >= 0) S.free[at] = star; else S.free.push(star);
      if (target && ev) { fill(target.e, target.i, star); } else { addSuperstar(star); }
      render();
      h.close();
      return false;
    } });
    HC.openModal({ title: cur ? 'Edit superstar' : 'New superstar', body: body, actions: actions });
    body.querySelector('#fe-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      photoToSprite(f).then(function (url) { img = url; body.querySelector('#fe-prev').src = url; }, function (err) { HC.toast(err.message, 'warning'); e.target.value = ''; });
    });
    body.querySelector('#fe-clear').addEventListener('click', function () { img = ''; body.querySelector('#fe-prev').src = HC.FALLBACK_IMG; body.querySelector('#fe-file').value = ''; });
    body.querySelector('#fe-name').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var b = body.closest('.hc-modal'); var btn = b && b.querySelector('.hc-modal-foot .btn-primary'); if (btn) btn.click(); } });
  }

  // ------------------------------------------------------------------ team picker (for a side)
  function openTeamPicker(ev, side) {
    var r = sidesOf(ev)[side], size = r.end - r.start;
    var body = document.createElement('div');
    function draw() {
      var teams = TT.list(tid()).filter(function (t) { return t.members.length <= size; });
      body.innerHTML = (teams.length ? teams.map(function (t) {
        return '<div class="team-row pick" data-id="' + esc(t.id) + '" tabindex="0">' + TT.facesHTML(t) +
          '<div class="team-info"><div class="team-name">' + esc(TT.displayName(t)) + '</div><div class="team-members">' + t.members.map(function (m) { return esc(m.name); }).join(' · ') + '</div></div></div>';
      }).join('') : '<p class="muted">You have no saved tag teams yet. Create your first one — it takes a few seconds.</p>') +
        '<div style="margin-top:14px"><button type="button" class="btn btn-primary btn-sm" id="pk-new">+ Create new tag team</button></div>';
    }
    draw();
    var m = HC.openModal({ title: 'Choose a tag team', body: body, focus: false, actions: [{ label: 'Cancel', kind: 'steel' }] });
    body.addEventListener('click', function (e) {
      var row = e.target.closest('.team-row.pick');
      if (row) {
        var t = TT.find(tid(), row.dataset.id);
        if (t && placeOnSide(ev, side, t)) { render(); m.close(); }
        return;
      }
      if (e.target.id === 'pk-new') {
        m.close();
        TT.openBuilder({ rosterId: tid(), pool: pool(), onSave: function (team) { if (placeOnSide(ev, side, team)) render(); } });
      }
    });
  }

  // ------------------------------------------------------------------ export
  function showTitle() { return (S.showName || '').trim() || 'Match Card'; }

  function exportHTML() {
    var html = '<div class="mcx" style="--acc:' + esc(S.color) + '">' +
      '<div class="mcx-head"><div class="mcx-show">' + esc(showTitle()) + '</div><div class="mcx-bar"></div></div>';

    function slotX(s) {
      return s ? '<div class="mcx-slot"><img src="' + esc(s.img) + '" crossorigin="anonymous" alt=""><span>' + esc(s.name) + '</span></div>'
        : '<div class="mcx-slot empty"><i>?</i><span>TBA</span></div>';
    }
    function beltX(belt, name) { return belt ? '<img class="mcx-belt" src="' + esc(belt) + '" crossorigin="anonymous" alt=""><div class="mcx-belt-name">' + esc(name) + '</div>' : ''; }
    S.events.forEach(function (ev, idx) {
      var f = fmt(ev), sd = sidesOf(ev), belt = beltImg(ev.champ);
      var main = S.events.length > 1 && idx === S.events.length - 1;
      html += '<div class="mcx-match' + (main ? ' main' : '') + '">' +
        '<div class="mcx-top">' + (main ? '<span class="mcx-main">Main event</span>' : '') + '<span class="mcx-type">' + esc(f.label) + '</span>' +
        '<span class="mcx-stip">' + esc(STIP_LABEL[ev.stip] || 'Normal Match') + '</span></div>';
      if (sd) {
        var sideX = function (k) {
          var tm = ev.sideTeams[k], out = '<div class="mcx-side">' + (tm ? '<div class="mcx-team">' + esc(tm.name) + '</div>' : '') + '<div class="mcx-row">';
          for (var i = sd[k].start; i < sd[k].end; i++) out += slotX(ev.slots[i]);
          return out + '</div></div>';
        };
        html += '<div class="mcx-body">' + sideX(0) + '<div class="mcx-vs">' + beltX(belt, titleOf(ev)) + '<b>VS</b></div>' + sideX(1) + '</div>';
      } else {
        html += '<div class="mcx-body free">' + beltX(belt, titleOf(ev)) + '<div class="mcx-row">' + ev.slots.map(slotX).join('') + '</div></div>';
      }
      html += '</div>';
    });
    return html + '<div class="mcx-wm"><span>Made on</span><img src="images/px/logo.png" crossorigin="anonymous" alt="2UHub"><span>.com</span></div></div>';
  }

  function waitImages(root) {
    return Promise.all(Array.prototype.slice.call(root.querySelectorAll('img')).map(function (im) {
      return im.complete ? Promise.resolve() : new Promise(function (res) { im.onload = im.onerror = res; });
    }));
  }

  // Shrink the picture, then enlarge it with hard edges: text and shapes become chunky pixels like the sprites.
  function pixelate(src, block, out) {
    var w = Math.ceil(src.width / block), h = Math.ceil(src.height / block);
    var small = document.createElement('canvas'); small.width = w; small.height = h;
    var sx = small.getContext('2d'); sx.imageSmoothingEnabled = true; sx.drawImage(src, 0, 0, w, h);
    var big = document.createElement('canvas'); big.width = w * out; big.height = h * out;
    var bx = big.getContext('2d'); bx.imageSmoothingEnabled = false; bx.drawImage(small, 0, 0, big.width, big.height);
    return big;
  }

  // -> Promise<canvas> with the finished, pixelated match card
  function renderCard() {
    var board = $('mc-export-board');
    board.innerHTML = exportHTML();
    var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    return fonts.then(function () { return waitImages(board); }).then(function () { return HC.crispImages(board, 1); }).then(function () {
      return html2canvas(board.firstChild, { backgroundColor: '#0e0e16', scale: 1, useCORS: true, allowTaint: true });
    }).then(function (canvas) {
      board.innerHTML = '';
      return pixelate(canvas, 2, 4);
    }, function (err) { board.innerHTML = ''; throw err; });
  }

  function openPreview() {
    var filled = S.events.some(function (ev) { return ev.slots.some(Boolean); });
    if (!filled) { HC.toast('Add at least one superstar to the card first.', 'warning'); return; }
    if (typeof html2canvas === 'undefined') { HC.toast('Image library is still loading — try again in a moment.', 'warning'); return; }
    var body = document.createElement('div');
    body.className = 'mcx-wrap';
    body.innerHTML = '<p class="muted">Making your card…</p>';
    var url = null;
    var m = HC.openModal({
      title: 'Match card', body: body, wide: true, focus: false,
      actions: [
        { label: 'Close', kind: 'steel' },
        { id: 'save', label: 'Save image', kind: 'primary', close: false, onClick: function () {
          if (!url) return false;
          var a = document.createElement('a');
          a.download = (showTitle().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'show') + '-matchcard.png';
          a.href = url;
          a.click();
          HC.toast('Match card downloaded.', 'success');
          return false;
        } }
      ]
    });
    m.buttons.save.disabled = true;
    renderCard().then(function (canvas) {
      url = canvas.toDataURL('image/png');
      body.innerHTML = '';
      var img = new Image();
      img.className = 'mcx-result';
      img.alt = 'Match card';
      img.src = url;
      body.appendChild(img);
      m.buttons.save.disabled = false;
    }).catch(function (err) {
      console.error(err);
      HC.toast('Could not make the image. If you opened this file locally, use the hosted site.', 'error');
      m.close();
    });
  }

  // ------------------------------------------------------------------ events
  function openSheet() { document.body.classList.add('sheet-open'); setTimeout(scrollToTarget, 60); }
  function closeSheet() { document.body.classList.remove('sheet-open'); }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (btn) {
      if (btn.disabled) return;
      var act = btn.dataset.act, ev = btn.dataset.e ? getEvent(+btn.dataset.e) : null;
      switch (act) {
        case 'tab': S.tab = btn.dataset.v; renderSide(); return;
        case 'mode-roster':
          if (S.rosterId && S.mode !== 'roster') { S.mode = 'roster'; if (!S.roster.length) loadRoster(S.rosterId); render(); }
          else window.location.href = 'rosters.html?for=matchcard';
          return;
        case 'mode-free': S.mode = 'free'; S.sex = 'all'; render(); return;
        case 'free-new': openFreeEditor(null); return;
        case 'free-del': S.free = S.free.filter(function (x) { return key(x) !== btn.dataset.k; }); render(); return;
        case 'f-sex': S.sex = btn.dataset.v; renderSide(); renderRoster(); return;
        case 'add-match': {
          var m = newEvent('1v1');
          S.events.push(m);
          S.active = { e: m.id, i: 0 };
          render();
          var el = document.querySelector('.mc-event[data-e="' + m.id + '"]');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        case 'clear-card':
          HC.confirm({ title: 'Clear the whole card?', message: 'Removes every match and superstar from the card.', okLabel: 'Clear', kind: 'danger' }).then(function (ok) {
            if (ok) { S.events = [newEvent('1v1')]; S.active = null; render(); }
          });
          return;
        case 'download': openPreview(); return;
        case 'sheet-open': openSheet(); return;
        case 'sheet-close': closeSheet(); return;
        case 'up': case 'down': {
          if (!ev) return;
          var i = S.events.indexOf(ev), j = act === 'up' ? i - 1 : i + 1;
          if (j < 0 || j >= S.events.length) return;
          S.events[i] = S.events[j]; S.events[j] = ev; render();
          return;
        }
        case 'del':
          if (!ev) return;
          S.events = S.events.filter(function (x) { return x !== ev; });
          if (!S.events.length) S.events = [newEvent('1v1')];
          S.active = null; render();
          return;
        case 'side-clear': {
          if (!ev) return;
          var r = sidesOf(ev)[+btn.dataset.side];
          for (var k = r.start; k < r.end; k++) ev.slots[k] = null;
          ev.sideTeams[+btn.dataset.side] = null;
          S.active = { e: ev.id, i: r.start };
          render();
          return;
        }
        case 'side-team': if (ev) openTeamPicker(ev, +btn.dataset.side); return;
        case 'team-new':
          TT.openBuilder({ rosterId: tid(), pool: pool(), onSave: function () { S.tab = 'teams'; render(); } });
          return;
        case 'team-edit': {
          var t = TT.find(tid(), btn.closest('.team-row').dataset.team);
          if (t) TT.openBuilder({ rosterId: tid(), pool: pool(), team: t, onSave: function () { render(); } });
          return;
        }
        case 'team-del': {
          var td = TT.find(tid(), btn.closest('.team-row').dataset.team);
          if (td) HC.confirm({ title: 'Delete tag team?', message: 'Delete "' + TT.displayName(td) + '"? Matches already on your card keep their wrestlers.', okLabel: 'Delete', kind: 'danger' }).then(function (ok) {
            if (ok) { TT.remove(S.rosterId, td.id); renderTeams(); }
          });
          return;
        }
      }
      return;
    }

    // slot click
    var slot = e.target.closest('.mc-slot');
    if (slot) {
      var sev = getEvent(+slot.dataset.e), si = +slot.dataset.i;
      if (!sev) return;
      if (S.mode === 'free') { S.active = { e: sev.id, i: si }; openFreeEditor({ e: sev.id, i: si }); return; }
      if (sev.slots[si]) {
        sev.slots[si] = null;
        var sd = sideIndex(sev, si);
        if (sd >= 0) sev.sideTeams[sd] = null;
      }
      S.active = { e: sev.id, i: si };
      render();
      if (isMobile()) openSheet();
      return;
    }

    // roster / team rows
    var row = e.target.closest('#roster-list .mrow');
    if (row) {
      var found = pool().filter(function (s) { return key(s) === row.dataset.k; })[0];
      if (found) addSuperstar(found);
      return;
    }
    var trow = e.target.closest('#team-list .team-row');
    if (trow) {
      var team = TT.find(tid(), trow.dataset.team);
      if (team) placeTeam(team);
    }
  });

  document.addEventListener('change', function (e) {
    var sel = e.target.closest('.mc-ev-sel select');
    if (sel) {
      var ev = getEvent(+sel.closest('.mc-event').dataset.e);
      if (!ev) return;
      if (sel.dataset.f === 'type') changeType(ev, sel.value);
      else if (sel.dataset.f === 'stip') ev.stip = sel.value;
      else if (sel.dataset.f === 'champ') { ev.champ = sel.value; ev.titleName = ''; }
      render();
      return;
    }
    if (e.target.id === 'pool-select') { S.source = e.target.value; renderRoster(); }
  });

  document.addEventListener('input', function (e) {
    var t = e.target.closest && e.target.closest('input[data-f="tname"]');
    if (!t) return;
    var ev = getEvent(+t.closest('.mc-event').dataset.e);
    if (ev) { ev.titleName = t.value; save(); }
  });
  $('show-name').addEventListener('input', function (e) { S.showName = e.target.value; save(); });
  $('show-color').addEventListener('input', function (e) { S.color = e.target.value; save(); });

  // drag & drop (desktop)
  var dragData = null;
  document.addEventListener('dragstart', function (e) {
    var row = e.target.closest && e.target.closest('#roster-list .mrow, #team-list .team-row');
    if (!row) return;
    dragData = row.dataset.team ? { t: 'team', id: row.dataset.team } : { t: 's', k: row.dataset.k };
    e.dataTransfer.setData('text/plain', row.dataset.team || row.dataset.k);
    e.dataTransfer.effectAllowed = 'copy';
    row.classList.add('dragging');
    document.body.classList.add('dragging');
  });
  document.addEventListener('dragend', function () {
    dragData = null;
    document.body.classList.remove('dragging');
    document.querySelectorAll('.dragging, .drag-over').forEach(function (x) { x.classList.remove('dragging', 'drag-over'); });
  });
  document.addEventListener('dragover', function (e) {
    var slot = e.target.closest && e.target.closest('.mc-slot');
    if (!slot || !dragData) return;
    e.preventDefault();
    document.querySelectorAll('.drag-over').forEach(function (x) { if (x !== slot) x.classList.remove('drag-over'); });
    slot.classList.add('drag-over');
  });
  document.addEventListener('drop', function (e) {
    var slot = e.target.closest && e.target.closest('.mc-slot');
    if (!slot || !dragData) return;
    e.preventDefault();
    var d = dragData;
    dragData = null;
    slot.classList.remove('drag-over');
    var ev = getEvent(+slot.dataset.e), i = +slot.dataset.i;
    if (!ev) return;
    if (d.t === 's') {
      var ss = pool().filter(function (s) { return key(s) === d.k; })[0];
      if (ss) fill(ev.id, i, ss);
    } else {
      var team = TT.find(tid(), d.id), side = sideIndex(ev, i);
      if (!team) return;
      if (side < 0) { HC.toast('Drop a tag team onto a tag match (2 vs 2 or bigger).', 'warning'); return; }
      if (placeOnSide(ev, side, team)) render();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });

  // ------------------------------------------------------------------ boot
  restore();
  // "Use roster" on the Rosters page leaves the chosen roster here
  var picked = HC.jget('2uhub_mc_roster', null);
  if (picked && typeof picked === 'string') { HC.sdel('2uhub_mc_roster'); S.rosterId = picked; S.rosterName = ''; S.roster = []; S.mode = 'roster'; }
  if (S.mode === 'roster' && !S.rosterId) S.mode = '';
  $('show-name').value = S.showName;
  $('show-color').value = S.color;
  render();
  if (S.rosterId) loadRoster(S.rosterId);
})();
