import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Volume2,
  VolumeX,
  Pause,
  Play,
} from "lucide-react";
import { bi } from "./i18n";
import {
  memoryDeck,
  mazes,
  mazeMove,
  mazeStars,
  traceProgress,
} from "./gameLogic";
import "./arcade.css";
const icons = ["🐢", "🐚", "🐟", "🦋", "🌻", "⛵", "🐑", "🌙"];
const names = [
  ["Turtle", "سلحفاة"],
  ["Shell", "صدفة"],
  ["Fish", "سمكة"],
  ["Butterfly", "فراشة"],
  ["Flower", "زهرة"],
  ["Boat", "قارب"],
  ["Sheep", "خروف"],
  ["Moon", "قمر"],
];
const games = [
  {
    id: "memory",
    icon: "🐢",
    name: ["Ocean pairs", "أزواج المحيط"],
    description: [
      "Flip, remember, match! Three boards to master.",
      "اقلب وتذكّر وطابق! ثلاث لوحات لاكتشافها.",
    ],
    meta: ["Memory · 3 levels", "ذاكرة · ٣ مستويات"],
    colour: "ocean",
  },
  {
    id: "trail",
    icon: "🐑",
    name: ["Wanees’ star trail", "طريق نجوم ونيس"],
    description: [
      "Find the stars and guide Wanees home.",
      "اعثر على النجوم وأوصل ونيس إلى البيت.",
    ],
    meta: ["Maze · 3 adventures", "متاهة · ٣ مغامرات"],
    colour: "peach",
  },
  {
    id: "sky",
    icon: "✨",
    name: ["Star painter", "رسّام النجوم"],
    description: [
      "Connect a secret picture in the night sky.",
      "صِل النجوم واكتشف صورة في السماء.",
    ],
    meta: ["Discovery · 4 pictures", "اكتشاف · ٤ صور"],
    colour: "night",
  },
  {
    id: "reef",
    icon: "🐠",
    name: ["My tiny ocean", "محيطي الصغير"],
    description: [
      "Build an underwater world and play with your fish.",
      "اصنع عالمًا تحت الماء والعب مع أسماكك.",
    ],
    meta: ["Create · Free play", "إبداع · لعب حر"],
    colour: "ocean",
  },
  {
    id: "music",
    icon: "🎵",
    name: ["Rainbow echoes", "أصداء قوس قزح"],
    description: [
      "Follow the glowing notes, or make your own tune.",
      "اتبع النغمات المضيئة أو اصنع لحنك.",
    ],
    meta: ["Music · Listen or watch", "موسيقى · استمع أو شاهد"],
    colour: "lavender",
  },
];
function label(p: string[]) {
  return bi(p[0], p[1]);
}
export function ArcadeShelf({ quiet = false }: { quiet?: boolean }) {
  useTranslation();
  return (
    <section className="arcade-shelf">
      <div className="arcade-banner">
        <div>
          <span className="eyebrow">
            {quiet
              ? bi("PLAY AT YOUR OWN PACE", "العب على راحتك")
              : bi("READY FOR A LITTLE ADVENTURE?", "مستعد لمغامرة صغيرة؟")}
          </span>
          <h2>
            {quiet
              ? bi("Little worlds to get lost in.", "عوالم صغيرة نسرح فيها.")
              : bi(
                  "One more discovery. One more smile.",
                  "اكتشاف جديد. ابتسامة جديدة.",
                )}
          </h2>
          <p>
            {quiet
              ? bi(
                  "Paint with stars, make music, or build a tiny ocean. No countdowns. No losing.",
                  "ارسم بالنجوم واصنع الموسيقى أو ابنِ محيطًا صغيرًا. بلا عدّ تنازلي ولا خسارة.",
                )
              : bi(
                  "Real little games to puzzle, explore and create. Choose your next adventure.",
                  "ألعاب صغيرة للتفكير والاستكشاف والإبداع. اختر مغامرتك القادمة.",
                )}
          </p>
        </div>
        <img src="/story-art/wanees.png" alt="" />
      </div>
      <div className="arcade-cards">
        {games
          .filter((g) =>
            quiet
              ? ["sky", "reef", "music"].includes(g.id)
              : ["memory", "trail"].includes(g.id),
          )
          .map((g) => (
            <Link
              className={`arcade-card ${g.colour}`}
              key={g.id}
              to={`${quiet ? "/calm" : "/explore/games"}/${g.id}`}
            >
              <div className={`arcade-cover ${g.id}`} aria-hidden="true">
                <span className="game-hero-icon">{g.icon}</span>
                <span className="mini-spark s1">✦</span>
                <span className="mini-spark s2">✧</span>
                <span className="mini-spark s3">✦</span>
                {g.id === "memory" && (
                  <div className="mini-cards">
                    🐢 <span>?</span> 🐢
                  </div>
                )}
                {g.id === "trail" && (
                  <div className="mini-trail">· · ★ · · ⌂</div>
                )}
                {g.id === "music" && (
                  <div className="mini-keys">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                )}
              </div>
              <div className="arcade-card-copy">
                <span className="meta">{label(g.meta)}</span>
                <h3>{label(g.name)}</h3>
                <p>{label(g.description)}</p>
                <span className="arcade-go">
                  {bi("Let’s play", "هيا نلعب")} <ArrowRight size={17} />
                </span>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
function Frame({
  id,
  children,
  quiet = false,
}: {
  id: string;
  children: React.ReactNode;
  quiet?: boolean;
}) {
  useTranslation();
  const g = games.find((g) => g.id === id)!;
  return (
    <section className={`arcade-game ${g.colour}`}>
      <Link className="game-back" to={quiet ? "/calm" : "/explore/games"}>
        <ArrowLeft size={16} />
        {bi("All games", "كل الألعاب")}
      </Link>
      <div className="game-heading">
        <div>
          <span className="eyebrow">{label(g.meta)}</span>
          <h1>{label(g.name)}</h1>
        </div>
        <span aria-hidden="true">{g.icon}</span>
      </div>
      {children}
    </section>
  );
}
function Win({
  title,
  children,
  onNext,
  next,
}: {
  title: string;
  children: React.ReactNode;
  onNext: () => void;
  next: string;
}) {
  return (
    <div className="game-win" role="status">
      <div className="win-stars" aria-hidden="true">
        ✦ ★ ✦
      </div>
      <h2>{title}</h2>
      <p>{children}</p>
      <button className="button primary" onClick={onNext}>
        {next}
        <ArrowRight size={17} />
      </button>
    </div>
  );
}
export function MemoryGame() {
  useTranslation();
  const [level, setLevel] = useState(0);
  const [round, setRound] = useState(0);
  return (
    <Frame id="memory">
      <MemoryBoard
        key={`${level}-${round}`}
        level={level}
        onLevel={setLevel}
        again={() => setRound(round + 1)}
      />
    </Frame>
  );
}
function MemoryBoard({
  level,
  onLevel,
  again,
}: {
  level: number;
  onLevel: (n: number) => void;
  again: () => void;
}) {
  const pairs = [3, 6, 8][level];
  const [deck] = useState(() => memoryDeck(pairs));
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);
  const [paused, pause] = useState(false);
  const [peek, setPeek] = useState(false);
  const complete = matched.length === pairs;
  const mismatch =
    open.length === 2 && deck[open[0]].pair !== deck[open[1]].pair;
  useEffect(() => {
    if (!mismatch || paused) return;
    const timer = setTimeout(() => setOpen([]), 1100);
    return () => clearTimeout(timer);
  }, [mismatch, paused]);
  function flip(index: number) {
    if (
      paused ||
      peek ||
      open.length === 2 ||
      open.includes(index) ||
      matched.includes(deck[index].pair)
    )
      return;
    const next = [...open, index];
    setOpen(next);
    if (next.length === 2) {
      setTurns(turns + 1);
      if (deck[next[0]].pair === deck[next[1]].pair) {
        setMatched([...matched, deck[index].pair]);
        setOpen([]);
      }
    }
  }
  return (
    <>
      <p className="game-instructions">
        {bi(
          "Find two pictures that belong together. Tap a card to turn it over.",
          "اعثر على صورتين متطابقتين. المس بطاقة لتقلبها.",
        )}
      </p>
      <div
        className="game-levels"
        aria-label={bi("Choose a board", "اختر لوحة")}
      >
        {[3, 6, 8].map((n, i) => (
          <button
            className={level === i ? "selected" : ""}
            aria-pressed={level === i}
            key={n}
            onClick={() => onLevel(i)}
          >
            {bi(`${n} pairs`, `${n} أزواج`)}
          </button>
        ))}
      </div>
      <div className="game-hud">
        <span>
          ✦ {matched.length} / {pairs} {bi("pairs", "أزواج")}
        </span>
        <span>{bi(`${turns} turns`, `${turns} محاولات`)}</span>
        <button onClick={() => pause(!paused)} className="button">
          {paused ? <Play size={15} /> : <Pause size={15} />}{" "}
          {paused ? bi("Resume", "متابعة") : bi("Pause", "إيقاف مؤقت")}
        </button>
      </div>
      <div
        className={`memory-board size-${pairs} ${paused ? "board-paused" : ""}`}
        aria-label={bi("Matching cards", "بطاقات المطابقة")}
      >
        {deck.map((card, i) => {
          const showing =
            peek || open.includes(i) || matched.includes(card.pair);
          return (
            <button
              key={card.id}
              className={`memory-card ${showing && !paused ? "flipped" : ""} ${matched.includes(card.pair) ? "matched" : ""}`}
              disabled={paused || matched.includes(card.pair)}
              aria-label={
                paused
                  ? bi(`Card ${i + 1}`, `البطاقة ${i + 1}`)
                  : showing
                    ? `${label(names[card.pair])}${matched.includes(card.pair) ? bi(" · matched", " · متطابقة") : ""}`
                    : bi(`Turn over card ${i + 1}`, `اقلب البطاقة ${i + 1}`)
              }
              aria-pressed={showing && !paused}
              onClick={() => flip(i)}
            >
              <span className="card-back" aria-hidden="true">
                ✦
              </span>
              <span className="card-front" aria-hidden="true">
                {icons[card.pair]}
              </span>
            </button>
          );
        })}
      </div>
      {complete ? (
        <Win
          title={bi("A sea of lovely matches!", "بحر من الأزواج الجميلة!")}
          next={
            level < 2
              ? bi("Try the next board", "جرّب اللوحة التالية")
              : bi("Play a fresh board", "العب لوحة جديدة")
          }
          onNext={() => (level < 2 ? onLevel(level + 1) : again())}
        >
          {bi(
            "You remembered, explored and found them all.",
            "تذكّرت واستكشفت ووجدتها كلها.",
          )}
        </Win>
      ) : (
        <div className="game-tools">
          <button
            className="button"
            disabled={paused || open.length > 0}
            onClick={() => setPeek(!peek)}
          >
            {peek
              ? bi("Hide pictures & play", "أخفِ الصور والعب")
              : bi("Take a little peek", "ألقِ نظرة صغيرة")}
          </button>
          <p role="status">
            {paused
              ? bi(
                  "Your ocean is resting. Resume when you like.",
                  "محيطك يستريح. تابع متى شئت.",
                )
              : mismatch
                ? bi(
                    "Different pictures! Remember their places.",
                    "صورتان مختلفتان! تذكّر مكانهما.",
                  )
                : peek
                  ? bi(
                      "Look as long as you like, then hide the pictures.",
                      "انظر كما تحب، ثم أخفِ الصور.",
                    )
                  : bi("Every turn is a new clue.", "كل محاولة دليل جديد.")}
          </p>
        </div>
      )}
      <button className="button" onClick={again}>
        <RotateCcw size={16} />
        {bi("Shuffle & restart", "اخلط وابدأ من جديد")}
      </button>
    </>
  );
}
export function TrailGame() {
  useTranslation();
  const [level, setLevel] = useState(0);
  const [round, setRound] = useState(0);
  return (
    <Frame id="trail">
      <TrailBoard
        key={`${level}-${round}`}
        level={level}
        onLevel={setLevel}
        again={() => setRound(round + 1)}
      />
    </Frame>
  );
}
function TrailBoard({
  level,
  onLevel,
  again,
}: {
  level: number;
  onLevel: (n: number) => void;
  again: () => void;
}) {
  const board = mazes[level],
    w = board[0].length,
    stars = mazeStars(board);
  const [position, setPosition] = useState(0);
  const [collected, collect] = useState<number[]>([]);
  const [trail, setTrail] = useState<number[]>([0]);
  const [hint, setHint] = useState(false);
  const [message, setMessage] = useState("");
  const complete =
    position === w * board.length - 1 && collected.length === stars.length;
  function move(dx: number, dy: number) {
    if (complete) return;
    const next = mazeMove(board, position, dx, dy);
    if (next === position) {
      setMessage(
        bi("A hedge! Try another direction.", "سياج! جرّب اتجاهًا آخر."),
      );
      return;
    }
    setPosition(next);
    setTrail([...new Set([...trail, next])]);
    if (stars.includes(next) && !collected.includes(next)) {
      collect([...collected, next]);
      setMessage(bi("A star for your little journey!", "نجمة لرحلتك الصغيرة!"));
    } else if (next === w * board.length - 1 && collected.length < stars.length)
      setMessage(
        bi(
          "Let’s find the other stars before heading home.",
          "لنجد النجوم الأخرى قبل العودة للبيت.",
        ),
      );
    else setMessage("");
  }
  const directions: [[number, number], typeof ArrowUp, string][] = [
    [[0, -1], ArrowUp, bi("Up", "أعلى")],
    [[-1, 0], ArrowLeft, bi("Left", "يسار")],
    [[0, 1], ArrowDown, bi("Down", "أسفل")],
    [[1, 0], ArrowRight, bi("Right", "يمين")],
  ];
  return (
    <>
      <p className="game-instructions">
        {bi(
          "Collect every star, then find the little house. Use the arrows, your keyboard, or tap a neighbouring square.",
          "اجمع كل النجوم، ثم اعثر على البيت الصغير. استخدم الأسهم أو لوحة المفاتيح أو المس مربعًا مجاورًا.",
        )}
      </p>
      <div className="game-levels">
        {mazes.map((_, i) => (
          <button
            key={i}
            className={level === i ? "selected" : ""}
            aria-pressed={level === i}
            onClick={() => onLevel(i)}
          >
            {bi(`Trail ${i + 1}`, `الطريق ${i + 1}`)}
          </button>
        ))}
      </div>
      <div className="game-hud">
        <span>
          ★ {collected.length} / {stars.length}
        </span>
        <button
          className="button"
          aria-pressed={hint}
          onClick={() => setHint(!hint)}
        >
          {hint
            ? bi("Hide footsteps", "أخفِ الآثار")
            : bi("Show my footsteps", "أظهر آثاري")}
        </button>
      </div>
      <div
        className="maze-board"
        style={{ "--cols": w } as CSSProperties}
        role="group"
        aria-label={bi(
          "Wanees maze. Arrow keys move.",
          "متاهة ونيس. تحرّك بمفاتيح الأسهم.",
        )}
        tabIndex={0}
        onKeyDown={(e) => {
          const d = (
            {
              ArrowUp: [0, -1],
              ArrowDown: [0, 1],
              ArrowLeft: [-1, 0],
              ArrowRight: [1, 0],
            } as Record<string, number[]>
          )[e.key];
          if (d) {
            e.preventDefault();
            move(d[0], d[1]);
          }
        }}
      >
        {board
          .join("")
          .split("")
          .map((cell, i) => {
            const dx = (i % w) - (position % w),
              dy = Math.floor(i / w) - Math.floor(position / w);
            const adjacent = Math.abs(dx) + Math.abs(dy) === 1;
            return (
              <button
                key={i}
                tabIndex={-1}
                disabled={cell === "#" || !adjacent || complete}
                className={`maze-cell ${cell === "#" ? "hedge" : ""} ${i === position ? "player" : ""} ${hint && trail.includes(i) ? "footstep" : ""}`}
                aria-label={
                  i === position
                    ? bi("Wanees", "ونيس")
                    : cell === "G"
                      ? bi("Home", "البيت")
                      : cell === "*" && !collected.includes(i)
                        ? bi("Star", "نجمة")
                        : bi("Path", "طريق")
                }
                onClick={() => move(dx, dy)}
              >
                {i === position ? (
                  <img src="/story-art/wanees.png" alt="" />
                ) : cell === "#" ? (
                  <span aria-hidden="true">✿</span>
                ) : cell === "G" ? (
                  "🏡"
                ) : cell === "*" && !collected.includes(i) ? (
                  "⭐"
                ) : hint && trail.includes(i) ? (
                  "·"
                ) : (
                  ""
                )}
              </button>
            );
          })}
      </div>
      <div className="direction-pad" dir="ltr">
        {directions.map(([d, Icon, text], i) => (
          <button
            key={text}
            className={`direction d${i}`}
            aria-label={text}
            disabled={complete}
            onClick={() => move(...d)}
          >
            <Icon />
          </button>
        ))}
      </div>
      <p className="game-feedback" role="status">
        {message ||
          bi(
            "A little detour is part of the adventure.",
            "الطريق الأطول جزء من المغامرة.",
          )}
      </p>
      {complete && (
        <Win
          title={bi(
            "Home with a pocketful of stars!",
            "وصلت وجيبك مليء بالنجوم!",
          )}
          next={
            level < 2
              ? bi("Explore the next trail", "استكشف الطريق التالي")
              : bi("Explore again", "استكشف مجددًا")
          }
          onNext={() => (level < 2 ? onLevel(level + 1) : again())}
        >
          {bi(
            "Wanees found a way, one small step at a time.",
            "وجد ونيس الطريق، خطوة صغيرة كل مرة.",
          )}
        </Win>
      )}
      <button className="button" onClick={again}>
        <RotateCcw size={16} />
        {bi("Start this trail again", "ابدأ هذا الطريق مجددًا")}
      </button>
    </>
  );
}
const constellations = [
  {
    name: ["A little sailing boat", "قارب صغير"],
    points: [
      [20, 65],
      [50, 65],
      [50, 18],
      [23, 58],
      [76, 58],
      [66, 79],
      [30, 79],
      [20, 65],
    ],
  },
  {
    name: ["A star for you", "نجمة لك"],
    points: [
      [50, 13],
      [60, 39],
      [85, 40],
      [66, 57],
      [72, 85],
      [50, 69],
      [28, 85],
      [34, 57],
      [15, 40],
      [40, 39],
      [50, 13],
    ],
  },
  {
    name: ["A little mountain home", "بيت قرب الجبل"],
    points: [
      [20, 46],
      [50, 17],
      [80, 46],
      [73, 46],
      [73, 81],
      [28, 81],
      [28, 46],
      [20, 46],
    ],
  },
  {
    name: ["A friendly fish", "سمكة لطيفة"],
    points: [
      [18, 50],
      [43, 25],
      [72, 42],
      [88, 24],
      [88, 77],
      [72, 59],
      [43, 80],
      [18, 50],
    ],
  },
];
export function StarGame({ quiet = false }: { quiet?: boolean }) {
  useTranslation();
  const [stage, setStage] = useState(0);
  const [at, setAt] = useState(-1);
  const [colour, setColour] = useState(0);
  const [hint, setHint] = useState(false);
  const drawing = constellations[stage],
    done = at === drawing.points.length - 1;
  const colours = ["#ffe8a8", "#f2b8d2", "#b4e6ec"];
  return (
    <Frame id="sky" quiet={quiet}>
      <p className="game-instructions">
        {bi(
          "Tap the glowing stars in number order. What picture is hiding in the sky?",
          "المس النجوم المضيئة حسب ترتيب الأرقام. أي صورة تختبئ في السماء؟",
        )}
      </p>
      <div className="game-hud">
        <span>
          {bi(`Picture ${stage + 1} of 4`, `الصورة ${stage + 1} من ٤`)}
        </span>
        <button
          className="button"
          aria-pressed={hint}
          onClick={() => setHint(!hint)}
        >
          {bi("Show a little hint", "أظهر تلميحًا صغيرًا")}
        </button>
      </div>
      <div
        className="star-board"
        style={{ "--star": colours[colour] } as CSSProperties}
      >
        <div className="sky-dots" aria-hidden="true" />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {hint && (
            <polyline
              points={drawing.points.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke="#ffffff22"
              strokeWidth=".7"
              strokeDasharray="2 2"
            />
          )}
          <polyline
            points={drawing.points
              .slice(0, at + 1)
              .map((p) => p.join(","))
              .join(" ")}
            fill="none"
            stroke={colours[colour]}
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {drawing.points.map(([x, y], i) => (
          <button
            key={i}
            disabled={i !== at + 1}
            className={`connect-star ${i <= at ? "lit" : ""} ${i === at + 1 ? "next" : ""}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={bi(`Star ${i + 1}`, `النجمة ${i + 1}`)}
            onClick={() => setAt(traceProgress(at, i))}
          >
            {i <= at ? "✦" : i + 1}
          </button>
        ))}
        {done && (
          <span className="constellation-title">{label(drawing.name)}</span>
        )}
      </div>
      <div className="game-tools">
        <fieldset className="star-palette">
          <legend>{bi("Your starlight colour", "لون ضوء نجومك")}</legend>
          {colours.map((c, i) => (
            <button
              style={{ background: c }}
              key={c}
              aria-pressed={colour === i}
              aria-label={label(
                [
                  ["Gold", "ذهبي"],
                  ["Rose", "وردي"],
                  ["Ice blue", "أزرق فاتح"],
                ][i],
              )}
              onClick={() => setColour(i)}
            >
              {colour === i ? "✓" : ""}
            </button>
          ))}
        </fieldset>
        <span role="status">
          {done
            ? label(drawing.name)
            : bi(`Next: star ${at + 2}`, `التالي: النجمة ${at + 2}`)}
        </span>
      </div>
      {done && (
        <Win
          title={bi("You painted the night sky.", "رسمت السماء ليلًا.")}
          next={bi("Another secret picture", "صورة سرية أخرى")}
          onNext={() => {
            setStage((stage + 1) % 4);
            setAt(-1);
          }}
        >
          {label(drawing.name)}
        </Win>
      )}
      <button className="button" onClick={() => setAt(-1)}>
        <RotateCcw size={16} />
        {bi("Draw this one again", "ارسم هذه مجددًا")}
      </button>
    </Frame>
  );
}
const reefPieces = [
  ["🐠", "Fish", "سمكة"],
  ["🐢", "Turtle", "سلحفاة"],
  ["🪸", "Coral", "مرجان"],
  ["🐚", "Shell", "صدفة"],
  ["🌿", "Sea plant", "نبتة بحرية"],
  ["⭐", "Sea star", "نجم البحر"],
];
type ReefItem = { id: number; kind: number; x: number; y: number };
export function ReefGame({ quiet = false }: { quiet?: boolean }) {
  useTranslation();
  const [items, setItems] = useState<ReefItem[]>(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("wanees-tiny-ocean") || "[]",
      );
      if (!Array.isArray(saved)) return [];
      const ids = new Set<number>();
      return saved
        .filter((x: ReefItem) => {
          if (
            !x ||
            !Number.isInteger(x.id) ||
            x.id < 1 ||
            ids.has(x.id) ||
            !Number.isInteger(x.kind) ||
            x.kind < 0 ||
            x.kind > 5 ||
            !Number.isFinite(x.x) ||
            x.x < 7 ||
            x.x > 93 ||
            !Number.isFinite(x.y) ||
            x.y < 14 ||
            x.y > 86
          )
            return false;
          ids.add(x.id);
          return true;
        })
        .slice(0, 18);
    } catch {
      return [];
    }
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      sessionStorage.setItem("wanees-tiny-ocean", JSON.stringify(items));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [items]);
  const [brush, setBrush] = useState(0);
  const [paused, pause] = useState(false);
  const [night, setNight] = useState(false);
  const [bubbles, setBubbles] = useState(false);
  const [selected, select] = useState<number | null>(null);
  const serial = useRef(Math.max(0, ...items.map((i) => i.id)));
  const selectedItem = items.find((i) => i.id === selected);
  function add(x: number, y: number) {
    if (items.length >= 18) return;
    const id = ++serial.current;
    setItems([
      ...items,
      {
        id,
        kind: brush,
        x: Math.max(7, Math.min(93, x)),
        y: Math.max(14, Math.min(86, y)),
      },
    ]);
    select(id);
  }
  function adjust(dx: number, dy: number) {
    setItems(
      items.map((item) =>
        item.id === selected
          ? {
              ...item,
              x: Math.max(7, Math.min(93, item.x + dx)),
              y: Math.max(14, Math.min(86, item.y + dy)),
            }
          : item,
      ),
    );
  }
  return (
    <Frame id="reef" quiet={quiet}>
      <p className="game-instructions">
        {bi(
          "Choose a sea friend, then tap an empty spot to add it. Select a friend to move it. Make the ocean your own.",
          "اختر صديقًا بحريًا، ثم المس مكانًا فارغًا لإضافته. اختر صديقًا لتحرّكه. اصنع محيطك كما تحب.",
        )}
      </p>
      <div
        className="reef-palette"
        aria-label={bi("Ocean pieces", "عناصر المحيط")}
      >
        {reefPieces.map(([icon, en, ar], i) => (
          <button
            className={brush === i ? "selected" : ""}
            key={en}
            aria-pressed={brush === i}
            onClick={() => setBrush(i)}
          >
            <span aria-hidden="true">{icon}</span>
            {bi(en, ar)}
          </button>
        ))}
      </div>
      <div
        className={`reef-world ${night ? "night" : ""} ${paused ? "still" : ""}`}
      >
        <div
          className="reef-place"
          role="button"
          tabIndex={0}
          aria-label={bi(
            "Place selected sea friend in the ocean. Enter places it in the centre.",
            "ضع الصديق البحري في المحيط. مفتاح الإدخال يضعه في المنتصف.",
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              add(50, 50);
            }
          }}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            add(
              ((e.clientX - r.left) / r.width) * 100,
              ((e.clientY - r.top) / r.height) * 100,
            );
          }}
        />
        <div className="reef-sand" aria-hidden="true" />
        {bubbles &&
          Array.from({ length: 8 }, (_, i) => (
            <i
              key={i}
              className="reef-bubble"
              style={{ left: `${8 + i * 12}%`, animationDelay: `${i * 0.7}s` }}
              aria-hidden="true"
            />
          ))}
        {items.map((item) => (
          <button
            key={item.id}
            className={`reef-item ${item.kind < 2 ? "swimmer" : ""} ${selected === item.id ? "selected" : ""}`}
            style={
              {
                left: `${item.x}%`,
                top: `${item.y}%`,
                "--delay": `${(item.id % 5) * -1}s`,
              } as CSSProperties
            }
            aria-label={`${bi(reefPieces[item.kind][1], reefPieces[item.kind][2])} ${item.id}`}
            aria-pressed={selected === item.id}
            onClick={() => select(item.id)}
          >
            <span aria-hidden="true">{reefPieces[item.kind][0]}</span>
          </button>
        ))}
        {!items.length && (
          <span className="reef-empty">
            {bi(
              "Your ocean begins with one little friend.",
              "يبدأ محيطك بصديق صغير.",
            )}
          </span>
        )}
      </div>
      <div className="game-hud">
        <span role="status">
          {bi(
            `${items.length} / 18 ocean friends`,
            `${items.length} / ١٨ صديقًا بحريًا`,
          )}
        </span>
        <button className="button" onClick={() => pause(!paused)}>
          {paused
            ? bi("Let them swim", "دعهم يسبحون")
            : bi("Still water", "ماء ساكن")}
        </button>
        <button
          className="button"
          aria-pressed={night}
          onClick={() => setNight(!night)}
        >
          {night ? bi("Sunrise", "شروق") : bi("Moonlight", "ضوء القمر")}
        </button>
        <button
          className="button"
          aria-pressed={bubbles}
          onClick={() => setBubbles(!bubbles)}
        >
          {bi("Bubbles", "فقاعات")}
        </button>
      </div>
      {selectedItem && (
        <div className="reef-editor">
          <strong>{bi("Move your friend", "حرّك صديقك")}</strong>
          <div dir="ltr">
            {[
              [0, -6],
              [-6, 0],
              [6, 0],
              [0, 6],
            ].map(([x, y], i) => (
              <button
                className="button"
                key={i}
                aria-label={label(
                  [
                    ["Move up", "حرّك لأعلى"],
                    ["Move left", "حرّك لليسار"],
                    ["Move right", "حرّك لليمين"],
                    ["Move down", "حرّك لأسفل"],
                  ][i],
                )}
                onClick={() => adjust(x, y)}
              >
                {["↑", "←", "→", "↓"][i]}
              </button>
            ))}
          </div>
          <button
            className="button"
            onClick={() => {
              setItems(items.filter((i) => i.id !== selected));
              select(null);
            }}
          >
            {bi("Remove this friend", "أزل هذا الصديق")}
          </button>
        </div>
      )}
      <div className="game-tools">
        <button
          className="button"
          disabled={!items.length}
          onClick={() => {
            setItems(items.slice(0, -1));
            select(null);
          }}
        >
          {bi("Undo last addition", "تراجع عن آخر إضافة")}
        </button>
        <button
          className="button"
          onClick={() => {
            setItems([]);
            select(null);
          }}
        >
          <RotateCcw size={16} />
          {bi("A fresh ocean", "محيط جديد")}
        </button>
        <span className="meta">
          {bi(
            saved
              ? "Your ocean is saved in this browser tab. Come back and keep creating."
              : "Your ocean stays here until you leave this activity.",
            saved
              ? "محيطك محفوظ في علامة التبويب هذه. عُد وواصل الإبداع."
              : "يبقى محيطك هنا حتى تغادر النشاط.",
          )}
        </span>
      </div>
    </Frame>
  );
}
const notes = [261.63, 329.63, 392, 523.25];
export function MusicGame({ quiet = false }: { quiet?: boolean }) {
  useTranslation();
  const [mode, setMode] = useState<"free" | "echo">("free");
  const [sound, setSound] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [answer, setAnswer] = useState<number[]>([]);
  const [active, setActive] = useState(-1);
  const [showing, setShowing] = useState(false);
  const [message, setMessage] = useState("");
  const context = useRef<AudioContext | null>(null);
  const soundEnabled = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mounted = useRef(true);
  function cancel() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShowing(false);
    setActive(-1);
  }
  useEffect(() => {
    mounted.current = true;
    const onHide = () => {
      if (document.hidden) {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setShowing(false);
        setActive(-1);
        setSequence([]);
        setAnswer([]);
        void context.current?.suspend();
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      mounted.current = false;
      timers.current.forEach(clearTimeout);
      void context.current?.close();
      context.current = null;
    };
  }, []);
  function tone(i: number) {
    if (!soundEnabled.current) return;
    try {
      const ctx = context.current ?? new AudioContext();
      context.current = ctx;
      void ctx.resume();
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = notes[i];
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.025);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.5);
    } catch {
      soundEnabled.current = false;
      setSound(false);
      setMessage(
        bi(
          "Sound is unavailable. The lights still work.",
          "الصوت غير متاح. ما زالت الأضواء تعمل.",
        ),
      );
    }
  }
  function flash(i: number) {
    setActive(i);
    tone(i);
    timers.current.push(
      setTimeout(() => {
        if (mounted.current) setActive(-1);
      }, 380),
    );
  }
  function demonstrate(seq: number[]) {
    cancel();
    setAnswer([]);
    setShowing(true);
    setMessage(bi("Watch the glowing notes…", "شاهد النغمات المضيئة…"));
    seq.forEach((n, i) =>
      timers.current.push(setTimeout(() => flash(n), i * 750 + 200)),
    );
    timers.current.push(
      setTimeout(
        () => {
          setShowing(false);
          setMessage(
            bi("Your turn. Tap the same colours.", "دورك. المس الألوان نفسها."),
          );
        },
        seq.length * 750 + 250,
      ),
    );
  }
  function start(length = 2) {
    const next = Array.from({ length }, () => Math.floor(Math.random() * 4));
    setSequence(next);
    demonstrate(next);
  }
  function tap(i: number) {
    if (showing) return;
    flash(i);
    if (mode === "free") {
      setMessage(bi("A little tune, made by you.", "لحن صغير من صنعك."));
      return;
    }
    if (!sequence.length) return;
    const next = [...answer, i];
    if (sequence[next.length - 1] !== i) {
      setAnswer([]);
      setMessage(
        bi(
          "A new melody! Watch your pattern again when you’re ready.",
          "لحن جديد! شاهد النمط مجددًا عندما تستعد.",
        ),
      );
      return;
    }
    setAnswer(next);
    if (next.length === sequence.length)
      setMessage(bi("You found the echo!", "وجدت الصدى!"));
    else
      setMessage(
        bi(`${next.length} notes remembered.`, `تذكّرت ${next.length} نغمات.`),
      );
  }
  const won = sequence.length > 0 && answer.length === sequence.length;
  return (
    <Frame id="music" quiet={quiet}>
      <p className="game-instructions">
        {bi(
          "Make a tune in Free play, or remember the lights in Echo play. Sound is optional.",
          "اصنع لحنًا في اللعب الحر، أو تذكّر الأضواء في لعبة الصدى. الصوت اختياري.",
        )}
      </p>
      <div className="game-hud">
        <div className="game-levels">
          {(["free", "echo"] as const).map((m) => (
            <button
              key={m}
              className={mode === m ? "selected" : ""}
              aria-pressed={mode === m}
              onClick={() => {
                cancel();
                setMode(m);
                setSequence([]);
                setAnswer([]);
                setMessage("");
              }}
            >
              {m === "free"
                ? bi("Free play", "لعب حر")
                : bi("Echo play", "لعبة الصدى")}
            </button>
          ))}
        </div>
        <button
          className="button"
          aria-pressed={sound}
          onClick={() => {
            soundEnabled.current = !sound;
            setSound(!sound);
            if (sound) void context.current?.suspend();
          }}
        >
          {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}{" "}
          {sound
            ? bi("Sound on", "الصوت مفعّل")
            : bi("Sound off", "الصوت مغلق")}
        </button>
      </div>
      <div className="music-stage">
        <div className="music-cloud" aria-hidden="true">
          {showing ? "✦" : won ? "♫" : "☁"}
        </div>
        <div className="music-keys">
          {["#e9af9e", "#edce89", "#9cc8b1", "#adbce0"].map((c, i) => (
            <button
              key={c}
              style={{ "--key": c } as CSSProperties}
              className={active === i ? "sounding" : ""}
              disabled={showing || (won && mode === "echo")}
              aria-label={label(
                [
                  ["Peach note", "نغمة خوخية"],
                  ["Gold note", "نغمة ذهبية"],
                  ["Mint note", "نغمة نعناعية"],
                  ["Blue note", "نغمة زرقاء"],
                ][i],
              )}
              onClick={() => tap(i)}
            >
              <span aria-hidden="true">{["●", "◆", "✿", "★"][i]}</span>
            </button>
          ))}
        </div>
        <p role="status">
          {message ||
            bi(
              "Four colours. So many little melodies.",
              "أربعة ألوان. ألحان صغيرة كثيرة.",
            )}
        </p>
      </div>
      {mode === "echo" && (
        <div className="game-tools">
          <button
            className="button primary"
            disabled={showing}
            onClick={() => start(won ? Math.min(sequence.length + 1, 6) : 2)}
          >
            {won
              ? bi("Try a longer melody", "جرّب لحنًا أطول")
              : bi("Start an echo", "ابدأ صدى")}
          </button>
          {sequence.length > 0 && (
            <button
              className="button"
              disabled={showing}
              onClick={() => demonstrate(sequence)}
            >
              {bi("Show me again", "أرني مجددًا")}
            </button>
          )}
          {showing && (
            <button
              className="button"
              onClick={() => {
                cancel();
                setSequence([]);
                setAnswer([]);
                setMessage("");
              }}
            >
              {bi("Stop", "توقف")}
            </button>
          )}
          <span>
            {bi(
              "Patterns grow from 2 to 6 notes. No time limit.",
              "تتدرّج الأنماط من نغمتين إلى ٦ نغمات. بلا وقت محدد.",
            )}
          </span>
        </div>
      )}
    </Frame>
  );
}
