import Progress from './Progress.js';
import { el, clear } from './dom.js';

// App — tiny state machine (LOADING is handled by main.js before App exists).
// Two screens, driven by hash routing so the back button and deep links work:
//   "#/"              -> home (level selection)
//   "#/level/<id>"    -> a mounted level

export default class App {
  static DEBUG = false;

  static debug(...args) {
    if (App.DEBUG) console.log('[App]', ...args);
  }

  constructor(levels) {
    this.levels = levels;

    this.homeScreen = document.getElementById('home-screen');
    this.levelScreen = document.getElementById('level-screen');
    this.levelGrid = document.getElementById('level-grid');
    this.progressCount = document.getElementById('progress-count');
    this.levelRoot = document.getElementById('level-root');
    this.levelTitleEl = document.getElementById('level-title');
    this.backBtn = document.getElementById('level-back-btn');

    this.currentCleanup = null;
    this.loadedCss = new Set();

    this.backBtn.addEventListener('click', () => this.navigateHome());
    window.addEventListener('hashchange', () => this._route());
  }

  start() {
    this._route();
  }

  navigateHome() {
    if (window.location.hash && window.location.hash !== '#/') {
      window.location.hash = '#/';
    } else {
      this._route();
    }
  }

  navigateLevel(id) {
    const target = `#/level/${id}`;
    if (window.location.hash !== target) {
      window.location.hash = target;
    } else {
      this._route();
    }
  }

  _route() {
    const hash = window.location.hash;
    const match = hash.match(/^#\/level\/(.+)$/);
    App.debug('route', hash);
    if (match) {
      this._openLevel(match[1]);
    } else {
      this._showHome();
    }
  }

  _showHome() {
    this._closeCurrentLevel();
    this._renderGrid();
    this.levelScreen.classList.add('hidden');
    this.homeScreen.classList.remove('hidden');
  }

  _renderGrid() {
    clear(this.levelGrid);
    let doneCount = 0;

    for (const entry of this.levels) {
      const done = Progress.isCompleted(entry.id);
      const unlocked = done || Progress.isUnlocked(entry.number, this.levels);
      if (done) doneCount++;
      const state = done ? 'done' : unlocked ? 'unlocked' : 'locked';

      const tile = el('div', {
        class: `level-tile ${state}`,
        attrs: { role: 'listitem', 'aria-disabled': state === 'locked' ? 'true' : 'false' },
      }, [
        el('div', { class: 'tile-number', text: String(entry.number) }),
        el('div', { class: 'tile-title', text: entry.title }),
        el('div', { class: 'tile-lock', text: '🔒' }),
        ...(done ? [el('div', { class: 'tile-done-badge', text: '✓' })] : []),
      ]);

      if (state !== 'locked') {
        tile.addEventListener('click', () => this.navigateLevel(entry.id));
      }

      this.levelGrid.appendChild(tile);
    }

    this.progressCount.textContent = `${doneCount} / ${this.levels.length}`;
  }

  async _openLevel(id) {
    const entry = this.levels.find((lvl) => lvl.id === id);
    if (!entry) {
      App.debug('unknown level id, returning home', id);
      this.navigateHome();
      return;
    }

    if (!Progress.isCompleted(id) && !Progress.isUnlocked(entry.number, this.levels)) {
      App.debug('level locked, returning home', id);
      this.navigateHome();
      return;
    }

    this._closeCurrentLevel();
    this.homeScreen.classList.add('hidden');
    this.levelScreen.classList.remove('hidden');
    this.levelTitleEl.textContent = entry.title;

    if (entry.css && !this.loadedCss.has(entry.css)) {
      this.loadedCss.add(entry.css);
      document.head.appendChild(el('link', { attrs: { rel: 'stylesheet', href: entry.css } }));
    }

    let mod;
    try {
      mod = await entry.load();
    } catch (err) {
      console.error(`[App] failed to load level "${id}"`, err);
      this.navigateHome();
      return;
    }

    // The route may have changed while the module was loading (fast back-nav).
    if (window.location.hash !== `#/level/${id}`) return;

    const level = mod.default;
    const ctx = {
      debug: App.DEBUG,
      isReplay: Progress.isCompleted(id),
      complete: () => {
        Progress.complete(id);
        this.navigateHome();
      },
      exit: () => this.navigateHome(),
    };

    App.debug('mounting level', id);
    this.currentCleanup = level.mount(this.levelRoot, ctx) || null;
  }

  _closeCurrentLevel() {
    if (this.currentCleanup) {
      try {
        this.currentCleanup();
      } catch (err) {
        console.warn('[App] level cleanup failed', err);
      }
      this.currentCleanup = null;
    }
    clear(this.levelRoot);
  }
}
