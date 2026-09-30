import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../i18n";
import titleImg from "../images/modstack-title.png";
import iconImg from "../images/placeholder.png";

type InfoPageShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function InfoPageShell({
  title,
  subtitle,
  children,
}: InfoPageShellProps) {
  const { language } = useLanguage();
  const labels = {
    en: { home: "Home", changelog: "Changelog", about: "About", back: "Back", notice: "© 2026 Modstack. Not an official Minecraft product.", privacy: "Privacy", terms: "Terms", support: "Support" },
    es: { home: "Inicio", changelog: "Cambios", about: "Acerca de", back: "Volver", notice: "© 2026 Modstack. No es un producto oficial de Minecraft.", privacy: "Privacidad", terms: "Términos", support: "Soporte" },
    pt: { home: "Início", changelog: "Alterações", about: "Sobre", back: "Voltar", notice: "© 2026 Modstack. Não é um produto oficial do Minecraft.", privacy: "Privacidade", terms: "Termos", support: "Suporte" },
  }[language];

  return (
    <div className="relative min-h-screen bg-[#0f1923] text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2596be]/10 via-transparent to-transparent" />
      <main className="relative z-10 mx-auto max-w-5xl px-5 md:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between gap-4 relative mb-12">
          <a className="logo" href="/">
            <div className="logo-mark">
              <img src={iconImg} alt="Modstack logo" />
            </div>
            <img src={titleImg} alt="Modstack" className="h-5 w-auto top-1 relative" />
          </a>
          <div className="nav-center hidden md:flex items-center gap-1">
            <a href="/" className="nav-item">{labels.home}</a>
            <a href="/changelog" className="nav-item">{labels.changelog}</a>
            <a href="/about" className="nav-item">{labels.about}</a>
          </div>
          <a
            href="/"
            className="!rounded-[8px] px-4 py-2 border border-zinc-800/80 bg-zinc-900/40 text-white hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-150 flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{labels.back}</span>
          </a>
        </div>

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-sky-400 to-[#2596be] bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-slate-400">
            {subtitle}
          </p>
        </header>

        <div className="space-y-6">{children}</div>

        <footer className="mt-14 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/45">
          <span>{labels.notice}</span>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-[#2596be]">{labels.privacy}</a>
            <a href="/terms" className="hover:text-[#2596be]">{labels.terms}</a>
            <a href="/support" className="hover:text-[#2596be]">{labels.support}</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-6 md:p-8 backdrop-blur-sm">
      <h2 className="text-lg md:text-xl font-black text-[#2596be] mb-4">{title}</h2>
      <div className="text-sm md:text-base leading-relaxed text-white/70 space-y-3">
        {children}
      </div>
    </section>
  );
}
