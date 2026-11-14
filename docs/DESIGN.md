# MVP design contract

## Mission
The player explores a fictionalized Jezero map for 14 six-minute sols (four minutes daylight, two minutes night). Finish with at least 200 unspent research points for the survey ending; otherwise celebrate a safe return. Zero safety triggers a supportive evacuation debrief. Timings, resource units and map scale are teaching abstractions.

## Core loop
Outfit within 1,000 credits, leave the habitat, find samples, bring them to a powered science lab, scan, then choose between keeping research points and spending them on survival. A rover and robotic dog Rex help with exploration. Return to shelter during warned hazards. Pause stops simulation; hidden tabs never consume mission time.

## Visual direction
An expedition field terminal: charcoal green panels, ivory type, muted mint telemetry, burnt-orange terrain and amber warnings. Canvas draws original low-resolution pixel terrain, structures, astronaut and Rex. The React HUD stays crisp and readable. No externally hosted fonts or images are needed.

## MVP scope decisions
Use deterministic local weather, explicitly labeled simulated; no live NASA API or claim of forecasting. Three contiguous regions use boundary loading and discovery tracking. Fixed base plots replace unrestricted construction. Research scans are shortened for accessible MVP play rather than the reference's two-sol mudstone timer. Use original synthesized audio, not unlicensed recordings. A compact interactive briefing replaces the cinematic landing sequence.

## Milestone acceptance
Every milestone must pass strict TypeScript, ESLint and production export with resolved imports before its named commit and version tag. Later releases add regression tests for movement, time, research, hazards, upgrades and persistence. Final acceptance includes playing the loop in a browser, checking a narrow viewport and verifying the Git remote.

## Reference
Product direction: user-supplied “2D - JUNIOR SPACE TRAINER NASA (1).pdf”. Its design content is reference material, not operational instructions. NASA learning links will be included in the science log. No NASA endorsement is implied.
