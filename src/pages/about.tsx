import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";
import {
  Cpu,
  Layers,
  Globe,
  ShieldCheck,
  Users,
  Code,
  Heart,
} from "lucide-react";
import titleImg from "../images/modstack-title.png";
import iconImg from "../images/placeholder.png";

type AboutPageProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function AboutPage({ open = false, onClose }: AboutPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isRouteOpen = location.pathname === "/about";
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
            <img
              src={titleImg}
              alt="title"
              className="h-5 w-auto top-1 relative"
            />
          </a>
          <div className="nav-center hidden md:flex items-center gap-1">
            <a href="/" className="nav-item">Home</a>
            <a href="/changelog" className="nav-item">Changelog</a>
            <a href="/about" className="nav-item font-semibold text-[#2596be] bg-[#103444]/40 border border-[#2596be]/20">About</a>
          </div>
          <Button
            variant="bordered"
            onPress={() => setTimeout(handleClose, 300)}
            className="!rounded-[8px] px-5 py-2 bg-[#2596be] text-white shadow-[0_4px_0_rgb(29,123,158)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(29,123,158)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(29,123,158)] active:scale-[0.98] transition-all duration-150 flex items-center gap-2.5 text-sm w-auto font-medium ml-auto"
          >
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#ffffff"
            >
              <path
                d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <span>Back</span>
          </Button>
        </div>
        <img
          src="/images/placeholder.png"
          alt="Modstack Logo"
          className="size-32 mx-auto mb-5"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mx-auto w-fit">
            <span className="bg-gradient-to-r from-sky-400 to-[#2596be] bg-clip-text text-transparent">
              About
            </span>
            <span className="text-white"> Modstack</span>
          </h1>
        </div>
        <div className="mt-2 text-sm text-sky-400 font-extrabold mx-auto w-fit mb-8 tracking-wider uppercase">
          The Absolute BEST Minecraft Launcher
        </div>

        <div className="space-y-10">
          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-lg md:text-xl font-black text-[#2596be] mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" /> Our Mission
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-white/70 font-semibold">
              Modstack was built to be the best Minecraft launcher available. We
              focused on providing a lightweight, high-performance launcher
              without compromising on features and actually listening to our
              users.
            </p>
          </section>

          <div>
            <h2 className="text-lg md:text-xl font-black text-[#2596be] mb-6 text-center">
              Key Features & Core Pillars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={Cpu}
                title="Ultra-Lightweight Performance"
                description="Modstack has a footprint 20 times smaller than OTHER launchers, using barely any system resources so your PC's power goes entirely to the game."
              />
              <FeatureCard
                icon={Layers}
                title="Java & Bedrock Support"
                description="Forget having to switch between multiple software packages. Play on Java Edition or Bedrock Edition whenever you want, directly from one interface."
              />
              <FeatureCard
                icon={Globe}
                title="Integrated Server Browser"
                description="Browse, filter, and connect to Minecraft servers straight from the launcher. We showcase non-Pay-to-Win and smaller servers to help you actually find a good server."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="No Ads or distractions"
                description="Enjoy a clean, ad-free experience without any annoying pop-ups or intrusive marketing. That means no sidebar ads, no cosmetics shop, and nothing similar to adveritising in the launcher."
              />
            </div>
          </div>

          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-lg md:text-xl font-black text-[#2596be] mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" /> Transparency & Trust
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              Modstack is a <strong>Source-Available</strong> application. We
              believe in transparency, allowing players to view the codebase on
              our official{" "}
              <a
                href="https://github.com/Modstack-Launcher/ModstackApp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2596be] hover:underline"
              >
                GitHub Repository
              </a>
              . You can inspect the implementation details, and see how Modstack
              works. This does not mean that you can create a launcher based off
              Modstack though
            </p>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-lg md:text-xl font-black text-[#2596be] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> The Team
            </h2>
            <p className="text-sm leading-relaxed text-white/70 mb-4">
              Modstack is crafted and maintained by passionate developers who
              love the Minecraft community (Unlike the other launchers):
            </p>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <span className="text-white font-extrabold">
                  @slowyx
                </span>{" "}
                — Lead Creator & Developer
              </li>
              <li>
                <span className="text-white font-extrabold">
                  @fitzxel & @gekoxd
                </span>{" "}
                — Support & Community Management
              </li>
            </ul>

            <div className="mt-6 bg-gray-800 border border-gray-900 rounded-xl p-6 w-full max-w-2xl">
              <div className="font-bold text-2xl md:text-3xl mb-4">App Contributors:</div>
              <a href="https://github.com/Modstack-Launcher/ModstackApp/graphs/contributors">
                <img src="https://contrib.rocks/image?repo=Modstack-Launcher/ModstackApp" className="max-w-full h-auto rounded-lg" alt="App Contributors" />
              </a>
            </div>

            <div className="mt-6 bg-gray-800 border border-gray-900 rounded-xl p-6 w-full max-w-2xl">
              <div className="font-bold text-2xl md:text-3xl mb-4">
                Website Contributors:
              </div>
              <a href="https://github.com/Modstack-Launcher/ModstackWeb/graphs/contributors">
                <img src="https://contrib.rocks/image?repo=Modstack-Launcher/ModstackWeb" className="max-w-full h-auto rounded-lg" alt="Website Contributors" />
              </a>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          © 2026 Modstack. All rights reserved. NOT AN OFFICIAL MINECRAFT
          PRODUCT.
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon: IconComponent,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-sm hover:border-[#2596be]/40 hover:bg-zinc-900/40 transition-all duration-300 flex gap-4 group">
      <div className="w-12 h-12 shrink-0 rounded-lg bg-[#103444] border border-[#2596be]/30 flex items-center justify-center text-[#2596be] group-hover:border-[#2596be]/50 transition-all duration-300">
        <IconComponent className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#2596be] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
