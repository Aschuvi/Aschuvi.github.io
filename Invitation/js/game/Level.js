class Level {
    static TRAP_TYPES = {
        TOGGLE_OFF: 'toggle_off',  // Starts off, toggles on each move
        TOGGLE_ON: 'toggle_on',    // Starts on, toggles on each move
        ALWAYS_ON: 'always_on'     // Always active
    };

    constructor(game, gridData, maxMoves, trapType = Level.TRAP_TYPES.TOGGLE_OFF) {
        // Store initial grid state for reset
        this.Game = game;
        this.initialGrid = gridData.map(row => [...row]);
        this.grid = gridData.map(row => [...row]);
        this.maxMoves = maxMoves;
        this.currentMoves = 0;
        this.playerPosition = this.findPlayer();
        this.goalPosition = this.findGoal();
        this.trapsState = {}; // Keeps track of trap states (on/off)
        this.trapType = trapType;
        this.possessKey = false;
        this.initializeTraps();
        Game.debug('Level.constructor', { 
            gridSize: `${gridData.length}x${gridData[0].length}`,
            maxMoves,
            playerStart: this.playerPosition,
            goalPosition: this.goalPosition
        });
    }

    initializeTraps() {
        const initialState = this.trapType === Level.TRAP_TYPES.TOGGLE_ON || 
                           this.trapType === Level.TRAP_TYPES.ALWAYS_ON;
        
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.hasTrap(this.grid[y][x])) {
                    this.trapsState[`${x},${y}`] = initialState;
                }
            }
        }
    }

    hasTrap(cell) {
        return cell === 'T' || cell === 'TR' || cell === 'TP' || cell === 'TE';
    }

    hasKey(cell) {
        return cell === 'K' || cell === 'KR' || cell === 'KE';
    }

    getBaseObject(cell) {
        if (cell.length === 2 && (cell[0] === 'T' || cell[0] === 'K')) {
            return cell[1]; // Return R, P, or E
        }
        return cell;
    }

    createCombinedCell(base, underBase) {
        if (underBase === ' ') return base;
        return underBase + base;
    }

    findPlayer() {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const cell = this.grid[y][x];
                if (cell === 'P' || cell === 'TP') {
                    return { x, y };
                }
            }
        }
        throw new Error('No player starting position found!');
    }

    findGoal() {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === 'G') {
                    return { x, y };
                }
            }
        }
        throw new Error('No goal position found!');
    }

    isValidMove(x, y) {
        return x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length;
    }

    getCell(x, y) {
        return this.isValidMove(x, y) ? this.grid[y][x] : null;
    }

    // canMoveTo(x, y) {
    //     if (!this.isValidMove(x, y)) return false;
    //     const cell = this.getCell(x, y);
    //     if (cell === 'X') return false;
    //     if (cell === 'C' && !this.possessKey) return false;
    //     return true;
    // }

    isObstacle(x, y) {
        Game.debug('Level.isObstacle', { x, y });
        
        if (!this.isValidMove(x, y)) return true;
        const cell = this.getCell(x, y);
        if (cell === 'X') return true;
        if (cell === 'R') return true;
        if (cell === 'C') return true;
        if (cell === 'G') return true;
        if (cell === 'T' && this.trapsState[`${x},${y}`]) return true;
        return false;
    }

    handleEnemy(enemyX, enemyY, dx, dy) {
        Game.debug('Level.handleEnemy', { 
            from: { x: enemyX, y: enemyY },
            direction: { dx, dy }
        });
        
        const newX = enemyX + dx;
        const newY = enemyY + dy;

        // Check if enemy would hit an obstacle
        if (this.isObstacle(newX, newY)) {
            // Show death animation
            const enemyCell = document.querySelector(`.grid-cell[data-position="${enemyX},${enemyY}"]`);
            if (enemyCell) {
                enemyCell.classList.add('dying');
                this.Game.blockRender = true;
                setTimeout(() => {
                    // Enemy is killed
                    const currentTrap = this.hasTrap(this.grid[enemyY][enemyX]);
                    this.grid[enemyY][enemyX] = currentTrap ? 'T' : ' ';
                    this.Game.blockRender = false;
                    this.Game.render();
                }, 300);
            } else {
                // If we can't find the cell, kill enemy immediately
                const currentTrap = this.hasTrap(this.grid[enemyY][enemyX]);
                this.grid[enemyY][enemyX] = currentTrap ? 'T' : ' ';
            }
            return true; // Enemy was killed
        } else if (this.isValidMove(newX, newY)) {
            const targetCell = this.getCell(newX, newY);
            const baseTarget = this.getBaseObject(targetCell);
            
            if (baseTarget === ' ' || baseTarget === 'T' || baseTarget === 'K') {
                // Move enemy, preserving traps
                const currentTrap = this.hasTrap(this.grid[enemyY][enemyX]);
                const currentKey = this.hasKey(this.grid[enemyY][enemyX]);
                
                this.grid[enemyY][enemyX] = currentTrap ? 'T' : currentKey ? 'K' : ' ';
                this.grid[newY][newX] = this.createCombinedCell('E', baseTarget);
                this.Game.enemyHitOnLastMove = { x: newX, y: newY };
                return false; // Enemy was moved
            }
        }
        return false; // Enemy couldn't move
    }

    toggleTraps() {
        // Don't toggle if traps are always on
        if (this.trapType === Level.TRAP_TYPES.ALWAYS_ON) {
            return;
        }
        
        // Toggle traps for TOGGLE_OFF and TOGGLE_ON types
        Object.keys(this.trapsState).forEach(key => {
            const [x, y] = key.split(',').map(Number);
            this.trapsState[key] = !this.trapsState[key];
            
            // If trap is turning on and there's an enemy on it, kill the enemy
            if (this.trapsState[key]) {
                const cell = this.grid[y][x];
                if (cell === 'TE') {
                    // Kill enemy, leave trap
                    
                    const enemyCell = document.querySelector(`.grid-cell[data-position="${x},${y}"]`);
                    if (enemyCell) {
                        enemyCell.classList.add('dying');
                        this.Game.blockRender = true;
                        setTimeout(() => {
                            // Enemy is killed
                            const currentTrap = this.hasTrap(this.grid[y][x]);
                            this.grid[y][x] = 'T';
                            this.Game.blockRender = false;
                            this.Game.render();
                        }, 300);
                    }
                    this.grid[y][x] = 'T';
                }
            }
        });
    }

    movePlayer(direction) {
        Game.debug('Level.movePlayer', { direction, currentMoves: this.currentMoves });
        this.Game.enemyHitOnLastMove = null;

        this.toggleTraps();

        const moves = {
            up: { dx: 0, dy: -1 },
            down: { dx: 0, dy: 1 },
            left: { dx: -1, dy: 0 },
            right: { dx: 1, dy: 0 }
        };

        const move = moves[direction];
        const newX = this.playerPosition.x + move.dx;
        const newY = this.playerPosition.y + move.dy;

        // Check if move is valid
        if (this.isValidMove(newX, newY)) 
        {
            const targetCell = this.getCell(newX, newY);
            const baseObject = this.getBaseObject(targetCell);
            const hasTargetTrap = this.hasTrap(targetCell);
            const hasTargetKey = this.hasKey(targetCell);
            let movePlayer = true;

            // Handle different cell types
            switch (baseObject) {
                case 'X':
                    movePlayer = false;
                    break;
                case 'C':
                    if (!this.possessKey) movePlayer = false;
                    break;
                case 'K':
                    this.possessKey = true;
                    break;
                case 'R':
                    // Check if rock can be pushed
                    movePlayer = false;
                    const rockNewX = newX + move.dx;
                    const rockNewY = newY + move.dy;
                    const targetCell = this.getBaseObject(this.getCell(rockNewX, rockNewY));
                    
                    // Only allow pushing rock onto empty spaces or traps
                    if (!this.isValidMove(rockNewX, rockNewY) || !['', ' ', 'T', 'K'].includes(targetCell)) {
                        break;
                    }
                    // Move rock and allow player to move into rock's previous position
                    this.grid[rockNewY][rockNewX] = this.createCombinedCell('R', targetCell);
                    this.grid[newY][newX] = hasTargetTrap ? 'T' : hasTargetKey ? 'K' : ' ';
                    break;
                case 'E':
                    // Handle enemy push
                    this.handleEnemy(newX, newY, move.dx, move.dy);
                    movePlayer = false;
                    break;
            }

            // Update grid
            if (movePlayer) {
                const currentTrap = this.hasTrap(this.grid[this.playerPosition.y][this.playerPosition.x]);
                this.grid[this.playerPosition.y][this.playerPosition.x] = currentTrap ? 'T' : ' ';
                this.grid[newY][newX] = this.createCombinedCell('P', hasTargetTrap ? 'T' : '');
                this.playerPosition = { x: newX, y: newY };
            
                // Handle trap effects
                if (hasTargetTrap && this.trapsState[`${newX},${newY}`]) {
                    this.currentMoves++; // Additional move point lost
                }
                
                return true;
            }
        }
        
        // we didn't move (punch, try oob, etc.), check if we are on an active trap
        
        const currentCell = this.getCell(this.playerPosition.x, this.playerPosition.y);
        const hasTargetTrap = this.hasTrap(currentCell);
        if (hasTargetTrap && this.trapsState[`${this.playerPosition.x},${this.playerPosition.y}`]) {
            this.currentMoves++; // Additional move point lost
        }
        return false;
    }

    isGameOver() {
        return this.currentMoves >= this.maxMoves;
    }

    static ADJACENT_POSITIONS = [
        { dx: 0, dy: -1, direction: 'up' }, // up
        { dx: 0, dy: 1, direction: 'down' },  // down
        { dx: -1, dy: 0, direction: 'left' }, // left
        { dx: 1, dy: 0, direction: 'right' }   // right
    ];

    findConnectedCells() {
        Game.debug('Level.findConnectedCells', { startPos: this.playerPosition });
        
        const connected = new Set(); // Store connected cells as "x,y" strings
        const toCheck = [[this.playerPosition.x, this.playerPosition.y]];
        const visited = new Set();

        while (toCheck.length > 0) {
            const [x, y] = toCheck.pop();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            // Don't add the player's position to connected cells
            if (!(x === this.playerPosition.x && y === this.playerPosition.y)) {
                connected.add(key);
            }

            // Check all four directions
            for (const { dx, dy } of Level.ADJACENT_POSITIONS) {
                const newX = x + dx;
                const newY = y + dy;
                const cell = this.getCell(newX, newY);

                // Add to check list if it's a valid cell and not a wall
                if (this.isValidMove(newX, newY) && cell !== 'X') {
                    toCheck.push([newX, newY]);
                }
            }
        }

        Game.debug('Level.findConnectedCells', { 
            connectedCount: connected.size,
            connected: Array.from(connected)
        });
        return connected;
    }

    getDirectionToCell(targetX, targetY) {
        Game.debug('Level.getDirectionToCell', {
            from: this.playerPosition,
            to: { x: targetX, y: targetY }
        });

        for (const pos of Level.ADJACENT_POSITIONS) {
            if (this.playerPosition.x + pos.dx === targetX && 
                this.playerPosition.y + pos.dy === targetY) {
                return pos.direction;
            }
        }
        return null;
    }

    isWon() {
        Game.debug('Level.isWon', {
            playerPos: this.playerPosition,
            goalPos: this.goalPosition
        });

        return Level.ADJACENT_POSITIONS.some(pos => {
            const isAdjacent = 
                this.playerPosition.x + pos.dx === this.goalPosition.x &&
                this.playerPosition.y + pos.dy === this.goalPosition.y;
            
            if (isAdjacent) {
                Game.debug('Level.isWon', `Player is adjacent to goal: ${JSON.stringify(pos)}`);
            }
            return isAdjacent;
        });
    }

    reset() {
        // Reset grid to initial state
        this.grid = this.initialGrid.map(row => [...row]);
        
        // Reset moves counter
        this.currentMoves = 0;
        
        // Reset player position
        this.playerPosition = this.findPlayer();
        
        // Reset key status
        this.possessKey = false;
        
        // Reset traps
        this.trapsState = {};
        this.initializeTraps();
        
        Game.debug('Level.reset', {
            playerPos: this.playerPosition,
            moves: this.currentMoves
        });
    }
}
