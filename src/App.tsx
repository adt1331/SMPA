import { useEffect, useState } from 'react';
import { Navigation, Printer, Share2, Truck } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { DriverView } from './components/DriverView';
import { Hero } from './components/Hero';
import { JourneyTimeline } from './components/JourneyTimeline';
import { RouteAtAGlance } from './components/RouteAtAGlance';
import { RouteMap } from './components/RouteMap';
import { RouteNotice } from './components/RouteNotice';
import { ShareAndQR, useShareRoute } from './components/ShareAndQR';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { VisitInformation } from './components/VisitInformation';
import { PrintSheetBottom, PrintSheetTop } from './components/PrintSheet';
import { ActionButton, ActionLink } from './components/ui';
import { fullRouteUrl } from './lib/maps';

type View = 'standard' | 'driver';

export default function App() {
  const [view, setView] = useState<View>('standard');
  const { share, copied } = useShareRoute();

  // Keep the mode in the URL hash so a shared link can open straight into
  // Driver View, and so the back button behaves as expected.
  useEffect(() => {
    const apply = () => setView(window.location.hash === '#driver' ? 'driver' : 'standard');
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  const changeView = (next: View) => {
    setView(next);
    if (next === 'driver') {
      window.location.hash = 'driver';
    } else if (window.location.hash === '#driver') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0 });
  };

  if (view === 'driver') {
    return <DriverView onExit={() => changeView('standard')} />;
  }

  return (
    <>
      <a
        href="#route"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2.5 focus:text-sm focus:text-white"
      >
        Skip to route
      </a>

      <SiteHeader view={view} onViewChange={changeView} />
      <Hero onShare={share} />

      <main className="mx-auto max-w-5xl space-y-10 px-4 pb-28 pt-8 lg:pb-12">
        <PrintSheetTop />

        <div className="screen-only space-y-10">
          <RouteAtAGlance />
        </div>

        <RouteMap />

        <div className="screen-only space-y-10">
          <JourneyTimeline />

        <section aria-label="Route actions" className="action-bar">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <ActionLink href={fullRouteUrl()} icon={Navigation} variant="primary">
              Open Maps
            </ActionLink>
            <ActionButton onClick={() => changeView('driver')} icon={Truck}>
              Driver View
            </ActionButton>
            <ActionButton onClick={share} icon={Share2}>
              Share Route
            </ActionButton>
            <ActionButton onClick={() => window.print()} icon={Printer}>
              Print Route
            </ActionButton>
          </div>
        </section>

          <VisitInformation />
          <ShareAndQR onShare={share} copied={copied} />
          <RouteNotice />
        </div>

        <PrintSheetBottom />
      </main>

      <SiteFooter />
      <BottomNav onDriverView={() => changeView('driver')} />
    </>
  );
}
