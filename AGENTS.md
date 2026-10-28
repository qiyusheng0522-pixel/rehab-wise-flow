
- Demo patient 孙德强 journey state lives in src/lib/demoJourney.ts; each app registers a patcher that rewrites its own mock data per stage, and Index remounts the phone app on stage change. Why: one coherent cross-role demo without refactoring every module.
