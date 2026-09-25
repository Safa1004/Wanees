import { ArcadeShelf } from "./Arcade";
import { useEffect, useState, useRef, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Heart,
  Leaf,
  RotateCcw,
  Sparkles,
  Star,
  Wind,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { bi } from "./i18n";
import type { Pair } from "./content";
import { storybooks, type Story } from "./playContent";
import { useApp } from "./state";
import "./playful.css";
const pair = (p: Pair) => bi(...p);
function NatureArt({ scene = "coast" }: { scene?: string }) {
  return (
    <svg
      className="nature-art"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect
        width="600"
        height="400"
        fill={scene === "stars" ? "#dcdcf0" : "#d7eae4"}
      />
      <circle cx="460" cy="90" r="45" fill="#fff0c9" />
      <path d="M0 225Q90 155 190 224T400 210T650 230V400H0Z" fill="#a9cebd" />
      <path
        d="M0 285Q120 228 265 277T610 270V400H0Z"
        fill={scene === "coast" ? "#78b4b6" : "#8eafa1"}
      />
      <path d="M0 345Q170 285 340 343T620 322V400H0Z" fill="#e9d8b5" />
      {[70, 185, 305].map((x, i) => (
        <g
          key={x}
          transform={`translate(${x} ${60 + (i % 2) * 45})`}
          fill="#fffaf0"
        >
          <ellipse rx="29" ry="11" />
          <circle cy="-7" r="12" />
          <circle cx="15" cy="-3" r="10" />
        </g>
      ))}
      {scene === "stars" &&
        [60, 160, 290, 380, 530].map((x, i) => (
          <path
            key={x}
            transform={`translate(${x} ${35 + (i % 3) * 47}) scale(.8)`}
            d="M0-13 4-4 14-3 6 4 8 14 0 9-8 14-6 4-14-3-4-4Z"
            fill="#fff6d9"
          />
        ))}
      {scene === "coast" &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${70 + i * 160} 299q25-12 50 0t50 0`}
            fill="none"
            stroke="#cce6dc"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
      {scene === "garden" &&
        [70, 500].map((x) => (
          <g key={x} transform={`translate(${x} 300)`}>
            <path d="M0 30V-35" stroke="#497d67" strokeWidth="5" />
            <ellipse cx="-12" cy="0" rx="15" ry="7" fill="#497d67" />
            <circle cy="-38" r="22" fill="#d79789" />
            <circle cy="-38" r="8" fill="#f7dda6" />
          </g>
        ))}
    </svg>
  );
}
export function DiscoveryHome() {
  const { t } = useTranslation();
  const cards = [
    {
      to: "/explore/tour",
      name: bi("A little hospital adventure", "مغامرة صغيرة في المستشفى"),
      desc: bi(
        "Visit five rooms. Find something new in each one.",
        "زُر خمس غرف واكتشف شيئًا جديدًا في كل منها.",
      ),
      image: "rooms-reception",
      tag: bi("LOOK & DISCOVER", "شاهد واكتشف"),
      color: "sea",
      Icon: Compass,
    },
    {
      to: "/explore/games/dress",
      name: bi("Help the team get ready", "ساعد الفريق على الاستعداد"),
      desc: bi(
        "Choose a guide and try their work clothes.",
        "اختر مرشدًا وجرّب ملابس العمل.",
      ),
      image: "clinician-female",
      tag: bi("DRESS & LEARN", "البس وتعلّم"),
      color: "clay",
      Icon: Heart,
    },
    {
      to: "/explore/games",
      name: bi("Little games, big discoveries", "ألعاب صغيرة واكتشافات كبيرة"),
      desc: bi(
        "Find matching pictures, follow a trail or pack your visit bag.",
        "طابق الصور أو اتبع المسار أو جهّز حقيبة زيارتك.",
      ),
      image: "wanees",
      tag: bi("PLAY TOGETHER", "نلعب معًا"),
      color: "sand",
      Icon: Sparkles,
    },
    {
      to: "/explore/resources",
      name: bi("Once upon a little moment…", "كان يا ما كان في لحظة صغيرة…"),
      desc: bi(
        "Four story adventures starring your friends.",
        "أربع مغامرات قصصية مع أصدقائك.",
      ),
      image: "maryam",
      tag: bi("READ & IMAGINE", "اقرأ وتخيّل"),
      color: "sea",
      Icon: BookOpen,
    },
  ];
  return (
    <>
      <ArcadeShelf />
      <h2>{bi("Explore your visit", "استكشف زيارتك")}</h2>
      <div className="discovery-grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className={`discovery-card ${c.color}`}>
            <div className="discovery-picture">
              <NatureArt scene={c.color === "sand" ? "stars" : "garden"} />
              <img src={`/story-art/${c.image}.png`} alt="" />
            </div>
            <div className="discovery-copy">
              <span className="eyebrow">
                <c.Icon size={15} /> {c.tag}
              </span>
              <h3>{c.name}</h3>
              <p>{c.desc}</p>
              <span className="discover-arrow">
                {bi("Come and try", "هيا نجرّب")} <ArrowRight size={17} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="gentle-note">
        <Heart size={20} />
        <p>
          {bi(
            "No race. No wrong way to be curious. Your grown-up can join in too.",
            "بلا سباق. لا توجد طريقة خاطئة للفضول. يمكن لمرافقك أن يشارك أيضًا.",
          )}
        </p>
        <Link to="/calm">{t("calm")}</Link>
      </div>
    </>
  );
}
const roomDiscoveries: {
  question: Pair;
  options: Pair[];
  answer: number;
  reply: Pair;
}[] = [
  {
    question: [
      "Who could help us find the right room?",
      "من يمكن أن يساعدنا في العثور على الغرفة؟",
    ],
    options: [
      ["The reception team", "فريق الاستقبال"],
      ["An imaginary seagull", "نورس خيالي"],
    ],
    answer: 0,
    reply: [
      "Yes! Your grown-up can ask the reception team for directions.",
      "نعم! يمكن لمرافقك سؤال فريق الاستقبال عن الطريق.",
    ],
  },
  {
    question: [
      "What could make waiting a little nicer?",
      "ما الذي قد يجعل الانتظار ألطف؟",
    ],
    options: [
      ["Reading together", "القراءة معًا"],
      ["Imagining a story", "تخيّل قصة"],
    ],
    answer: -1,
    reply: [
      "Both are lovely ideas. Choose what feels right for you.",
      "كلتاهما فكرة جميلة. اختر ما يناسبك.",
    ],
  },
  {
    question: [
      "An unfamiliar tool! What could we do?",
      "أداة غير مألوفة! ماذا يمكننا أن نفعل؟",
    ],
    options: [
      ["Ask the team to explain", "نطلب من الفريق شرحها"],
      ["Guess without asking", "نخمّن دون سؤال"],
    ],
    answer: 0,
    reply: [
      "You can ask what a tool does before it is used.",
      "يمكنك السؤال عن فائدة الأداة قبل استخدامها.",
    ],
  },
  {
    question: [
      "Who explains how to stand or sit for the picture?",
      "من يشرح كيف نقف أو نجلس للتصوير؟",
    ],
    options: [
      ["The imaging team", "فريق التصوير"],
      ["Our storybook characters", "شخصيات قصتنا"],
    ],
    answer: 0,
    reply: [
      "Your own imaging team will guide you.",
      "فريق التصوير الخاص بك سيرشدك.",
    ],
  },
  {
    question: [
      "Before heading home, what can we ask?",
      "عمّ يمكن أن نسأل قبل العودة للبيت؟",
    ],
    options: [
      ["What happens next?", "ماذا سيحدث بعد ذلك؟"],
      ["How will we hear about the results?", "كيف سنعرف النتائج؟"],
    ],
    answer: -1,
    reply: [
      "Both are useful questions for your grown-up to ask the team.",
      "كلاهما سؤال مفيد يمكن لمرافقك طرحه على الفريق.",
    ],
  },
];
export function RoomDiscovery({ room }: { room: number }) {
  return <RoomQuestion key={room} room={room} />;
}
function RoomQuestion({ room }: { room: number }) {
  const [choice, choose] = useState<number | null>(null);
  const item = roomDiscoveries[room];
  const correct =
    choice !== null && (item.answer === -1 || item.answer === choice);
  return (
    <section className="discovery-question">
      <span className="eyebrow">
        <Compass size={16} />
        {bi("A LITTLE DISCOVERY", "اكتشاف صغير")}
      </span>
      <h3>{pair(item.question)}</h3>
      <div className="options">
        {item.options.map((o, i) => (
          <button
            className={`option ${choice === i ? "selected" : ""}`}
            aria-pressed={choice === i}
            key={i}
            onClick={() => choose(i)}
          >
            {pair(o)}
            {choice === i && <Check size={16} />}
          </button>
        ))}
      </div>
      {choice !== null && (
        <p role="status" className="choice-reply">
          {correct
            ? pair(item.reply)
            : bi(
                "Let’s think together. The hospital team can help us understand. Try the other idea.",
                "لنفكّر معًا. يمكن لفريق المستشفى مساعدتنا على الفهم. جرّب الفكرة الأخرى.",
              )}
        </p>
      )}
    </section>
  );
}
export function StoryShelf() {
  useTranslation();
  const [selected, select] = useState<string | null>(null);
  const [query, search] = useState("");
  const story = storybooks.find((s) => s.id === selected);
  if (story)
    return (
      <StoryReader key={story.id} story={story} back={() => select(null)} />
    );
  const visible = storybooks.filter((s) =>
    s.title.some((t) => t.toLowerCase().includes(query.toLowerCase().trim())),
  );
  return (
    <section className="story-shelf">
      <div className="shelf-heading">
        <div>
          <span className="eyebrow">
            {bi("THE WANEES STORY SHELF", "رف قصص ونيس")}
          </span>
          <h2>
            {bi("A small story. A whole new world.", "قصة صغيرة. عالم جديد.")}
          </h2>
          <p>
            {bi(
              "Original stories in English and Arabic. Read together and choose what happens in your imagination.",
              "قصص أصلية بالعربية والإنجليزية. نقرأ معًا ونختار ما يحدث في خيالنا.",
            )}
          </p>
        </div>
        <BookOpen size={42} />
      </div>
      <label className="story-search">
        {bi("Find a story", "ابحث عن قصة")}
        <input
          type="search"
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder={bi(
            "Try Wanees, Maryam or Amer",
            "جرّب ونيس أو مريم أو عامر",
          )}
        />
      </label>
      <div className="book-grid">
        {visible.map((s) => (
          <button
            className={`book-card ${s.color}`}
            onClick={() => select(s.id)}
            key={s.id}
          >
            <div className="book-cover">
              <NatureArt scene={s.scene} />
              <img src={`/story-art/${s.character}.png`} alt="" />
              <span className="book-pill">
                {bi("4 pages · Read together", "٤ صفحات · نقرأ معًا")}
              </span>
            </div>
            <div className="book-copy">
              <h3>{pair(s.title)}</h3>
              <p>{pair(s.subtitle)}</p>
              <span>
                {bi("Open the story", "افتح القصة")} <ArrowRight size={16} />
              </span>
            </div>
          </button>
        ))}
      </div>
      {!visible.length && (
        <p role="status">
          {bi(
            "No stories found. Try another name.",
            "لم نجد قصة. جرّب اسمًا آخر.",
          )}
        </p>
      )}
      <details className="reading-sources">
        <summary>
          {bi(
            "For grown-ups: more books & reading notes",
            "للأهل: كتب إضافية وملاحظات القراءة",
          )}
        </summary>
        <p>
          {bi(
            "The four Wanees stories above are original fictional stories, not accounts of a particular hospital visit. Read at your child’s pace; any choice may be skipped.",
            "قصص ونيس الأربع أعلاه قصص خيالية أصلية، ولا تصف زيارة إلى مستشفى بعينه. اقرأ حسب رغبة طفلك، ويمكن تجاوز أي اختيار.",
          )}
        </p>
        <p>
          <a
            href="https://storyweaver.org.in/en/open-content"
            target="_blank"
            rel="noreferrer"
          >
            {bi(
              "Discover openly licensed children’s books on StoryWeaver ↗",
              "اكتشف كتب الأطفال ذات الترخيص المفتوح في StoryWeaver ↗",
            )}
          </a>
        </p>
        <p>
          <a
            href="https://www.gosh.nhs.uk/patients-and-families/support-services/play-team/about-play-department/"
            target="_blank"
            rel="noreferrer"
          >
            {bi(
              "How the GOSH Play team uses play, creativity and books ↗",
              "كيف يستخدم فريق اللعب في GOSH اللعب والإبداع والكتب ↗",
            )}
          </a>
        </p>
        <p className="meta">
          {bi(
            "External sites open in a new tab. Wanees is not affiliated with these organisations.",
            "تُفتح المواقع الخارجية في علامة تبويب جديدة. لا يرتبط ونيس بهذه الجهات.",
          )}
        </p>
      </details>
    </section>
  );
}
function StoryReader({ story, back }: { story: Story; back: () => void }) {
  const [page, setPage] = useState(0);
  const pageHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    pageHeading.current?.focus({ preventScroll: true });
    pageHeading.current?.scrollIntoView?.({
      block: "start",
      behavior: "instant",
    });
  }, [page]);
  const [choices, setChoices] = useState<Record<number, number>>({});
  const [finished, finish] = useState(false);
  const p = story.pages[page];
  const choice = choices[page];
  return (
    <article className="storybook">
      <div className="reader-bar">
        <button className="button" onClick={back}>
          <ArrowLeft size={16} />
          {bi("Story shelf", "رف القصص")}
        </button>
        <span>
          {bi(
            `Page ${page + 1} of ${story.pages.length}`,
            `الصفحة ${page + 1} من ${story.pages.length}`,
          )}
        </span>
        <button
          className="button"
          onClick={() => {
            setPage(0);
            setChoices({});
            finish(false);
          }}
        >
          <RotateCcw size={16} />
          {bi("Start again", "ابدأ من جديد")}
        </button>
      </div>
      <h2 ref={pageHeading} tabIndex={-1}>
        {pair(story.title)}
      </h2>
      <div className="story-spread">
        <div className="story-illustration">
          <NatureArt scene={story.scene} />
          <img
            src={`/story-art/${story.character}.png`}
            alt={bi("Your story companion", "رفيق قصتك")}
          />
          <span className="illustration-caption">{pair(story.subtitle)}</span>
        </div>
        <div className="story-page">
          <div
            className="page-dots"
            aria-label={bi("Story progress", "تقدّم القصة")}
          >
            {story.pages.map((_, i) => (
              <span
                className={i === page ? "current" : i < page ? "read" : ""}
                key={i}
              />
            ))}
          </div>
          <p className="read-aloud" key={page}>
            {pair(p.text)}
          </p>
          <fieldset className="story-choice">
            <legend>{pair(p.prompt)}</legend>
            <div className="options">
              {p.choices.map((c, i) => (
                <button
                  className={`option ${choice === i ? "selected" : ""}`}
                  aria-pressed={choice === i}
                  key={i}
                  onClick={() => setChoices({ ...choices, [page]: i })}
                >
                  {pair(c)}
                  {choice === i && <Star size={17} />}
                </button>
              ))}
            </div>
            <p className="choice-reply" role="status">
              {choice !== undefined
                ? pair(p.replies[choice])
                : bi(
                    "Choose an idea, or just keep reading.",
                    "اختر فكرة، أو واصل القراءة فقط.",
                  )}
            </p>
          </fieldset>
        </div>
      </div>
      <div className="reader-bar">
        <button
          className="button"
          disabled={page === 0}
          onClick={() => {
            setPage(page - 1);
            finish(false);
          }}
        >
          <ArrowLeft size={16} />
          {bi("Previous page", "الصفحة السابقة")}
        </button>
        <button
          className="button primary"
          onClick={() =>
            page < story.pages.length - 1 ? setPage(page + 1) : finish(true)
          }
        >
          {page < story.pages.length - 1
            ? bi("Turn the page", "اقلب الصفحة")
            : bi("The end", "النهاية")}
          <ArrowRight size={16} />
        </button>
      </div>
      {finished && (
        <div className="story-end" role="status">
          <Sparkles />
          <h3>
            {bi(
              "A lovely little adventure, together.",
              "مغامرة صغيرة جميلة، معًا.",
            )}
          </h3>
          <p>
            {bi(
              "What was your favourite part? Tell your grown-up, draw it, or keep it in your imagination.",
              "ما الجزء المفضّل لديك؟ أخبر مرافقك أو ارسمه أو احتفظ به في خيالك.",
            )}
          </p>
          <button className="button primary" onClick={back}>
            {bi("Choose another story", "اختر قصة أخرى")}
          </button>
        </div>
      )}
    </article>
  );
}
const sensePrompts: Pair[] = [
  [
    "Find a colour you like. You can point, say its name, or imagine it.",
    "ابحث عن لون تحبه. يمكنك الإشارة إليه أو ذكر اسمه أو تخيّله.",
  ],
  [
    "Notice one sound, or imagine a gentle sound you enjoy.",
    "لاحظ صوتًا واحدًا، أو تخيّل صوتًا لطيفًا تحبه.",
  ],
  [
    "Notice something comfortable: a sleeve, a cushion, or your feet resting.",
    "لاحظ شيئًا مريحًا: كمّك أو وسادة أو قدميك المستريحتين.",
  ],
  [
    "Think of someone who helps you feel welcome.",
    "فكّر في شخص يجعلك تشعر بالترحيب.",
  ],
];
export function QuietPlay() {
  const { activity = "breathing" } = useParams();
  return <QuietActivity key={activity} activity={activity} />;
}
function QuietActivity({ activity }: { activity: string }) {
  useTranslation();
  const [playing, setPlaying] = useState(false);
  const [colour, setColour] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const [prompt, setPrompt] = useState(0);
  const [cloud, setCloud] = useState(0);
  const flat = useApp((s) => s.flat);
  const reduced = flat;
  const title =
    activity === "coast"
      ? bi("A pocket-sized seaside", "شاطئ بحجم الجيب")
      : activity === "ground"
        ? bi("Grow a little kindness garden", "ازرع حديقة لطف صغيرة")
        : bi("The sleepy flower", "الزهرة النعسانة");
  useEffect(() => {
    const hide = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  const colours = ["#d69c91", "#acb7d7", "#e2bc71"];
  const symbols = ["✦", "❋", "✿", "✧", "❀", "✦"];
  return (
    <section className="quiet-play">
      <span className="eyebrow">
        {bi("A LITTLE ROOM TO JUST BE", "مساحة صغيرة لتكون على راحتك")}
      </span>
      <h1>{title}</h1>
      <p className="quiet-intro">
        {activity === "coast"
          ? bi(
              "Find a shell, change a cloud, and stay as long as you like.",
              "اعثر على صدفة وغيّر غيمة وابقَ كما تحب.",
            )
          : activity === "ground"
            ? bi(
                "Notice something around you, then tap a patch to grow a flower. You can imagine instead, too.",
                "لاحظ شيئًا حولك، ثم المس بقعة لتنمو زهرة. يمكنك الاكتفاء بالتخيّل أيضًا.",
              )
            : bi(
                "Watch the petals open and settle. Breathe in your own comfortable way; there is no need to follow the flower.",
                "شاهد البتلات تتفتح وتهدأ. تنفّس بالطريقة المريحة لك، ولا حاجة لمتابعة إيقاع الزهرة.",
              )}
      </p>
      <div
        className={`quiet-world ${activity} ${playing && !reduced ? "is-playing" : ""}`}
      >
        <NatureArt scene={activity === "ground" ? "garden" : "coast"} />
        {activity === "breathing" ? (
          <div className="flower-space">
            <div
              className="breathing-flower"
              style={{ "--petal": colours[colour] } as CSSProperties}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <i
                  style={{
                    transform: `rotate(${i * 60}deg) translateY(-40px)`,
                  }}
                  key={i}
                />
              ))}
              <span>
                <svg
                  className="flower-face"
                  viewBox="0 0 60 60"
                  aria-hidden="true"
                >
                  <path
                    d="M13 25q5 5 10 0m14 0q5 5 10 0M23 38q7 6 14 0"
                    fill="none"
                    stroke="#75603d"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="14" cy="34" r="4" fill="#e9b39a" />
                  <circle cx="46" cy="34" r="4" fill="#e9b39a" />
                </svg>
              </span>
            </div>
            <p>
              {playing
                ? bi(
                    "Open… and settle. Your own pace is welcome.",
                    "تفتّح… وهدوء. على راحتك.",
                  )
                : bi(
                    "A quiet little flower, waiting with you.",
                    "زهرة صغيرة هادئة تنتظر معك.",
                  )}
            </p>
          </div>
        ) : activity === "coast" ? (
          <>
            <button
              className="cloud-play"
              onClick={() => setCloud((cloud + 1) % 3)}
              aria-label={bi("Change the cloud shape", "غيّر شكل الغيمة")}
            >
              <span aria-hidden="true">{["☁", "🐑", "🐢"][cloud]}</span>
              <small>{bi("Tap to imagine", "المس لتتخيّل")}</small>
            </button>
            <div className="shell-beach">
              {symbols.map((symbol, i) => (
                <button
                  className={`shell ${found.includes(i) ? "collected" : ""}`}
                  key={i}
                  disabled={found.includes(i)}
                  aria-label={bi(
                    `Collect shell ${i + 1}`,
                    `اجمع الصدفة ${i + 1}`,
                  )}
                  onClick={() => setFound([...found, i])}
                >
                  <span aria-hidden="true">{symbol}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="garden-patches">
            {symbols.map((_, i) => (
              <button
                key={i}
                aria-pressed={found.includes(i)}
                aria-label={bi(
                  `${found.includes(i) ? "Flower" : "Plant a flower"} ${i + 1}`,
                  `${found.includes(i) ? "زهرة" : "ازرع زهرة"} ${i + 1}`,
                )}
                onClick={() =>
                  setFound(found.includes(i) ? found : [...found, i])
                }
              >
                <span aria-hidden="true">{found.includes(i) ? "✿" : "+"}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {activity === "breathing" ? (
        <>
          <div className="quiet-controls">
            <button
              className="button primary"
              onClick={() => setPlaying(!playing)}
            >
              {playing
                ? bi("Pause the flower", "أوقف الزهرة مؤقتًا")
                : bi("Wake the flower", "أيقظ الزهرة")}
            </button>
            <fieldset>
              <legend>{bi("Choose a petal colour", "اختر لون البتلات")}</legend>
              {colours.map((c, i) => (
                <button
                  key={c}
                  className="colour-dot"
                  style={{ background: c }}
                  aria-label={pair(
                    [
                      ["Peach", "خوخي"],
                      ["Lavender", "بنفسجي"],
                      ["Honey", "عسلي"],
                    ][i] as Pair,
                  )}
                  aria-pressed={colour === i}
                  onClick={() => setColour(i)}
                >
                  {colour === i && <Check size={18} />}
                </button>
              ))}
            </fieldset>
          </div>
          {reduced && (
            <p className="meta">
              {bi(
                "Still view is on. The flower stays still.",
                "العرض الثابت مفعّل. تبقى الزهرة ساكنة.",
              )}
            </p>
          )}
        </>
      ) : activity === "coast" ? (
        <div className="shell-tray">
          <span>{bi("Your little collection", "مجموعتك الصغيرة")}</span>
          <div aria-hidden="true">
            {found.map((i) => (
              <span key={i}>{symbols[i]}</span>
            ))}
          </div>
          <p role="status">
            {found.length === 6
              ? bi(
                  "All six shells are here. Shall we leave them for the next explorer?",
                  "هنا الأصداف الستة. هل نتركها للمستكشف القادم؟",
                )
              : bi(
                  `${found.length} of 6 shells found. There is no hurry.`,
                  `وجدت ${found.length} من ٦ أصداف. لا داعي للعجلة.`,
                )}
          </p>
        </div>
      ) : (
        <div className="sense-prompt">
          <Leaf size={23} />
          <p>{pair(sensePrompts[prompt])}</p>
          <button
            className="button"
            onClick={() => setPrompt((prompt + 1) % sensePrompts.length)}
          >
            {bi("Another gentle idea", "فكرة لطيفة أخرى")}{" "}
            <ArrowRight size={16} />
          </button>
          <span role="status">
            {found.length
              ? bi(
                  found.length === 1
                    ? "One flower in your little garden."
                    : `${found.length} flowers in your little garden.`,
                  `عدد الزهور في حديقتك الصغيرة: ${found.length}.`,
                )
              : bi(
                  "Every garden begins with a little patch.",
                  "تبدأ كل حديقة ببقعة صغيرة.",
                )}
          </span>
        </div>
      )}
      <div className="reader-bar">
        <Link className="button" to="/calm">
          <ArrowLeft size={16} />
          {bi("Quiet moments", "لحظات هادئة")}
        </Link>
        <button
          className="button"
          onClick={() => {
            setFound([]);
            setPrompt(0);
            setCloud(0);
            setPlaying(false);
          }}
        >
          <RotateCcw size={16} />
          {bi("Start fresh", "نبدأ من جديد")}
        </button>
      </div>
      <p className="meta">
        {bi(
          "No sound starts automatically. You can pause, leave, or ask your grown-up to join you anytime.",
          "لا يبدأ أي صوت تلقائيًا. يمكنك التوقف أو المغادرة أو طلب مشاركة مرافقك متى شئت.",
        )}
      </p>
    </section>
  );
}
export function QuietWelcome() {
  return (
    <div className="quiet-welcome">
      <div>
        <span className="eyebrow">
          {bi("SOFT LITTLE ADVENTURES", "مغامرات صغيرة هادئة")}
        </span>
        <h2>{bi("Less hurry. More wonder.", "عجلة أقل. دهشة أكثر.")}</h2>
        <p>
          {bi(
            "A flower to watch, a beach to explore, a garden to grow. Choose whatever feels good today.",
            "زهرة نشاهدها وشاطئ نستكشفه وحديقة نزرعها. اختر ما يناسبك اليوم.",
          )}
        </p>
      </div>
      <Wind size={62} strokeWidth={1} />
    </div>
  );
}
