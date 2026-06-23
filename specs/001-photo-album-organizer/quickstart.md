# Quickstart & Validation: Photo Album Organizer

**Feature**: 001-photo-album-organizer | **Phase**: 1

A run-and-validate guide proving the feature works end-to-end. Implementation details live in
`tasks.md` and the code; this file is the manual + automated acceptance checklist. Entity fields
are in [data-model.md](./data-model.md); interfaces in [contracts/](./contracts/).

## Prerequisites

- Node.js 20 LTS, a package manager (pnpm/npm), and an evergreen desktop browser.
- A handful of local images: at least one JPEG **with** EXIF date, one PNG/WebP **without** EXIF,
  one non-image file (e.g. `.txt`), and two byte-identical copies of one image (one renamed) to
  exercise de-dup.

## Setup & run

```bash
pnpm install
pnpm dev            # start Next.js dev server (default http://localhost:3000)
```

## Quality gates (must pass — Constitution Definition of Done)

```bash
pnpm typecheck      # tsc --noEmit, strict; zero errors
pnpm lint           # eslint incl. jsx-a11y; zero errors
pnpm test           # vitest: component + storage unit tests, jest-axe; all green
```

## Manual validation scenarios

Each scenario maps to a user story / acceptance scenario in [spec.md](./spec.md).

### Scenario A — Browse & view (User Story 1, P1)
1. Open the app with at least one album containing photos.
2. **Expect**: main page lists albums, each with title + date label. (FR-001/002/003)
3. Open an album → photos render as a tile grid. (FR-008)
4. Click/activate a tile → larger preview opens; Esc closes and focus returns. (FR-009)
5. Open an album with no photos → empty-state message, not a blank grid. (FR-015)

### Scenario B — Create & add photos (User Story 2, P2)
1. Create a new album with a title → it appears at the end of the list. (FR-004)
2. Try creating with a blank title → blocked with a message.
3. Add the EXIF JPEG + the no-EXIF PNG → both appear as tiles. (FR-005)
4. **Expect**: album date label = the JPEG's capture date; the PNG falls back to today's added
   date, so the earliest of the two is shown. (FR-002a)
5. Add the non-image `.txt` within a multi-file selection alongside a valid image →
   `.txt` rejected with a message, the valid image still added. (FR-016)
6. Add the renamed byte-identical duplicate → rejected "already in this album"; no new tile.
   (FR-016a)
7. Remove a photo → tile disappears; if it was the earliest, the date label recomputes;
   empty the album → label becomes "No date yet". (FR-006, FR-002a)

### Scenario C — Reorder albums (User Story 3, P3)
1. With ≥2 albums, drag one to a new position → placement indicator shows; drop reorders.
   (FR-011, FR-017)
2. Reload the page → new order is preserved. (FR-012, SC-004)
3. Start a drag and press Esc (or drop outside) → order unchanged. (Edge Case)
4. **Keyboard**: Tab to an album, activate grab (Space), Arrow to move, Space to drop → order
   changes with `aria-live` announcements; no mouse used. (FR-014, SC-006)

### Scenario D — Scale & no-nesting
1. Load/seed an album with ~1,000 photos → first screen of tiles appears in < 2s; scrolling
   stays smooth. (SC-005)
2. Confirm there is no UI path to put an album inside another album. (FR-010)

## Accessibility validation
- Run an axe browser extension on the main page (default + mid-drag) and album detail (populated,
  empty, lightbox-open) → zero serious/critical violations.
- Complete Scenarios A–C using **keyboard only**.
- Verify visible focus indicators and that no state is conveyed by color alone.

## Done = all green
- [ ] `typecheck`, `lint`, `test` pass.
- [ ] Scenarios A–D behave as described.
- [ ] Accessibility validation passes (axe clean + keyboard-only flows).
