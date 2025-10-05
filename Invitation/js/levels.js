const LEVELS = [
    {
        grid: [
            ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', ' ', 'P', 'X'],
            ['X', 'X', ' ', ' ', 'E', ' ', ' ', 'X'],
            ['X', 'X', ' ', 'E', ' ', 'E', 'X', 'X'],
            ['X', ' ', ' ', 'X', 'X', 'X', 'X', 'X'],
            ['X', ' ', 'R', ' ', ' ', 'R', ' ', 'X'],
            ['X', ' ', 'R', ' ', 'R', ' ', ' ', 'G']
        ],
        maxMoves: 23
    },
    {
        grid: [
            ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
            ['X', ' ', ' ', ' ', ' ', 'X', 'X', 'X'],
            ['X', 'E', 'X', 'T', 'T', ' ', ' ', 'X'],
            [' ', 'T', 'X', 'X', 'TR', 'TR', 'R', 'X'],
            [' ', ' ', 'X', 'X', ' ', 'T', ' ', 'X'],
            ['P', ' ', 'X', 'X', ' ', 'E', ' ', 'X'],
            ['X', 'X', 'X', 'X', 'G', ' ', 'E', 'X']
        ],
        maxMoves: 24,
        trapType: Level.TRAP_TYPES.ALWAYS_ON
    },
    {
        grid: [
            ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'G', ' ', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'X', 'C', 'X'],
            ['X', 'X', ' ', 'T', 'T', ' ', ' ', 'P'],
            ['X', 'X', 'T', 'X', 'T', 'X', ' ', ' '],
            ['X', 'X', ' ', ' ', 'E', 'T', 'T', 'X'],
            ['K', 'X', 'T', 'X', 'T', 'X', ' ', 'X'],
            [' ', ' ', ' ', ' ', ' ', 'E', ' ', 'X']
        ],
        maxMoves: 32,
        trapType: Level.TRAP_TYPES.ALWAYS_ON
    },
    {
        grid: [
            ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
            ['P', 'X', 'K', ' ', 'R', 'X', 'X', 'X', 'X'],
            [' ', 'R', 'T', 'TR', ' ', 'C', ' ', 'X', 'X'],
            ['R', ' ', 'R', ' ', 'R', 'R', ' ', 'G', 'X'],
            [' ', 'R', ' ', 'R', ' ', 'R', 'R', ' ', 'X'],
            ['X', ' ', 'R', ' ', 'R', ' ', 'X', 'X', 'X']
        ],
        maxMoves: 23,
        trapType: Level.TRAP_TYPES.ALWAYS_ON
    },
    {
        grid: [
            ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', ' ', 'G', 'X', 'X'],
            ['X', 'X', 'X', ' ', 'C', 'R', ' ', 'X'],
            ['X', 'P', 'X', 'T', ' ', 'R', ' ', 'X'],
            ['X', ' ', 'X', ' ', 'T', ' ', 'T', 'X'],
            ['X', 'E', 'X', 'R', 'R', 'R', 'R', 'X'],
            ['X', 'T', ' ', 'T', ' ', ' ', 'T', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'X', 'K', 'X']
        ],
        maxMoves: 23,
        trapType: Level.TRAP_TYPES.TOGGLE_OFF
    },
    {
        grid: [
            ['X', ' ', 'P', ' ', 'X', 'X', 'X'],
            ['X', 'R', 'R', 'R', 'X', 'X', 'X'],
            [' ', ' ', ' ', 'K', 'X', 'X', 'X'],
            ['X', 'T', 'TR', ' ', ' ', 'X', 'X'],
            ['X', 'E', 'X', 'R', 'R', ' ', ' '],
            ['X', ' ', ' ', 'R', ' ', 'E', 'X'],
            ['X', 'X', 'X', 'X', 'C', 'R', ' '],
            ['X', 'X', 'X', 'X', ' ', 'G', 'X']
        ],
        maxMoves: 43,
        trapType: Level.TRAP_TYPES.TOGGLE_OFF
    },
    {
        grid: [
            ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'G', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', ' ', ' ', ' ', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'R', 'C', 'R', 'X', 'X', 'X'],
            ['X', 'R', 'X', 'R', ' ', ' ', 'X', ' ', 'X'],
            ['R', ' ', ' ', 'R', 'R', 'R', ' ', ' ', 'K'],
            [' ', 'R', 'R', 'R', ' ', ' ', 'R', 'R', ' '],
            ['X', 'P', ' ', 'R', ' ', ' ', 'R', ' ', 'X']
        ],
        maxMoves: 33,
        trapType: Level.TRAP_TYPES.TOGGLE_OFF
    },
];


/*
P: Player
R: Pushable rocks
T: Toggle traps
G: Goal
X: Walls
C: Treasure chests
K: Keys
E: Enemies
*/