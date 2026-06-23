<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
`specs/001-photo-album-organizer/plan.md`

Active feature: **Photo Album Organizer** (`specs/001-photo-album-organizer/`).
Stack: Next.js (App Router) + TypeScript `strict`; IndexedDB (`idb`) for local
persistence; `@dnd-kit` for accessible drag-and-drop reordering; `exifr` for
capture-date extraction; SHA-256 (Web Crypto) for per-album photo de-dup;
`@tanstack/react-virtual` for the photo tile grid. Tests: Vitest + React Testing
Library + jest-axe (`fake-indexeddb` for storage). See also `research.md`,
`data-model.md`, `contracts/`, and `quickstart.md` in the feature directory.
<!-- SPECKIT END -->
