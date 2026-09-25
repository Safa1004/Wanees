// @vitest-environment jsdom
import { beforeAll, afterEach, expect, it, vi } from "vitest";
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
let root: Root;
let host: HTMLDivElement;
beforeAll(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
});
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  host?.remove();
});
async function mount(path: string, element: ReactNode) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={element} />
        </Routes>
      </MemoryRouter>,
    );
  });
}
async function click(text: string) {
  const button = Array.from(host.querySelectorAll("button")).find((b) =>
    b.textContent?.includes(text),
  );
  expect(button, `button ${text}`).toBeTruthy();
  await act(async () => button!.click());
}
it("lets readers choose, finish, restart and switch between complete stories", async () => {
  const { StoryShelf } = await import("./Playful");
  await mount("/", <StoryShelf />);
  await click("Wanees and the pocket");
  expect(host.textContent).toContain("Page 1 of 4");
  await click("A little toy");
  expect(host.textContent).toContain("A familiar toy could keep him company.");
  for (let i = 0; i < 3; i++) await click("Turn the page");
  await click("The end");
  expect(host.textContent).toContain("What was your favourite part?");
  await click("Start again");
  expect(host.textContent).toContain("Page 1 of 4");
  expect(host.textContent).not.toContain(
    "A familiar toy could keep him company.",
  );
  await click("Story shelf");
  await click("Maryam and the listening");
  expect(host.textContent).toContain("Maryam sat with her aunt");
});
it("collects distinct shells and resets them without changing global motion preferences", async () => {
  const { QuietPlay } = await import("./Playful");
  const { useApp } = await import("./state");
  await mount(
    "/calm/coast",
    <Routes>
      <Route path="/calm/:activity" element={<QuietPlay />} />
    </Routes>,
  );
  const shells = Array.from(host.querySelectorAll<HTMLButtonElement>(".shell"));
  expect(shells).toHaveLength(6);
  await act(async () => {
    shells[0].click();
  });
  await act(async () => {
    shells[0].click();
  });
  expect(host.textContent).toContain("1 of 6 shells found");
  await click("Start fresh");
  expect(host.textContent).toContain("0 of 6 shells found");
  expect(useApp.getState().paused).toBe(false);
});
it("shows Arabic story content and choices after a language change", async () => {
  const { StoryShelf } = await import("./Playful");
  const { default: i18n } = await import("./i18n");
  await i18n.changeLanguage("ar");
  await mount("/", <StoryShelf />);
  await click("سؤال عامر");
  expect(host.textContent).toContain("الصفحة 1 من 4");
  await click("ما اسم هذه الأداة؟");
  expect(host.textContent).toContain("معرفة الاسم");
  await act(async () => {
    await i18n.changeLanguage("en");
  });
});
