import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Plus,
  Send,
  Trash2,
  Volume2,
  Square,
  Heart,
} from "lucide-react";
import { api, streamReply } from "./api";
import i18n, { bi } from "./i18n";
import { useAccount, ErrorNote } from "./Accounts";
import { Heading, Visual } from "./main";
import { useApp } from "./state";
type Conversation = {
  id: string;
  version: number;
  conversation: {
    character: string;
    language: string;
    messages: { id: string; role: string; text: string }[];
  };
};
export default function Chat() {
  const account = useAccount();
  const qc = useQueryClient();
  const { companion, set } = useApp();
  const [selected, select] = useState("");
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pendingText, setPendingText] = useState("");
  const [partialReply, setPartialReply] = useState("");
  const chatRequest = useRef<AbortController | null>(null);
  const [error, setError] = useState<unknown>();
  const [speaking, setSpeaking] = useState("");
  const [loadingVoice, setLoadingVoice] = useState("");
  const audio = useRef<HTMLAudioElement | null>(null);
  const audioUrl = useRef("");
  const voiceRequest = useRef<AbortController | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const logged = !!account.data?.authenticated;
  const status = useQuery({
    queryKey: ["chat-status"],
    queryFn: () =>
      api<{
        configured: boolean;
        voiceConfigured: boolean;
        arabicVoiceConfigured: boolean;
      }>("/chat/status"),
    enabled: logged,
  });
  const conversations = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api<Conversation[]>("/chat/conversations"),
    enabled: logged,
  });
  const current = conversations.data?.find((c) => c.id === selected);
  function stop() {
    voiceRequest.current?.abort();
    audio.current?.pause();
    audio.current = null;
    if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
    audioUrl.current = "";
    setSpeaking("");
    setLoadingVoice("");
  }
  useEffect(
    () => () => {
      chatRequest.current?.abort();
      voiceRequest.current?.abort();
      audio.current?.pause();
      if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
    },
    [],
  );
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [current?.conversation.messages.length, pendingText, partialReply]);
  async function speak(id: string) {
    stop();
    const controller = new AbortController();
    voiceRequest.current = controller;
    setLoadingVoice(id);
    setError(null);
    try {
      const response = await fetch(
        `/api/v1/chat/conversations/${selected}/audio/${id}`,
        { signal: controller.signal },
      );
      if (!response.ok) {
        const problem = await response.json();
        throw new Error(problem.title || "Voice unavailable");
      }
      const blob = await response.blob();
      if (controller.signal.aborted) return;
      audioUrl.current = URL.createObjectURL(blob);
      const player = new Audio(audioUrl.current);
      audio.current = player;
      player.onended = stop;
      player.onerror = () => {
        stop();
        setError(
          new Error(bi("The audio could not play.", "تعذّر تشغيل الصوت.")),
        );
      };
      await player.play();
      setSpeaking(id);
    } catch (e) {
      if (!controller.signal.aborted) setError(e);
    } finally {
      if (voiceRequest.current === controller) setLoadingVoice("");
    }
  }
  async function start() {
    setBusy(true);
    setError(null);
    stop();
    try {
      const result = await api<Conversation>("/chat/conversations", "POST", {
        character: companion,
        language: i18n.language.startsWith("ar") ? "ar" : "en",
        adultConsent: consent,
      });
      await qc.invalidateQueries({ queryKey: ["conversations"] });
      select(result.id);
      setText("");
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  async function send() {
    if (!current || !text.trim() || busy) return;
    setPendingText(text.trim());
    setPartialReply("");
    const controller = new AbortController();
    chatRequest.current = controller;
    setBusy(true);
    setError(null);
    stop();
    try {
      const reply = await streamReply<Conversation>(
        `/chat/conversations/${current.id}/messages`,
        {
          text: text.trim(),
          version: current.version,
          stream: true,
        },
        setPartialReply,
        controller.signal,
      );
      setText("");
      qc.setQueryData<Conversation[]>(["conversations"], (old) =>
        (old || []).map((c) => (c.id === reply.id ? reply : c)),
      );
    } catch (e) {
      setError(e);
      await qc.invalidateQueries({ queryKey: ["conversations"] });
    } finally {
      setPendingText("");
      setPartialReply("");
      chatRequest.current = null;
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow={bi("A MOMENT TOGETHER", "لحظة معًا")}
        title={bi("What’s on your mind?", "بماذا تفكّر؟")}
        sub={bi(
          "A gentle conversation with your AI companion. Keep a trusted adult nearby.",
          "حديث لطيف مع رفيقك بالذكاء الاصطناعي. أبقِ شخصًا بالغًا تثق به بالقرب منك.",
        )}
      />
      <div className="chat-layout">
        <aside className="panel companion-panel">
          <div className="chat-character">
            <Visual
              kind="character"
              character={current?.conversation.character || companion}
              action={speaking ? "greeting" : "idle"}
            />
          </div>
          <span className="eyebrow">
            {current?.conversation.character || companion}
          </span>
          <p>
            {bi(
              "We can ask questions, imagine a story, or take a calm breath together.",
              "يمكننا طرح الأسئلة أو تخيّل قصة أو أخذ نفس هادئ معًا.",
            )}
          </p>
          <label>
            {bi("Choose a companion", "اختر رفيقًا")}
            <select
              value={companion}
              disabled={busy}
              onChange={(e) => {
                stop();
                select("");
                set({ companion: e.target.value });
              }}
            >
              <option>Wanees</option>
              <option>Amer</option>
              <option>Maryam</option>
            </select>
          </label>
          <button
            className="button"
            onClick={async () => {
              if (speaking === "sample") {
                stop();
                return;
              }
              stop();
              setError(null);
              const player = new Audio(
                `/voices/${(current?.conversation.character || companion).toLowerCase()}.wav`,
              );
              audio.current = player;
              player.onended = stop;
              player.onerror = () => {
                stop();
                setError(
                  new Error(
                    bi("The sample could not play.", "تعذّر تشغيل العينة."),
                  ),
                );
              };
              try {
                await player.play();
                setSpeaking("sample");
              } catch (e) {
                setError(e);
              }
            }}
          >
            <Volume2 size={17} />
            {speaking === "sample"
              ? bi("Stop sample", "إيقاف العينة")
              : bi("Hear the English voice", "استمع للصوت الإنجليزي")}
          </button>
          <div className="chat-boundary">
            <Heart size={17} />
            <p>
              {bi(
                "An AI character can make mistakes. For health questions, ask your adult or care team.",
                "قد يخطئ رفيق الذكاء الاصطناعي. للأسئلة الصحية اسأل ولي أمرك أو فريق الرعاية.",
              )}
            </p>
          </div>
        </aside>
        <section className="panel conversation-panel">
          {!logged ? (
            <div className="chat-empty">
              <MessageCircle size={36} />
              <h2>{bi("A space for your conversations", "مساحة لأحاديثك")}</h2>
              <p>
                {bi(
                  "An adult signs in to start. Your conversations stay in your account on your Wanees server.",
                  "يسجّل شخص بالغ الدخول للبدء. تبقى المحادثات في حسابك على خادم ونيس الخاص بك.",
                )}
              </p>
              <Link className="button primary" to="/account">
                {bi(
                  "Sign in or create an account",
                  "سجّل الدخول أو أنشئ حسابًا",
                )}
              </Link>
            </div>
          ) : (
            <>
              {!status.data?.configured && !status.isPending && (
                <div className="chat-status" role="status">
                  {bi(
                    "Chat is waiting for your server’s AI service. Your account and the rest of Wanees still work.",
                    "الدردشة بانتظار خدمة الذكاء الاصطناعي على خادمك. يظل حسابك وبقية ونيس متاحين.",
                  )}
                </div>
              )}
              <div className="conversation-toolbar">
                <select
                  aria-label={bi("Saved conversations", "المحادثات المحفوظة")}
                  value={selected}
                  disabled={busy}
                  onChange={(e) => {
                    stop();
                    select(e.target.value);
                    setText("");
                  }}
                >
                  <option value="">
                    {bi("A new conversation", "محادثة جديدة")}
                  </option>
                  {conversations.data?.map((c, n) => (
                    <option key={c.id} value={c.id}>
                      {c.conversation.character} ·{" "}
                      {c.conversation.messages[0]?.text.slice(0, 35) ||
                        `${bi("Conversation", "محادثة")} ${n + 1}`}
                    </option>
                  ))}
                </select>
                <button
                  className="icon-button"
                  disabled={busy}
                  aria-label={bi("New conversation", "محادثة جديدة")}
                  onClick={() => {
                    stop();
                    select("");
                  }}
                >
                  <Plus size={20} />
                </button>
                {current && (
                  <button
                    className="icon-button"
                    disabled={busy}
                    aria-label={bi("Delete conversation", "حذف المحادثة")}
                    onClick={async () => {
                      if (
                        !window.confirm(
                          bi(
                            "Delete this conversation? This cannot be undone.",
                            "حذف هذه المحادثة؟ لا يمكن التراجع.",
                          ),
                        )
                      )
                        return;
                      setBusy(true);
                      try {
                        stop();
                        await api(`/chat/conversations/${selected}`, "DELETE");
                        select("");
                        await qc.invalidateQueries({
                          queryKey: ["conversations"],
                        });
                      } catch (e) {
                        setError(e);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              {!current ? (
                <div className="chat-empty">
                  <MessageCircle size={35} />
                  <h2>
                    {bi(
                      `Say hello to ${companion}`,
                      `قل مرحبًا لـ ${companion}`,
                    )}
                  </h2>
                  <p>
                    {bi(
                      "Messages are saved until you delete the conversation or your account. Please leave out names, contact details and medical records.",
                      "تُحفظ الرسائل حتى تحذف المحادثة أو الحساب. تجنّب الأسماء وبيانات الاتصال والسجلات الطبية.",
                    )}
                  </p>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    {bi(
                      "I am an adult, and I agree to AI chat being saved on this server. I will stay with my child.",
                      "أنا بالغ وأوافق على حفظ محادثة الذكاء الاصطناعي على هذا الخادم وسأبقى مع طفلي.",
                    )}
                  </label>
                  <button
                    className="button primary"
                    disabled={!consent || busy || !status.data?.configured}
                    onClick={start}
                  >
                    {bi("Start chatting", "ابدأ المحادثة")}
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className="chat-messages"
                    role="log"
                    aria-live="polite"
                    dir={current.conversation.language === "ar" ? "rtl" : "ltr"}
                  >
                    {current.conversation.messages.length === 0 && (
                      <div className="chat-empty">
                        <p>{bi("You can start with…", "يمكنك البدء بـ…")}</p>
                        {[
                          bi(
                            "Can we make up a happy story?",
                            "هل نؤلف قصة سعيدة؟",
                          ),
                          bi("I feel a little nervous.", "أشعر ببعض القلق."),
                          bi(
                            "What does a stethoscope do?",
                            "ما فائدة السماعة الطبية؟",
                          ),
                        ].map((t) => (
                          <button
                            className="chat-starter"
                            key={t}
                            onClick={() => setText(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                    {current.conversation.messages.map((m) => (
                      <article className={`chat-bubble ${m.role}`} key={m.id}>
                        <span>
                          {m.role === "user"
                            ? bi("You", "أنت")
                            : current.conversation.character}
                        </span>
                        <p>{m.text}</p>
                        {m.role === "assistant" && (
                          <button
                            className="text-button"
                            disabled={
                              !(current.conversation.language === "ar"
                                ? status.data?.arabicVoiceConfigured
                                : status.data?.voiceConfigured) ||
                              !!loadingVoice
                            }
                            onClick={() =>
                              speaking === m.id ? stop() : speak(m.id)
                            }
                          >
                            {speaking === m.id ? (
                              <Square size={15} />
                            ) : (
                              <Volume2 size={16} />
                            )}
                            {loadingVoice === m.id
                              ? bi("Preparing voice…", "نجهّز الصوت…")
                              : speaking === m.id
                                ? bi("Stop", "إيقاف")
                                : bi("Listen", "استمع")}
                          </button>
                        )}
                      </article>
                    ))}
                    {pendingText && (
                      <div className="chat-bubble user">
                        <span>{bi("You", "أنت")}</span>
                        <p>{pendingText}</p>
                      </div>
                    )}
                    {partialReply && (
                      <div className="chat-bubble">
                        <span>{current.conversation.character}</span>
                        <p>{partialReply}</p>
                      </div>
                    )}
                    {busy && !partialReply && (
                      <p role="status">
                        {bi("Your companion is thinking…", "رفيقك يفكّر…")}
                      </p>
                    )}
                    <div ref={bottom} />
                  </div>
                  <form
                    className="chat-compose"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void send();
                    }}
                  >
                    <label className="sr-only" htmlFor="chat-text">
                      {bi("Your message", "رسالتك")}
                    </label>
                    <textarea
                      id="chat-text"
                      value={text}
                      maxLength={1500}
                      rows={2}
                      disabled={busy}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={bi(
                        "Take your time. Type a message…",
                        "خذ وقتك. اكتب رسالة…",
                      )}
                    />
                    <button
                      className="button primary"
                      disabled={busy || !text.trim()}
                      aria-label={bi("Send message", "إرسال الرسالة")}
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </>
              )}
            </>
          )}
          <ErrorNote
            error={
              error || account.error || conversations.error || status.error
            }
          />
        </section>
      </div>
    </>
  );
}
