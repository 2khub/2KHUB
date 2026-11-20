/* 2KHUB Tag Teams — shared by setup, the draft board and the match card maker.
   A team is 2 to 6 superstars with an optional name. Teams are saved per game in
   localStorage and drafted together as a single pick. Requires hardcore.js (window.HC). */
(function () {
  'use strict';
  var HC = window.HC;
  var MIN_MEMBERS = 2, MAX_MEMBERS = 6;

  function storeKey(rosterId) { return '2khub_tagteams_' + (rosterId || 'default'); }
  function list(rosterId) {
    var l = HC.jget(storeKey(rosterId), []);
    if (!Array.isArray(l)) return [];
    return l.filter(function (t) { return t && t.id && Array.isArray(t.members) && t.members.length >= MIN_MEMBERS; }).map(function (t) {
      t.members = t.members.map(function (m) { return { name: m.name, img: HC.px(m.img), sex: m.sex, tier: m.tier }; });
      return t;
    });
  }
  function persist(rosterId, teams) { return HC.jset(storeKey(rosterId), teams); }

  function slim(s) { return { name: s.name, img: HC.px(s.img || ''), sex: s.sex || 'man', tier: s.tier || 'mid' }; }

  function autoName(members) {
    var n = members.map(function (m) { return m.name; });
    if (n.length <= 2) return n.join(' & ');
    return n.slice(0, -1).join(', ') + ' & ' + n[n.length - 1];
  }
  function displayName(t) { return (t.name && t.name.trim()) || autoName(t.members); }
  function memberKeys(t) { return t.members.map(function (m) { return HC.keyOf(m.name); }).sort().join('|'); }

  function save(rosterId, team) {
    var teams = list(rosterId);
    var i = -1;
    teams.forEach(function (t, idx) { if (t.id === team.id) i = idx; });
    if (i >= 0) teams[i] = team; else teams.push(team);
    return persist(rosterId, teams);
  }
  function remove(rosterId, id) {
    return persist(rosterId, list(rosterId).filter(function (t) { return t.id !== id; }));
  }
  function find(rosterId, id) {
    var r = null;
    list(rosterId).forEach(function (t) { if (t.id === id) r = t; });
    return r;
  }

  function facesHTML(team) {
    var shown = team.members.slice(0, 5);
    return '<div class="team-faces">' + shown.map(function (m) {
      return '<img src="' + HC.esc(m.img) + '" alt="" loading="lazy">';
    }).join('') + '</div>';
  }

  // ---------- builder dialog ----------
  // opts: { rosterId, pool:[superstars], team?:existing, onSave(team) }
  function openBuilder(opts) {
    var rosterId = opts.rosterId;
    var editing = opts.team || null;
    var picked = editing ? editing.members.map(slim) : [];
    var query = '';
    var sex = 'all';

    // pool = everything offered + members of the team being edited (so edits never lose them)
    var seen = {};
    var pool = [];
    (opts.pool || []).concat(editing ? editing.members : []).forEach(function (s) {
      var k = HC.keyOf(s.name);
      if (!seen[k]) { seen[k] = 1; pool.push(slim(s)); }
    });
    pool.sort(function (a, b) { return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }); });

    var body = document.createElement('div');
    body.innerHTML =
      '<div class="tt-name-row"><label class="lbl" for="tt-name">Team name <span style="text-transform:none;letter-spacing:0">(optional)</span></label>' +
      '<input id="tt-name" class="field" maxlength="40" placeholder="Leave blank to auto-name" value="' + HC.esc(editing ? (editing.name || '') : '') + '"></div>' +
      '<label class="lbl">Team members</label>' +
      '<div class="tt-members" id="tt-members"></div>' +
      '<div class="tt-count" id="tt-count"></div>' +
      '<div class="tt-tools">' +
        '<input id="tt-search" class="field" placeholder="Search superstars..." autocomplete="off">' +
        '<div class="seg" id="tt-sex"><button type="button" data-v="all" class="on">All</button><button type="button" data-v="man">Men</button><button type="button" data-v="woman">Women</button></div>' +
      '</div>' +
      '<div class="tt-list" id="tt-list"></div>';

    var modal = HC.openModal({
      title: editing ? 'Edit Tag Team' : 'Create Tag Team',
      body: body,
      wide: true,
      focus: false,
      actions: [
        { label: 'Cancel', kind: 'steel' },
        { id: 'save', label: editing ? 'Save Changes' : 'Create Team', kind: 'primary', onClick: onSave }
      ]
    });

    var membersEl = body.querySelector('#tt-members');
    var countEl = body.querySelector('#tt-count');
    var listEl = body.querySelector('#tt-list');
    var nameEl = body.querySelector('#tt-name');
    var saveBtn = modal.buttons.save;

    function isPicked(s) { return picked.some(function (p) { return HC.keyOf(p.name) === HC.keyOf(s.name); }); }

    function renderMembers() {
      membersEl.innerHTML = picked.length ? picked.map(function (m, i) {
        return '<div class="tt-member" data-i="' + i + '" title="Click to remove"><img src="' + HC.esc(m.img) + '" alt=""><div class="nm">' + HC.esc(m.name) + '</div><span class="x">&times;</span></div>';
      }).join('') : '<div class="tt-empty-hint">Click superstars below to add them to the team.</div>';
      var ready = picked.length >= MIN_MEMBERS;
      membersEl.classList.toggle('ready', ready);
      countEl.innerHTML = '<b>' + picked.length + '</b> selected' + (ready ? ' — ready to save' : ' — pick at least ' + MIN_MEMBERS) + ' (max ' + MAX_MEMBERS + ')';
      saveBtn.disabled = !ready;
      nameEl.placeholder = picked.length >= 2 ? autoName(picked) : 'Leave blank to auto-name';
    }

    function renderList() {
      var q = query.trim().toLowerCase();
      var items = pool.filter(function (s) {
        return (!q || s.name.toLowerCase().indexOf(q) >= 0) && (sex === 'all' || s.sex === sex);
      });
      if (!items.length) { listEl.innerHTML = '<div class="tt-none">No superstars match.</div>'; return; }
      listEl.innerHTML = items.map(function (s) {
        return '<button type="button" class="tt-card' + (isPicked(s) ? ' picked' : '') + '" data-k="' + HC.esc(HC.keyOf(s.name)) + '">' +
          '<img src="' + HC.esc(s.img) + '" alt="" loading="lazy"><span>' + HC.esc(s.name) + '</span></button>';
      }).join('');
    }

    listEl.addEventListener('click', function (e) {
      var card = e.target.closest('.tt-card');
      if (!card) return;
      var k = card.dataset.k;
      var idx = -1;
      picked.forEach(function (p, i) { if (HC.keyOf(p.name) === k) idx = i; });
      if (idx >= 0) picked.splice(idx, 1);
      else if (picked.length < MAX_MEMBERS) {
        var s = pool.filter(function (x) { return HC.keyOf(x.name) === k; })[0];
        if (s) picked.push(s);
      } else { HC.toast('A team can have up to ' + MAX_MEMBERS + ' members.', 'warning'); return; }
      renderMembers();
      card.classList.toggle('picked', idx < 0);
    });
    membersEl.addEventListener('click', function (e) {
      var m = e.target.closest('.tt-member');
      if (!m) return;
      picked.splice(parseInt(m.dataset.i, 10), 1);
      renderMembers();
      renderList();
    });
    body.querySelector('#tt-sex').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      sex = b.dataset.v;
      body.querySelectorAll('#tt-sex button').forEach(function (x) { x.classList.toggle('on', x === b); });
      renderList();
    });
    body.querySelector('#tt-search').addEventListener('input', function (e) { query = e.target.value; renderList(); });
    nameEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !saveBtn.disabled) saveBtn.click(); });

    function onSave() {
      if (picked.length < MIN_MEMBERS) { HC.toast('Pick at least ' + MIN_MEMBERS + ' superstars first.', 'warning'); return false; }
      var team = {
        id: editing ? editing.id : 't' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36),
        name: nameEl.value.trim(),
        members: picked.map(slim)
      };
      var dupe = list(rosterId).some(function (t) { return t.id !== team.id && memberKeys(t) === memberKeys(team); });
      if (dupe) { HC.toast('That exact team already exists.', 'warning'); return false; }
      if (!save(rosterId, team)) { HC.toast('Could not save (browser storage is blocked).', 'error'); return false; }
      HC.toast('Team saved: ' + displayName(team), 'success');
      if (opts.onSave) opts.onSave(team);
    }

    renderMembers();
    renderList();
    setTimeout(function () { var s = body.querySelector('#tt-search'); if (s) s.focus(); }, 40);
    return modal;
  }

  window.TagTeams = {
    MIN_MEMBERS: MIN_MEMBERS, MAX_MEMBERS: MAX_MEMBERS,
    list: list, save: save, remove: remove, find: find,
    autoName: autoName, displayName: displayName, memberKeys: memberKeys,
    facesHTML: facesHTML, openBuilder: openBuilder
  };
})();
