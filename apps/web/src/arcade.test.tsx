// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import {
  mazes,
  mazeMove,
  mazeStars,
  traceProgress,
  memoryDeck,
} from "./gameLogic";
let root: Root | undefined;
let host: HTMLDivElement;
beforeAll(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
});
afterEach(async () => {
  if (root) {
    await act(async () => root!.unmount());
    root = undefined;
  }
  host?.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
async function mount(node: ReactNode) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root!.render(<MemoryRouter>{node}</MemoryRouter>));
}
async function click(text: string) {
  const b = [...host.querySelectorAll("button")].find((el) =>
    el.textContent?.includes(text),
  );
  expect(b, text).toBeTruthy();
  await act(async () => b!.click());
}
it("all maze stars and homes are reachable; walls and edges block movement", () => {
  for (const board of mazes) {
    const w = board[0].length,
      seen = new Set([0]),
      queue = [0];
    while (queue.length) {
      const p = queue.shift()!;
      for (const [x, y] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const n = mazeMove(board, p, x, y);
        if (!seen.has(n)) {
          seen.add(n);
          queue.push(n);
        }
      }
    }
    for (const star of mazeStars(board)) expect(seen.has(star)).toBe(true);
    expect(seen.has(w * board.length - 1)).toBe(true);
    expect(mazeMove(board, 0, -1, 0)).toBe(0);
    expect(mazeMove(board, 0, 0, -1)).toBe(0);
  }
  expect(mazeMove(mazes[0], 0, 0, 1)).toBe(0);
});
it("memory decks have two of every picture and unique identities", () => {
  for (const size of [3, 6, 8]) {
    const deck = memoryDeck(size);
    expect(new Set(deck.map((c) => c.id)).size).toBe(size * 2);
    for (let i = 0; i < size; i++)
      expect(deck.filter((c) => c.pair === i)).toHaveLength(2);
  }
});
it("memory completion unlocks a fresh larger board", async () => {
  const { MemoryGame } = await import("./Arcade");
  await mount(<MemoryGame />);
  await click("Take a little peek");
  const cards = [...host.querySelectorAll<HTMLButtonElement>(".memory-card")];
  const groups = new Map<string, number[]>();
  cards.forEach((c, i) => {
    const key = c.getAttribute("aria-label")!;
    groups.set(key, [...(groups.get(key) || []), i]);
  });
  await click("Hide pictures");
  for (const pair of groups.values())
    for (const i of pair) await act(async () => cards[i].click());
  expect(host.textContent).toContain("A sea of lovely matches!");
  await click("Try the next board");
  expect(host.querySelectorAll(".memory-card")).toHaveLength(12);
  expect(host.textContent).toContain("0 / 6");
});
it("stars advance in order and all four pictures can be completed", async () => {
  expect(traceProgress(0, 3)).toBe(0);
  expect(traceProgress(0, 1)).toBe(1);
  const { StarGame } = await import("./Arcade");
  await mount(<StarGame />);
  for (let stage = 0; stage < 4; stage++) {
    let remaining =
      host.querySelectorAll<HTMLButtonElement>(".connect-star").length;
    while (remaining--) {
      const next = host.querySelector<HTMLButtonElement>(".connect-star.next");
      expect(next).not.toBeNull();
      await act(async () => next!.click());
    }
    expect(host.textContent).toContain("You painted the night sky.");
    await click("Another secret picture");
  }
  expect(host.textContent).toContain("Picture 1 of 4");
});
it("aquarium keyboard placement, movement and undo work", async () => {
  const { ReefGame } = await import("./Arcade");
  await mount(<ReefGame />);
  const place = host.querySelector(".reef-place")!;
  await act(async () =>
    place.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(host.querySelectorAll(".reef-item")).toHaveLength(1);
  const right = host.querySelector<HTMLButtonElement>(
    '[aria-label="Move right"]',
  )!;
  await act(async () => right.click());
  expect(host.querySelector<HTMLElement>(".reef-item")!.style.left).toBe("56%");
  await click("Undo last addition");
  expect(host.querySelectorAll(".reef-item")).toHaveLength(0);
});
it("echo accepts a correct sequence and cancels timers on leaving", async () => {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0);
  const { MusicGame } = await import("./Arcade");
  await mount(<MusicGame />);
  await click("Echo play");
  await click("Start an echo");
  await act(async () => vi.advanceTimersByTime(1800));
  const key = host.querySelector<HTMLButtonElement>(
    '[aria-label="Peach note"]',
  )!;
  await act(async () => key.click());
  await act(async () => key.click());
  expect(host.textContent).toContain("You found the echo!");
  await click("Try a longer melody");
  expect(vi.getTimerCount()).toBeGreaterThan(0);
  await act(async () => root!.unmount());
  root = undefined;
  expect(vi.getTimerCount()).toBe(0);
});

it("Explore and Quiet Moments offer disjoint activity shelves", async () => {
  const { ArcadeShelf } = await import("./Arcade");
  await mount(<ArcadeShelf />);
  const explore = [...host.querySelectorAll("a")].map((a) =>
    a.getAttribute("href"),
  );
  expect(explore).toContain("/explore/games/memory");
  expect(explore).toContain("/explore/games/trail");
  await act(async () =>
    root!.render(
      <MemoryRouter>
        <ArcadeShelf quiet />
      </MemoryRouter>,
    ),
  );
  const quiet = [...host.querySelectorAll("a")].map((a) =>
    a.getAttribute("href"),
  );
  expect(quiet).toContain("/calm/reef");
  expect(quiet).toContain("/calm/music");
  expect(quiet).toContain("/calm/sky");
  expect(explore.some((href) => quiet.includes(href))).toBe(false);
});
