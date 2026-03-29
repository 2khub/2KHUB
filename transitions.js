/* 2KHUB — Page exit transition (navigation fade-out). No dependencies. */
(function () {
  'use strict';

  function isInternal(a) {
    var href = a.getAttribute('href') || '';
    if (!href || href === '#' || href.charAt(0) === '#') return false;
    if (a.target === '_blank') return false;
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) return false;
    return true;
  }

  function bindLinks() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      if (a.dataset.txBound) return;
      a.dataset.txBound = '1';
      a.addEventListener('click', function (e) {
        if (!isInternal(a)) return;
        e.preventDefault();
        var dest = a.href;
        document.body.classList.add('page-exit');
        setTimeout(function () { window.location.assign(dest); }, 240);
      });
    });
  }

  if (document.readyState !== 'loading') {
    bindLinks();
  } else {
    document.addEventListener('DOMContentLoaded', bindLinks);
  }
}());
