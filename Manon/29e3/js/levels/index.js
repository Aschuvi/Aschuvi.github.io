// Level registry. Add one entry per level, in order, as they're built.
//
// - `id` is stable and used as the localStorage completion key: never renumber
//   or rename an id once a level has shipped, or players lose that level's progress.
// - `number` drives display order and sequential unlocking on the home screen.
// - `assets` must be static (no import()) so the preloader can build its
//   manifest before any level module is fetched.
// - `load` is a lazy dynamic import so 20 levels don't all parse up front.

const TOTAL_LEVELS = 20;

// Levels not yet written render a shared "coming soon" placeholder so the
// home grid can show its final shape from day one. Replace an entry's
// `load`/`title`/`teaser`/`css`/`assets` as each level gets built — never
// change its `id` once players may have completed it.
const placeholderEntry = (number) => ({
  number,
  id: `level${String(number).padStart(2, '0')}`,
  title: `Niveau ${number}`,
  teaser: 'À venir',
  assets: { images: [], audio: [] },
  load: () => import('./placeholder.js'),
});

export const LEVELS = [
  {
    number: 1,
    id: 'pacs',
    title: 'Le PACS',
    teaser: 'Mars',
    css: 'css/levels/level01.css',
    assets: { images: [], audio: [] },
    load: () => import('./level01-pacs.js'),
  },
  ...Array.from({ length: TOTAL_LEVELS - 1 }, (_, i) => placeholderEntry(i + 2)),
];
