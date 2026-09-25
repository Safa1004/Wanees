let csrf = "";
export async function api<T = any>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  if (method !== "GET") {
    const r = await fetch("/api/v1/session");
    if (!r.ok) throw new Error("API unavailable");
    csrf = (await r.json()).csrf;
  }
  const r = await fetch("/api/v1" + path, {
    method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(method !== "GET" ? { "X-CSRF-TOKEN": csrf } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!r.ok) {
    const problem = await r.json().catch(() => ({}));
    throw new Error(
      problem.detail || problem.title || `Request failed (${r.status})`,
    );
  }
  return r.status === 204 ? (undefined as T) : r.json();
}
export function clearCsrf() {
  csrf = "";
}
export function download(name: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function calendar(date: string, time: string) {
  const at = new Date(`${date}T${time}:00+04:00`);
  if (!Number.isFinite(at.getTime())) throw new Error("Invalid date");
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wanees//Visit note//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@wanees.local`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(at)}`,
    `DTEND:${stamp(new Date(at.getTime() + 3600000))}`,
    "SUMMARY:Personal appointment",
    "DESCRIPTION:Personal reminder - not a confirmed booking.",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

/** NDJSON keeps replies readable as they arrive; only complete events commit UI history. */
export async function streamReply<T>(
  path: string,
  body: unknown,
  onText: (text: string) => void,
  signal: AbortSignal,
): Promise<T> {
  const session = await api<{ csrf: string }>("/session");
  const response = await fetch("/api/v1" + path, {
    method: "POST",
    credentials: "same-origin",
    signal,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": session.csrf,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.title || `Request failed (${response.status})`);
  }
  if (!response.body) throw new Error("The reply could not be opened.");
  const reader = response.body.getReader(),
    decoder = new TextDecoder();
  let pending = "",
    text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      pending += decoder.decode(value, { stream: !done });
      if (pending.length > 100000) throw new Error("Invalid reply.");
      let newline: number;
      while ((newline = pending.indexOf("\n")) >= 0) {
        const line = pending.slice(0, newline);
        pending = pending.slice(newline + 1);
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === "error")
          throw new Error(event.title || "The reply was interrupted.");
        if (event.type === "delta" && typeof event.text === "string") {
          text += event.text;
          if (text.length > 5000) throw new Error("Invalid reply.");
          onText(text);
        }
        if (event.type === "complete" && event.result) return event.result as T;
      }
      if (done) throw new Error("The reply was interrupted. Please try again.");
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
