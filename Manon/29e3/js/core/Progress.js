// Progress persistence — localStorage, wrapped so private-browsing / quota
// failures degrade to an in-memory fallback instead of crashing the game.

const STORAGE_KEY = '29e3:progress';

class Progress {
  constructor() {
    this._memory = { v: 1, completed: [] };
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { v: 1, completed: [] };
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.completed)) return { v: 1, completed: [] };
      return parsed;
    } catch (err) {
      console.warn('[Progress] falling back to in-memory storage:', err);
      return this._memory;
    }
  }

  _save(data) {
    this._memory = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('[Progress] could not persist progress:', err);
    }
  }

  isCompleted(id) {
    return this._load().completed.includes(id);
  }

  /** A level at position `number` (1-based) in `levels` is unlocked once every earlier level is completed. */
  isUnlocked(number, levels) {
    if (number <= 1) return true;
    const data = this._load();
    return levels
      .filter((lvl) => lvl.number < number)
      .every((lvl) => data.completed.includes(lvl.id));
  }

  complete(id) {
    const data = this._load();
    if (!data.completed.includes(id)) {
      data.completed.push(id);
      this._save(data);
    }
  }

  completedCount() {
    return this._load().completed.length;
  }

  reset() {
    this._save({ v: 1, completed: [] });
  }
}

// Singleton — one progress store for the whole app.
export default new Progress();
