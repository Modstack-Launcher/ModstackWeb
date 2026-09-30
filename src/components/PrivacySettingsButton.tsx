import type { CSSProperties } from "react";
import { adsenseConfig, isAdsenseConfigured } from "../config/adsense";
import { loadAdSenseScript } from "../lib/adsense";
import { useLanguage } from "../i18n";

declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: Array<unknown>;
      showRevocationMessage?: unknown;
    };
  }
}

type PrivacySettingsButtonProps = {
  className?: string;
  style?: CSSProperties;
};

export default function PrivacySettingsButton({ className, style }: PrivacySettingsButtonProps) {
  const { language } = useLanguage();
  if (!isAdsenseConfigured) return null;

  const openSettings = async () => {
    try {
      await loadAdSenseScript(adsenseConfig.publisherId);
      window.googlefc = window.googlefc || {};
      window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
      window.googlefc.callbackQueue.push(window.googlefc.showRevocationMessage);
    } catch {
      // Ad blockers can prevent the privacy dialog as well as the ad units.
    }
  };

  return (
    <button type="button" className={className} style={style} onClick={openSettings}>
      {{ en: "Privacy & cookie settings", es: "Configuración de privacidad y cookies", pt: "Configurações de privacidade e cookies" }[language]}
    </button>
  );
}
