import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Printer, QrCode, Share2 } from 'lucide-react';
import { SITE_URL, site } from '../config/routeConfig';
import { ActionButton, Card, SectionHeading } from './ui';

const URL_PLACEHOLDER = 'ADD_DEPLOYED_URL_HERE';

/**
 * The QR code encodes the configured SITE_URL once it has been set. Until
 * then it falls back to the address the page is actually being served from,
 * so no deployment URL is fabricated in the source.
 */
export function useShareUrl(): { url: string; configured: boolean } {
  return useMemo(() => {
    const configured = SITE_URL !== URL_PLACEHOLDER && SITE_URL.length > 0;
    if (configured) return { url: SITE_URL, configured: true };
    if (typeof window !== 'undefined') {
      return { url: window.location.href.split('#')[0], configured: false };
    }
    return { url: '', configured: false };
  }, []);
}

export function useShareRoute() {
  const { url } = useShareUrl();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const share = async () => {
    const payload = { title: `${site.authority} — ${site.title}`, text: site.shareText, url };
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(payload);
        return;
      } catch (error) {
        // User dismissed the sheet — not a failure worth reporting.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${site.shareText} — ${url}`);
      setCopied(true);
    } catch {
      window.prompt('Copy the route link:', url);
    }
  };

  return { share, copied };
}

export function ShareAndQR({
  onShare,
  copied,
}: {
  onShare: () => void;
  copied: boolean;
}) {
  const { url, configured } = useShareUrl();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
      color: { dark: '#0b2942', light: '#ffffff' },
    })
      .then((data) => {
        if (!cancelled) setQrDataUrl(data);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <section id="share" aria-labelledby="share-title" className="scroll-mt-20">
      <SectionHeading
        id="share-title"
        eyebrow="Distribution"
        title="Share &amp; Print"
        description="Circulate this guide by WhatsApp, email or QR code, or print a route sheet for the vehicle."
      />

      <Card className="grid gap-5 px-4 py-5 sm:grid-cols-[auto_1fr] sm:px-6">
        <div className="flex flex-col items-center sm:items-start">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR code linking to the route guide at ${url}`}
              width={168}
              height={168}
              className="h-[168px] w-[168px] rounded-md border border-rule bg-white p-2"
            />
          ) : (
            <div className="flex h-[168px] w-[168px] items-center justify-center rounded-md border border-dashed border-rule text-slate-ink">
              <QrCode size={28} strokeWidth={1.5} aria-hidden="true" />
            </div>
          )}
          <p className="eyebrow mt-2 text-center text-slate-ink sm:text-left">
            Scan to open route on mobile
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[14px] leading-relaxed text-slate-ink">{site.shareText}</p>

          <div className="action-bar mt-4 flex flex-wrap gap-2">
            <ActionButton onClick={onShare} icon={copied ? Check : Share2} variant="primary">
              {copied ? 'Route link copied' : 'Share Route'}
            </ActionButton>
            <ActionButton onClick={() => window.print()} icon={Printer}>
              Print Route
            </ActionButton>
          </div>

          <p
            aria-live="polite"
            className={`mt-2 text-[13px] font-medium text-port ${copied ? '' : 'sr-only'}`}
          >
            {copied ? 'Route link copied' : ''}
          </p>

          {!configured && (
            <p className="eyebrow mt-4 inline-flex rounded-sm border border-dashed border-slate-ink/40 bg-offwhite px-2 py-1.5 text-slate-ink">
              SITE_URL not yet configured — QR uses the current address
            </p>
          )}
        </div>
      </Card>
    </section>
  );
}
