import { useEffect, useRef, useState } from "react";
import { adsenseConfig } from "../config/adsense";
import { loadAdSenseScript } from "../lib/adsense";
import { useLanguage } from "../i18n";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

const AD_LOAD_TIMEOUT_MS = 15000;

type AdSenseUnitProps = {
  slotId: string;
  placement: "home" | "content";
};

export default function AdSenseUnit({ slotId, placement }: AdSenseUnitProps) {
  const { language } = useLanguage();
  const adRef = useRef<HTMLModElement>(null);
  const [isHidden, setIsHidden] = useState(false);
  const { publisherId } = adsenseConfig;
  const isConfigured = Boolean(publisherId && /^\d+$/.test(slotId));

  useEffect(() => {
    if (!isConfigured || !adRef.current) return;

    const adElement = adRef.current;
    const updateStatus = () => {
      if (adElement.dataset.adStatus === "unfilled") setIsHidden(true);
    };
    const observer = new MutationObserver(updateStatus);
    observer.observe(adElement, { attributes: true, attributeFilter: ["data-ad-status"] });

    const timeoutId = window.setTimeout(() => {
      if (adElement.dataset.adStatus !== "filled") setIsHidden(true);
    }, AD_LOAD_TIMEOUT_MS);

    loadAdSenseScript(publisherId)
      .then(() => {
        if (adElement.dataset.adRequested === "true") return;
        adElement.dataset.adRequested = "true";
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      })
      .catch(() => setIsHidden(true));

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [isConfigured, publisherId]);

  if (!isConfigured || isHidden) return null;

  const label = { en: "Advertisement", es: "Publicidad", pt: "Publicidade" }[language];

  return (
    <aside className="ad-placement" data-placement={placement} aria-label={label}>
      <span className="ad-placement__label">{label}</span>
      <ins
        ref={adRef}
        className="adsbygoogle ad-placement__unit"
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
