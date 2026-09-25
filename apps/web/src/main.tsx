import React, { Suspense, lazy, useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  House,
  Route as RouteIcon,
  Compass,
  Wind,
  ArrowUpRight,
  ArrowRight,
  Pause,
  Play,
  Settings2,
  Users,
  ShieldCheck,
  Globe,
  Heart,
  Check,
  Menu,
  X,
} from "lucide-react";
import "./i18n";
import i18n, { bi } from "./i18n";
import { useApp } from "./state";
import "./style.css";
import { useWebTools } from "./web-tools";
const Scene = lazy(() => import("./Scene"));
const Accounts = lazy(() => import("./Accounts"));
const Admin = lazy(() =>
  import("./Accounts").then((m) => ({ default: m.Admin })),
);
const Clinical = lazy(() =>
  import("./Accounts").then((m) => ({ default: m.Clinical })),
);
const Chat = lazy(() => import("./Chat"));
const Pages = lazy(() => import("./Pages"));
const qc = new QueryClient();
export function Visual(props: {
  actionNonce?: number;
  motionPaused?: boolean;
  focus?: string;
  character?: string;
  mode?: string;
  kind?: string;
  dress?: string[];
  action?: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="scene-fallback" role="status">
          {props.mode === "dress" && (
            <img
              src={`/posters/clinician-${props.kind === "male" ? "male" : "female"}.png`}
              alt=""
            />
          )}
          <p>
            {bi("Opening your 3D scene…", "جارٍ فتح المشهد ثلاثي الأبعاد…")}
          </p>
        </div>
      }
    >
      <Scene {...props} />
    </Suspense>
  );
}
export function Heading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="page-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div>
  );
}
function Home() {
  const { t } = useTranslation();
  const { paused, set, step, companion } = useApp();
  return (
    <>
      <div className="intro-line">
        <Link to="/setup" className="inline-link">
          {t("hospital")}
        </Link>
        <span>
          {bi("Ages 5–10 · Routine X-ray", "٥–١٠ سنوات · أشعة سينية")}
        </span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            {bi("YOUR COMPANION, EVERY LITTLE STEP", "رفيقك في كل خطوة صغيرة")}
          </span>
          <h1>
            {t("hello")}
            <br />
            <em>{t("hello2")}</em>
          </h1>
          <p>
            {companion === "Wanees"
              ? t("intro")
              : bi(
                  `Hello, I’m ${companion}. Let’s explore your visit together, one small step at a time.`,
                  `أهلًا، أنا ${companion === "Amer" ? "عامر" : "مريم"}. لنستكشف زيارتك معًا، خطوة صغيرة في كل مرة.`,
                )}
          </p>
          <Link className="button primary" to="/visit">
            {t("start")}
            <ArrowRight size={19} />
          </Link>
          <div className="reassurance">
            <ShieldCheck size={17} />
            {bi("Explore together. Take your time.", "نستكشف معًا، على راحتك.")}
          </div>
        </div>
        <div className="hero-stage">
          <Visual />
          <span className="scene-label">
            {companion === "Wanees"
              ? bi("Ahlan! I’m Wanees.", "أهلًا! أنا ونيس.")
              : companion === "Amer"
                ? bi("Ahlan! I’m Amer.", "أهلًا! أنا عامر.")
                : bi("Ahlan! I’m Maryam.", "أهلًا! أنا مريم.")}
          </span>
          <div className="scene-controls">
            <Link to="/setup?step=companion">
              {bi("Choose your companion", "اختر رفيقك")}
            </Link>
            <button
              className="icon-button"
              aria-label={paused ? t("play") : t("pause")}
              onClick={() => set({ paused: !paused })}
            >
              {paused ? <Play size={17} /> : <Pause size={17} />}
            </button>
          </div>
        </div>
      </section>
      <section className="journey-row">
        <div>
          <span className="eyebrow">
            {bi("A SMALL STEP IS A GOOD START", "كل خطوة صغيرة بداية طيبة")}
          </span>
          <h2>{t("journey")}</h2>
          <p>{t("journeySub")}</p>
        </div>
        <Link className="progress-ticket" to="/visit">
          <div className="ticket-icon">
            <RouteIcon />
          </div>
          <div>
            <strong>{t("xray")}</strong>
            <span>
              {t("step")} {step + 1} {t("of")} 6
            </span>
            <div className="progress-track">
              <i style={{ width: `${((step + 1) / 6) * 100}%` }} />
            </div>
          </div>
          <ArrowUpRight />
        </Link>
      </section>
      <div className="activity-grid">
        <Link to="/explore/tour" className="activity-card sea">
          <Compass />
          <span className="card-number">01</span>
          <h3>{t("tour")}</h3>
          <p>
            {bi(
              "Make a new place feel familiar.",
              "تعرّف على المكان قبل زيارتك.",
            )}
          </p>
          <ArrowUpRight className="corner-arrow" />
        </Link>
        <Link to="/calm" className="activity-card clay">
          <Wind />
          <span className="card-number">02</span>
          <h3>{t("calm")}</h3>
          <p>
            {bi(
              "A breath, a pause, a little space.",
              "نَفَس هادئ، واستراحة صغيرة.",
            )}
          </p>
          <ArrowUpRight className="corner-arrow" />
        </Link>
        <Link to="/care/passport" className="activity-card sand">
          <Heart />
          <span className="card-number">03</span>
          <h3>
            {bi(
              "What helps you feel comfortable?",
              "ما الذي يساعدك على الراحة؟",
            )}
          </h3>
          <p>
            {bi("Tell us in your own way.", "أخبرنا بالطريقة التي تناسبك.")}
          </p>
          <ArrowUpRight className="corner-arrow" />
        </Link>
      </div>
      <div className="parent-strip">
        <Users />
        <div>
          <strong>
            {bi("Beside them, every step.", "بجانبهم في كل خطوة.")}
          </strong>
          <p>
            {bi(
              "Checklists, comfort preferences, and a little help preparing.",
              "قوائم وتفضيلات وأدوات للاستعداد معًا.",
            )}
          </p>
        </div>
        <Link to="/care">
          {t("care")}
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </>
  );
}
function App() {
  useWebTools();
  const { t } = useTranslation();
  const [settings, showSettings] = useState(false);
  const [mobile, setMobile] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!settings) return;
    const previous = document.activeElement as HTMLElement;
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") showSettings(false);
      if (e.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button,input,select,a[href]",
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [settings]);
  const { flat, set, companion } = useApp();
  const loc = useLocation();
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const timer = setTimeout(() => {
      import("axe-core").then(async ({ default: axe }) => {
        try {
          const report = await axe.run(document.querySelector("main")!, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
            },
          });
          console.info(
            "WANEES_AXE",
            JSON.stringify({
              path: location.pathname,
              violations: report.violations.map((v) => ({
                id: v.id,
                impact: v.impact,
                targets: v.nodes.map((n) => n.target),
              })),
            }),
          );
        } catch {
          /* A previous scan may still be completing during hot reload. */
        }
      });
    }, 1800);
    return () => clearTimeout(timer);
  }, [loc.pathname]);
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    localStorage.setItem("wanees-language", i18n.language);
  }, [i18n.language]);
  useEffect(() => {
    setMobile(false);
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  function language() {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  }
  return (
    <>
      <a className="skip" href="#main">
        {bi("Skip to content", "انتقل إلى المحتوى")}
      </a>
      <div className="app-shell">
        <aside
          id="primary-navigation"
          className={`sidebar ${mobile ? "open" : ""}`}
        >
          <Link to="/" className="brand">
            <img src="/emblem.svg" alt="" />
            <span>
              <b lang="ar">ونيس</b>
              <strong>Wanees</strong>
            </span>
          </Link>
          <span className="nav-label">{bi("A SPACE FOR YOU", "مساحة لك")}</span>
          <nav>
            {[
              ["/", House, "home"],
              ["/visit", RouteIcon, "visit"],
              ["/explore", Compass, "explore"],
              ["/calm", Wind, "calm"],
            ].map(([url, Icon, key]) => {
              const I = Icon as typeof House;
              return (
                <NavLink key={String(url)} to={String(url)} end={url === "/"}>
                  <I size={20} />
                  {t(String(key))}
                </NavLink>
              );
            })}
          </nav>
          <div className="sidebar-bottom">
            <div className="little-note">
              <img src="/emblem.svg" alt="" />
              <p>
                {bi(
                  "You don’t have to know everything before you begin.",
                  "لا تحتاج أن تعرف كل شيء قبل أن تبدأ.",
                )}
              </p>
            </div>
            <NavLink to="/chat">
              <Heart size={18} />
              {bi("Companion chat", "حديث مع رفيقي")}
            </NavLink>
            <NavLink to="/account">
              <Users size={18} />
              {bi("My account", "حسابي")}
            </NavLink>
            <NavLink to="/care">
              <Users size={18} />
              {t("care")}
            </NavLink>
            <button onClick={() => showSettings(true)}>
              <Settings2 size={18} />
              {t("settings")}
            </button>
            <button onClick={language}>
              <Globe size={18} />
              {i18n.language === "en" ? "العربية" : "English"}
            </button>
          </div>
        </aside>
        <div className="content-shell">
          <header>
            <button
              className="mobile-menu icon-button"
              aria-label={bi("Menu", "القائمة")}
              aria-expanded={mobile}
              aria-controls="primary-navigation"
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X /> : <Menu />}
            </button>
            <div className="breadcrumb">
              Wanees <span>/</span>{" "}
              {t(
                loc.pathname.startsWith("/care")
                  ? "care"
                  : loc.pathname.startsWith("/visit")
                    ? "visit"
                    : loc.pathname.startsWith("/explore")
                      ? "explore"
                      : loc.pathname.startsWith("/calm")
                        ? "calm"
                        : "home",
              )}
            </div>
            <div className="header-actions">
              <span className="demo-badge">
                {bi("FICTIONAL HOSPITAL", "مستشفى خيالي")}
              </span>
              <button onClick={language} className="text-button">
                {i18n.language === "en" ? "العربية" : "English"}
              </button>
              <button
                className="avatar"
                onClick={() => showSettings(true)}
                aria-label={t("settings")}
              >
                W
              </button>
            </div>
          </header>
          <main id="main">
            <Suspense
              fallback={<p>{bi("Opening your space…", "نفتح مساحتك…")}</p>}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/account" element={<Accounts />} />
                <Route path="/login" element={<Accounts />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/clinical" element={<Clinical />} />
                <Route path="/*" element={<Pages />} />
              </Routes>
            </Suspense>
          </main>
          <footer>
            <span>Wanees · ونيس</span>
            <span>{t("demo")}</span>
            <Link to="/care/privacy">{t("privacy")}</Link>
          </footer>
        </div>
      </div>
      {settings && (
        <div className="modal-backdrop">
          <section
            ref={dialogRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <button
              autoFocus
              className="modal-close icon-button"
              onClick={() => showSettings(false)}
              aria-label={t("close")}
            >
              <X />
            </button>
            <h2 id="settings-title">{t("choose")}</h2>
            <p>{t("chooseSub")}</p>
            <label>
              {t("language")}
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </label>
            <label>
              {t("companion")}
              <select
                value={companion}
                onChange={(e) => set({ companion: e.target.value })}
              >
                <option>Wanees</option>
                <option value="Maryam">{bi("Maryam", "مريم")}</option>
                <option value="Amer">{bi("Amer", "عامر")}</option>
              </select>
            </label>
            <label>
              {t("age")}
              <select defaultValue="5–10">
                <option>5–10</option>
                <option disabled>
                  {bi("Under 5 — coming later", "أقل من ٥ — قريبًا")}
                </option>
                <option disabled>
                  {bi("11+ — coming later", "١١+ — قريبًا")}
                </option>
              </select>
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={flat}
                onChange={(e) => set({ flat: e.target.checked })}
              />
              {t("two")}
            </label>
            <button
              className="button primary"
              onClick={() => showSettings(false)}
            >
              {t("done")}
              <Check size={18} />
            </button>
          </section>
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
