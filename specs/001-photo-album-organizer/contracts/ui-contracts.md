# Contract: UI Screens & Components

**Feature**: 001-photo-album-organizer | **Phase**: 1

Behavioral contracts for the user-facing surfaces. Each maps to functional requirements and is
the basis for component unit tests (Vitest + RTL) and jest-axe assertions (Constitution I & IV).
Every interactive element is keyboard-operable with a visible focus indicator and an accessible
name; color is never the sole state signal.

---

## Screen: Main page — Album List (`app/page.tsx`, `components/albums/*`)

**Purpose**: show all albums as one freely re-orderable list and allow opening/creating them.

| Behavior | Requirement | Acceptance signal |
|----------|-------------|-------------------|
| Render all albums in a single list ordered by `position` | FR-001, FR-011 | Albums appear; order matches persisted `position`. |
| Each album shows title + date label (or "No date yet") | FR-002, FR-002a, FR-003 | Card shows title and derived date / placeholder. |
| Create a new album via a titled dialog | FR-004 | New album appended; empty title blocked with message. |
| Delete an album (with confirmation) | FR-007 | Album + its photos removed after confirm. |
| Reorder by pointer drag-and-drop | FR-011, FR-017 | Dragging shows a placement indicator; drop reorders + persists. |
| Reorder by keyboard | FR-014, SC-006 | Focus a card, activate grab, arrow to move, drop; `aria-live` announces each step. |
| Drag cancel / invalid drop returns to origin | Edge Case | Pressing Esc or dropping outside leaves order unchanged. |
| Empty state when no albums | FR-015 | "Create your first album" prompt shown instead of an empty list. |
| Open an album | FR-001 | Activating a card navigates to `/albums/[albumId]`. |
| Persisted order survives reload | FR-012, SC-004 | After reload, list order equals last arrangement. |

**A11y contract**: the sortable list uses `@dnd-kit` keyboard sensor + announcements; cards are
focusable with role/name; the drag handle (or whole card) exposes grab instructions via
`aria-describedby`; jest-axe passes with zero violations in default, dragging, and empty states.

---

## Screen: Album Detail — Photo Tile Grid (`app/albums/[albumId]/page.tsx`, `components/photos/*`)

**Purpose**: preview an album's photos as tiles and open one larger.

| Behavior | Requirement | Acceptance signal |
|----------|-------------|-------------------|
| Render photos as a tile grid (thumbnails) | FR-008 | Tiles show thumbnails; layout has no shift (intrinsic w/h). |
| Virtualized rendering for large albums | SC-005, Edge Case | First screen of tiles renders < 2s for 1,000 photos; scroll stays responsive. |
| Open a tile to a larger preview (lightbox) | FR-009 | Activating a tile shows the full image overlay; Esc closes; focus trapped + restored. |
| Add photos (file picker, multi-select) | FR-005 | Selected supported images appear as tiles. |
| Reject unsupported/corrupt files, keep going | FR-016, Edge Case | Bad files reported in a message; good files still added. |
| Reject in-album duplicates by content | FR-016a | Duplicate reported "already in this album"; no new tile. |
| Remove a photo | FR-006 | Tile disappears; album date recomputes. |
| Album date label updates after add/remove | FR-002a | Header date reflects earliest capture date, or "No date yet" when emptied. |
| Empty state when album has no photos | FR-015 | Empty-album message instead of a blank grid. |

**A11y contract**: tiles are buttons with accessible names (file name / index); the lightbox is a
modal dialog (`role="dialog"`, `aria-modal`, focus trap, Esc to close, focus returned to the
originating tile); the grid is keyboard-navigable; jest-axe passes in populated, empty, and
lightbox-open states.

---

## Shared primitives (`components/ui/*`)

| Component | Contract |
|-----------|----------|
| `EmptyState` | Renders a heading, helper text, and an optional primary action; used for no-albums and empty-album. |
| `Dialog` | Accessible modal base (focus trap, Esc, labelled by title) reused by create/delete/lightbox. |
| `VisuallyHidden` | Provides screen-reader-only text for icon-only controls and live announcements. |

**Reuse rule (Constitution III)**: create/delete confirmations and the lightbox all build on the
shared `Dialog`; empty states all build on `EmptyState` — no one-off modal or empty markup.
