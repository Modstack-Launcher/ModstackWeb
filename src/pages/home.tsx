import React, { useState, useEffect } from "react";
import AuthButton from "../components/AuthButton";
import { Card, CardBody } from "@heroui/react";
import previewImg from "../images/launcher-preview.png";
import iconImg from "../images/placeholder.png";
import titleImg from "../images/modstack-title.png";
import {
  Download,
  ChevronDown,
  Feather,
  Server,
  Boxes,
  DownloadCloud,
  Users,
  Sliders,
  Check,
  X,
  Sword,
  Compass,
  Wrench,
} from "lucide-react";

const windowsExeUrl =
  "https://github.com/Modstack-Launcher/ModstackInstaller/releases/download/v1.0.0/modstack-setup.exe";
const linuxAppImageUrl =
  "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack.AppImage";
const linuxDebUrl =
  "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack.deb";
const linuxRpmUrl =
  "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack.rpm";
const macDmgUrl =
  "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack.dmg";

const AppleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const LinuxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z" />
  </svg>
);

const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

interface SubOptionProps {
  href: string;
  label: string;
}

const SubOption = ({ href, label }: SubOptionProps) => (
  <a
    href={href}
    style={{
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: "5px",
      padding: "6px 10px",
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: "6px",
      textDecoration: "none",
      color: "rgba(255,255,255,0.9)",
      fontSize: "11px",
      fontWeight: 600,
      transition: "background 0.15s",
      whiteSpace: "nowrap" as const,
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.35)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.2)")
    }
  >
    <Download style={{ width: "9px", height: "9px" }} />
    {label}
  </a>
);

const blueCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px 12px 14px",
  backgroundColor: "#1d7b9e",
  borderRadius: "8px 8px 6px 6px",
  color: "#ffffff",
  fontWeight: 600,
  boxShadow: "0 6px 0 rgb(29,123,158)",
};

const subTray: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  backgroundColor: "rgba(37,150,190,0.12)",
  border: "1px solid rgba(37,150,190,0.25)",
  borderTop: "none",
  borderRadius: "0 0 8px 8px",
  padding: "8px",
};

const features = [
  {
    icon: Feather,
    title: "Fast and Lightweight",
    description:
      "ModStack takes almost no resources on your computer. ModStack is also about 20 times smaller than most other launchers",
  },
  {
    icon: Server,
    title: "Server Browser",
    description: (
      <>
        Easily find Minecraft servers inside the launcher. No need to keep your
        browser open. We show smaller non P2W servers using{" "}
        <a
          href="https://anyserver.pro"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2596be] hover:underline"
        >
          AnyServer.pro
        </a>{" "}
        and{" "}
        <a
          href="https://modrinth.com"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="text-[#2596be] hover:underline"
        >
          Modrinth.com
        </a>
      </>
    ),
  },
  {
    icon: Boxes,
    title: "Bedrock and Java Support",
    description:
      "Forget just having Java. Play on Bedrock edition too whenever you want",
  },
  {
    icon: DownloadCloud,
    title: "Easy Mod installation and imports",
    description:
      "No need for any folder archeology. Just download or import your mods inside the launcher",
  },
  {
    icon: Users,
    title: "Account Switcher",
    description:
      "Easily manage and instantly switch between multiple Microsoft and offline accounts.",
  },
  {
    icon: Sliders,
    title: "Sleek Customization",
    description:
      "A beautiful, ad-free interface with clean layouts and advanced customization.",
  },
];

const modpacks = [
  {
    icon: Compass,
    title: "Explorers Odyssey",
    description:
      "Embark on an epic journey across custom biomes, stunning dimensions, and challenging dungeons.",
    url: "https://www.curseforge.com/minecraft/modpacks/explorers-odyssey",
  },
  {
    icon: Sword,
    title: "RLCraft",
    description:
      "An action RPG fantasy modpack focused on pure survival, exploration, and immersive realism.",
    url: "https://www.curseforge.com/minecraft/modpacks/rlcraft",
  },
  {
    icon: Wrench,
    title: "All the Mods 9",
    description:
      "A massive kitchen-sink modpack featuring a huge variety of modern tech, magic, and adventure mods.",
    url: "https://www.curseforge.com/minecraft/modpacks/all-the-mods-9",
  },
];

interface NewsItem {
  id?: string;
  title?: string;
  content?: string;
  image?: string;
  published?: boolean;
  createdAt?: string;
  url?: string;
}

function App() {
  const [expanded, setExpanded] = useState(false);
  const [latestNews, setLatestNews] = useState<NewsItem | null>(null);
  const [detectedOS, setDetectedOS] = useState<"Windows" | "macOS" | "Linux" | "Mobile" | null>(null);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
      setDetectedOS("Mobile");
    } else if (ua.includes("win")) {
      setDetectedOS("Windows");
    } else if (ua.includes("mac")) {
      setDetectedOS("macOS");
    } else if (ua.includes("linux")) {
      setDetectedOS("Linux");
    }
  }, []);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        const published = data.filter((item: NewsItem) => item.published);
        if (published.length > 0) {
          published.sort(
            (a: NewsItem, b: NewsItem) =>
              new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
          );
          setLatestNews(published[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  let primaryDownloadUrl = windowsExeUrl;
  let primaryDownloadLabel = "Download for Windows";
  let primaryDownloadIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      className="w-6 h-6"
    >
      <path
        fill="white"
        d="M96 96L310.6 96L310.6 310.6L96 310.6L96 96zM329.4 96L544 96L544 310.6L329.4 310.6L329.4 96zM96 329.4L310.6 329.4L310.6 544L96 544L96 329.4zM329.4 329.4L544 329.4L544 544L329.4 544L329.4 329.4z"
      />
    </svg>
  );

  if (detectedOS === "macOS") {
    primaryDownloadUrl = macDmgUrl;
    primaryDownloadLabel = "Download for macOS";
    primaryDownloadIcon = <AppleIcon />;
  } else if (detectedOS === "Linux") {
    primaryDownloadUrl = linuxAppImageUrl;
    primaryDownloadLabel = "Download for Linux";
    primaryDownloadIcon = <LinuxIcon />;
  } else if (detectedOS === "Mobile") {
    primaryDownloadUrl = windowsExeUrl;
    primaryDownloadLabel = "Download for Desktop";
    primaryDownloadIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        className="w-6 h-6"
      >
        <path
          fill="white"
          d="M96 96L310.6 96L310.6 310.6L96 310.6L96 96zM329.4 96L544 96L544 310.6L329.4 310.6L329.4 96zM96 329.4L310.6 329.4L310.6 544L96 544L96 329.4zM329.4 329.4L544 329.4L544 544L329.4 544L329.4 329.4z"
        />
      </svg>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        color: "#e2e8f0",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <nav>
        <a className="logo" href="#">
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
          <a href="/" className="nav-item font-semibold text-[#2596be] bg-[#103444]/40 border border-[#2596be]/20">Home</a>
          <a href="/changelog" className="nav-item">Changelog</a>
          <a href="/about" className="nav-item">About</a>
        </div>
        <div className="nav-right">
          <a
            href="https://discord.gg/nxsDcYVa6s"
            target="_blank"
            rel="noopener noreferrer"
            className="!rounded-[8px] px-4 py-2 bg-[#5865F2] text-white shadow-[0_4px_0_rgb(71,82,196)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(71,82,196)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(71,82,196)] active:scale-[0.98] transition-all duration-150 flex items-center gap-2.5 text-sm w-auto font-medium"
          >
            <DiscordIcon size={18} />
            <span>Join Discord</span>
          </a>
          <AuthButton />
        </div>
      </nav>

      <div className="hero">
        <svg
          className="hero-bg"
          viewBox="0 0 900 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.9">
            <polygon
              points="450,60 200,200 200,440 450,300"
              fill="#1a2a40"
              stroke="#2a3a55"
              strokeWidth="1"
            />
            <polygon
              points="450,60 700,200 700,440 450,300"
              fill="#152030"
              stroke="#2a3a55"
              strokeWidth="1"
            />
            <polygon
              points="450,60 200,200 450,340 700,200"
              fill="#1e3040"
              stroke="#2a3a55"
              strokeWidth="1"
            />
            <line
              x1="450"
              y1="60"
              x2="450"
              y2="300"
              stroke="#2a3a55"
              strokeWidth="0.8"
              opacity="0.6"
            />
            <line
              x1="200"
              y1="200"
              x2="700"
              y2="200"
              stroke="#2a3a55"
              strokeWidth="0.8"
              opacity="0.4"
            />
          </g>
          <g opacity="0.4">
            <polygon
              points="130,310 10,380 10,480 130,410"
              fill="#1a2a40"
              stroke="#2a3a55"
              strokeWidth="0.7"
            />
            <polygon
              points="130,310 250,380 250,480 130,410"
              fill="#152030"
              stroke="#2a3a55"
              strokeWidth="0.7"
            />
            <polygon
              points="130,310 10,380 130,450 250,380"
              fill="#1e3040"
              stroke="#2a3a55"
              strokeWidth="0.7"
            />
          </g>
          <g opacity="0.4">
            <polygon
              points="770,310 650,380 650,480 770,410"
              fill="#1a2a40"
              stroke="#2a3a55"
              strokeWidth="0.7"
            />
            <polygon
              points="770,310 890,380 890,480 770,410"
              fill="#152030"
              stroke="#2a3a55"
              strokeWidth="0.7"
            />
            <polygon
              points="770,310 650,380 770,450 890,380"
              fill="#1e3040"
              stroke="#2a3a55"
              strokeWidth="0.7"
            />
          </g>
        </svg>

        <div className="hero-content">
          <div className="badge">v1.2.0 STABLE</div>
          <h1 className="font-minecraft !font-normal !tracking-normal">
            Download Modstack
            <br />
            {detectedOS === "macOS" ? "for macOS" : detectedOS === "Linux" ? "for Linux" : detectedOS === "Mobile" ? "for Desktop" : "for Windows"}
          </h1>
          <p>
            Modstack is a unique launcher that lets you play your favorite mods
            and keep them up to date, all in one handy package.
          </p>

          {/* ── Download buttons + expandable platform grid ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: "16px",
              width: "100%",
            }}
          >
            <div className="hero-btns">
              <button
                onClick={() => (window.location.href = primaryDownloadUrl)}
                className="!rounded-[8px] px-8 py-4 bg-[#2596be] text-white shadow-[0_6px_0_rgb(29,123,158)] hover:translate-y-[1px] hover:shadow-[0_4px_0_rgb(29,123,158)] active:translate-y-[4px] active:shadow-[0_1px_0_rgb(29,123,158)] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                {primaryDownloadIcon}
                <span>{primaryDownloadLabel}</span>
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full sm:w-auto"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  whiteSpace: "nowrap" as const,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.color = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                <Download style={{ width: "16px", height: "16px" }} />
                More download options
                <ChevronDown
                  style={{
                    width: "16px",
                    height: "16px",
                    transition: "transform 0.25s",
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
            </div>

            {/* Expandable platform grid */}
            <div
              style={{
                width: "100%",
                maxWidth: "580px",
                overflow: "hidden",
                maxHeight: expanded ? "750px" : "0px",
                opacity: expanded ? 1 : 0,
                transition:
                  "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
              }}
            >
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full px-4 sm:px-0"
                style={{
                  paddingTop: "4px",
                  paddingBottom: "8px",
                }}
              >
                {/* Windows */}
                <div>
                  <div style={blueCard}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      className="w-6 h-6"
                    >
                      <path
                        fill="white"
                        d="M96 96L310.6 96L310.6 310.6L96 310.6L96 96zM329.4 96L544 96L544 310.6L329.4 310.6L329.4 96zM96 329.4L310.6 329.4L310.6 544L96 544L96 329.4zM329.4 329.4L544 329.4L544 544L329.4 544L329.4 329.4z"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginTop: "8px",
                      }}
                    >
                      Windows
                    </span>
                  </div>
                  <div style={subTray}>
                    <SubOption href={windowsExeUrl} label=".exe" />
                  </div>
                </div>

                {/* macOS */}
                <div>
                  <div style={blueCard}>
                    <AppleIcon />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginTop: "8px",
                      }}
                    >
                      macOS
                    </span>
                  </div>
                  <div style={subTray}>
                    <SubOption href={macDmgUrl} label=".dmg" />
                  </div>
                </div>

                {/* Linux */}
                <div>
                  <div style={blueCard}>
                    <LinuxIcon />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginTop: "8px",
                      }}
                    >
                      Linux
                    </span>
                  </div>
                  <div style={subTray}>
                    <SubOption href={linuxAppImageUrl} label=".AppImage" />
                    <SubOption href={linuxDebUrl} label=".deb" />
                    <SubOption href={linuxRpmUrl} label=".rpm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ── end download section ── */}

          <div className="preview-card w-full max-w-4xl px-4">
            <Card
              isPressable
              radius="sm"
              className="w-full !rounded-[8px] overflow-hidden border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:border-[#2596be]/40 will-change-transform !cursor-default"
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.06s linear",
              }}
            >
              <CardBody className="p-0">
                <img
                  src={previewImg}
                  alt="Modstack Launcher Preview"
                  className="w-full h-auto md:h-[490px] md:object-cover pointer-events-none select-none"
                />
              </CardBody>
            </Card>
          </div>

          {/* Latest News Highlights */}
          {latestNews && (
            <div className="mt-12 w-full max-w-4xl px-4">
              <a
                href="/changelog"
                className="group flex flex-col md:flex-row items-stretch bg-zinc-900/20 backdrop-blur-sm border border-zinc-800/80 hover:border-[#2596be]/45 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#2596be]/5 text-left"
              >
                {/* News Image */}
                {latestNews.image && (
                  <div className="relative md:w-2/5 min-h-[160px] md:min-h-0 overflow-hidden bg-zinc-950/60 border-b md:border-b-0 md:border-r border-zinc-800/50 flex items-center justify-center">
                    <img
                      src={latestNews.image}
                      alt={latestNews.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] font-bold bg-[#2596be] text-black px-2.5 py-0.5 rounded tracking-wider uppercase">
                        Latest Update
                      </span>
                    </div>
                  </div>
                )}

                {/* News Content */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#2596be] tracking-wider uppercase">
                      What's New
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-2 line-clamp-2">
                      {latestNews.title}
                    </h3>
                    <p className="text-slate-400 text-xs md:text-sm line-clamp-2 leading-relaxed">
                      {latestNews.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/40 mt-2">
                    <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">
                      {new Date(latestNews.createdAt ?? Date.now()).toLocaleDateString("en", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[#2596be] text-xs font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
                      Read Changelog →
                    </span>
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-24 md:mt-32 max-w-6xl w-full px-4 mb-16 text-center">
            <span className="text-[#2596be] font-bold tracking-wider uppercase text-xs sm:text-sm bg-[#103444] px-3.5 py-1.5 rounded-full border border-[#2596be]/25">
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-normal text-white mt-5 mb-3 tracking-normal font-minecraft">
              Built for every player
            </h2>
            <div className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-16 font-normal">
              Choose a Minecraft launcher that actually puts the community
              first.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {features.map((feature, i) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={i}
                    className="p-6 md:p-8 rounded-xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-sm hover:border-[#2596be]/40 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#103444] border border-[#2596be]/30 flex items-center justify-center text-[#2596be] group-hover:border-[#2596be]/50 transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#2596be] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <div className="text-slate-400 text-sm leading-relaxed">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparison Section */}
          <div className="mt-24 md:mt-32 max-w-5xl w-full px-4 mb-16 text-center mx-auto">
            <span className="text-[#2596be] font-bold tracking-wider uppercase text-xs sm:text-sm bg-[#103444] px-3.5 py-1.5 rounded-full border border-[#2596be]/25">
              Comparison
            </span>
            <h2 className="text-3xl md:text-5xl font-normal text-white mt-5 mb-3 tracking-normal font-minecraft">
              Why Modstack?
            </h2>
            <div className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-12 font-normal">
              See how we stack up against other popular launchers.
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/50">
                    <th className="p-3 sm:p-6 text-slate-400 font-semibold text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap">
                      Features
                    </th>
                    <th className="p-3 sm:p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <img src={iconImg} alt="Modstack" className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-white font-bold text-xs sm:text-base">Modstack</span>
                      </div>
                    </th>
                    <th className="p-3 sm:p-6 text-center text-slate-400 font-medium text-xs sm:text-base">
                      Prism
                    </th>
                    <th className="p-3 sm:p-6 text-center text-slate-400 font-medium text-xs sm:text-sm whitespace-nowrap">
                      Modrinth
                    </th>
                    <th className="p-3 sm:p-6 text-center text-slate-400 font-medium text-xs sm:text-sm whitespace-nowrap">
                      CurseForge
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {[
                    {
                      name: "Fast & Lightweight",
                      modstack: true,
                      prism: true,
                      modrinth: true,
                      curseforge: false,
                    },
                    {
                      name: "Bedrock & Java Support",
                      modstack: true,
                      prism: false,
                      modrinth: false,
                      curseforge: false,
                    },
                    {
                      name: "Built-in Server Browser",
                      modstack: true,
                      prism: false,
                      modrinth: true,
                      curseforge: false,
                    },
                    {
                      name: "Ad-Free Experience",
                      modstack: true,
                      prism: true,
                      modrinth: false,
                      curseforge: false,
                    },
                    {
                      name: "Music",
                      modstack: true,
                      prism: false,
                      modrinth: false,
                      curseforge: false,
                    },
                    {
                      name: "Online chat with friends",
                      modstack: true,
                      prism: false,
                      modrinth: false,
                      curseforge: false,
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 sm:p-6 text-white font-medium text-xs sm:text-base whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="p-3 sm:p-6 text-center">
                        <div className="flex justify-center">
                          {row.modstack ? (
                            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#2596be]" />
                          ) : (
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 sm:p-6 text-center">
                        <div className="flex justify-center">
                          {row.prism ? (
                            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
                          ) : (
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 sm:p-6 text-center">
                        <div className="flex justify-center">
                          {row.modrinth ? (
                            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
                          ) : (
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 sm:p-6 text-center">
                        <div className="flex justify-center">
                          {row.curseforge ? (
                            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
                          ) : (
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Featured Modpacks Section */}
          <div className="mt-24 md:mt-32 max-w-6xl w-full px-4 mb-16 text-center">
            <span className="text-[#2596be] font-bold tracking-wider uppercase text-xs sm:text-sm bg-[#103444] px-3.5 py-1.5 rounded-full border border-[#2596be]/25">
              Featured Modpacks
            </span>
            <h2 className="text-3xl md:text-5xl font-normal text-white mt-5 mb-3 tracking-normal font-minecraft">
              The Best Modpacks to try
            </h2>
            <div className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-16 font-normal">
              The best modpacks to try using Modstack
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {modpacks.map((modpack, i) => {
                const IconComponent = modpack.icon;
                return (
                  <a
                    key={i}
                    href={modpack.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 md:p-8 rounded-xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-sm hover:border-[#2596be]/40 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col gap-4 group cursor-pointer no-underline"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#103444] border border-[#2596be]/30 flex items-center justify-center text-[#2596be] group-hover:border-[#2596be]/50 transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#2596be] transition-colors duration-300">
                        {modpack.title}
                      </h3>
                      <div className="text-slate-400 text-sm leading-relaxed">
                        {modpack.description}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#2596be] group-hover:text-sky-400 transition-colors duration-300">
                      <span>View Modpack</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <footer
        className="px-5 sm:px-12 py-10"
        style={{
          backgroundColor: "#0a1219",
          borderTop: "1px solid #1e2d3d",
          marginTop: "80px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            className="grid grid-cols-2 md:flex md:justify-between gap-8 md:gap-24"
            style={{
              alignItems: "flex-start",
            }}
          >
            <div
              className="col-span-2 md:col-span-1"
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <img
                  src={iconImg}
                  alt="logo"
                  style={{ width: "22px", height: "22px" }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#e2e8f0",
                  }}
                >
                  Modstack
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#4a6080",
                  margin: 0,
                  maxWidth: "220px",
                  lineHeight: "1.6",
                }}
              >
                Custom Minecraft launcher to manage and play your favorite mods.
              </p>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#3a5070",
                  fontWeight: 600,
                }}
              >
                Community
              </span>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <a
                  href="https://twitter.com/modstack_"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialLinkStyle}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  @Modstack
                </a>
                <a
                  href="https://twitter.com/primeCigarrete"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialLinkStyle}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  @primeCigarrete
                </a>
                <a
                  href="https://discord.gg/nxsDcYVa6s"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialLinkStyle}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Discord
                </a>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#3a5070",
                  fontWeight: 600,
                }}
              >
                Product
              </span>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <a href="/studio" style={legalLinkStyle}>
                  Studio
                </a>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#3a5070",
                  fontWeight: 600,
                }}
              >
                Legal
              </span>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <a href="/terms" style={legalLinkStyle}>
                  Terms & Conditions
                </a>
                <a href="/privacy" style={legalLinkStyle}>
                  Privacy Policy
                </a>
                <a href="/about" style={legalLinkStyle}>
                  About
                </a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #1a2a3a" }} />

          <div
            className="text-center sm:text-left"
            style={{
              marginBottom: "-8px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#4a6a8a" }}>
              Modstack is{" "}
              <a
                href="https://github.com/Modstack-Launcher/ModstackApp"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1d7b9e",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#2bb1e0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1d7b9e")}
              >
                Source-Available, not Open Source
              </a>
              .
            </span>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center"
            style={{
              width: "100%",
            }}
          >
            <span className="text-center sm:text-left" style={{ fontSize: "12px", color: "#2e4060" }}>
              © 2026 Modstack. All rights reserved.
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#3a5070",
                textAlign: "center",
                maxWidth: "400px",
                lineHeight: "1.6",
              }}
            >
              NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED
              WITH MOJANG OR MICROSOFT.
            </span>
            <span className="text-center sm:text-right" style={{ fontSize: "12px", color: "#2e4060" }}>
              Made with 💙 by @primeCigarrete
              <br />
              support: @fitzxel & @gekoxd
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const socialLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  color: "#5a7a9a",
  textDecoration: "none",
  transition: "color 0.2s",
  cursor: "pointer",
};

const legalLinkStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#5a7a9a",
  textDecoration: "none",
  cursor: "pointer",
};

export default App;
