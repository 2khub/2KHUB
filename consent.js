/* Cookie choice. Advertising (Google AdSense) and the visit recorder (Microsoft Clarity) are only loaded after a visitor
   presses "Accept all". "Only necessary" loads neither. The choice is kept in this browser and can be changed from the
   "Cookie settings" link in the footer. The pages no longer contain these two scripts themselves. */
(function () {
  'use strict';
  var KEY = '2uhub_consent', ADS = 'ca-pub-7224985162462472', CLARITY = 'wibltdvrqy';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* storage blocked: the banner just shows again */ } }

  function loadOptional() {
    if (window.__optionalLoaded) return;
    window.__optionalLoaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY);
    var s = document.createElement('script');
    s.async = true; s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADS;
    document.head.appendChild(s);
  }

  // removes the cookies we know about when someone withdraws consent
  function clearCookies() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (/^(_clck|_clsk|CLID|MR|SM|ANONCHK|SRM_B|_ga.*|__gads|__gpi|IDE|test_cookie)$/.test(n)) {
        document.cookie = n + '=; Max-Age=0; path=/';
        document.cookie = n + '=; Max-Age=0; path=/; domain=' + location.hostname;
        document.cookie = n + '=; Max-Age=0; path=/; domain=.' + location.hostname.replace(/^www\./, '');
      }
    });
  }

  function choose(v) {
    var was = get();
    set(v);
    var b = document.getElementById('cc-banner');
    if (b) b.remove();
    if (v === 'all') loadOptional();
    else if (was === 'all') { clearCookies(); location.reload(); }
  }

  function show() {
    if (document.getElementById('cc-banner')) return;
    var b = document.createElement('div');
    b.id = 'cc-banner'; b.className = 'cc-banner'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Cookie choice');
    b.innerHTML = '<p><b>Cookies.</b> We use them to show ads and to see how the site is used. The tools work without them. ' +
      'Read the <a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="cc-btns"><button type="button" class="btn btn-steel btn-sm" data-cc="necessary">Only necessary</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-cc="all">Accept all</button></div>';
    b.addEventListener('click', function (e) { var t = e.target.closest('[data-cc]'); if (t) choose(t.dataset.cc); });
    document.body.appendChild(b);
  }

  // a "Cookie settings" link in the footer lets people change their mind
  function footerLink() {
    document.querySelectorAll('.hc-footer h4').forEach(function (h) {
      if (h.textContent.trim() !== 'Legal') return;
      var ul = h.parentNode.querySelector('ul');
      if (!ul || ul.querySelector('[data-cc-open]')) return;
      var li = document.createElement('li');
      li.innerHTML = '<a href="#" class="fk" data-cc-open>Cookie settings</a>';
      ul.appendChild(li);
    });
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cc-open]')) { e.preventDefault(); show(); }
  });

  function start() {
    footerLink();
    var v = get();
    if (v === 'all') loadOptional();
    else if (!v) show();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
