import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";
import PrivacySettingsButton from "../components/PrivacySettingsButton";
import titleImg from "../images/modstack-title.png";
import iconImg from "../images/placeholder.png";

type PrivacyPageProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function PrivacyPage({ open = false, onClose }: PrivacyPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isRouteOpen = location.pathname === "/privacy";
  const shouldRender = isRouteOpen || open;

  const handleClose = () => {
    if (isRouteOpen) navigate("/");
    else onClose?.();
  };

  useEffect(() => {
    if (!shouldRender) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender, isRouteOpen]);

  useEffect(() => {
    if (!shouldRender) return;
    const blobs = document.querySelectorAll(".blob-dynamic");
    blobs.forEach((blob) => {
      const el = blob as HTMLElement;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.width = `${420 + Math.random() * 520}px`;
      el.style.height = `${420 + Math.random() * 520}px`;
      el.style.animationDelay = `${Math.random() * 6}s`;
    });
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className="relative min-h-screen bg-[#0f1923] text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="blob-dynamic" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2596be]/10 via-transparent to-transparent" />

      <main className="relative z-10 mx-auto max-w-5xl px-5 md:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between gap-4 relative mb-10">
          <a className="logo" href="/">
            <div className="logo-mark">
              <img src={iconImg} alt="logo" />
            </div>
            <img src={titleImg} alt="title" className="h-5 w-auto top-1 relative" />
          </a>
          <div className="nav-center hidden md:flex items-center gap-1">
            <a href="/" className="nav-item">Home</a>
            <a href="/changelog" className="nav-item">Changelog</a>
            <a href="/about" className="nav-item">About</a>
          </div>
          <Button
            variant="bordered"
            onPress={() => setTimeout(handleClose, 300)}
            className="!rounded-[8px] px-5 py-2 bg-[#2596be] text-white shadow-[0_4px_0_rgb(29,123,158)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(29,123,158)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(29,123,158)] active:scale-[0.98] transition-all duration-150 flex items-center gap-2.5 text-sm w-auto font-medium ml-auto"
          >
            <svg width="24px" height="24px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff">
              <path d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back</span>
          </Button>
        </div>
        <img src="/images/placeholder.png" alt="Privacy Policy" className="size-32 mx-auto mb-5" />
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mx-auto w-fit">
            <span className="bg-gradient-to-r from-sky-400 to-[#2596be] bg-clip-text text-transparent">
              Privacy Policy
            </span>
            <span className="text-white"> for Modstack</span>
          </h1>
        </div>
        <div className="mt-1 text-sm text-white/80 font-extrabold mx-auto w-fit mb-6">
          Last updated: September 30, 2026
        </div>
        <p className="text-sm leading-relaxed text-white/70 font-semibold">
          By using{" "}
          <span className="text-[#2596be] font-extrabold">Modstack</span>{" "}
          and our services, you agree to the practices described in this policy.
          We recommend reading it carefully.
        </p>

        <Section title="1. Information We Collect">
          <p className="text-sm leading-relaxed text-white/70">
            When you sign in to Modstack, we collect and store the following
            information associated with your account:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>
              <span className="text-white/90 font-extrabold">Email address</span>{" "}
              provided by your authentication provider (Google or Discord).
            </li>
            <li>
              <span className="text-white/90 font-extrabold">Provider user ID</span>{" "}
              — a unique identifier assigned by Google or Discord.
            </li>
            <li>
              <span className="text-white/90 font-extrabold">Authentication provider</span>{" "}
              — whether you signed in with Google or Discord.
            </li>
            <li>
              <span className="text-white/90 font-extrabold">Account creation date.</span>
            </li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            We do not collect your authentication password or payment information.
            The website may also process technical data as described below. Advertising
            is limited to the website and is never integrated into the Modstack launcher.
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p className="text-sm leading-relaxed text-white/70">
            Account information is used to:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>Identify and authenticate your account across sessions.</li>
            <li>Associate your preferences and data with your account.</li>
            <li>Provide support if you contact us.</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            We do not sell your account information. Advertising providers may process
            website usage and device data independently as described in Section 3.
          </p>
        </Section>

        <Section title="3. Advertising, Cookies, and Similar Technologies">
          <p className="text-sm leading-relaxed text-white/70">
            The Modstack website uses Google AdSense to display advertising. Google and
            its advertising partners may use cookies, local storage, IP address, device
            information, and activity on this website to deliver, limit, measure, and
            personalize ads, depending on your location and consent choices. Ads are not
            shown unless the website's AdSense configuration is enabled.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Where required, a consent message provides choices before personalized
            advertising cookies are used. Non-personalized ads can still use cookies or
            similar technologies for frequency capping, aggregated reporting, security,
            and fraud prevention. Learn more in{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2596be] hover:text-sky-400 transition-colors"
            >
              Google's advertising policies
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2596be] hover:text-sky-400 transition-colors"
            >
              Google's Privacy Policy
            </a>.
          </p>
        </Section>

        <Section title="4. Your Advertising Privacy Choices">
          <p className="text-sm leading-relaxed text-white/70">
            You may accept, reject, or manage advertising purposes in the privacy message
            shown where applicable. You can revisit or withdraw those choices at any time:
          </p>
          <PrivacySettingsButton className="mt-3 text-sm font-extrabold text-[#2596be] hover:text-sky-400 transition-colors" />
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            You can also manage ad personalization through{" "}
            <a
              href="https://myadcenter.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2596be] hover:text-sky-400 transition-colors"
            >
              Google's My Ad Center
            </a>. Blocking advertising scripts may prevent ads and the privacy settings
            dialog from appearing, but it does not affect access to website content.
          </p>
        </Section>

        <Section title="5. Third-Party Authentication">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack supports sign-in via{" "}
            <span className="text-white/90 font-extrabold">Google</span> and{" "}
            <span className="text-white/90 font-extrabold">Discord</span>. The
            authentication process is handled directly by those providers. We
            never have access to your password. Your login is subject to:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2596be] hover:text-sky-400 transition-colors"
              >
                Google's Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://discord.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2596be] hover:text-sky-400 transition-colors"
              >
                Discord's Privacy Policy
              </a>
            </li>
          </ul>
        </Section>

        <Section title="6. Security">
          <p className="text-sm leading-relaxed text-white/70">
            We take reasonable measures to protect the information stored on our
            servers. Your email and provider ID are stored securely and are never
            shared with unauthorized parties. We still recommend keeping your
            Google and Discord credentials confidential.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p className="text-sm leading-relaxed text-white/70">
            Your account data is retained as long as you have an active account
            with Modstack. If you wish to have your data deleted, contact us at
            the email below and we will remove it promptly.
          </p>
        </Section>

        <Section title="8. Minors">
          <p className="text-sm leading-relaxed text-white/70">
            Our services are not directed at children under the age of 13. We do
            not knowingly collect data from anyone under 13.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p className="text-sm leading-relaxed text-white/70">
            We reserve the right to update this privacy policy at any time. We
            will notify you of significant changes through the platform.
          </p>
        </Section>

        <Section title="10. Contact">
          <p className="text-sm leading-relaxed text-white/70">
            If you have any questions about this policy or want to request data
            deletion, feel free to reach out:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>
              <span className="text-white/90 font-extrabold">Email:</span>{" "}
              <a
                href="mailto:modstacksupport@gmail.com"
                className="text-[#2596be] hover:text-sky-400 transition-colors"
              >
                modstacksupport@gmail.com
              </a>
            </li>
            <li>
              <span className="text-white/90 font-extrabold">Discord:</span>{" "}
              <a
                href="https://discord.gg/QmZpUCbn2N"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2596be] hover:text-sky-400 transition-colors"
              >
                discord.gg/QmZpUCbn2N
              </a>
            </li>
          </ul>
        </Section>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          © 2026 Modstack. All rights reserved.
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-base md:text-lg font-extrabold text-[#2596be]">{title}</h2>
      <div className="mt-2 font-semibold">{children}</div>
    </section>
  );
}
