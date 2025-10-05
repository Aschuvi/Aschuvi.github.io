class Game {
    static DEBUG_MODE = false; // Global debug toggle
    static QUESTIONS_PER_LEVEL = 1; // Number of questions to ask after each level

    static debug(functionName, ...args) {
        if (Game.DEBUG_MODE) {
            console.log(`[DEBUG] ${functionName}:`, ...args);
        }
    }

    constructor(levels) {
        this.levels = levels;
        this.currentLevelIndex = 0;
        this.currentLevel = null;
        this.isGameActive = false;
        this.currentQuestion = null;
        this.currentQuestionIndex = 0; // Track which question to show for levels with multiple questions
        this.currentDialogueIndex = 0; // Track current dialogue line
        this.dialogueType = null;
        this.preventDialogueProgress = false;
        this.inviteName = new URLSearchParams(window.location.search).get('invite') || 'Toi';
        this.playerFacingRight = false; // Track player direction
        this.blockRender = false;
        this.enemyHitOnLastMove = null;
        Game.debug('constructor', { levels: levels.length, inviteName: this.inviteName });
    }

    init() {
        this.loadLevel(this.currentLevelIndex);
        this.setupControls();
        this.setupClickControls();
        this.setupResetButton();
        this.setupDialogueControls();
        this.setupBackgroundMusic();
        this.isGameActive = false;
        this.render();
        this.showIntroDialogue();
    }

    showIntroDialogue() {
        Game.debug('Game.showIntroDialogue', {
            hasIntroDialogue: !!INTRO_DIALOGUE,
            dialogueLength: INTRO_DIALOGUE.length
        });

        document.getElementById('success-overlay').classList.remove('hidden');
        this.currentDialogueIndex = 0;
        this.showDialogueLine(INTRO_DIALOGUE, () => {
            // When intro is done, hide overlay and start game
            Game.debug('Game.showIntroDialogue', 'Intro complete, starting game');
            document.getElementById('success-overlay').classList.add('hidden');
            this.isGameActive = true;
        }, 'intro');
    }

    setupDialogueControls() {
        const dialogueContainer = document.getElementById('dialogue-container');
        
        // Handle click on the entire overlay
        dialogueContainer.addEventListener('click', () => {
            if (!dialogueContainer.classList.contains('hidden') && !this.preventDialogueProgress) {
                this.progressDialogue();
            }
        });

        // Handle Enter key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !dialogueContainer.classList.contains('hidden') && !this.preventDialogueProgress) {
                this.progressDialogue();
            }
        });
    }

    setupResetButton() {
        const resetBtn = document.getElementById('reset-btn');
        resetBtn.addEventListener('click', () => {
            Game.debug('Game.resetLevel', { levelIndex: this.currentLevelIndex });
            this.currentLevel.reset();
            this.isGameActive = true;
            this.render();
        }, 'level');
    }

    setupBackgroundMusic() {
        const music = document.getElementById('background-music');
        const muteBtn = document.getElementById('mute-btn');
        
        // Most browsers require a user interaction before playing audio
        const startMusic = () => {
            music.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
            // Remove the event listeners once music starts
            document.removeEventListener('click', startMusic);
            document.removeEventListener('keydown', startMusic);
        };
        
        // Add event listeners for both click and keydown to start music
        document.addEventListener('click', startMusic);
        document.addEventListener('keydown', startMusic);

        // Setup mute button
        muteBtn.addEventListener('click', () => {
            if (music.muted) {
                music.muted = false;
                muteBtn.textContent = '♪';
                muteBtn.classList.remove('muted');
            } else {
                music.muted = true;
                muteBtn.textContent = '♫';
                muteBtn.classList.add('muted');
            }
        });
    }

    setupClickControls() {
        const gridElement = document.getElementById('game-grid');
        gridElement.addEventListener('click', (event) => {
            if (!this.isGameActive) return;

            const cellElement = event.target.closest('.grid-cell');
            if (!cellElement) return;

            // Find the clicked cell's coordinates
            const row = cellElement.parentElement;
            const y = Array.from(row.parentElement.children).indexOf(row);
            const x = Array.from(row.children).indexOf(cellElement);

            Game.debug('Game.handleClick', { x, y });

            // Check if the clicked cell is adjacent to the player
            const direction = this.currentLevel.getDirectionToCell(x, y);
            if (direction) {
                this.handleMove(direction);
            }
        });
    }

    getCurrentLevelQuestion() {
        Game.debug('Game.getCurrentLevelQuestion', {
            levelIndex: this.currentLevelIndex,
            hasQuestions: !!LEVEL_QUESTIONS[this.currentLevelIndex]
        });

        const levelQuestions = LEVEL_QUESTIONS[this.currentLevelIndex];
        if (!levelQuestions) {
            console.error('No questions defined for level:', this.currentLevelIndex);
            return null;
        }
        return levelQuestions[this.currentQuestionIndex];
    }

    showQuestion() {
        Game.debug('Game.showQuestion', {
            levelIndex: this.currentLevelIndex,
            hasQuestions: !!LEVEL_QUESTIONS[this.currentLevelIndex]
        });

        const questionContainer = document.getElementById('question-container');
        const questionSpeaker = document.getElementById('question-speaker');
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        
        // Get the current level's question
        this.currentQuestion = this.getCurrentLevelQuestion();
        if (!this.currentQuestion) {
            return;
        }

        // Extract speaker and text from the question
        const { speaker, text } = this.extractSpeakerAndText(this.currentQuestion.question);
        
        // Display the question
        questionSpeaker.textContent = speaker;
        questionText.textContent = text;

        // Update speaker image
        const speakerImage = document.getElementById('speaker-image');
        if (speaker === 'Simon') {
            speakerImage.src = 'assets/images/ChampUuuu.png'; // Different image for questions
            speakerImage.classList.remove('hidden');
        }
        else if (speaker === 'Manon') {
            speakerImage.src = 'assets/images/Champi.png'; // Different image for questions
            speakerImage.classList.remove('hidden');
        }
        else if (speaker === 'Jean-Michel Explications') {
            speakerImage.src = 'assets/images/JeanMichelExplications.png'; // Different image for questions
            speakerImage.classList.remove('hidden');
        }
        else {
            speakerImage.classList.add('hidden');
        }
        optionsContainer.innerHTML = '';
        questionContainer.classList.remove('hidden');

        // Create option buttons
        this.currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.addEventListener('click', () => this.handleAnswer(index));
            optionsContainer.appendChild(button);
        });
    }

    proceedToNextLevel() {
        Game.debug('Game.proceedToNextLevel', {
            levelIndex: this.currentLevelIndex,
            hasQuestions: !!LEVEL_QUESTIONS[this.currentLevelIndex]
        });

        const successOverlay = document.getElementById('success-overlay');
        const questionContainer = document.getElementById('question-container');
        
        // Remove winning class from player
        const playerCell = document.querySelector('.grid-cell.p.winning, .grid-cell.tp.winning');
        if (playerCell) {
            playerCell.classList.remove('winning');
        }
        
        successOverlay.classList.add('hidden');
        questionContainer.classList.add('hidden');
        this.currentLevelIndex++;
        this.currentQuestionIndex = 0; // Reset question index for new level
        this.loadLevel(this.currentLevelIndex);
        this.isGameActive = true;
    }

    handleAnswer(selectedIndex) {
        Game.debug('Game.handleAnswer', {
            levelIndex: this.currentLevelIndex,
            hasQuestions: !!LEVEL_QUESTIONS[this.currentLevelIndex]
        });

        const optionButtons = document.querySelectorAll('.option-button');
        const questionContainer = document.getElementById('question-container');

        // Disable all buttons
        optionButtons.forEach(button => button.disabled = true);
        
        // Show correct/incorrect feedback
        const isCorrect = selectedIndex === this.currentQuestion.correctAnswer;
        optionButtons[this.currentQuestion.correctAnswer].classList.add('correct');
        
        if (isCorrect) {
            // Check if there are more questions for this level
            const levelQuestions = LEVEL_QUESTIONS[this.currentLevelIndex];
            this.currentQuestionIndex++;
            
            if (this.currentQuestionIndex < levelQuestions.length) {
                // Show next question after delay
                setTimeout(() => {
                    this.showQuestion();
                }, 1000);
            } else {
                // No more questions, proceed to next level
                setTimeout(() => {
                    this.proceedToNextLevel();
                }, 1000);
            }
        } else {
            // Show incorrect answer
            optionButtons[selectedIndex].classList.add('incorrect');
            // Short delay then show game over message
            setTimeout(() => {
                questionContainer.classList.add('hidden');
                this.currentQuestionIndex = 0; // Reset question index when restarting level
                this.gameOver();
            }, 1000);
        }
    }

    loadLevel(levelIndex) {
        Game.debug('Game.loadLevel', {
            levelIndex: levelIndex,
            hasLevels: !!this.levels[levelIndex]
        });

        if (levelIndex >= this.levels.length) {
            this.gameWon();
            return;
        }
        const levelData = this.levels[levelIndex];
        this.currentLevel = new Level(this, levelData.grid, levelData.maxMoves, levelData.trapType);
        this.render();
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            if (!this.isGameActive) return;

            const key = event.key.toLowerCase();
            let direction = null;

            switch (key) {
                case 'arrowup':
                case 'z':
                    direction = 'up';
                    break;
                case 'arrowdown':
                case 's':
                    direction = 'down';
                    break;
                case 'arrowleft':
                case 'q':
                    direction = 'left';
                    break;
                case 'arrowright':
                case 'd':
                    direction = 'right';
                    break;
            }

            if (direction) {
                this.handleMove(direction);
            }
        });
    }

    handleMove(direction) {
        Game.debug('Game.handleMove', { direction });

        // Update facing direction
        if (direction === 'right') {
            this.playerFacingRight = true;
        } else if (direction === 'left') {
            this.playerFacingRight = false;
        }
        
        // Try to move
        const moved = this.currentLevel.movePlayer(direction);
        this.currentLevel.currentMoves++;
        if (!this.blockRender) {
            this.render();
        }
        
        // If position didn't change, it means we punch an obstacle
        if (!moved) {
            const playerCell = document.querySelector('.grid-cell.p, .grid-cell.tp');
            if (playerCell) {
                playerCell.classList.add('punch');
                setTimeout(() => {
                    const updatedPlayerCell = document.querySelector('.grid-cell.p, .grid-cell.tp');
                    if (updatedPlayerCell) {
                        updatedPlayerCell.classList.remove('punch', 'punch-right');
                    }
                }, 300);
            }
        }
        
        if (this.currentLevel.isWon()) {
            this.levelComplete();
        } else if (this.currentLevel.isGameOver()) {
            this.gameOver();
        }
    }

    render() {
        Game.debug('Game.render');
        
        const gridElement = document.getElementById('game-grid');
        const movesProgressFill = document.getElementById('moves-progress-fill');
        const movesCounterText = document.getElementById('moves-counter-text');

        // Clear existing grid
        gridElement.innerHTML = '';
        
        // Add level-specific classes
        gridElement.className = '';
        if (this.currentLevelIndex === 0) {
            gridElement.classList.add('level-1');
        } else if (this.currentLevelIndex === 1) {
            gridElement.classList.add('level-2');
        } else if (this.currentLevelIndex === 2) {
            gridElement.classList.add('level-3');
        } else if (this.currentLevelIndex === 3) {
            gridElement.classList.add('level-4');
        } else if (this.currentLevelIndex === 4) {
            gridElement.classList.add('level-5');
        } else if (this.currentLevelIndex === 5) {
            gridElement.classList.add('level-6');
        } else if (this.currentLevelIndex === 6) {
            gridElement.classList.add('level-7');
        }

        // Render grid
        this.currentLevel.grid.forEach((row, y) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'grid-row';

            row.forEach((cell, x) => {
                const cellElement = document.createElement('div');
                const cellClass = cell.toLowerCase();
                cellElement.className = `grid-cell ${cellClass}`;
                
                // Add active class to active traps
                if (cellClass.includes('t') && this.currentLevel.trapsState[`${x},${y}`]) {
                    cellElement.classList.add('active');
                }

                // Add facing direction class to player
                if (cellClass === 'p' || cellClass === 'tp') {
                    if (this.playerFacingRight) {
                        cellElement.classList.add('facing-right');
                    }
                }

                // handle enemy hit on last move
                if (this.enemyHitOnLastMove && this.enemyHitOnLastMove.x === x && this.enemyHitOnLastMove.y === y) {
                    cellElement.classList.add('hit');
                    setTimeout(() => {
                        cellElement.classList.remove('hit');
                    }, 300);
                }
                
                cellElement.setAttribute('data-type', cell);
                cellElement.setAttribute('data-position', `${x},${y}`);
                rowElement.appendChild(cellElement);
            });

            gridElement.appendChild(rowElement);
        });

        // Update moves counter progress bar
        const movesLeft = this.currentLevel.maxMoves - this.currentLevel.currentMoves;
        const progressPercentage = (movesLeft / this.currentLevel.maxMoves) * 100;
        
        movesProgressFill.style.width = `${progressPercentage}%`;
        movesCounterText.textContent = `${movesLeft}`;
        
        // Change text color based on progress - if more than 50% filled, use white text
        if (progressPercentage > 50) {
            movesCounterText.classList.add('over-fill');
        } else {
            movesCounterText.classList.remove('over-fill');
        }
    }

    levelComplete() {
        Game.debug('Game.levelComplete', {
            levelIndex: this.currentLevelIndex,
            hasLevelDialogues: !!LEVEL_DIALOGUES[this.currentLevelIndex]
        });

        this.isGameActive = false;
        // Add winning class to player
        const playerCell = document.querySelector('.grid-cell.p, .grid-cell.tp');
        if (playerCell) {
            playerCell.classList.add('winning');
        }

        // Show success overlay after 1 second
        setTimeout(() => {
            document.getElementById('success-overlay').classList.remove('hidden');
            this.currentDialogueIndex = 0;
            this.showDialogue();
        }, 1000);
    }

    showDialogue() {
        Game.debug('Game.showDialogue', {
            levelIndex: this.currentLevelIndex,
            hasLevelDialogues: !!LEVEL_DIALOGUES[this.currentLevelIndex]
        });

        const levelDialogues = LEVEL_DIALOGUES[this.currentLevelIndex];
        this.showDialogueLine(levelDialogues, () => {
            // When dialogue is done, show the question
            document.getElementById('dialogue-container').classList.add('hidden');
            this.showQuestion();
        }, 'level');
    }

    extractSpeakerAndText(text) {
        // Check if text starts with a speaker name (e.g., "Manon: ")
        const match = text.match(/^([^:]+):\s*"(.+)"$/);
        const result = match ? {
            speaker: match[1].trim(),
            text: match[2].trim()
        } : {
            speaker: "Narrateur",
            text: text
        };
        
        Game.debug('Game.extractSpeakerAndText', {
            input: text,
            result: result
        });
        
        return result;
    }

    showDialogueLine(dialogueLines, onComplete, dialogueType) {
        Game.debug('Game.showDialogueLine', {
            hasDialogues: !!dialogueLines,
            currentIndex: this.currentDialogueIndex,
            totalLines: dialogueLines ? dialogueLines.length : 0,
            hasCallback: !!onComplete
        });

        const dialogueContainer = document.getElementById('dialogue-container');
        const dialogueText = document.getElementById('dialogue-text');

        if (!dialogueLines || this.currentDialogueIndex >= dialogueLines.length) {
            // No more dialogues, call completion callback
            Game.debug('Game.showDialogueLine', 'No more dialogues, completing');
            if (onComplete) onComplete();
            return;
        }

        // Get the current line and substitute the invitee's name
        let text = dialogueLines[this.currentDialogueIndex];
        text = text.replace('XXX', this.inviteName);

        // Extract speaker and text
        const { speaker, text: message } = this.extractSpeakerAndText(text);

        // Create or update speaker name element
        let speakerElement = dialogueContainer.querySelector('.speaker-name');
        if (!speakerElement) {
            speakerElement = document.createElement('div');
            speakerElement.className = 'speaker-name';
            dialogueContainer.insertBefore(speakerElement, dialogueText);
        }
        speakerElement.textContent = speaker;

        // Update speaker image
        const speakerImage = document.getElementById('speaker-image');
        if (speaker === 'Simon') {
            speakerImage.src = dialogueType === 'intro' ? 'assets/images/ChampWoups.png' : 'assets/images/ChampUuuu.png';
            speakerImage.classList.remove('hidden');
        }  
        else if (speaker === 'Manon') {
            speakerImage.src = dialogueType === 'intro' ? 'assets/images/ChampiAngry.png' : 'assets/images/Champi.png';
            speakerImage.classList.remove('hidden');
        }
        else if (speaker === 'Jean-Michel Explications') {
            speakerImage.src = 'assets/images/JeanMichelExplications.png'; // Different image for questions
            speakerImage.classList.remove('hidden');
        }
        else {
        speakerImage.classList.add('hidden');
        }

        // Update text
        dialogueText.textContent = message;
        dialogueContainer.classList.remove('hidden');
        this.currentOnDialogueComplete = onComplete;
        this.dialogueType = dialogueType;
    }

    progressDialogue() {
        Game.debug('Game.progressDialogue', {
            currentIndex: this.currentDialogueIndex,
            isLevelDialogue: this.dialogueType === 'level',
            levelIndex: this.currentLevelIndex
        });

        this.currentDialogueIndex++;
        this.showDialogueLine(
            this.dialogueType === 'level' ? LEVEL_DIALOGUES[this.currentLevelIndex] : this.dialogueType === 'intro' ? INTRO_DIALOGUE : [],
            this.currentOnDialogueComplete,
            this.dialogueType
        );
    }

    gameOver() {
        this.isGameActive = false;
        this.preventDialogueProgress = true;
        document.getElementById('success-overlay').classList.remove('hidden');
        
        // Show game over dialogue
        const dialogueContainer = document.getElementById('dialogue-container');
        const dialogueText = document.getElementById('dialogue-text');
        let speakerElement = dialogueContainer.querySelector('.speaker-name');
        
        if (!speakerElement) {
            speakerElement = document.createElement('div');
            speakerElement.className = 'speaker-name';
            dialogueContainer.insertBefore(speakerElement, dialogueText);
        }
        
        const speakerImage = document.getElementById('speaker-image');
        speakerImage.src = 'assets/images/ChampiAngry.png'; // Different image for questions
        speakerImage.classList.remove('hidden');

        speakerElement.textContent = 'Manon';
        dialogueText.textContent = 'Simon, tu fais de la merde !';
        dialogueContainer.classList.remove('hidden');
        
        // Add click handler to restart level
        const handleRestart = () => {
            document.getElementById('success-overlay').classList.add('hidden');
            dialogueContainer.classList.add('hidden');
            this.loadLevel(this.currentLevelIndex);
            this.preventDialogueProgress = false;
            this.isGameActive = true;
            // Remove the event listeners
            document.removeEventListener('click', handleRestart);
            document.removeEventListener('keydown', handleRestart);
        };
        
        // Allow click or any key to restart
        document.addEventListener('click', handleRestart);
        document.addEventListener('keydown', handleRestart);
    }

    gameWon() {
        this.isGameActive = false;
        this.generateEndScreenContent();
        document.getElementById('end-screen').classList.remove('hidden');
    }

    generateEndScreenContent() {
        const endScreenContent = document.querySelector('.end-screen-content');
        
        endScreenContent.innerHTML = `
            <h1>🏆 Bravo ${this.inviteName} 🏆</h1>
            <div class="event-text">
                <p>On t'attend le <strong>22 novembre à partir de 12h30</strong> au <strong>66 avenue des Etats Unis à Versailles</strong>.</p>
                
                <p>Tu pourras te garer gratuitement rue de la ceinture ou payer sur le boulevard de la république. Tu n'as rien besoin d'apporter on (Manon) s'occupe de tout. Fais-toi tout beau ✨</p>
                
                <p>Merci d'avoir joué, on se voit vite 💖</p>

                <p>Cliquez sur le bouton en dessous pour confirmer ta présence et nous aider à organiser la fête !</p>
                
                <div class="confirmation-button-container">
                    <button id="confirm-presence-btn" class="confirmation-button">
                        Confirmer
                    </button>
                </div>
            </div>
        `;
        
        this.setupConfirmationButton();
    }

    setupConfirmationButton() {
        const confirmBtn = document.getElementById('confirm-presence-btn');
        confirmBtn.addEventListener('click', () => {
            window.open('https://docs.google.com/forms/d/e/1FAIpQLSe_F1-3TUCHwfAIujcCLmcBvGux_CMhmxeozdhqtrDtE6w2iA/viewform?usp=header', '_blank');
        });
    }
}
