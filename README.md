# MarsBound: 14 Sols on Mars

A browser-based, top-down Mars science and survival game built with Next.js, TypeScript, Tailwind, Canvas and Zustand. Inspired by the supplied Junior Space Trainer design reference. This is an independent educational simulation, not a NASA product.

## Development
Node 22 or newer. Run `npm ci`, then `npm run dev`. Run `npm run typecheck`, `npm run lint`, and `npm run build` before committing. The production static export is written to `out/`.

## Architecture
`src/app`: application shell; `src/engine`: Canvas, input, camera and loop; `src/game`: gameplay and state; `src/components`: accessible React interface; `tests`: simulation regression coverage.

## Milestones
Each numbered milestone is independently typechecked, linted, built, committed and tagged. Versions v0.1.0 through v0.13.0 precede v1.0.0. See Git history for the development sequence.

## Exploring the updated world
Hold **Shift + WASD** to run. Approach an outlined object and press **E** to use it; at the Command bed, E rests or wakes your astronaut, and movement also wakes them. Use **M** to find geological landmarks and E nearby to read their field notes (also available in **J**, the journal).

Frost, dust and radiation effects become less intense inside a facility. This is a visual shelter cue; radiation protection still depends on the existing shielding and survival rules. Solar conduits show facility power/circuit status. Adventure cards retain their existing equipment and credit costs; expand “What’s in my kit?” to inspect them.

The landforms are simplified, walkable educational exhibits, not a geographically accurate placement of Mars landmarks. Their field notes link to NASA sources. Sprite generation prompts and provenance are in `public/sprites/README.md`.
