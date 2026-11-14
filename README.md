# MarsBound: 14 Sols on Mars

A browser-based, top-down Mars science and survival game built with Next.js, TypeScript, Tailwind, Canvas and Zustand. Inspired by the supplied Junior Space Trainer design reference. This is an independent educational simulation, not a NASA product.

## Development
Node 22 or newer. Run `npm ci`, then `npm run dev`. Run `npm run typecheck`, `npm run lint`, and `npm run build` before committing. The production static export is written to `out/`.

## Architecture
`src/app`: application shell; `src/engine`: Canvas, input, camera and loop; `src/game`: gameplay and state; `src/components`: accessible React interface; `tests`: simulation regression coverage.

## Milestones
Each numbered milestone is independently typechecked, linted, built, committed and tagged. Versions v0.1.0 through v0.13.0 precede v1.0.0. See Git history for the development sequence.
