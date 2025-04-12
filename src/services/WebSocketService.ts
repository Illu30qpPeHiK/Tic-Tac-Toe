export type GameMove = {
  index: number;
  player: "X" | "O";
};

export type GameState = {
  board: Array<"X" | "O" | null>;
  currentPlayer: "X" | "O";
  winner: "X" | "O" | "draw" | null;
  gameId: string;
  playerSymbol?: "X" | "O";
};

export type WebSocketMessage = {
  type: "create" | "join" | "move" | "game-state" | "player-joined" | "error";
  gameId?: string;
  move?: GameMove;
  gameState?: GameState;
  error?: string;
};

class WebSocketService {
  private socket: WebSocket | null = null;
  private callbacks: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onGameState?: (gameState: GameState) => void;
    onPlayerJoined?: (gameId: string) => void;
    onError?: (error: string) => void;
  } = {};

  connect(url: string = "wss://tic-tac-toe-ws") {
    if (this.socket) {
      return;
    }

    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log("WebSocket connected");
        this.callbacks.onConnect?.();
      };

      this.socket.onclose = () => {
        console.log("WebSocket disconnected");
        this.socket = null;
        this.callbacks.onDisconnect?.();
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.callbacks.onError?.("Failed to connect to game server");
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("Received message:", message);

          switch (message.type) {
            case "game-state":
              if (message.gameState) {
                this.callbacks.onGameState?.(message.gameState);
              }
              break;
            case "player-joined":
              if (message.gameId) {
                this.callbacks.onPlayerJoined?.(message.gameId);
              }
              break;
            case "error":
              if (message.error) {
                this.callbacks.onError?.(message.error);
              }
              break;
            default:
              console.warn("Unknown message type:", message.type);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      this.callbacks.onError?.("Failed to connect to game server");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  createGame() {
    this.sendMessage({
      type: "create",
    });
  }

  joinGame(gameId: string) {
    this.sendMessage({
      type: "join",
      gameId,
    });
  }

  makeMove(index: number, player: "X" | "O", gameId: string) {
    this.sendMessage({
      type: "move",
      gameId,
      move: {
        index,
        player,
      },
    });
  }

  private sendMessage(message: WebSocketMessage) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      this.callbacks.onError?.("Not connected to game server");
      return false;
    }

    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("Failed to send WebSocket message:", error);
      return false;
    }
  }

  onConnect(callback: () => void) {
    this.callbacks.onConnect = callback;
    return this;
  }

  onDisconnect(callback: () => void) {
    this.callbacks.onDisconnect = callback;
    return this;
  }

  onGameState(callback: (gameState: GameState) => void) {
    this.callbacks.onGameState = callback;
    return this;
  }

  onPlayerJoined(callback: (gameId: string) => void) {
    this.callbacks.onPlayerJoined = callback;
    return this;
  }

  onError(callback: (error: string) => void) {
    this.callbacks.onError = callback;
    return this;
  }
  
  simulateConnection() {
    console.log("Simulating WebSocket connection");
    setTimeout(() => {
      this.callbacks.onConnect?.();
    }, 500);
  }
  
  simulateCreateGame() {
    console.log("Simulating game creation");
    const gameId = Math.random().toString(36).substring(2, 8);
    
    setTimeout(() => {
      this.callbacks.onGameState?.({
        board: Array(9).fill(null),
        currentPlayer: "X",
        winner: null,
        gameId,
        playerSymbol: "X"  // Creator is always X and goes first
      });
    }, 500);
    
    return gameId;
  }
  
  simulateJoinGame(gameId: string) {
    console.log("Simulating joining game:", gameId);
    
    setTimeout(() => {
      this.callbacks.onGameState?.({
        board: Array(9).fill(null),
        currentPlayer: "X", // X always goes first
        winner: null,
        gameId,
        playerSymbol: "O"  // Joiner is always O and waits for X's move
      });
      
      this.callbacks.onPlayerJoined?.(gameId);
    }, 500);
  }
  
  simulateMakeMove(index: number, player: "X" | "O", gameState: GameState) {
    console.log("Simulating move:", index, player);
    
    if (player !== gameState.currentPlayer) {
      console.log("Not your turn!");
      this.callbacks.onError?.("It's not your turn");
      return;
    }
    
    const newBoard = [...gameState.board];
    newBoard[index] = player;
    
    const winner = this.checkWinner(newBoard);
    const isDraw = !winner && newBoard.every(cell => cell !== null);
    
    setTimeout(() => {
      this.callbacks.onGameState?.({
        board: newBoard,
        currentPlayer: player === "X" ? "O" : "X",
        winner: winner ? winner : isDraw ? "draw" : null,
        gameId: gameState.gameId,
        playerSymbol: gameState.playerSymbol
      });
    }, 300);
  }
  
  private checkWinner(board: Array<"X" | "O" | null>) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    
    return null;
  }
}

export default new WebSocketService();
