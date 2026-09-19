import { hasConsent, onConsentChange } from './consent';

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
export function initAnalytics(id: string) {
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer ?? [];
  // A fila gtag usa o objeto Arguments conforme a integração oficial.
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  let carregado = false;
  let marketingAnterior = false;
  function aplicar() {
    const analiticos = hasConsent('analiticos');
    const marketing = hasConsent('marketing');
    if (carregado && (!analiticos || (marketingAnterior && !marketing))) {
      Object.assign(window, { [`ga-disable-${id}`]: true });
      // Interromper tags já executadas exige novo documento. Não emitir pings sem consentimento.
      for (const cookie of document.cookie.split(';')) {
        const nome = cookie.trim().split('=')[0] ?? '';
        if (!/^_ga(?:_|$)/.test(nome)) continue;
        document.cookie = `${nome}=; Max-Age=0; path=/; SameSite=Lax`;
        const partes = location.hostname.split('.');
        while (partes.length > 1) {
          document.cookie = `${nome}=; Max-Age=0; path=/; domain=.${partes.join('.')}; SameSite=Lax`;
          partes.shift();
        }
      }
      location.reload();
      return;
    }
    if (!analiticos) return;
    marketingAnterior = marketing;
    w.gtag!('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
    });
    if (carregado) return;
    carregado = true;
    w.gtag!('js', new Date());
    const caminho = [
      '/',
      '/politica-de-privacidade',
      '/termos-de-uso',
      '/politica-de-cookies',
    ].includes(location.pathname)
      ? location.pathname
      : '/';
    w.gtag!('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + caminho,
      page_referrer: '',
      cookie_expires: 15552000,
    });
    w.gtag!('event', 'page_view', {
      page_location: location.origin + caminho,
      page_referrer: '',
      page_title: 'Studio — página institucional',
    });
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.async = true;
    document.head.append(script);
  }
  onConsentChange(aplicar);
  aplicar();
}
