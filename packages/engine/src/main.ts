// Minimum players required to start a game.
const MINIMUM_PLAYER_COUNT = 2;

// The valid states for a game to be in.
type GameState = "lobbying" | "playing" | "finished";

/**
 * Create a new game of Shiritori.
 * @param Player The type of the players.
 * @param Word The type of the words.
 * @example
 * const game = new Game<string, string>();
 * const lobby = game.startLobby();
 */
export class Game<Player, Word> {
    /**
     * Start a lobby for a game of Shiritori.
     * @returns {LobbyingGame<Player, Word>} A game of Shiritori that is in the
     * lobbying state.
     */
    startLobby(): LobbyingGame<Player, Word> {
        return new LobbyingGame<Player, Word>();
    }
}

/**
 * A game of Shiritori that is in the lobbying state.
 * CAUTION: This class should not be instantiated directly, use
 * `Game.startLobby()` instead.
 * @param Player The type of the players.
 * @param Word The type of the words.
 * @example
 * const game = new Game<string, string>();
 * const lobby = game.startLobby();
 * lobby.addPlayer("player1");
 * lobby.addPlayer("player2");
 * const runningGame = lobby.startGame();
 */
class LobbyingGame<Player, Word> {
    /**
     * The state of the game.
     */
    state: GameState;

    /**
     * The players in the game.
     */
    players: Set<Player>;

    constructor() {
        this.state = "lobbying";

        this.players = new Set<Player>();
    }

    /**
     * Add players to the game.
     * @param player The player to add to the game.
     */
    addPlayer(player: Player) {
        this.players.add(player);
    }

    /**
     * Start a running game of Shiritori.
     * @returns {RunningGame<Player, Word>} A game of Shiritori that is in the
     * playing state.
     */
    startGame(): RunningGame<Player, Word> {
        if (this.players.size < MINIMUM_PLAYER_COUNT)
            throw new Error("not enough players");

        return new RunningGame<Player, Word>(this.players);
    }
}

/**
 * A game of Shiritori that is in the playing state.
 * CAUTION: This class should not be instantiated directly, use
 * `LobbyingGame.startGame()` instead.
 * @param Player The type of the players.
 * @param Word The type of the words.
 * @example
 * const game = new Game<string, string>();
 * const lobby = game.startLobby();
 * lobby.addPlayer("player1");
 * lobby.addPlayer("player2");
 * const runningGame = lobby.startGame();
 * runningGame.addWord("word1");
 * runningGame.addWord("word2");
 * runningGame.killCurrentPlayer();
 * const finishedGame = runningGame.getFinishedGame();
 */
class RunningGame<Player, Word> {
    /**
     * The state of the game.
     */
    state: GameState;

    /**
     * The players in the game.
     */
    players: Set<Player>;
    /**
     * The words that have been used in the game.
     */
    words: Set<Word>;

    /**
     * The player whose turn it is.
     */
    currentPlayer: Player;

    /**
     * The states of the players in the game.
     */
    playerAliveStates: Map<Player, boolean>;

    constructor(players: Set<Player>) {
        this.state = "playing";

        this.players = players;
        this.words = new Set<Word>();

        this.currentPlayer = [...this.players][0];

        this.playerAliveStates = new Map<Player, boolean>();
        for (const player of this.players) {
            this.playerAliveStates.set(player, true);
        }
    }

    /**
     * Adds a word to the game and cycles to the next player.
     * @param word The word to add to the game.
     */
    addWord(word: Word) {
        if (this.hasGameEnded()) throw new Error("game has ended");

        if (!this.playerAliveStates.get(this.currentPlayer))
            throw new Error("player is dead");
        if (this.words.has(word)) throw new Error("word already used");

        this.words.add(word);

        this.selectNextPlayer();
    }

    /**
     * Selects the next player in the game.
     */
    selectNextPlayer() {
        if (this.hasGameEnded()) throw new Error("game has ended");

        const players = [...this.players];

        do {
            const index = players.indexOf(this.currentPlayer);
            this.currentPlayer = players[(index + 1) % players.length];
        } while (!this.playerAliveStates.get(this.currentPlayer));
    }

    /**
     * Kills the current player and selects the next player.
     */
    killCurrentPlayer() {
        if (this.hasGameEnded()) throw new Error("game has ended");

        this.playerAliveStates.set(this.currentPlayer, false);

        if (!this.hasGameEnded()) this.selectNextPlayer();
    }

    /**
     * Checks whether the game has ended.
     * @returns {boolean} Whether the game has ended.
     */
    hasGameEnded(): boolean {
        return (
            [...this.playerAliveStates.values()].filter(Boolean).length === 1
        );
    }

    /**
     * Get an instance of a finished Shiritori game.
     * @returns {FinishedGame<Player, Word>} A game of Shiritori that is in the
     * finished state.
     */
    getFinishedGame(): FinishedGame<Player, Word> {
        if (!this.hasGameEnded()) throw new Error("game has not ended");

        return new FinishedGame<Player, Word>(
            this.players,
            this.words,
            this.playerAliveStates
        );
    }
}

/**
 * A game of Shiritori that is in the finished state.
 * CAUTION: This class should not be instantiated directly, use
 * `RunningGame.getFinishedGame()` instead.
 * @param Player The type of the players.
 * @param Word The type of the words.
 * @example
 * const game = new Game<string, string>();
 * const lobby = game.startLobby();
 * lobby.addPlayer("player1");
 * lobby.addPlayer("player2");
 * const runningGame = lobby.startGame();
 * runningGame.addWord("word1");
 * runningGame.addWord("word2");
 * runningGame.killCurrentPlayer();
 * const finishedGame = runningGame.getFinishedGame();
 * console.log(finishedGame.winner);
 */
class FinishedGame<Player, Word> {
    /**
     * The state of the game.
     */
    state: GameState;

    /**
     * The players in the game.
     */
    players: Set<Player>;
    /**
     * The words that have been used in the game.
     */
    words: Set<Word>;

    /**
     * The states of the players in the game.
     */
    playerAliveStates: Map<Player, boolean>;

    /**
     * The winner of the game.
     */
    winner: Player;

    constructor(
        players: Set<Player>,
        words: Set<Word>,
        playerAliveStates: Map<Player, boolean>
    ) {
        this.state = "finished";

        this.players = players;
        this.words = words;

        this.playerAliveStates = playerAliveStates;

        this.winner = [...this.playerAliveStates.entries()].filter(
            ([, alive]) => alive
        )[0][0];
    }
}
