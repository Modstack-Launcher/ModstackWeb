import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../i18n";
import titleImg from "../images/modstack-title.png";
import iconImg from "../images/placeholder.png";

type NewsItem = {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  published: boolean;
};



function getCategory(item: NewsItem): string {
  const title = item.title.toLowerCase();
  const content = item.content.toLowerCase();

  if (title.includes("bedrock") || content.includes("bedrock")) {
    return "Bedrock";
  }
  if (title.includes("skin") || content.includes("skin")) {
    return "Skins";
  }
  if (
    title.includes("v1.") ||
    title.includes("v0.") ||
    title.includes("alpha") ||
    title.includes("beta") ||
    title.includes("modstack 1.")
  ) {
    return "App";
  }
  return "Features";
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
  }
}

export default function NewsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    // Generate background blobs positioning
    const blobs = document.querySelectorAll(".blob-dynamic");
    blobs.forEach((blob) => {
      const el = blob as HTMLElement;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.width = `${420 + Math.random() * 520}px`;
      el.style.height = `${420 + Math.random() * 520}px`;
      el.style.animationDelay = `${Math.random() * 6}s`;
    });
  }, []);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news updates.");
        return res.json();
      })
      .then((data: NewsItem[]) => {
        // filter published and sort by createdAt descending
        const filtered = data
          .filter((item) => item.published)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setNews(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "An unexpected error occurred.");
        setLoading(false);
      });
  }, []);



  return (
    <div className="relative min-h-screen bg-[#0f1923] text-white overflow-hidden flex flex-col">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="blob-dynamic" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2596be]/10 via-transparent to-transparent" />

      <main className="relative z-10 flex-1 mx-auto max-w-4xl w-full px-5 md:px-8 py-8 md:py-16 flex flex-col">
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
            <a href="/changelog" className="nav-item font-semibold text-[#2596be] bg-[#103444]/40 border border-[#2596be]/20">Changelog</a>
            <a href="/about" className="nav-item">About</a>
          </div>
          <Button
            variant="bordered"
            onPress={() => navigate("/")}
            className="!rounded-[8px] px-4 py-2 border-zinc-800/80 bg-zinc-900/40 text-white hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-150 flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>
        <div className="mb-10 text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Changelog
          </h1>
          <p className="text-zinc-400 text-sm md:text-base font-medium">
            Keep up-to-date on what's new with Modstack.
          </p>
        </div>



        {/* Timeline Content */}
        <div className="flex-grow flex flex-col">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-[#ffffff11] border-t-[#2596be] rounded-full animate-spin" />
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Loading updates...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12 px-6 border border-red-500/20 bg-red-950/10 rounded-2xl max-w-md mx-auto">
              <p className="text-red-400 text-sm font-medium mb-3">{error}</p>
              <Button
                variant="bordered"
                size="sm"
                className="text-white border-zinc-700"
                onPress={() => {
                  setLoading(true);
                  setError(null);
                  fetch("/api/news")
                    .then((res) => res.json())
                    .then((data) => {
                      setNews(
                        data
                          .filter((item: NewsItem) => item.published)
                          .sort(
                            (a: NewsItem, b: NewsItem) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )
                      );
                      setLoading(false);
                    })
                    .catch((err) => {
                      setError(err.message);
                      setLoading(false);
                    });
                }}
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            <div className="text-center text-zinc-500 py-20 text-sm border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
              No changelog entries found.
            </div>
          )}

          {!loading && !error && news.length > 0 && (
            <div className="relative border-l border-zinc-800/80 ml-3.5 sm:ml-4 pl-6 sm:pl-10 space-y-12 py-2">
              {news.map((item) => {
                const cat = getCategory(item);
                const relativeTime = getRelativeTime(item.createdAt);
                const dateFormatted = new Date(item.createdAt).toLocaleDateString(
                  language === "pt" ? "pt-BR" : language,
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                );

                return (
                  <div key={item.id} className="relative group animate-fadeIn">
                    {/* Timeline Node dot */}
                    <div className="absolute -left-[34px] sm:-left-[50px] top-1 w-5 h-5 bg-[#0f1923] rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(37,150,190,0.45)] border border-[#2596be]/20 group-hover:scale-110 transition-transform duration-200 z-10">
                      <div className="w-2.5 h-2.5 bg-[#2596be] rounded-full shadow-[0_0_4px_rgba(37,150,190,0.6)]" />
                    </div>

                    {/* Metadata header line */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm mb-3">
                      <span className="font-black text-[#2596be] tracking-wide uppercase text-[11px] md:text-[13px]">
                        {cat}
                      </span>
                      <span className="text-zinc-700">•</span>
                      <span className="font-bold text-zinc-200">
                        {dateFormatted}
                      </span>
                      <span className="text-zinc-500 font-medium text-xs">
                        {relativeTime}
                      </span>
                    </div>

                    {/* Changelog Card container */}
                    <div className="bg-[#141d2b]/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 hover:border-[#2596be]/30 transition-all duration-300">
                      <h2 className="text-lg md:text-xl font-extrabold text-white mb-4 leading-snug">
                        {item.title}
                      </h2>

                      {/* Optional inline image */}
                      {item.image && (
                        <div className="mb-5 overflow-hidden rounded-xl bg-zinc-950/60 border border-zinc-800/40 max-w-xl">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-auto max-h-[280px] object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}

                      {/* Content logs */}
                      <div className="prose prose-invert max-w-none text-slate-300 text-xs md:text-sm leading-relaxed space-y-3 font-medium">
                        <ReactMarkdown>{item.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20 border-t border-white/5 pt-6 text-center text-xs text-white/30">
          © 2026 Modstack. All rights reserved. NOT AN OFFICIAL MINECRAFT PRODUCT.
        </div>
      </main>

      {/* Inline styles for custom elements */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .prose ul {
          list-style-type: disc !important;
          padding-left: 1.25rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .prose li {
          margin-top: 0.35rem !important;
          margin-bottom: 0.35rem !important;
          color: #cbd5e1 !important; /* text-slate-300 */
        }
        .prose a {
          color: #2596be !important;
          text-decoration: underline !important;
        }
        .prose a:hover {
          color: #38bdf8 !important;
        }
      `}</style>
    </div>
  );
}
