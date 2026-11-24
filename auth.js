/* Accounts: sign in with Google or Discord through Supabase, a public display name, and an account menu in the header.
   window.Auth is used by the roster community now and by the Universe tracker later.
   The Supabase library is only downloaded when someone is signed in, is coming back from signing in, or presses "Sign in". */
(function () {
  'use strict';
  var cfg = window.SUPABASE_CONFIG || {};
  var enabled = !!(cfg.url && cfg.anonKey);
  var LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.0/dist/umd/supabase.js';
  var NAME_OK = /^[A-Za-z0-9_ .\-]{3,24}$/;
  var st = { user: null, profile: null, ready: false };
  var listeners = [], clientPromise = null;
  // pixel-art icons (one square per pixel)
  var ICON = {
    google: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" width="18" height="18" shape-rendering="crispEdges" aria-hidden="true"><rect x="4" y="0" width="5" height="1" fill="#EA4335"/><rect x="3" y="1" width="7" height="1" fill="#EA4335"/><rect x="2" y="2" width="9" height="1" fill="#EA4335"/><rect x="1" y="3" width="2" height="1" fill="#FBBC05"/><rect x="3" y="3" width="2" height="1" fill="#EA4335"/><rect x="8" y="3" width="2" height="1" fill="#EA4335"/><rect x="0" y="4" width="4" height="1" fill="#FBBC05"/><rect x="0" y="5" width="3" height="1" fill="#FBBC05"/><rect x="0" y="6" width="3" height="1" fill="#FBBC05"/><rect x="6" y="6" width="6" height="1" fill="#4285F4"/><rect x="0" y="7" width="3" height="1" fill="#FBBC05"/><rect x="6" y="7" width="7" height="1" fill="#4285F4"/><rect x="0" y="8" width="3" height="1" fill="#FBBC05"/><rect x="3" y="8" width="1" height="1" fill="#34A853"/><rect x="9" y="8" width="4" height="1" fill="#4285F4"/><rect x="1" y="9" width="4" height="1" fill="#34A853"/><rect x="8" y="9" width="2" height="1" fill="#34A853"/><rect x="10" y="9" width="2" height="1" fill="#4285F4"/><rect x="2" y="10" width="9" height="1" fill="#34A853"/><rect x="3" y="11" width="7" height="1" fill="#34A853"/><rect x="4" y="12" width="5" height="1" fill="#34A853"/></svg>',
    discord: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 9" width="18" height="10" shape-rendering="crispEdges" aria-hidden="true"><rect x="2" y="0" width="5" height="1" fill="#7B86FF"/><rect x="8" y="0" width="5" height="1" fill="#7B86FF"/><rect x="1" y="1" width="13" height="1" fill="#7B86FF"/><rect x="0" y="2" width="15" height="1" fill="#7B86FF"/><rect x="0" y="3" width="3" height="1" fill="#7B86FF"/><rect x="5" y="3" width="5" height="1" fill="#7B86FF"/><rect x="12" y="3" width="3" height="1" fill="#7B86FF"/><rect x="0" y="4" width="3" height="1" fill="#7B86FF"/><rect x="5" y="4" width="5" height="1" fill="#7B86FF"/><rect x="12" y="4" width="3" height="1" fill="#7B86FF"/><rect x="0" y="5" width="15" height="1" fill="#7B86FF"/><rect x="1" y="6" width="13" height="1" fill="#7B86FF"/><rect x="2" y="7" width="2" height="1" fill="#7B86FF"/><rect x="5" y="7" width="5" height="1" fill="#7B86FF"/><rect x="11" y="7" width="2" height="1" fill="#7B86FF"/><rect x="3" y="8" width="1" height="1" fill="#7B86FF"/><rect x="11" y="8" width="1" height="1" fill="#7B86FF"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8" width="18" height="12" shape-rendering="crispEdges" aria-hidden="true"><rect x="4" y="0" width="4" height="1" fill="#FFFFFF"/><rect x="3" y="1" width="6" height="1" fill="#FFFFFF"/><rect x="3" y="2" width="6" height="1" fill="#FFFFFF"/><rect x="4" y="3" width="4" height="1" fill="#FFFFFF"/><rect x="2" y="4" width="8" height="1" fill="#FFFFFF"/><rect x="1" y="5" width="10" height="1" fill="#FFFFFF"/><rect x="0" y="6" width="12" height="1" fill="#FFFFFF"/><rect x="0" y="7" width="12" height="1" fill="#FFFFFF"/></svg>'
  };

  function esc(s) { return window.HC ? HC.esc(s) : String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function emit() { listeners.forEach(function (fn) { try { fn(st); } catch (e) { console.error(e); } }); render(); }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Could not load the sign-in library.')); };
      document.head.appendChild(s);
    });
  }
  function client() {
    if (!enabled) return Promise.reject(new Error('Accounts are not set up yet.'));
    if (!clientPromise) {
      clientPromise = (window.__fakeSupabase ? Promise.resolve(window.__fakeSupabase) : loadScript(LIB).then(function () {
        return window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
      })).then(function (c) { watch(c); return c; });
    }
    return clientPromise;
  }

  function loadProfile(c, user) {
    if (!user) { st.profile = null; return Promise.resolve(); }
    return c.from('profiles').select('display_name').eq('id', user.id).maybeSingle().then(function (r) {
      st.profile = r && r.data ? r.data : null;
    }, function () { st.profile = null; });
  }
  function setUser(c, user) {
    st.user = user || null;
    return loadProfile(c, st.user).then(function () {
      st.ready = true; emit();
      if (st.user && !st.profile) openNameModal(true);
    });
  }
  function watch(c) {
    c.auth.onAuthStateChange(function (evt, session) { if (evt !== 'TOKEN_REFRESHED') setUser(c, session && session.user); });
    c.auth.getSession().then(function (r) { setUser(c, r && r.data && r.data.session && r.data.session.user); });
  }

  // a session saved by an earlier visit, or the page we land on after the provider sends the person back
  function mayHaveSession() {
    try {
      for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^sb-.*-auth-token$/.test(k)) return true; }
    } catch (e) { /* blocked */ }
    return /[?#&](access_token|code|error_description)=/.test(location.search + location.hash);
  }

  // ---------------------------------------------------------------- header
  function slot() { return document.querySelector('.hc-header-actions'); }
  function render() {
    var host = slot();
    if (!host || !enabled) return;
    var box = document.getElementById('auth-box');
    if (!box) { box = document.createElement('div'); box.id = 'auth-box'; box.className = 'auth-menu'; host.insertBefore(box, host.firstChild); }
    if (!st.user) {
      box.innerHTML = '<button type="button" class="btn btn-steel btn-sm" id="auth-btn"><span class="ico ico-sm">' + ICON.user + '</span>Sign in</button>';
    } else {
      var name = st.profile ? st.profile.display_name : 'Account';
      box.innerHTML = '<button type="button" class="btn btn-steel btn-sm" id="auth-btn" aria-haspopup="true">' + esc(name) + ' &#9662;</button>' +
        '<div class="auth-pop" id="auth-pop" hidden><div class="auth-who"><b>' + esc(name) + '</b><span>' + esc((st.user.email || '')) + '</span></div>' +
        '<a class="auth-item" href="rosters#mine">My rosters</a>' +
        '<button type="button" class="auth-item" data-auth="name">Change display name</button>' +
        '<button type="button" class="auth-item" data-auth="export">Download my data</button>' +
        '<button type="button" class="auth-item" data-auth="out">Sign out</button>' +
        '<button type="button" class="auth-item danger" data-auth="delete">Delete account</button></div>';
    }
  }
  document.addEventListener('click', function (e) {
    var pop = document.getElementById('auth-pop');
    if (e.target.closest('#auth-btn')) {
      if (!st.user) { openSignIn(); return; }
      if (pop) pop.hidden = !pop.hidden;
      return;
    }
    var it = e.target.closest('[data-auth]');
    if (it) {
      if (pop) pop.hidden = true;
      if (it.dataset.auth === 'out') signOut();
      else if (it.dataset.auth === 'name') openNameModal(false);
      else if (it.dataset.auth === 'delete') deleteAccount();
      else if (it.dataset.auth === 'export') exportData();
      return;
    }
    if (pop && !e.target.closest('#auth-box')) pop.hidden = true;
  });

  // ---------------------------------------------------------------- sign in, name, sign out, delete
  function signInWith(provider) {
    return client().then(function (c) {
      return c.auth.signInWithOAuth({ provider: provider, options: { redirectTo: location.origin + location.pathname + location.search } });
    }).then(function (r) { if (r && r.error) throw r.error; }).catch(function (e) { HC.toast(e.message || 'Could not sign in.', 'error'); });
  }
  function openSignIn() {
    if (!enabled) { HC.toast('Accounts are not switched on yet.', 'info'); return; }
    var body = document.createElement('div');
    body.innerHTML = '<p>Sign in to share rosters with the community and keep your Universe saves in the cloud.</p>' +
      '<div class="auth-providers"><button type="button" class="btn btn-steel btn-lg auth-prov google" data-prov="google"><span class="ico">' + ICON.google + '</span>Continue with Google</button>' +
      '<button type="button" class="btn btn-steel btn-lg auth-prov discord" data-prov="discord"><span class="ico">' + ICON.discord + '</span>Continue with Discord</button></div>' +
      '<p class="muted auth-fine">By signing in you agree to the <a href="terms">Terms</a> and the <a href="privacy">Privacy Policy</a>. You can still use the draft tools without an account.</p>';
    body.addEventListener('click', function (e) { var b = e.target.closest('[data-prov]'); if (b) { b.disabled = true; signInWith(b.dataset.prov); } });
    HC.openModal({ title: 'Sign in', body: body, focus: false, actions: [{ label: 'Close', kind: 'steel' }] });
  }

  function openNameModal(first) {
    var body = document.createElement('div');
    body.innerHTML = '<p>' + (first ? 'Choose a display name. It is shown on the rosters you share.' : 'Your display name is shown on the rosters you share.') + '</p>' +
      '<label class="lbl" for="auth-name">Display name</label><input id="auth-name" class="field" maxlength="24" autocomplete="off" value="' + esc(st.profile ? st.profile.display_name : '') + '">' +
      '<p class="muted auth-fine">3 to 24 characters: letters, numbers, spaces, dots, dashes and underscores. Names are unique.</p>';
    var m = HC.openModal({ title: first ? 'Welcome to 2UHub' : 'Display name', body: body, focus: false, actions: [
      { label: first ? 'Later' : 'Cancel', kind: 'steel' },
      { id: 'save', label: 'Save', kind: 'primary', close: false, onClick: function () {
        var v = body.querySelector('#auth-name').value.trim();
        if (!NAME_OK.test(v)) { HC.toast('Use 3 to 24 letters, numbers, spaces, dots, dashes or underscores.', 'warning'); return false; }
        m.buttons.save.disabled = true;
        saveName(v).then(function () { HC.toast('Display name saved.', 'success'); m.close(); }).catch(function (e) {
          m.buttons.save.disabled = false;
          HC.toast(e && e.code === '23505' ? 'That name is taken. Try another.' : (e.message || 'Could not save the name.'), 'error');
        });
        return false;
      } }
    ] });
  }
  function saveName(v) {
    return client().then(function (c) {
      var q = st.profile ? c.from('profiles').update({ display_name: v }).eq('id', st.user.id) : c.from('profiles').insert({ id: st.user.id, display_name: v });
      return q.then(function (r) { if (r.error) throw r.error; st.profile = { display_name: v }; emit(); });
    });
  }
  function signOut() {
    return client().then(function (c) { return c.auth.signOut(); }).then(function () { st.user = null; st.profile = null; emit(); HC.toast('Signed out.'); });
  }
  // everything we hold about the signed-in person, as one file
  function exportData() {
    client().then(function (c) { return c.from('rosters').select('*').eq('owner', st.user.id); }).then(function (r) {
      if (r.error) throw r.error;
      var out = { exported: new Date().toISOString(), account: { id: st.user.id, email: st.user.email || '', display_name: st.profile ? st.profile.display_name : '' },
        shared_rosters: r.data || [], rosters_saved_in_this_browser: window.HC ? HC.library() : [] };
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
      a.download = '2uhub-my-data.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      HC.toast('Your data was downloaded.', 'success');
    }).catch(function (e) { HC.toast(e.message || 'Could not download your data.', 'error'); });
  }

  function deleteAccount() {
    HC.confirm({ title: 'Delete your account?', message: 'Your account, your display name and every roster you shared are deleted for good. This cannot be undone.', okLabel: 'Delete account', kind: 'danger' }).then(function (ok) {
      if (!ok) return;
      client().then(function (c) { return c.rpc('delete_my_account').then(function (r) { if (r.error) throw r.error; return c.auth.signOut(); }); })
        .then(function () { st.user = null; st.profile = null; emit(); HC.toast('Your account was deleted.', 'success'); })
        .catch(function (e) { HC.toast(e.message || 'Could not delete the account.', 'error'); });
    });
  }

  // resolves with the user once they are signed in and have a display name; otherwise opens the right window and rejects
  function requireUser() {
    if (!enabled) return Promise.reject(new Error('Accounts are not switched on yet.'));
    return client().then(function () {
      if (!st.ready) return new Promise(function (r) { setTimeout(r, 400); });
    }).then(function () {
      if (!st.user) { openSignIn(); throw new Error('Sign in first, then try again.'); }
      if (!st.profile) { openNameModal(true); throw new Error('Choose a display name first, then try again.'); }
      return st.user;
    });
  }

  window.Auth = {
    enabled: enabled,
    get user() { return st.user; },
    get profile() { return st.profile; },
    onChange: function (fn) { listeners.push(fn); },
    client: client, openSignIn: openSignIn, requireUser: requireUser, signOut: signOut
  };

  function start() {
    if (!enabled) return;
    render();
    if (mayHaveSession() || window.__fakeSupabase) client().catch(function (e) { console.error(e); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
