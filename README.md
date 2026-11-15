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

## Cinematics, hazard tasks and sound
The three intro frames and three endings use `public/sprites/storyboard-v1.png`. Subtitle text and named VO/SFX triggers live in `src/game/cinematics.ts`. Sound is opt-in. Spoken narration is disabled pending custom recordings; subtitles and future VO trigger IDs remain. Supplied WAV and short OGG recordings cover gameplay actions, while legacy synthesized cues remain as fallback. The sound trigger layer can be replaced with licensed recordings later.

Dust: deploy K at the marked beacon site for telemetry and +20 RP. Freezing night: E at the powered external thermal relay for heater priority and +15 RP. Radiation: E at the inside Command bulkhead switch within 60 seconds for +20 RP and protection while inside Command. Rewards are once per event and persist in saves. The game uses a deterministic simulated schedule; the journal can fetch NASA DONKI SEP records using its public DEMO_KEY, with timeout/error fallback. These observational records do not predict Mars exposure or change the playable simulation schedule. Source: https://api.nasa.gov/#DONKI

New event/cinematic state and handlers use snake_case. Existing public Mission fields retain their names for compatibility. The field sample population is halved deterministically; the full sample registry stays available to load older inventories and lab scans.

## Use of SI
OpenAI Codex and GitHub Copilot assisted with code implementation, debugging, and testing. The team directed the gameplay, art selection, audio choices, disclosure scope, and acceptance criteria, then reviewed the generated changes and tested the resulting experience.

Machine-readable disclosure is available in [SI-PROVENANCE.json](./SI-PROVENANCE.json). The selected intro artwork is visibly marked in the three intro frames listed there; gameplay sprites are not included in that artwork disclosure.
