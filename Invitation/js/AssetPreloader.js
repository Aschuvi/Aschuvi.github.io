class AssetPreloader {
    constructor() {
        this.assets = {
            images: [
                'assets/images/champ_hit_right.png',
                'assets/images/champ_hit.png',
                'assets/images/champ_rest_1_right.png',
                'assets/images/champ_rest_1.png',
                'assets/images/champ_rest_2_right.png',
                'assets/images/champ_rest_2.png',
                'assets/images/champ_sourire.png',
                'assets/images/champ_win.png',
                'assets/images/champ_woups.png',
                'assets/images/champ_down.png',
                'assets/images/Champi.png',
                'assets/images/ChampiAngry.png',
                'assets/images/ChampUuuu.png',
                'assets/images/ChampWoups.png',
                'assets/images/chest.png',
                'assets/images/enemy_1_left.png',
                'assets/images/enemy_1.png',
                'assets/images/Enemy_down.png',
                'assets/images/Enemy_hit.png',
                'assets/images/enemy_left.png',
                'assets/images/enemy.png',
                'assets/images/key.png',
                'assets/images/letter.png',
                'assets/images/levels/Level1.png',
                'assets/images/levels/Level2.png',
                'assets/images/levels/Level3.png',
                'assets/images/levels/Level4.png',
                'assets/images/levels/Level5.png',
                'assets/images/levels/Level6.png',
                'assets/images/levels/Level7.png',
                'assets/images/lock.png',
                'assets/images/rock.png',
                'assets/images/spikes_down.png',
                'assets/images/spikes_up.png',
                'assets/images/JeanMichelExplications.png',
                'assets/images/clues/level4.png',
                'assets/images/clues/Level6.png',
                'assets/images/clues/Level7.png'
            ],
            audio: [
                'assets/musics/background-music.mp3'
            ]
        };
        
        this.loadedCount = 0;
        this.totalAssets = this.assets.images.length + this.assets.audio.length;
        this.onProgress = null;
        this.onComplete = null;
        this.onError = null;
    }

    preload() {
        return new Promise((resolve, reject) => {
            this.onComplete = resolve;
            this.onError = reject;
            
            // Preload images
            this.assets.images.forEach(src => {
                const img = new Image();
                img.onload = () => this.onAssetLoaded();
                img.onerror = () => this.onAssetError(src);
                img.src = src;
            });
            
            // Preload audio
            this.assets.audio.forEach(src => {
                const audio = new Audio();
                audio.oncanplaythrough = () => this.onAssetLoaded();
                audio.onerror = () => this.onAssetError(src);
                audio.src = src;
            });
        });
    }

    onAssetLoaded() {
        this.loadedCount++;
        const progress = (this.loadedCount / this.totalAssets) * 100;
        
        if (this.onProgress) {
            this.onProgress(progress, this.loadedCount, this.totalAssets);
        }
        
        if (this.loadedCount === this.totalAssets) {
            if (this.onComplete) {
                this.onComplete();
            }
        }
    }

    onAssetError(src) {
        console.warn(`Failed to load asset: ${src}`);
        // Continue loading even if some assets fail
        this.onAssetLoaded();
    }

    // Method to get loading status
    getLoadingStatus() {
        return {
            loaded: this.loadedCount,
            total: this.totalAssets,
            progress: (this.loadedCount / this.totalAssets) * 100
        };
    }

    setProgressCallback(callback) {
        this.onProgress = callback;
    }
}
