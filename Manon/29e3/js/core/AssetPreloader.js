// Promise-based asset preloader.
// Adapted from Invitation/js/AssetPreloader.js: a failed asset is treated as
// "loaded" (with a console warning) so one missing file never hangs the game.

export default class AssetPreloader {
  constructor(manifest = { images: [], audio: [] }) {
    this.assets = {
      images: manifest.images || [],
      audio: manifest.audio || [],
    };

    this.loadedCount = 0;
    this.totalAssets = this.assets.images.length + this.assets.audio.length;
    this.onProgress = null;
  }

  preload() {
    if (this.totalAssets === 0) {
      if (this.onProgress) this.onProgress(100, 0, 0);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this._onComplete = resolve;

      this.assets.images.forEach((src) => {
        const img = new Image();
        img.onload = () => this._onAssetLoaded();
        img.onerror = () => this._onAssetError(src);
        img.src = src;
      });

      this.assets.audio.forEach((src) => {
        const audio = new Audio();
        audio.oncanplaythrough = () => this._onAssetLoaded();
        audio.onerror = () => this._onAssetError(src);
        audio.src = src;
      });
    });
  }

  _onAssetLoaded() {
    this.loadedCount++;
    const progress = (this.loadedCount / this.totalAssets) * 100;

    if (this.onProgress) this.onProgress(progress, this.loadedCount, this.totalAssets);
    if (this.loadedCount === this.totalAssets && this._onComplete) this._onComplete();
  }

  _onAssetError(src) {
    console.warn(`[AssetPreloader] failed to load asset: ${src}`);
    this._onAssetLoaded();
  }

  setProgressCallback(callback) {
    this.onProgress = callback;
  }
}
