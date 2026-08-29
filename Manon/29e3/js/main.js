import App from './core/App.js';
import AssetPreloader from './core/AssetPreloader.js';
import Progress from './core/Progress.js';
import { LEVELS } from './levels/index.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  App.DEBUG = params.get('debug') === 'true';
  if (App.DEBUG) console.log('[DEBUG] Debug mode enabled');

  if (params.get('reset') === '1') {
    Progress.reset();
    App.debug('progress reset via ?reset=1');
  }

  // iOS URL-bar viewport fix.
  const setVH = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);

  initializeLoading();
});

function buildManifest() {
  const manifest = { images: [], audio: [] };
  for (const entry of LEVELS) {
    if (!entry.assets) continue;
    if (entry.assets.images) manifest.images.push(...entry.assets.images);
    if (entry.assets.audio) manifest.audio.push(...entry.assets.audio);
  }
  return manifest;
}

function initializeLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  const progressFill = document.getElementById('progress-fill');
  const loadingText = document.getElementById('loading-text');

  const preloader = new AssetPreloader(buildManifest());
  let loadingTimeout;

  const boot = () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        const app = new App(LEVELS);
        app.start();
      }, 300);
    }, 300);
  };

  preloader.setProgressCallback((progress, loaded, total) => {
    progressFill.style.width = `${progress}%`;
    loadingText.textContent = total > 0 ? `Chargement... ${loaded}/${total}` : 'Chargement...';
  });

  // Never let a missing/slow asset hang the game.
  loadingTimeout = setTimeout(() => {
    loadingText.textContent = 'Assez attendu...';
    progressFill.style.width = '100%';
    boot();
  }, 15000);

  preloader
    .preload()
    .then(() => {
      clearTimeout(loadingTimeout);
      loadingText.textContent = 'Chargement terminé !';
      progressFill.style.width = '100%';
      boot();
    })
    .catch((err) => {
      clearTimeout(loadingTimeout);
      console.error('[main] error loading assets:', err);
      loadingText.textContent = 'Erreur de chargement, redémarrage...';
      setTimeout(boot, 1500);
    });
}
