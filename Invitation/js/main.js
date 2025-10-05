document.addEventListener('DOMContentLoaded', () => {
    // Enable debug mode with URL parameter ?debug=true
    Game.DEBUG_MODE = new URLSearchParams(window.location.search).get('debug') === 'true';
    
    if (Game.DEBUG_MODE) {
        console.log('[DEBUG] Debug mode enabled');
    }

    // Fix for mobile viewport height
    const setVH = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);

    // Initialize loading system
    initializeLoading();
});

function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.getElementById('progress-fill');
    const loadingText = document.getElementById('loading-text');
    
    const preloader = new AssetPreloader();
    let loadingTimeout;
    
    // Set up progress callback
    preloader.setProgressCallback((progress, loaded, total) => {
        progressFill.style.width = `${progress}%`;
        loadingText.textContent = `Chargement des assets... ${loaded}/${total}`;
    });
    
    // Set a timeout to prevent infinite loading
    loadingTimeout = setTimeout(() => {
        loadingText.textContent = 'Assez attendu...';
        progressFill.style.width = '100%';
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                const game = new Game(LEVELS);
                game.init();
            }, 500);
        }, 500);
    }, 15000); // 15 second timeout
    
    // Start preloading
    preloader.preload()
        .then(() => {
            // Clear timeout since loading completed successfully
            clearTimeout(loadingTimeout);
            
            // All assets loaded successfully
            loadingText.textContent = 'Chargement terminé !';
            progressFill.style.width = '100%';
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                // Initialize the game after loading screen is hidden
                setTimeout(() => {
                    const game = new Game(LEVELS);
                    game.init();
                }, 500);
            }, 500);
        })
        .catch((error) => {
            // Clear timeout since we're handling the error
            clearTimeout(loadingTimeout);
            
            console.error('Error loading assets:', error);
            loadingText.textContent = 'Erreur de chargement, redémarrage...';
            
            // Still try to start the game even if some assets failed
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    const game = new Game(LEVELS);
                    game.init();
                }, 500);
            }, 2000);
        });
}