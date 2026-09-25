/** Pure rules shared by the game boards and regression tests. */
export function shuffled<T>(items: T[], random = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function memoryDeck(pairs: number) {
  return shuffled(
    Array.from({ length: pairs * 2 }, (_, i) => ({
      id: i,
      pair: Math.floor(i / 2),
    })),
  );
}
export const mazes = [
  ["S....", "###.#", "*...#", ".####", "....G"],
  ["S#...*", ".#.##.", "...#..", "##.#.#", "*..#..", ".#...G"],
  ["S..#..*", "##.#.#.", "...#.#.", ".###.#.", ".*...#.", ".#####.", "......G"],
];
export function mazeMove(
  board: string[],
  position: number,
  dx: number,
  dy: number,
) {
  const w = board[0].length,
    x = (position % w) + dx,
    y = Math.floor(position / w) + dy;
  if (x < 0 || x >= w || y < 0 || y >= board.length || board[y][x] === "#")
    return position;
  return y * w + x;
}
export function mazeStars(board: string[]) {
  return board
    .join("")
    .split("")
    .flatMap((x, i) => (x === "*" ? [i] : []));
}
export function traceProgress(current: number, target: number) {
  return target === current + 1 ? target : current;
}
