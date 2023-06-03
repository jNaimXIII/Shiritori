const MINIMUM_PLAYER_COUNT = 2;

type GameState = "lobby" | "playing" | "finished";

class Game<Player, Word> {
    startLobby() {
        return new LobbyingGame<Player, Word>();
    }
}

class LobbyingGame<Player, Word> {
    state: GameState;

    players: Set<Player>;

    constructor() {
        this.state = "lobby";

        this.players = new Set<Player>();
    }

    addPlayer(player: Player) {
        this.players.add(player);
    }

    startGame() {
        if (this.players.size < MINIMUM_PLAYER_COUNT) throw new Error("not enough players");

        return new RunningGame<Player, Word>(this.players);
    }
}

class RunningGame<Player, Word> {
    state: GameState;

    players: Set<Player>;
    words: Set<Word>;

    currentPlayer: Player;

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

    addWord(word: Word) {
        if (this.hasGameEnded()) throw new Error("game has ended");

        if (!this.playerAliveStates.get(this.currentPlayer)) throw new Error("player is dead");
        if (this.words.has(word)) throw new Error("word already used");

        this.words.add(word);

        this.selectNextPlayer();
    }

    selectNextPlayer() {
        if (this.hasGameEnded()) throw new Error("game has ended");

        const players = [...this.players];

        do {
            let index = players.indexOf(this.currentPlayer);
            this.currentPlayer = players[(index + 1) % players.length];
        } while (!this.playerAliveStates.get(this.currentPlayer));
    }

    killCurrentPlayer() {
        if (this.hasGameEnded()) throw new Error("game has ended");

        this.playerAliveStates.set(this.currentPlayer, false);

        if (this.hasGameEnded()) return;

        this.selectNextPlayer();
    }

    hasGameEnded() {
        return [...this.playerAliveStates.values()].filter(Boolean).length === 1;
    }

    getFinishedGame() {
        if (!this.hasGameEnded()) throw new Error("game has not ended");

        return new FinishedGame<Player, Word>(this.players, this.words, this.playerAliveStates);
    }
}

class FinishedGame<Player, Word> {
    state: GameState;

    players: Set<Player>;
    words: Set<Word>;

    playerAliveStates: Map<Player, boolean>;

    winner: Player;

    constructor(players: Set<Player>, words: Set<Word>, playerAliveStates: Map<Player, boolean>) {
        this.state = "finished";

        this.players = players;
        this.words = words;

        this.playerAliveStates = playerAliveStates;

        this.winner = [...this.playerAliveStates.entries()].filter(([, alive]) => alive)[0][0];
    }
}

// // DEMO GAME
// const game = new Game<string, string>();

// const lobbyingGame = game.startLobby();

// lobbyingGame.addPlayer("a");
// lobbyingGame.addPlayer("b");
// lobbyingGame.addPlayer("c");
// lobbyingGame.addPlayer("d");

// const runningGame = lobbyingGame.startGame();

// runningGame.addWord("wa1");

// runningGame.addWord("wb1");

// runningGame.addWord("wc1");

// runningGame.addWord("wd1");

// runningGame.killCurrentPlayer();
// console.log(runningGame.hasGameEnded());

// runningGame.killCurrentPlayer();
// console.log(runningGame.hasGameEnded());

// runningGame.killCurrentPlayer();
// console.log(runningGame.hasGameEnded());

// const finishedGame = runningGame.getFinishedGame();

// console.log(finishedGame);
