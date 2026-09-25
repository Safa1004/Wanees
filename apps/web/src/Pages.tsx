import {
  ArcadeShelf,
  MemoryGame,
  TrailGame,
  StarGame,
  ReefGame,
  MusicGame,
} from "./Arcade";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  DiscoveryHome,
  RoomDiscovery,
  StoryShelf,
  QuietPlay,
  QuietWelcome,
} from "./Playful";
import { SeaCanvas } from "./SeaCanvas";
import type { AuthorizedPanorama } from "./Panorama";
const Panorama = lazy(() => import("./Panorama"));
import {
  Routes,
  Route,
  Link,
  NavLink,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Printer,
  Download,
  Volume2,
  BookOpen,
  Compass,
  Wind,
  Heart,
  Backpack,
  Shirt,
  Shapes,
  CalendarDays,
  Plus,
  Trash2,
  LogOut,
  ShieldCheck,
  Eye,
} from "lucide-react";
import i18n, { bi } from "./i18n";
import { useApp } from "./state";
import { Visual, Heading } from "./main";
import {
  steps,
  preferences,
  checklist,
  equipment,
  resources,
  type Pair,
} from "./content";
import { api, clearCsrf, calendar, download } from "./api";
const pair = (p: Pair) => bi(...p);
function Notice() {
  const { t } = useTranslation();
  return <p className="notice">{t("draft")}</p>;
}
function ErrorBox({ error }: { error: unknown }) {
  const { t } = useTranslation();
  return error ? (
    <p className="error" role="alert">
      {t("error")}
    </p>
  ) : null;
}
function Speech({ text }: { text: string }) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), [text]);
  if (!("speechSynthesis" in window)) return null;
  return (
    <button
      className="button"
      onClick={() => {
        if (playing) {
          speechSynthesis.cancel();
          setPlaying(false);
        } else {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = i18n.language === "ar" ? "ar-OM" : "en-GB";
          u.onend = () => setPlaying(false);
          u.onerror = () => setPlaying(false);
          speechSynthesis.speak(u);
          setPlaying(true);
        }
      }}
    >
      <Volume2 size={17} />
      {playing ? t("stop") : t("listen")}
    </button>
  );
}
function Visit() {
  const { t } = useTranslation();
  const { step, set, flat } = useApp();
  const s = steps[step];
  return (
    <>
      <Heading
        eyebrow={t("hospital")}
        title={t("visitTitle")}
        sub={t("visitSub")}
      />
      <div className="steps">
        {steps.map((s, i) => (
          <button
            key={i}
            className={i === step ? "active" : ""}
            aria-current={i === step ? "step" : undefined}
            onClick={() => set({ step: i })}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {pair(s.title)}
          </button>
        ))}
      </div>
      <div className="split">
        <div className="scene-box">
          <Visual
            mode={s.room === "home" ? "home" : "visit"}
            kind={s.room === "home" ? "xray" : s.room}
            action={
              step === 0
                ? "greeting"
                : step === 3
                  ? "demonstrating"
                  : step === 5
                    ? "goodbye"
                    : "listening"
            }
          />
        </div>
        <article className="story">
          <span className="eyebrow">
            {t("step")} {step + 1} {t("of")} 6
          </span>
          <h2>{pair(s.title)}</h2>
          <p>{pair(s.body)}</p>
          <div className="notice">{pair(s.question)}</div>
          <div className="actions">
            <button
              className="button"
              disabled={step === 0}
              onClick={() => set({ step: step - 1 })}
            >
              <ArrowLeft size={17} />
              {t("back")}
            </button>
            {step < 5 ? (
              <button
                className="button primary"
                onClick={() => set({ step: step + 1 })}
              >
                {t("next")}
                <ArrowRight size={17} />
              </button>
            ) : (
              <Link className="button primary" to="/calm/feelings">
                {t("feelings")}
                <Heart size={17} />
              </Link>
            )}
          </div>
        </article>
      </div>
      <div className="actions">
        <button className="button" onClick={() => set({ flat: !flat })}>
          <BookOpen size={17} />
          {flat ? t("three") : t("read")}
        </button>
        <Speech text={pair(s.body)} />
        <button className="button" onClick={() => set({ step: 0 })}>
          <RotateCcw size={17} />
          {t("reset")}
        </button>
      </div>
      <Notice />
      <div className="meta">
        {bi(
          "Content version demo-1 · Draft, not clinically approved",
          "نسخة المحتوى demo-1 · مسودة غير معتمدة سريريًا",
        )}
      </div>
    </>
  );
}
function Explore() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const playingGame =
    /\/explore\/games\/(memory|trail|sky|reef|music)\/?$/.test(pathname);
  return (
    <>
      {!playingGame && (
        <>
          <Heading
            title={bi("A place to be curious.", "مساحة للاكتشاف.")}
            sub={bi(
              "Look around, try something, ask a question.",
              "انظر حولك وجرّب واطرح أسئلتك.",
            )}
          />
          <nav className="tabs">
            <NavLink end to="/explore">
              {bi("Discovery club", "نادي الاكتشاف")}
            </NavLink>
            {[
              ["/explore/tour", "tour"],
              ["/explore/equipment", "equipment"],
              ["/explore/games", "games"],
              ["/explore/resources", "library"],
            ].map(([url, key]) => (
              <NavLink end={url === "/explore"} key={url} to={url}>
                {t(key)}
              </NavLink>
            ))}
          </nav>
        </>
      )}
      <Routes>
        <Route index element={<DiscoveryHome />} />
        <Route path="tour" element={<Tour />} />
        <Route path="equipment" element={<Equipment />} />
        <Route path="games/*" element={<Games />} />
        <Route path="resources/*" element={<Library />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
function Tour() {
  const [room, setRoom] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [photographic, setPhotographic] = useState(false);
  const { data: tourMedia } = useQuery<{ panoramas: AuthorizedPanorama[] }>({
    queryKey: ["public-tour-media"],
    queryFn: async () => {
      const r = await fetch("/tour-media.json");
      if (!r.ok) throw new Error("media");
      return r.json();
    },
  });
  const roomId = ["entrance", "reception", "assessment", "xray", "exit"][room];
  const photo = tourMedia?.panoramas.find(
    (p) =>
      p.room === roomId &&
      p.authorized === true &&
      p.source &&
      p.rights &&
      p.reviewedAt &&
      p.url.startsWith("/"),
  );
  const [view, setView] = useState(0);
  const rooms: Pair[] = [
    ["Entrance", "المدخل"],
    ["Reception", "الاستقبال"],
    ["Assessment room", "غرفة التقييم"],
    ["X-ray room", "غرفة الأشعة"],
    ["Heading home", "العودة للمنزل"],
  ];
  const descriptions: Pair[] = [
    [
      "Your grown-up can ask the team where to go. The entrance is the beginning of your visit.",
      "يمكن لمرافقك سؤال الفريق عن المكان الذي يجب الذهاب إليه. المدخل هو بداية زيارتك.",
    ],
    [
      "Let the team know you have arrived. Ask where you can wait and how they will call you.",
      "أخبر الفريق بوصولك. اسأل عن مكان الانتظار وكيف سينادونك.",
    ],
    [
      "A team member may ask some questions. You can ask them to explain any unfamiliar equipment.",
      "قد يطرح أحد أفراد الفريق بعض الأسئلة. يمكنك طلب شرح أي أداة لا تعرفها.",
    ],
    [
      "Meet the imaging team and the equipment. Your own team will explain which position you need.",
      "تعرّف على فريق التصوير والأدوات. سيشرح لك فريقك الوضع المناسب للتصوير.",
    ],
    [
      "Before leaving, ask the team about the next step and how results will be shared.",
      "قبل المغادرة، اسأل الفريق عن الخطوة التالية وكيفية الحصول على النتائج.",
    ],
  ];
  return (
    <>
      <div className="split">
        <div>
          {photo && (
            <div className="actions">
              <button
                className="button"
                onClick={() => setPhotographic(false)}
                aria-pressed={!photographic}
              >
                {bi("Illustrative 3D", "مشهد توضيحي ثلاثي الأبعاد")}
              </button>
              <button
                className="button"
                onClick={() => setPhotographic(true)}
                aria-pressed={photographic}
              >
                {bi("Hospital photograph · 360°", "صورة المستشفى · ٣٦٠ درجة")}
              </button>
            </div>
          )}
          {photographic && photo ? (
            <Suspense
              fallback={<p>{bi("Opening photograph…", "جارٍ فتح الصورة…")}</p>}
            >
              <Panorama media={photo} />
            </Suspense>
          ) : (
            <div className="scene-box" key={view}>
              <Visual
                mode="tour"
                kind={
                  ["entrance", "reception", "assessment", "xray", "exit"][room]
                }
              />
            </div>
          )}
          <div className="actions">
            <button className="button" onClick={() => setView(view + 1)}>
              <RotateCcw size={17} />
              {bi("Reset view", "إعادة ضبط العرض")}
            </button>
            <span className="meta">
              {bi("Illustrative 3D environment", "بيئة توضيحية ثلاثية الأبعاد")}
            </span>
          </div>
        </div>
        <div className="panel">
          <span className="eyebrow">{bi("YOUR ROOM MAP", "خريطة زيارتك")}</span>
          <div className="options">
            {rooms.map((r, i) => (
              <button
                className={`option ${i === room ? "selected" : ""}`}
                key={i}
                onClick={() => {
                  setRoom(i);
                  setVisited((v) => (v.includes(i) ? v : [...v, i]));
                }}
              >
                <span>0{i + 1}</span>
                {pair(r)}
                {i === room && <Check size={17} />}
              </button>
            ))}
          </div>
          <h2>{pair(rooms[room])}</h2>
          <p>{pair(descriptions[room])}</p>
          <Speech text={pair(descriptions[room])} />
          <RoomDiscovery room={room} />
        </div>
      </div>
      <div
        className="tour-stamps"
        aria-label={bi("Rooms you explored", "الغرف التي استكشفتها")}
      >
        {rooms.map((r, i) => (
          <span key={i} className={visited.includes(i) ? "found" : ""}>
            {visited.includes(i) ? "✦ " : "○ "}
            {pair(r)}
          </span>
        ))}
      </div>
      <p className="notice">
        {bi(
          "This is an illustrative room, not a photograph of a hospital. A real 360° tour will need authorised hospital photography.",
          "هذه غرفة توضيحية وليست صورة لمستشفى حقيقي. تتطلب جولة ٣٦٠ درجة صورًا مأذونًا باستخدامها من المستشفى.",
        )}
      </p>
    </>
  );
}
function Equipment() {
  const { t } = useTranslation();
  const [kind, setKind] = useState(0);
  const [focus, setFocus] = useState("");
  const parts: Record<string, { id: string; label: Pair }[]> = {
    stethoscope: [
      { id: "EarTip", label: ["Ear tips", "قطع الأذن"] },
      { id: "FlexibleTubing", label: ["Flexible tubing", "الأنبوب المرن"] },
      { id: "ChestPiece", label: ["Chest piece", "قطعة الصدر"] },
    ],
    thermometer: [
      { id: "Display", label: ["Display", "الشاشة"] },
      { id: "Probe", label: ["Probe tip", "طرف المسبار"] },
      { id: "PowerButton", label: ["Power button", "زر التشغيل"] },
    ],
    xray: [
      {
        id: "TubeHousing",
        label: ["X-ray tube housing", "غلاف أنبوب الأشعة السينية"],
      },
      { id: "UprightDetector", label: ["Image detector", "كاشف الصورة"] },
      { id: "TableTop", label: ["Imaging table", "طاولة التصوير"] },
    ],
  };
  return (
    <>
      <div className="split">
        <div className="scene-box">
          <Visual mode="equipment" kind={equipment[kind].id} focus={focus} />
        </div>
        <div className="story">
          <span className="eyebrow">{t("equipment")}</span>
          <h2>{pair(equipment[kind].name)}</h2>
          <p>{pair(equipment[kind].use)}</p>
          <fieldset className="appearance-options">
            <legend>{bi("Look at a part", "تعرّف على جزء")}</legend>
            <div className="actions">
              {parts[equipment[kind].id]?.map((p) => (
                <button
                  key={p.id}
                  className={`button ${focus === p.id ? "primary" : ""}`}
                  aria-pressed={focus === p.id}
                  onClick={() => setFocus(focus === p.id ? "" : p.id)}
                >
                  {pair(p.label)}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="muted">
            {bi(
              "Drag to turn the model. Scroll or pinch to look closer.",
              "اسحب لتدوير النموذج. استخدم التكبير لرؤيته عن قرب.",
            )}
          </p>
          <div className="options">
            {equipment.map((e, i) => (
              <button
                key={e.id}
                className={`option ${i === kind ? "selected" : ""}`}
                onClick={() => {
                  setKind(i);
                  setFocus("");
                }}
              >
                {pair(e.name)}
                {i === kind && <Check size={17} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Notice />
    </>
  );
}
function Games() {
  const cards: [string, Pair, typeof Shirt, string][] = [
    ["dress", ["Dress for the day", "ملابس يوم العمل"], Shirt, "sea"],
    ["pack", ["Pack a little comfort", "نجهّز حقيبة الراحة"], Backpack, "sand"],
    ["match", ["Meet your match", "نجد الأداة المناسبة"], Shapes, "clay"],
  ];
  return (
    <Routes>
      <Route
        index
        element={
          <>
            <ArcadeShelf />
            <h2>{bi("More ways to explore", "طرق أخرى للاستكشاف")}</h2>
            <div className="grid2">
              {cards.map(([id, name, Icon, color]) => (
                <Link to={id} key={id} className={`activity-card ${color}`}>
                  <Icon />
                  <h3>{pair(name)}</h3>
                  <p>{bi("Explore at your own pace", "اكتشف على راحتك")}</p>
                  <ArrowRight className="corner-arrow" />
                </Link>
              ))}
            </div>
            <p className="muted">
              {bi(
                "No timers, no pressure. Stop whenever you like.",
                "بلا مؤقّت ولا ضغط. توقّف متى أردت.",
              )}
            </p>
          </>
        }
      />
      <Route path="memory" element={<MemoryGame />} />
      <Route path="trail" element={<TrailGame />} />
      <Route path="sky" element={<Navigate to="/calm/sky" replace />} />
      <Route path="reef" element={<Navigate to="/calm/reef" replace />} />
      <Route path="music" element={<Navigate to="/calm/music" replace />} />
      <Route path="dress" element={<Dress />} />
      <Route path="bubbles" element={<Navigate to="/calm/bubbles" replace />} />
      <Route path="pack" element={<Pack />} />
      <Route path="match" element={<Match />} />
    </Routes>
  );
}
function Dress() {
  const { t } = useTranslation();
  const [clinician, setClinician] = useState("female");
  const [greeting, setGreeting] = useState(0);
  const [dress, setDress] = useState<string[]>([]);
  const [paused, pause] = useState(false);
  const pieces: { id: string; name: Pair; why: Pair }[] = [
    {
      id: "scrubs",
      name: ["Scrubs", "ملابس العمل الطبية"],
      why: [
        "Clothes worn by some healthcare staff at work.",
        "ملابس يرتديها بعض أفراد فريق الرعاية أثناء العمل.",
      ],
    },
    {
      id: "cap",
      name: ["Cap", "غطاء الرأس"],
      why: [
        "May help keep hair covered for some tasks.",
        "قد يُستخدم لتغطية الشعر أثناء بعض المهام.",
      ],
    },
    {
      id: "mask",
      name: ["Mask", "الكمامة"],
      why: [
        "Used for some tasks to help limit the spread of droplets.",
        "تُستخدم في بعض المهام للحد من انتشار الرذاذ.",
      ],
    },
    {
      id: "glasses",
      name: ["Protective glasses", "نظارات واقية"],
      why: [
        "Help protect eyes during certain tasks.",
        "تساعد على حماية العينين أثناء مهام محددة.",
      ],
    },
  ];
  return (
    <>
      <Heading
        title={bi("What does the team wear?", "ماذا يرتدي الفريق؟")}
        sub={bi(
          "Choose an item and discover its purpose. Not every item is used for every procedure.",
          "اختر قطعة وتعرّف على فائدتها. لا تُستخدم كل القطع في كل إجراء.",
        )}
      />
      <div className="split">
        <div className="scene-box">
          <Visual
            actionNonce={greeting}
            mode="dress"
            kind={clinician}
            dress={dress}
            motionPaused={paused}
            action="greeting"
          />
        </div>
        <div>
          <label>
            {bi("Healthcare guide", "مرشد الرعاية")}
            <select
              value={clinician}
              onChange={(e) => setClinician(e.target.value)}
            >
              <option value="female">{bi("Female clinician", "مختصة")}</option>
              <option value="male">{bi("Male clinician", "مختص")}</option>
            </select>
          </label>
          <div className="guide-actions">
            <button
              className="button"
              disabled={paused}
              onClick={() => setGreeting(greeting + 1)}
            >
              {bi("Say hello", "قل مرحبًا")} ✦
            </button>
          </div>
          <div className="options">
            {pieces.map((p) => (
              <button
                disabled={paused}
                key={p.id}
                className={`option ${dress.includes(p.id) ? "selected" : ""}`}
                aria-pressed={dress.includes(p.id)}
                onClick={() =>
                  setDress(
                    dress.includes(p.id)
                      ? dress.filter((x) => x !== p.id)
                      : [...dress, p.id],
                  )
                }
              >
                <div>
                  <strong>{pair(p.name)}</strong>
                  <p className="muted">{pair(p.why)}</p>
                </div>
                {dress.includes(p.id) && <Check />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="game-toolbar">
        <button className="button" onClick={() => pause(!paused)}>
          {paused ? t("play") : t("pause")}
        </button>
        <button className="button" onClick={() => setDress([])}>
          {t("reset")}
        </button>
        <Link to="/explore/games" className="button">
          {t("back")}
        </Link>
      </div>
    </>
  );
}
function Bubbles() {
  const { t } = useTranslation();
  const [popped, setPopped] = useState<number[]>([]);
  const [paused, pause] = useState(false);
  return (
    <>
      <Heading
        title={bi("A quiet little sea.", "بحر صغير وهادئ.")}
        sub={bi(
          "Choose a bubble to let it go. Use Tab and Enter, or tap. There is no hurry. Sound is off.",
          "اختر فقاعة لتختفي. استخدم لوحة المفاتيح أو المس الشاشة. لا داعي للعجلة. الصوت مغلق.",
        )}
      />
      <div
        className="game-stage"
        aria-label={bi("Bubble activity", "نشاط الفقاعات")}
      >
        <SeaCanvas paused={paused} />
        {Array.from(
          { length: 12 },
          (_, i) =>
            !popped.includes(i) && (
              <button
                key={i}
                disabled={paused}
                aria-label={bi(`Bubble ${i + 1}`, `الفقاعة ${i + 1}`)}
                className="bubble"
                style={{
                  left: `${8 + (i % 4) * 23}%`,
                  top: `${8 + Math.floor(i / 4) * 30}%`,
                  width: 48 + (i % 3) * 10,
                  height: 48 + (i % 3) * 10,
                }}
                onClick={() => setPopped([...popped, i])}
              >
                {i + 1}
              </button>
            ),
        )}
        {popped.length === 12 && (
          <div className="empty">
            <h2>{bi("A little space to just be.", "مساحة صغيرة للهدوء.")}</h2>
            <button className="button" onClick={() => setPopped([])}>
              {t("reset")}
            </button>
          </div>
        )}
      </div>
      <div className="game-toolbar">
        <button className="button" onClick={() => pause(!paused)}>
          {paused ? t("play") : t("pause")}
        </button>
        <button className="button" onClick={() => setPopped([])}>
          {t("reset")}
        </button>
        <Link className="button" to="/calm">
          {t("back")}
        </Link>
        <span aria-live="polite">{popped.length} / 12</span>
      </div>
    </>
  );
}
function Pack() {
  const { t } = useTranslation();
  const [bag, setBag] = useState<number[]>([]);
  const [paused, pause] = useState(false);
  return (
    <>
      <Heading
        title={bi("A bag that feels like you.", "حقيبة فيها ما يريحك.")}
        sub={bi(
          "Select the things on your preparation list. Your team will give any food, drink, or medication instructions.",
          "اختر الأشياء من قائمة الاستعداد. سيعطيك فريقك تعليمات الطعام والشراب والأدوية.",
        )}
      />
      <div className="grid2">
        <div className="options">
          {checklist.map((c, i) => (
            <button
              disabled={paused}
              className={`option ${bag.includes(i) ? "selected" : ""}`}
              key={i}
              onClick={() =>
                setBag(
                  bag.includes(i) ? bag.filter((n) => n !== i) : [...bag, i],
                )
              }
            >
              {pair(c)}
              {bag.includes(i) && <Check />}
            </button>
          ))}
        </div>
        <div className="panel sand">
          <Backpack size={64} strokeWidth={1} />
          <h2>{bi("In your bag", "في حقيبتك")}</h2>
          {bag.length === 0 ? (
            <p>
              {bi("Choose an item to put it here.", "اختر شيئًا لوضعه هنا.")}
            </p>
          ) : (
            <ul>
              {bag.map((i) => (
                <li key={i}>{pair(checklist[i])}</li>
              ))}
            </ul>
          )}
          <p aria-live="polite">
            {bag.length} / {checklist.length}
          </p>
        </div>
      </div>
      <div className="actions">
        <button className="button" onClick={() => pause(!paused)}>
          {paused ? t("play") : t("pause")}
        </button>
        <button className="button" onClick={() => setBag([])}>
          {t("reset")}
        </button>
        <Link className="button" to="/explore/games">
          {t("back")}
        </Link>
      </div>
    </>
  );
}
function Match() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [message, setMessage] = useState("");
  const [matched, setMatched] = useState<string[]>([]);
  const [paused, pause] = useState(false);
  return (
    <>
      <Heading
        title={bi("What does it do?", "ماذا تفعل هذه الأداة؟")}
        sub={bi(
          "Match the equipment to its purpose.",
          "اختر الأداة المناسبة للوصف.",
        )}
      />
      {matched.length === 3 ? (
        <div className="panel">
          <h2>
            {bi("You’ve explored all three.", "تعرّفت على الأدوات الثلاث.")}
          </h2>
          <button
            className="button"
            onClick={() => {
              setMatched([]);
              setCurrent(0);
              setMessage("");
            }}
          >
            {t("reset")}
          </button>
        </div>
      ) : (
        <div className="split">
          <div className="panel">
            <Shapes size={40} />
            <h2>{pair(equipment[current].use)}</h2>
            <p role="status">{message}</p>
          </div>
          <div className="options">
            {[2, 0, 1].map((i) => (
              <button
                className="option"
                disabled={paused}
                key={i}
                onClick={() => {
                  if (i === current) {
                    setMatched([...matched, equipment[i].id]);
                    setCurrent((current + 1) % 3);
                    setMessage(
                      bi(
                        "That’s the one. Let’s explore another.",
                        "هذه هي الأداة. لنكتشف أداة أخرى.",
                      ),
                    );
                  } else
                    setMessage(
                      bi(
                        "Have another look. You can explore the equipment for a hint.",
                        "انظر مرة أخرى. يمكنك مراجعة الأدوات للمساعدة.",
                      ),
                    );
                }}
              >
                {pair(equipment[i].name)}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="actions">
        <button className="button" onClick={() => pause(!paused)}>
          {paused ? t("play") : t("pause")}
        </button>
        <button
          className="button"
          onClick={() => {
            setMatched([]);
            setCurrent(0);
            setMessage("");
          }}
        >
          {t("reset")}
        </button>
        <Link className="button" to="/explore/games">
          {t("back")}
        </Link>
      </div>
    </>
  );
}
function Calm() {
  const { t } = useTranslation();
  return (
    <Routes>
      <Route
        index
        element={
          <>
            <Heading title={t("calmTitle")} sub={t("calmSub")} />
            <ArcadeShelf quiet />
            <QuietWelcome />
            <Link className="button" to="/calm/bubbles">
              {bi("Pop gentle bubbles", "فقاعات لطيفة")}
            </Link>
            <div className="grid3">
              {[
                ["breathing", "breathing", Wind, "sea"],
                ["coast", "coast", Compass, "sand"],
                ["ground", "ground", Eye, "clay"],
              ].map(([url, key, Icon, color]) => {
                const I = Icon as typeof Wind;
                return (
                  <Link
                    to={String(url)}
                    className={`activity-card ${color}`}
                    key={String(url)}
                  >
                    <I />
                    <h3>{t(String(key))}</h3>
                    <p>
                      {bi(
                        "Make a little room for yourself.",
                        "مساحة صغيرة لك.",
                      )}
                    </p>
                    <ArrowRight className="corner-arrow" />
                  </Link>
                );
              })}
            </div>
            <div className="panel" style={{ marginTop: 25 }}>
              <Feelings />
            </div>
          </>
        }
      />
      <Route path="sky" element={<StarGame quiet />} />
      <Route path="reef" element={<ReefGame quiet />} />
      <Route path="music" element={<MusicGame quiet />} />
      <Route path="bubbles" element={<Bubbles />} />
      <Route path="feelings" element={<Feelings />} />
      <Route path=":activity" element={<QuietPlay />} />
    </Routes>
  );
}
function Feelings() {
  const { t } = useTranslation();
  const [feeling, setFeeling] = useState<number | null>(null);
  const labels: Pair[] = [
    ["Curious", "فضولي"],
    ["Unsure", "متردّد"],
    ["Worried", "قلق"],
    ["Comfortable", "مرتاح"],
  ];
  return (
    <>
      <Heading title={t("feelings")} sub={t("feelingsSub")} />
      <div className="feelings">
        {labels.map((l, i) => (
          <button
            key={i}
            className={feeling === i ? "selected" : ""}
            onClick={() => setFeeling(i)}
            aria-pressed={feeling === i}
          >
            <svg
              viewBox="0 0 60 60"
              className="feeling-face"
              aria-hidden="true"
            >
              <circle cx="30" cy="30" r="26" />
              <path d="M20 23v4m20-4v4" strokeLinecap="round" />
              {i === 3 ? (
                <path d="M20 36q10 12 20 0" fill="none" />
              ) : i === 2 ? (
                <path d="M20 42q10-12 20 0" fill="none" />
              ) : i === 1 ? (
                <path d="M21 38h18" />
              ) : (
                <ellipse cx="30" cy="39" rx="5" ry="6" fill="none" />
              )}
            </svg>
            {pair(l)}
          </button>
        ))}
      </div>
      {feeling !== null && (
        <div className="status" role="status">
          {bi(
            "Thank you for sharing. This check-in stays only on this screen. Every feeling belongs here.",
            "شكرًا لمشاركتك. يبقى هذا الاختيار على هذه الشاشة فقط. كل المشاعر مقبولة هنا.",
          )}
        </div>
      )}
      <div className="actions">
        <Link className="button" to="/">
          {t("skip")}
        </Link>
        <Link className="button primary" to="/care/passport">
          {t("passport")}
          <ArrowRight size={17} />
        </Link>
      </div>
    </>
  );
}
function Library() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [opened, setOpened] = useState<string | null>(null);
  const r = resources.find((x) => x.id === opened);
  if (r)
    return (
      <article className="panel">
        <span className="tag">{pair(r.category)}</span>
        <Heading title={pair(r.title)} />
        <p>{pair(r.body)}</p>
        {r.id === "planner" && (
          <>
            <label>
              {bi("My questions", "أسئلتي")}
              <textarea />
            </label>
            <label>
              {bi("What I would like to bring", "ما أود إحضاره")}
              <textarea />
            </label>
          </>
        )}
        {r.id === "colour" && (
          <img
            style={{ height: 300, filter: "grayscale(1)" }}
            src="/emblem.svg"
            alt={bi("Wanees colouring reference", "نموذج تلوين ونيس")}
          />
        )}
        <div className="meta">
          {bi(
            "Wanees sample editorial content · demo-1 · Clinical review pending",
            "محتوى توضيحي من ونيس · demo-1 · بانتظار المراجعة السريرية",
          )}
        </div>
        <div className="actions">
          <button className="button" onClick={() => setOpened(null)}>
            {t("back")}
          </button>
          <button className="button" onClick={() => window.print()}>
            <Printer size={17} />
            {t("print")}
          </button>
          <a
            className="button"
            href={`/resources/${r.id}-${i18n.language}.html`}
            download
          >
            <Download size={17} />
            {t("download")}
          </a>
        </div>
      </article>
    );
  return (
    <>
      <StoryShelf />
      <h2>{bi("For grown-ups & little makers", "للأهل والمبدعين الصغار")}</h2>
      <div className="grid2">
        <label>
          {bi("Find a resource", "ابحث عن مورد")}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={bi(
              "Search stories and printables",
              "ابحث في القصص والمطبوعات",
            )}
          />
        </label>
        <label>
          {bi("For whom?", "لمن؟")}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">{bi("Everyone", "الجميع")}</option>
            <option value="child">{bi("Children", "الأطفال")}</option>
            <option value="parent">{bi("Grown-ups", "الأهل")}</option>
          </select>
        </label>
      </div>
      {resources
        .filter(
          (r) =>
            r.id !== "story" &&
            (filter === "all" || r.audience === filter) &&
            pair(r.title).toLowerCase().includes(search.toLowerCase()),
        )
        .map((r) => (
          <div className="resource" key={r.id}>
            <BookOpen size={26} />
            <div>
              <span className="meta">{pair(r.category)}</span>
              <h3>{pair(r.title)}</h3>
              <p className="meta">
                {t("hospital")} · {bi("Sample resource", "مورد توضيحي")}
              </p>
            </div>
            <button className="button" onClick={() => setOpened(r.id)}>
              {bi("Open", "افتح")}
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      {resources.filter(
        (r) =>
          r.id !== "story" &&
          (filter === "all" || r.audience === filter) &&
          pair(r.title).toLowerCase().includes(search.toLowerCase()),
      ).length === 0 && (
        <p className="empty">
          {bi("No resources match your search.", "لا توجد موارد تطابق بحثك.")}
        </p>
      )}
    </>
  );
}
function Care() {
  const { t } = useTranslation();
  return (
    <>
      <Heading title={t("parentTitle")} sub={t("parentSub")} />
      <nav className="tabs">
        {[
          ["/care", "welcome"],
          ["/care/passport", "passport"],
          ["/care/appointments", "appointments"],
          ["/care/checklist", "checklist"],
          ["/care/privacy", "privacy"],
        ].map(([url, key]) => (
          <NavLink end={url === "/care"} to={url} key={url}>
            {t(key)}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route index element={<ParentHome />} />
        <Route path="passport" element={<Passport />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="checklist" element={<Checklist />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () =>
      api<{ authenticated: boolean; role: string | null; demo: boolean }>(
        "/session",
      ),
    retry: false,
  });
}
function Gate({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const q = useSession();
  const qc = useQueryClient();
  const [error, setError] = useState<unknown>(null);
  const [consent, setConsent] = useState(false);
  if (q.isPending)
    return <p>{bi("Opening your workspace…", "نفتح مساحتك…")}</p>;
  if (q.data?.authenticated && q.data.role === "Guardian")
    return <>{children}</>;
  if (q.data && !q.data.demo)
    return (
      <div className="panel">
        <ShieldCheck size={30} />
        <h2>{bi("Your private family space", "مساحة أسرتك الخاصة")}</h2>
        <p>
          {bi(
            "Sign in with a parent / user account to manage child profiles and preparation notes.",
            "سجّل الدخول بحساب ولي أمر / مستخدم لإدارة ملفات الأطفال وملاحظات الاستعداد.",
          )}
        </p>
        <Link className="button primary" to="/account">
          {bi("Sign in or create an account", "سجّل الدخول أو أنشئ حسابًا")}
        </Link>
      </div>
    );
  return (
    <div className="panel">
      <ShieldCheck size={30} />
      <h2>{bi("A private practice space.", "مساحة خاصة للتجربة.")}</h2>
      <p>{t("synthetic")}</p>
      <p>
        {bi(
          "Start a synthetic caregiver session to save notes to this local demo server. It is separate from the child’s public exploration. Demo sessions expire after two hours; logout ends access to this disposable workspace.",
          "ابدأ جلسة تجريبية لمرافق لحفظ الملاحظات على خادم العرض المحلي. وهي منفصلة عن استكشاف الطفل العام. تنتهي الجلسة بعد ساعتين؛ وعند الخروج لن تستطيع العودة إلى مساحة التجربة هذه.",
        )}
      </p>
      <label className="check-label">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        {bi(
          "I will use fictional information only.",
          "سأستخدم معلومات خيالية فقط.",
        )}
      </label>
      <button
        disabled={!consent || !q.data?.demo}
        className="button primary"
        onClick={async () => {
          try {
            await api("/demo/session", "POST", { role: "Guardian" });
            clearCsrf();
            qc.removeQueries({ predicate: (q) => q.queryKey[0] !== "session" });
            await qc.invalidateQueries();
          } catch (e) {
            setError(e);
          }
        }}
      >
        {bi("Open caregiver demo", "افتح تجربة الأهل")}
      </button>
      <ErrorBox error={error || q.error} />
      {q.isError && (
        <button className="button" onClick={() => q.refetch()}>
          {t("retry")}
        </button>
      )}
    </div>
  );
}
function ParentHome() {
  const { t } = useTranslation();
  return (
    <>
      <div className="grid2">
        <Link to="/care/passport" className="activity-card sea">
          <Heart />
          <h3>{t("passport")}</h3>
          <p>
            {bi(
              "Put helpful preferences into words.",
              "نعبّر عن التفضيلات المفيدة.",
            )}
          </p>
        </Link>
        <Link to="/care/checklist" className="activity-card sand">
          <Backpack />
          <h3>{t("checklist")}</h3>
          <p>
            {bi("A few practical things to bring.", "أشياء عملية نجهّزها.")}
          </p>
        </Link>
      </div>
      <div style={{ marginTop: 25 }}>
        <Gate>
          <Profiles />
          <SavedPassports />
          <CareNotes />
        </Gate>
      </div>
      <div className="panel">
        <h2>{bi("Questions are welcome.", "الأسئلة مرحّب بها.")}</h2>
        <p>
          {bi(
            "Make room for what your child already knows, what they wonder about, and how they feel. Your care team can help with questions specific to the procedure.",
            "أفسح المجال لما يعرفه طفلك وما يتساءل عنه وما يشعر به. يمكن لفريق الرعاية المساعدة في الأسئلة الخاصة بالإجراء.",
          )}
        </p>
        <Link className="inline-link" to="/explore/resources">
          {t("library")}
        </Link>
      </div>
      <Link className="inline-link" to="/staff">
        {t("staff")}
      </Link>
    </>
  );
}
function Profiles() {
  const { profileId, set } = useApp();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["profiles"],
    queryFn: () => api<any[]>("/records/profiles"),
  });
  const [nick, setNick] = useState("");
  const [error, setError] = useState<unknown>();
  return (
    <div className="panel">
      <h2>{bi("Family practice profiles", "ملفات العائلة التجريبية")}</h2>
      <p>
        {bi(
          "Use a nickname and age band. No full names or medical identifiers.",
          "استخدم اسمًا مستعارًا وفئة عمرية. دون أسماء كاملة أو أرقام طبية.",
        )}
      </p>
      {q.data?.map((r) => (
        <div className="resource" key={r.id}>
          <button
            className={`option ${profileId === r.id ? "selected" : ""}`}
            onClick={() => set({ profileId: r.id })}
          >
            {JSON.parse(r.data).nickname}
            {profileId === r.id && <Check size={17} />}
          </button>
          <span>5–10</span>
          <button
            className="button"
            onClick={async () => {
              try {
                await api("/records/profiles/" + r.id, "DELETE");
                if (profileId === r.id) set({ profileId: "" });
                await qc.invalidateQueries();
              } catch (e) {
                setError(e);
              }
            }}
          >
            <Trash2 size={17} />
            {bi("Delete", "حذف")}
          </button>
        </div>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await api("/records/profiles", "POST", {
              data: { nickname: nick, ageBand: "5-10" },
            });
            setNick("");
            await qc.invalidateQueries({ queryKey: ["profiles"] });
          } catch (e) {
            setError(e);
          }
        }}
      >
        <label>
          {bi("Nickname", "الاسم المستعار")}
          <input
            value={nick}
            maxLength={40}
            required
            onChange={(e) => setNick(e.target.value)}
          />
        </label>
        <button className="button" type="submit">
          <Plus size={17} />
          {bi("Add profile", "إضافة ملف")}
        </button>
      </form>
      <ErrorBox error={error || q.error} />
    </div>
  );
}
function Passport() {
  const { t } = useTranslation();
  const { profileId } = useApp();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(6).fill(null),
  );
  const [preview, setPreview] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<unknown>();
  const session = useSession();
  const [dataId, setDataId] = useState("");
  const [share, setShare] = useState<{ id: string; token: string } | null>(
    null,
  );
  useEffect(() => {
    setIndex(0);
    setAnswers(Array(6).fill(null));
    setPreview(false);
    setReviewed(false);
    setDataId("");
    setShare(null);
    setStatus("");
  }, [profileId]);
  const choice = preferences[index];
  function next() {
    if (index === 5) setPreview(true);
    else setIndex(index + 1);
  }
  return (
    <>
      <ProfilePicker />
      {!preview ? (
        <div className="split">
          <div className="scene-box">
            <Visual />
          </div>
          <div className="story">
            <span className="eyebrow">
              {bi("A LITTLE ABOUT YOU", "لنتعرّف عليك")} · {index + 1}/6
            </span>
            <h2>{pair(choice.question)}</h2>
            <div className="options">
              {choice.choices.map((c, i) => (
                <button
                  key={i}
                  className={`option ${answers[index] === i ? "selected" : ""}`}
                  onClick={() =>
                    setAnswers(answers.map((a, j) => (j === index ? i : a)))
                  }
                >
                  {pair(c)}
                  {answers[index] === i && <Check size={17} />}
                </button>
              ))}
            </div>
            <div className="actions">
              <button
                className="button"
                disabled={index === 0}
                onClick={() => setIndex(index - 1)}
              >
                {t("back")}
              </button>
              <button className="button primary" onClick={next}>
                {index === 5 ? t("review") : t("next")}
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  setAnswers(answers.map((a, j) => (j === index ? null : a)));
                  next();
                }}
              >
                {t("skip")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="passport">
            <header>
              <img src="/emblem.svg" alt="" />
              <div>
                <h2>{t("passport")}</h2>
                <span className="meta">Wanees · ونيس</span>
              </div>
            </header>
            <p>
              {bi(
                "These preferences may help us prepare together. They are requests, not guarantees or a medical record.",
                "قد تساعدنا هذه التفضيلات على الاستعداد معًا. إنها طلبات وليست ضمانات أو سجلًا طبيًا.",
              )}
            </p>
            <dl>
              {answers.map(
                (a, i) =>
                  a !== null && (
                    <div key={i}>
                      <dt>{pair(preferences[i].question)}</dt>
                      <dd>{pair(preferences[i].choices[a])}</dd>
                    </div>
                  ),
              )}
            </dl>
            {answers.every((a) => a === null) && (
              <p>
                {bi(
                  "No preferences selected. You can go back and add some, or leave this blank.",
                  "لم تُحدّد تفضيلات. يمكنك الرجوع لإضافتها أو تركها فارغة.",
                )}
              </p>
            )}
            <div className="meta">
              {bi(
                "Draft demonstration · Reviewed by caregiver only when the checkbox below is selected.",
                "عرض توضيحي · لا تُعدّ مراجعة الأهل مكتملة إلا بعد تحديد المربع أدناه.",
              )}
            </div>
          </div>
          <label className="check-label no-print">
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(e) => setReviewed(e.target.checked)}
            />
            {bi(
              "I am the caregiver and have reviewed these preferences with the child.",
              "أنا مرافق الطفل وقد راجعت هذه التفضيلات معه.",
            )}
          </label>
          <div className="actions">
            <button
              className="button"
              onClick={() => {
                setPreview(false);
                setReviewed(false);
              }}
            >
              {bi("Edit preferences", "تعديل التفضيلات")}
            </button>
            <button
              className="button primary"
              disabled={!reviewed}
              onClick={() => window.print()}
            >
              <Printer size={17} />
              {t("print")}
            </button>
            <button
              className="button"
              disabled={!reviewed}
              onClick={() =>
                download(
                  "Wanees-Comfort-Passport.txt",
                  [
                    t("passport"),
                    ...answers.flatMap((a, i) =>
                      a === null
                        ? []
                        : [
                            pair(preferences[i].question) +
                              ": " +
                              pair(preferences[i].choices[a]),
                          ],
                    ),
                  ].join("\n\n"),
                )
              }
            >
              <Download size={17} />
              {t("download")}
            </button>
            {session.data?.role === "Guardian" && (
              <button
                className="button"
                disabled={!reviewed}
                onClick={async () => {
                  try {
                    const r = await api("/records/passports", "POST", {
                      data: {
                        answers,
                        profileId,
                        reviewed: true,
                        language: i18n.language,
                        version: "demo-1",
                      },
                    });
                    setDataId(r.id);
                    setStatus(
                      bi(
                        "Saved to your private caregiver workspace.",
                        "حُفظ في مساحة الأهل التجريبية.",
                      ),
                    );
                  } catch (e) {
                    setError(e);
                  }
                }}
              >
                {t("save")}
              </button>
            )}
          </div>
          {dataId && (
            <div className="panel no-print">
              <h3>
                {bi("Optional one-hour share", "مشاركة اختيارية لمدة ساعة")}
              </h3>
              <p>
                {bi(
                  "Anyone with this link can read this passport until it expires or you revoke it. The link works only while this server is available.",
                  "يمكن لأي شخص لديه الرابط قراءة الجواز حتى انتهاء صلاحيته أو إلغائه. يعمل الرابط فقط حين يكون هذا الخادم متاحًا.",
                )}
              </p>
              {!share ? (
                <button
                  className="button"
                  onClick={async () => {
                    try {
                      setShare(
                        await api("/shares", "POST", { passportId: dataId }),
                      );
                    } catch (e) {
                      setError(e);
                    }
                  }}
                >
                  {bi("Create share link", "إنشاء رابط مشاركة")}
                </button>
              ) : (
                <>
                  <label>
                    {bi("Share link", "رابط المشاركة")}
                    <input
                      readOnly
                      value={`${location.origin}/shared/${share.token}`}
                    />
                  </label>
                  <button
                    className="button"
                    onClick={async () => {
                      try {
                        await api("/shares/" + share.id, "DELETE");
                        setShare(null);
                      } catch (e) {
                        setError(e);
                      }
                    }}
                  >
                    {bi("Revoke link", "إلغاء الرابط")}
                  </button>
                </>
              )}
            </div>
          )}
          {status && (
            <p role="status" className="status no-print">
              {status}
            </p>
          )}
          <ErrorBox error={error} />
        </>
      )}
      <Notice />
    </>
  );
}
function Appointments() {
  return (
    <Gate>
      <AppointmentEditor />
    </Gate>
  );
}
const appointmentSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.string().max(150),
  note: z.string().max(1000),
  profileId: z.string(),
});
type Appointment = z.infer<typeof appointmentSchema>;
function AppointmentEditor() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["appointments"],
    queryFn: () => api<any[]>("/records/appointments"),
  });
  const profiles = useQuery({
    queryKey: ["profiles"],
    queryFn: () => api<any[]>("/records/profiles"),
  });
  const [editing, setEditing] = useState<any>(null);
  const [error, setError] = useState<unknown>();
  const form = useForm<Appointment>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: "",
      time: "09:00",
      location: "",
      note: "",
      profileId: "",
    },
  });
  return (
    <>
      <Notice />
      <div className="grid2">
        <section className="panel">
          <h2>
            {editing
              ? bi("Edit appointment note", "تعديل ملاحظة الموعد")
              : bi("Add an appointment note", "أضف ملاحظة موعد")}
          </h2>
          <p>
            {bi(
              "A personal reminder, not a confirmed hospital booking. Times use Asia/Muscat (UTC+4).",
              "تذكير شخصي، وليس حجزًا مؤكدًا بالمستشفى. التوقيت: مسقط (UTC+4).",
            )}
          </p>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              try {
                await api(
                  "/records/appointments" + (editing ? "/" + editing.id : ""),
                  editing ? "PUT" : "POST",
                  {
                    data: {
                      ...data,
                      hospitalId: "al-bahar",
                      pathwayId: "routine-xray",
                      timeZone: "Asia/Muscat",
                    },
                    version: editing?.version,
                  },
                );
                setEditing(null);
                form.reset();
                await qc.invalidateQueries({ queryKey: ["appointments"] });
              } catch (e) {
                setError(e);
              }
            })}
          >
            <label>
              {bi("Profile (optional)", "الملف (اختياري)")}
              <select {...form.register("profileId")}>
                <option value="">
                  {bi("No profile selected", "لم يُحدّد ملف")}
                </option>
                {profiles.data?.map((p) => (
                  <option value={p.id} key={p.id}>
                    {JSON.parse(p.data).nickname}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid2">
              <label>
                {bi("Date", "التاريخ")}
                <input type="date" required {...form.register("date")} />
              </label>
              <label>
                {bi("Arrival time", "وقت الوصول")}
                <input type="time" required {...form.register("time")} />
              </label>
            </div>
            <label>
              {bi("Location", "المكان")}
              <input maxLength={150} {...form.register("location")} />
            </label>
            <label>
              {bi(
                "Private note — not shared with a clinician",
                "ملاحظة خاصة — لا تُشارك مع مختص",
              )}
              <textarea maxLength={1000} {...form.register("note")} />
            </label>
            {Object.keys(form.formState.errors).length > 0 && (
              <p role="alert" className="error">
                {bi(
                  "Check the date, time, and field lengths.",
                  "تحقّق من التاريخ والوقت وطول النصوص.",
                )}
              </p>
            )}
            <button
              disabled={form.formState.isSubmitting}
              className="button primary"
              type="submit"
            >
              {t("save")}
            </button>
            {editing && (
              <button
                type="button"
                className="button"
                onClick={() => {
                  setEditing(null);
                  form.reset();
                }}
              >
                {bi("Cancel", "إلغاء")}
              </button>
            )}
          </form>
          <ErrorBox error={error} />
        </section>
        <section>
          <h2>{t("appointments")}</h2>
          <ErrorBox error={q.error} />
          {q.data?.length === 0 && (
            <p className="empty">
              {bi(
                "Your appointment notes will appear here.",
                "ستظهر ملاحظات مواعيدك هنا.",
              )}
            </p>
          )}
          {q.data?.map((r) => {
            const d = JSON.parse(r.data);
            return (
              <article className="panel" key={r.id}>
                <CalendarDays />
                <h3>
                  {new Intl.DateTimeFormat(
                    i18n.language === "ar" ? "ar-OM" : "en-GB",
                    { dateStyle: "long", timeZone: "Asia/Muscat" },
                  ).format(new Date(d.date + "T12:00:00+04:00"))}
                </h3>
                <p>
                  <bdi>{d.time}</bdi> · {d.location || t("hospital")}
                </p>
                {d.note && <p>{d.note}</p>}
                <span className="tag">
                  {bi("Personal note", "ملاحظة شخصية")}
                </span>
                <div className="actions">
                  <button
                    className="button"
                    onClick={() => {
                      setEditing(r);
                      form.reset(d);
                    }}
                  >
                    {bi("Edit", "تعديل")}
                  </button>
                  <button
                    className="button"
                    onClick={() =>
                      download(
                        "appointment.ics",
                        calendar(d.date, d.time),
                        "text/calendar",
                      )
                    }
                  >
                    {bi("Calendar file", "ملف التقويم")}
                  </button>
                  <button
                    className="button"
                    onClick={async () => {
                      try {
                        await api("/records/appointments/" + r.id, "DELETE");
                        await qc.invalidateQueries({
                          queryKey: ["appointments"],
                        });
                      } catch (e) {
                        setError(e);
                      }
                    }}
                    aria-label={bi("Delete appointment", "حذف الموعد")}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            );
          })}
          <p className="muted">
            {bi(
              "Google Calendar sync is not configured. The calendar file is a download only.",
              "مزامنة تقويم Google غير مهيّأة. ملف التقويم للتنزيل فقط.",
            )}
          </p>
        </section>
      </div>
    </>
  );
}
function Checklist() {
  const { t } = useTranslation();
  const { profileId } = useApp();
  const session = useSession();
  const qc = useQueryClient();
  const [checked, setChecked] = useState<number[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<unknown>();
  const q = useQuery({
    queryKey: ["checklists", profileId],
    queryFn: () => api<any[]>("/records/checklists"),
    enabled: session.data?.role === "Guardian",
  });
  const saved = q.data?.find((r) => JSON.parse(r.data).profileId === profileId);
  useEffect(() => {
    setChecked(saved ? JSON.parse(saved.data).checked : []);
    setStatus("");
  }, [saved?.id, profileId]);
  return (
    <div className="panel">
      <h2>{t("checklist")}</h2>
      <p>
        {bi(
          "A practical list for the sample X-ray pathway. Follow your team’s individual instructions about food, drinks, and medicines.",
          "قائمة عملية لمسار الأشعة التوضيحي. اتبع تعليمات فريقك الخاصة بشأن الطعام والشراب والأدوية.",
        )}
      </p>
      <ProfilePicker />
      {checklist.map((c, i) => (
        <label key={i} className="check-label">
          <input
            type="checkbox"
            checked={checked.includes(i)}
            onChange={() =>
              setChecked(
                checked.includes(i)
                  ? checked.filter((n) => n !== i)
                  : [...checked, i],
              )
            }
          />
          {pair(c)}
        </label>
      ))}
      <div className="progress-track">
        <i style={{ width: `${(checked.length / 6) * 100}%` }} />
      </div>
      <p className="muted">{checked.length}/6</p>
      <div className="actions">
        <button className="button" onClick={() => window.print()}>
          <Printer size={17} />
          {t("print")}
        </button>
        <button className="button" onClick={() => setChecked([])}>
          {t("reset")}
        </button>
        {session.data?.role === "Guardian" && (
          <button
            className="button primary"
            onClick={async () => {
              try {
                await api(
                  "/records/checklists" + (saved ? "/" + saved.id : ""),
                  saved ? "PUT" : "POST",
                  {
                    data: { checked, profileId, pathway: "routine-xray" },
                    version: saved?.version,
                  },
                );
                await qc.invalidateQueries({ queryKey: ["checklists"] });
                setStatus(bi("Checklist saved.", "حُفظت القائمة."));
              } catch (e) {
                setError(e);
              }
            }}
          >
            {t("save")}
          </button>
        )}
      </div>
      {status && (
        <p className="status" role="status">
          {status}
        </p>
      )}
      <ErrorBox error={error || q.error} />
    </div>
  );
}
function ProfilePicker() {
  const { profileId, set } = useApp();
  const session = useSession();
  const q = useQuery({
    queryKey: ["profiles"],
    queryFn: () => api<any[]>("/records/profiles"),
    enabled: session.data?.role === "Guardian",
  });
  if (!q.data?.length) return null;
  return (
    <label className="no-print">
      {bi("For this profile", "لهذا الملف")}
      <select
        value={profileId}
        onChange={(e) => set({ profileId: e.target.value })}
      >
        <option value="">
          {bi("General family workspace", "مساحة العائلة العامة")}
        </option>
        {q.data.map((r) => (
          <option key={r.id} value={r.id}>
            {JSON.parse(r.data).nickname}
          </option>
        ))}
      </select>
    </label>
  );
}
function SavedPassports() {
  const { t } = useTranslation();
  const { profileId } = useApp();
  const q = useQuery({
    queryKey: ["passports"],
    queryFn: () => api<any[]>("/records/passports"),
  });
  const qc = useQueryClient();
  const [opened, setOpened] = useState<string | null>(null);
  const [error, setError] = useState<unknown>();
  return (
    <div className="panel">
      <h2>{bi("Saved Comfort Passports", "جوازات الراحة المحفوظة")}</h2>
      <ProfilePicker />
      {q.data
        ?.filter((r) => (JSON.parse(r.data).profileId || "") === profileId)
        .map((r) => {
          const d = JSON.parse(r.data);
          return (
            <div key={r.id}>
              <div className="resource">
                <span>
                  {new Date(r.createdAt).toLocaleDateString(
                    i18n.language === "ar" ? "ar-OM" : "en-GB",
                  )}
                </span>
                <button
                  className="button"
                  onClick={() => setOpened(opened === r.id ? null : r.id)}
                >
                  {opened === r.id ? t("close") : bi("View", "عرض")}
                </button>
                <button
                  className="button"
                  onClick={async () => {
                    try {
                      await api("/records/passports/" + r.id, "DELETE");
                      await qc.invalidateQueries({ queryKey: ["passports"] });
                    } catch (e) {
                      setError(e);
                    }
                  }}
                >
                  {bi("Delete", "حذف")}
                </button>
              </div>
              {opened === r.id && (
                <div className="passport">
                  <h3>{t("passport")}</h3>
                  {d.answers.map(
                    (a: number | null, i: number) =>
                      a !== null && (
                        <p key={i}>
                          <strong>{pair(preferences[i].question)}</strong>
                          <br />
                          {pair(preferences[i].choices[a])}
                        </p>
                      ),
                  )}
                  <button className="button" onClick={() => window.print()}>
                    {t("print")}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      {q.data?.filter((r) => (JSON.parse(r.data).profileId || "") === profileId)
        .length === 0 && (
        <p>
          {bi(
            "No passport saved for this profile yet.",
            "لم يُحفظ جواز لهذا الملف بعد.",
          )}
        </p>
      )}
      <ErrorBox error={error || q.error} />
    </div>
  );
}
function CareNotes() {
  const { profileId } = useApp();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<unknown>();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["notes", profileId],
    queryFn: () => api<any[]>("/records/notes"),
  });
  return (
    <div className="panel">
      <h2>{bi("Questions for the care team", "أسئلة لفريق الرعاية")}</h2>
      <p>
        {bi(
          "These notes are saved here only. They are not sent to or monitored by a clinician.",
          "تُحفظ هذه الملاحظات هنا فقط. لا تُرسل إلى مختص ولا يراقبها فريق الرعاية.",
        )}
      </p>
      <ProfilePicker />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await api("/records/notes", "POST", {
              data: { text: note, profileId },
            });
            setNote("");
            setStatus(
              bi(
                "Saved privately in your workspace.",
                "حُفظت بشكل خاص في مساحة التجربة.",
              ),
            );
            await qc.invalidateQueries({ queryKey: ["notes"] });
          } catch (e) {
            setError(e);
          }
        }}
      >
        <label>
          {bi("Your question", "سؤالك")}
          <textarea
            required
            maxLength={1000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <button className="button">{bi("Save question", "حفظ السؤال")}</button>
      </form>
      {q.data
        ?.filter((r) => (JSON.parse(r.data).profileId || "") === profileId)
        .map((r) => (
          <p key={r.id}>{JSON.parse(r.data).text}</p>
        ))}
      {status && (
        <p className="status" role="status">
          {status}
        </p>
      )}
      <ErrorBox error={error || q.error} />
    </div>
  );
}

function Privacy() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const session = useSession();
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<unknown>();
  const [status, setStatus] = useState("");
  return (
    <div className="panel">
      <h2>{t("privacy")}</h2>
      <p>
        {bi(
          "Public exploration does not need an account. Language is kept on this device; child choices are kept in memory. In account mode, adult accounts, child profiles and preparation records are stored in PostgreSQL on your operator’s server. The hospital content is still fictional and unreviewed. Use fictional information while evaluating this build.",
          "لا يحتاج الاستكشاف العام إلى حساب. تُحفظ اللغة على هذا الجهاز، وتبقى اختيارات الطفل في الذاكرة. تُخزّن سجلات الأهل التجريبية على الخادم المحلي. لا تُدخل معلومات حقيقية لطفل أو معلومات طبية.",
        )}
      </p>
      <p>
        {bi(
          "No advertising, camera, microphone, location, or tracking analytics are used. Character chat uses the open-source models on your operator’s server. Chat messages are saved in your account until you delete them or the account; only the conversation is sent to the chat model, not your family records. Character audio is generated on request and is not saved by the app. Existing story read-aloud uses browser voices. Operator backups require separate deletion.",
          "لا تُستخدم إعلانات أو كاميرا أو ميكروفون أو موقع أو تحليلات تتبّع. تستخدم دردشة الرفيق نماذج مفتوحة المصدر على خادم مشغّل ونيس. تُحفظ الرسائل في حسابك حتى تحذفها أو تحذف الحساب. تُرسل المحادثة فقط إلى النموذج، وليس سجلات الأسرة. يُنشأ صوت الرفيق عند طلبه ولا يحفظه التطبيق. تستخدم قراءة القصص أصوات المتصفح. تتطلب النسخ الاحتياطية حذفًا منفصلًا.",
        )}
      </p>
      {session.data?.authenticated && (
        <>
          <div className="actions">
            <button
              className="button"
              onClick={async () => {
                try {
                  const records = await api("/account/export");
                  download(
                    "wanees-account-export.json",
                    JSON.stringify(records, null, 2),
                    "application/json",
                  );
                } catch (e) {
                  setError(e);
                }
              }}
            >
              <Download size={17} />
              {bi("Export my account data", "تصدير بيانات حسابي")}
            </button>
            <button
              className="button"
              onClick={async () => {
                await api("/auth/logout", "POST");
                clearCsrf();
                qc.clear();
                await qc.invalidateQueries();
                location.assign("/care");
              }}
            >
              <LogOut size={17} />
              {bi("Log out", "تسجيل الخروج")}
            </button>
          </div>
          <label className="check-label">
            <input
              type="checkbox"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
            />
            {bi(
              "Delete my account, all owned records and conversations, and revoke all shares. This cannot be undone.",
              "حذف حسابي وجميع سجلاتي ومحادثاتي وإلغاء المشاركات. لا يمكن التراجع عن هذا.",
            )}
          </label>
          <button
            disabled={!confirm}
            className="button danger"
            onClick={async () => {
              try {
                await api("/account", "DELETE");
                clearCsrf();
                qc.clear();
                setStatus(
                  bi(
                    "Your account and workspace have been deleted.",
                    "حُذفت مساحة التجربة.",
                  ),
                );
                await qc.invalidateQueries();
              } catch (e) {
                setError(e);
              }
            }}
          >
            {bi("Delete workspace", "حذف المساحة")}
          </button>
        </>
      )}
      {status && <p className="status">{status}</p>}
      <ErrorBox error={error} />
      <hr />
      <h3>{bi("Offline public resources", "الموارد العامة دون اتصال")}</h3>
      <p>
        {bi(
          "Download public reading resources for this device. Account pages and private API responses are never cached by the service worker.",
          "نزّل موارد القراءة العامة لهذا الجهاز. لا يخزّن عامل الخدمة صفحات الحساب أو استجابات الواجهة الخاصة.",
        )}
      </p>
      <button
        className="button"
        onClick={async () => {
          try {
            await navigator.serviceWorker.register("/sw.js");
            await navigator.serviceWorker.ready;
            setStatus(
              bi(
                "Public resource caching is enabled for this device.",
                "فُعّل حفظ الموارد العامة على هذا الجهاز.",
              ),
            );
          } catch (e) {
            setError(e);
          }
        }}
      >
        {bi(
          "Enable public offline resources",
          "تفعيل الموارد العامة دون اتصال",
        )}
      </button>
    </div>
  );
}
function Staff() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const session = useSession();
  const [error, setError] = useState<unknown>();
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [language, setLanguage] = useState("en");
  const isStaff = [
    "Editor",
    "Reviewer",
    "HospitalAdmin",
    "PlatformAdmin",
  ].includes(session.data?.role || "");
  const q = useQuery({
    queryKey: ["staff-content"],
    queryFn: () => api<any[]>("/staff/content"),
    enabled: isStaff,
  });
  const audit = useQuery({
    queryKey: ["audit"],
    queryFn: () => api<any[]>("/staff/audit"),
    enabled: isStaff,
  });
  async function role(r: string) {
    try {
      await api("/demo/session", "POST", { role: r });
      clearCsrf();
      qc.removeQueries({ predicate: (q) => q.queryKey[0] !== "session" });
      await qc.invalidateQueries();
    } catch (e) {
      setError(e);
    }
  }
  return (
    <>
      <Heading
        eyebrow={bi("FICTIONAL HOSPITAL WORKSPACE", "مساحة مستشفى خيالي")}
        title={t("staff")}
        sub={bi(
          "A sandboxed editorial workflow. Approval here is a demonstration state, not clinical approval.",
          "مسار تحرير تجريبي. الاعتماد هنا حالة توضيحية وليس موافقة سريرية.",
        )}
      />
      <div className="notice">
        {bi(
          "No real patient access. Demonstration roles are available only with DemoMode enabled.",
          "لا وصول إلى مرضى حقيقيين. الأدوار التجريبية متاحة فقط عند تشغيل وضع العرض.",
        )}
      </div>
      <div className="tabs">
        {session.data?.demo && (
          <>
            <button
              disabled={!session.data?.demo}
              className={session.data?.role === "Editor" ? "selected" : ""}
              onClick={() => role("Editor")}
            >
              {bi("Demo editor", "محرّر تجريبي")}
            </button>
            <button
              disabled={!session.data?.demo}
              className={session.data?.role === "Reviewer" ? "selected" : ""}
              onClick={() => role("Reviewer")}
            >
              {bi("Demo reviewer", "مراجع تجريبي")}
            </button>
          </>
        )}
        <Link to="/account">{bi("My account", "حسابي")}</Link>
        {isStaff && <span>{session.data?.role}</span>}
        <Link to="/care">{t("care")}</Link>
      </div>
      <ErrorBox error={error || session.error || q.error} />
      {isStaff && (
        <>
          <div className="grid2">
            <div className="panel">
              <h2>
                {sourceId
                  ? bi("Revise as a new draft", "تعديل في مسودة جديدة")
                  : bi("Create a content version", "إنشاء نسخة محتوى")}
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await api("/staff/content", "POST", {
                      hospitalId: "al-bahar",
                      title,
                      body,
                      language,
                      sourceId,
                    });
                    setTitle("");
                    setBody("");
                    setSourceId(null);
                    await qc.invalidateQueries();
                  } catch (e) {
                    setError(e);
                  }
                }}
              >
                <label>
                  {bi("Title", "العنوان")}
                  <input
                    required
                    maxLength={200}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label>
                  {t("language")}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </label>
                <label>
                  {bi("Draft text", "نص المسودة")}
                  <textarea
                    required
                    maxLength={10000}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </label>
                <button className="button primary">
                  {bi("Save draft", "حفظ المسودة")}
                </button>
              </form>
            </div>
            <div className="panel">
              <h2>{bi("Evaluation plan", "خطة التقييم")}</h2>
              <p>
                {bi(
                  "No participant metrics have been collected. A future pilot should measure:",
                  "لم تُجمع بيانات مشاركين. ينبغي أن يقيس الاختبار المستقبلي:",
                )}
              </p>
              <ul>
                <li>
                  {bi(
                    "Can families complete the preparation flow?",
                    "هل تستطيع العائلات إكمال خطوات الاستعداد؟",
                  )}
                </li>
                <li>
                  {bi(
                    "Can children describe what happens next?",
                    "هل يستطيع الطفل وصف الخطوة التالية؟",
                  )}
                </li>
                <li>
                  {bi(
                    "Do caregivers find the passport useful?",
                    "هل يجد الأهل جواز الراحة مفيدًا؟",
                  )}
                </li>
                <li>
                  {bi(
                    "Does the experience work with assistive tools?",
                    "هل تعمل التجربة مع أدوات الإتاحة؟",
                  )}
                </li>
              </ul>
              <p className="muted">
                {bi(
                  "Usability is not evidence of clinical effectiveness.",
                  "سهولة الاستخدام ليست دليلًا على الفعالية السريرية.",
                )}
              </p>
            </div>
          </div>
          <h2>{bi("Review queue", "قائمة المراجعة")}</h2>
          {q.data?.length === 0 && (
            <p className="empty">
              {bi(
                "Create a draft to try the review workflow.",
                "أنشئ مسودة لتجربة مسار المراجعة.",
              )}
            </p>
          )}
          {q.data?.map((r) => {
            const d = JSON.parse(r.data);
            const next: { [k: string]: string } = {
              draft: "in-review",
              "in-review": "approved",
              approved: "published",
              published: "retired",
            };
            const labels: { [k: string]: Pair } = {
              draft: ["Send for review", "إرسال للمراجعة"],
              "in-review": ["Approve demo version", "اعتماد النسخة التجريبية"],
              approved: ["Publish demo version", "نشر النسخة التجريبية"],
              published: ["Retire", "إيقاف النشر"],
            };
            return (
              <article className="panel" key={r.id}>
                <span className="tag">
                  {bi(
                    d.status,
                    (
                      {
                        draft: "مسودة",
                        "in-review": "قيد المراجعة",
                        approved: "معتمد تجريبيًا",
                        published: "منشور تجريبيًا",
                        retired: "متوقف",
                      } as Record<string, string>
                    )[d.status] || d.status,
                  )}{" "}
                  · v{r.version} · {d.language}
                </span>
                <h3>{d.title}</h3>
                <p dir={d.language === "ar" ? "rtl" : "ltr"}>{d.body}</p>
                <button
                  className="button"
                  onClick={() => {
                    setSourceId(r.id);
                    setTitle(d.title);
                    setBody(d.body);
                    setLanguage(d.language);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {bi("Create a revised draft", "إنشاء مسودة معدّلة")}
                </button>
                {next[d.status] && (
                  <button
                    className="button"
                    disabled={
                      d.status !== "draft" &&
                      !["Reviewer", "HospitalAdmin", "PlatformAdmin"].includes(
                        session.data?.role || "",
                      )
                    }
                    onClick={async () => {
                      try {
                        await api(
                          "/staff/content/" + r.id + "/transition",
                          "POST",
                          { status: next[d.status], version: r.version },
                        );
                        await qc.invalidateQueries();
                      } catch (e) {
                        setError(e);
                      }
                    }}
                  >
                    {pair(labels[d.status])}
                  </button>
                )}
              </article>
            );
          })}
          <details className="panel">
            <summary>{bi("Audit trail", "سجل التدقيق")}</summary>
            {audit.data?.map((r) => {
              const d = JSON.parse(r.data);
              return (
                <p key={r.id}>
                  <bdi>
                    {d.action} · {new Date(d.at).toLocaleString()}
                  </bdi>
                </p>
              );
            })}
          </details>
        </>
      )}
    </>
  );
}
function Shared() {
  const { token } = useParams();
  const q = useQuery({
    queryKey: ["share", token],
    queryFn: () => api("/shared/" + token),
    retry: false,
  });
  if (q.isError)
    return (
      <div className="panel">
        <h2>{bi("This share is unavailable.", "هذه المشاركة غير متاحة.")}</h2>
        <p>
          {bi(
            "It may have expired or been revoked. Ask the caregiver for a new copy.",
            "ربما انتهت صلاحيتها أو أُلغيت. اطلب نسخة جديدة من المرافق.",
          )}
        </p>
      </div>
    );
  if (!q.data) return <p>{bi("Loading…", "جارٍ التحميل…")}</p>;
  const d = JSON.parse(q.data.data);
  return (
    <div className="passport">
      <h1>{bi("Comfort Passport", "جواز الراحة")}</h1>
      <p>
        {bi(
          "Caregiver-reviewed preferences. Requests are not guarantees.",
          "تفضيلات راجعها المرافق. الطلبات ليست ضمانات.",
        )}
      </p>
      {d.answers.map(
        (a: number | null, i: number) =>
          a !== null &&
          preferences[i]?.choices[a] && (
            <p key={i}>
              <strong>{pair(preferences[i].question)}</strong>
              <br />
              {pair(preferences[i].choices[a])}
            </p>
          ),
      )}
    </div>
  );
}
function Setup() {
  const { t } = useTranslation();
  const [stage, setStage] = useState(
    new URLSearchParams(window.location.search).get("step") === "companion"
      ? 2
      : 0,
  );
  const { companion, flat, outfit, skin, glasses, mobility, set } = useApp();
  return (
    <>
      <Heading title={t("choose")} sub={t("chooseSub")} />
      <div className="split">
        <div className="panel">
          <span className="eyebrow">{stage + 1}/3</span>
          {stage === 0 ? (
            <>
              <h2>{bi("Language & access", "اللغة والإتاحة")}</h2>
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
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={flat}
                  onChange={(e) => set({ flat: e.target.checked })}
                />
                {t("two")}
              </label>
            </>
          ) : stage === 1 ? (
            <>
              <h2>{bi("Your hospital and visit", "المستشفى والزيارة")}</h2>
              <label>
                {bi("Hospital", "المستشفى")}
                <select>
                  <option>{t("hospital")}</option>
                </select>
              </label>
              <label>
                {bi("Pathway", "مسار الزيارة")}
                <select>
                  <option>{t("xray")}</option>
                  <option disabled>
                    {bi(
                      "Additional pathways await review",
                      "مسارات إضافية بانتظار المراجعة",
                    )}
                  </option>
                </select>
              </label>
              <p>{t("demo")}</p>
            </>
          ) : (
            <>
              <h2>{t("companion")}</h2>
              <label>
                {t("age")}
                <select>
                  <option>{bi("5–10 years", "٥–١٠ سنوات")}</option>
                  <option disabled>
                    {bi(
                      "Other age groups await review",
                      "فئات أخرى بانتظار المراجعة",
                    )}
                  </option>
                </select>
              </label>
              <label>
                {t("companion")}
                <select
                  value={companion}
                  onChange={(e) => set({ companion: e.target.value })}
                >
                  <option value="Wanees">{bi("Wanees", "ونيس")}</option>
                  <option value="Maryam">{bi("Maryam", "مريم")}</option>
                  <option value="Amer">{bi("Amer", "عامر")}</option>
                </select>
              </label>
              {companion !== "Wanees" && (
                <fieldset className="appearance-options">
                  <legend>
                    {bi("Make your companion familiar", "اختر مظهر رفيقك")}
                  </legend>
                  <label>
                    {bi("Welcome clothing", "ملابس الترحيب")}
                    <select
                      value={outfit}
                      onChange={(e) => set({ outfit: e.target.value })}
                    >
                      <option value="everyday">
                        {bi("Everyday clothes", "ملابس يومية")}
                      </option>
                      <option value="welcome">
                        {companion === "Amer"
                          ? bi("Dishdasha & kumma", "دشداشة وكمّة")
                          : bi(
                              "Embroidered welcome outfit",
                              "ملابس ترحيب مطرّزة",
                            )}
                      </option>
                    </select>
                  </label>
                  <label>
                    {bi("Skin tone", "لون البشرة")}
                    <select
                      value={skin}
                      onChange={(e) => set({ skin: e.target.value })}
                    >
                      <option value="light">{bi("Light", "فاتح")}</option>
                      <option value="warm">{bi("Warm", "متوسط")}</option>
                      <option value="deep">{bi("Deep", "داكن")}</option>
                    </select>
                  </label>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={glasses}
                      onChange={(e) => set({ glasses: e.target.checked })}
                    />
                    {bi("Glasses", "نظارة")}
                  </label>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={mobility}
                      onChange={(e) => set({ mobility: e.target.checked })}
                    />
                    {bi("Walking support", "عكاز للمساعدة في المشي")}
                  </label>
                  <p className="meta">
                    {bi(
                      "Welcome clothing is for home scenes. The visit uses everyday clothing.",
                      "تظهر ملابس الترحيب في الصفحة الرئيسية، وتُستخدم الملابس اليومية أثناء الزيارة.",
                    )}
                  </p>
                </fieldset>
              )}
            </>
          )}
          <div className="actions">
            <button
              disabled={stage === 0}
              className="button"
              onClick={() => setStage(stage - 1)}
            >
              {t("back")}
            </button>
            {stage < 2 ? (
              <button
                className="button primary"
                onClick={() => setStage(stage + 1)}
              >
                {t("next")}
              </button>
            ) : (
              <Link to="/visit" className="button primary">
                {t("start")}
              </Link>
            )}
          </div>
        </div>
        <div>
          <div className="scene-box small">
            <Visual />
          </div>
          <h3 style={{ marginTop: 20 }}>{t("journey")}</h3>
          <ol>
            {steps.map((s) => (
              <li key={s.room + pair(s.title)}>{pair(s.title)}</li>
            ))}
          </ol>
        </div>
      </div>
      <Notice />
    </>
  );
}
function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="panel">
      <h1>{t("notfound")}</h1>
      <Link className="button" to="/">
        {t("return")}
      </Link>
    </div>
  );
}
export default function Pages() {
  return (
    <Routes>
      <Route path="setup" element={<Setup />} />
      <Route path="visit" element={<Visit />} />
      <Route path="explore/*" element={<Explore />} />
      <Route path="calm/*" element={<Calm />} />
      <Route path="care/*" element={<Care />} />
      <Route path="staff" element={<Staff />} />
      <Route path="shared/:token" element={<Shared />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
