# Playable games — 25 September 2026

Explore now puts two active discovery games on its landing page and game shelf. The three gentle creative games live exclusively in Quiet Moments. During a game, the extra Explore heading and tabs are hidden to leave more space for the board. Existing room exploration, equipment, dress-up, stories and earlier activities remain available.

## Games

- **Ocean pairs:** shuffled matching boards with 3, 6 or 8 pairs; picture peek, pause, turn count, match feedback, completion and next-board controls.
- **Wanees’ star trail:** three solvable garden mazes; collect every star before completing the route home; tap neighbouring cells, use the direction pad or keyboard arrows; optional footsteps and replay.
- **Star painter:** four ordered connect-the-stars pictures with an optional outline hint and three line colours. Available in Quiet Moments; old Explore URLs redirect there.
- **My tiny ocean:** place up to 18 fish, turtles, coral, shells, plants and sea stars; move and remove individual items, undo the last addition, switch moonlight, add bubbles and pause motion. Keyboard placement and movement are supported. Validated creature positions are saved in sessionStorage for this browser tab, with a visible fallback message if storage is unavailable. No account, server or personal information is involved.
- **Rainbow echoes:** free-play musical keys and visual/audio pattern recall growing from 2 to 6 notes. Sound starts off and is optional; each note also has a distinct shape and colour. Replay and stop controls are available. Scheduled playback is cancelled when leaving or hiding the tab.

All new text is available in English and Arabic. Layouts use responsive grids and logical text direction. OS reduced-motion preferences disable decorative swimming, bubble motion and transitions. No countdowns, purchases, advertisements, streak penalties, analytics or new dependencies were added. The games are small browser games, not clinical interventions; enjoyment has not been evaluated with children.

## Verification

- TypeScript build, ESLint and production Vite build pass.
- 18 tests pass across five frontend test files, including shelf separation and streaming checks. New tests prove every maze star/home is reachable, edge/wall movement is blocked, memory decks contain exact pairs, completed matching rounds advance, all four star drawings complete in sequence, aquarium keyboard editing works, and echo timers are cleaned up on leaving.
- Browser: completed a memory board and first maze; completed a star picture using actual click targets; placed and moved aquarium creatures, changed moonlight/bubbles, and verified the creatures returned after navigating away; exercised optional sound and echo playback with no browser errors.
- Arabic aquarium controls/content verified. Explore landing page checked at a 390px viewport, with no horizontal overflow. Wider game boards visually reviewed.

Assets use the existing original Wanees Blender cutout, CSS scenery and operating-system emoji. Emoji appearance may differ by device. Musical notes are generated locally with Web Audio; no remote media service is needed.
