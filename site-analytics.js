(function () {
  'use strict';

  const MEASUREMENT_ID = 'G-CHFYS314FZ';
  const CONSENT_KEY = 'mariaAnalyticsConsent';
  const CAMPAIGN_KEY = 'mariaCampaignSource';

  function readCampaignSource() {
    const query = new URLSearchParams(location.search);
    const fromUrl = {
      traffic_source: query.get('utm_source') || '',
      traffic_medium: query.get('utm_medium') || '',
      traffic_campaign: query.get('utm_campaign') || ''
    };
    if (fromUrl.traffic_source || fromUrl.traffic_medium || fromUrl.traffic_campaign) {
      try { sessionStorage.setItem(CAMPAIGN_KEY, JSON.stringify(fromUrl)); } catch (_) {}
      return fromUrl;
    }
    try {
      const saved = JSON.parse(sessionStorage.getItem(CAMPAIGN_KEY) || 'null');
      return saved && typeof saved === 'object' ? saved : fromUrl;
    } catch (_) {
      return fromUrl;
    }
  }

  const campaignSource = readCampaignSource();

  // Personal diary pages are intentionally excluded from GA4.
  const path = location.pathname.toLowerCase();
  if (path === '/diary' || path === '/diary.html' || path.startsWith('/diary/')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  // Google Consent Mode: the tag is detectable immediately, but analytics
  // storage and page/event collection stay disabled until explicit consent.
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
    transport_type: 'beacon'
  });

  const googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(googleTag);

  let analyticsAllowed = false;

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (_) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) {}
  }

  function grantAnalytics(sendPageView) {
    if (analyticsAllowed) return;
    analyticsAllowed = true;
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    if (sendPageView) {
      window.gtag('event', 'page_view', Object.assign({
        page_location: location.href,
        page_title: document.title
      }, campaignSource));
    }
  }

  function denyAnalytics() {
    analyticsAllowed = false;
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }

  function makeConsentBanner() {
    if (document.getElementById('maria-analytics-consent')) return;
    const lang = (document.documentElement.lang || navigator.language || 'ru').toLowerCase();
    const isHe = lang.startsWith('he');
    const isEn = lang.startsWith('en');
    const copy = isHe
      ? { text: 'אפשר לאפשר Google Analytics לסטטיסטיקה של האתר הציבורי. רשומות היומן האישי אינן נמדדות.', yes: 'אישור', no: 'לא תודה' }
      : isEn
        ? { text: 'You can allow Google Analytics for statistics on the public website. Personal diary entries are not tracked.', yes: 'Allow', no: 'No thanks' }
        : { text: 'Можно разрешить Google Analytics для статистики публичного сайта. Личные записи дневника не отслеживаются.', yes: 'Разрешить', no: 'Не сейчас' };

    const box = document.createElement('div');
    box.id = 'maria-analytics-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:680px;margin:auto;padding:16px 18px;border-radius:16px;background:#fffdf9;color:#251d1b;border:1px solid #d8c9c1;box-shadow:0 12px 40px rgba(0,0,0,.16);font:15px/1.45 -apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif';
    box.innerHTML = '<div style="margin-bottom:12px">' + copy.text + '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button type="button" data-ga-consent="yes" style="border:0;border-radius:999px;padding:10px 15px;background:#4c2430;color:#fff;font-weight:700">' + copy.yes + '</button>' +
      '<button type="button" data-ga-consent="no" style="border:1px solid #b9a69c;border-radius:999px;padding:10px 15px;background:#fff;color:#251d1b;font-weight:700">' + copy.no + '</button>' +
      '</div>';
    document.body.appendChild(box);
    box.addEventListener('click', function (event) {
      const button = event.target.closest('[data-ga-consent]');
      if (!button) return;
      if (button.dataset.gaConsent === 'yes') {
        setConsent('granted');
        grantAnalytics(true);
      } else {
        setConsent('denied');
        denyAnalytics();
      }
      box.remove();
    });
  }

  function track(eventName, params) {
    if (!analyticsAllowed || typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, Object.assign({}, campaignSource, params || {}));
  }

  document.addEventListener('click', function (event) {
    const gameButton = event.target.closest('[data-open]');
    if (gameButton && (path === '/games' || path === '/games.html')) {
      track('game_start', {
        game: gameButton.dataset.open || 'unknown',
        source_page: path
      });
    }

    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.href || '';
    const pathname = new URL(href, location.href).pathname;
    const linkText = (link.textContent || '').trim().slice(0, 100);

    if (/wa\.me|whatsapp\.com/i.test(href)) {
      track('whatsapp_click', { link_url: href, link_text: linkText, source_page: path });
    } else if (/pay\.grow\.link/i.test(href)) {
      track('grow_checkout_click', { link_url: href, link_text: linkText, source_page: path });
    } else if (pathname.endsWith('/zhivi-i-zvuchi.html')) {
      track('offer_click', { offer: 'zhivi_i_zvuchi', link_url: href, link_text: linkText, source_page: path });
    } else if (pathname.endsWith('/golos-bez-straha.html')) {
      track('offer_click', { offer: 'golos_bez_straha', link_url: href, link_text: linkText, source_page: path });
    }
  }, { capture: true });

  const consent = getConsent();
  if (consent === 'granted') {
    grantAnalytics(true);
  } else if (consent === 'denied') {
    denyAnalytics();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', makeConsentBanner, { once: true });
  } else {
    makeConsentBanner();
  }
})();
