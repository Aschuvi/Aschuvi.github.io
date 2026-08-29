import { el, clear } from '../core/dom.js';

// Stand-in for levels that haven't been built yet. Shared by every
// not-yet-written entry in levels/index.js — swap each one out for its own
// module as it's built, same as level01-pacs.js.

export default {
  mount(root) {
    const view = el('div', { class: 'placeholder-level' }, [
      el('p', { text: 'Ce souvenir arrive bientôt.' }),
    ]);
    root.appendChild(view);
    return () => clear(root);
  },
};
