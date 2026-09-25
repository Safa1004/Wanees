import { afterEach, expect, it, vi } from "vitest";
import { streamReply } from "./api";
afterEach(() => vi.unstubAllGlobals());
function mockStream(text: string) {
  const bytes = new TextEncoder().encode(text);
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ csrf: "token" })))
      .mockResolvedValueOnce(
        new Response(
          new ReadableStream({
            start(c) {
              for (let i = 0; i < bytes.length; i += 3)
                c.enqueue(bytes.slice(i, i + 3));
              c.close();
            },
          }),
        ),
      ),
  );
}
it("streams split UTF-8 Arabic text and waits for a persisted completion", async () => {
  mockStream(
    '{"type":"delta","text":"مرحبا"}\n{"type":"complete","result":{"version":2}}\n',
  );
  const updates: string[] = [];
  const result = await streamReply(
    "/chat/test",
    {},
    (t) => updates.push(t),
    new AbortController().signal,
  );
  expect(updates).toEqual(["مرحبا"]);
  expect(result).toEqual({ version: 2 });
});
it("never treats a truncated stream as a saved reply", async () => {
  mockStream('{"type":"delta","text":"Hello"}\n');
  await expect(
    streamReply("/chat/test", {}, () => {}, new AbortController().signal),
  ).rejects.toThrow("interrupted");
});
it("surfaces provider errors instead of keeping a partial reply", async () => {
  mockStream(
    '{"type":"delta","text":"Hello"}\n{"type":"error","title":"Please retry"}\n',
  );
  await expect(
    streamReply("/chat/test", {}, () => {}, new AbortController().signal),
  ).rejects.toThrow("Please retry");
});
