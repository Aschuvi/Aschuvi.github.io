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

    // Initialize the game with levels
    const game = new Game(LEVELS);
    game.init();
});