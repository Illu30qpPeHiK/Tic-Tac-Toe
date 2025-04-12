
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import TicTacToeBoard from "@/components/TicTacToeBoard";
import GameStatus from "@/components/GameStatus";
import GameControls from "@/components/GameControls";
import WebSocketService, { GameState } from "@/services/WebSocketService";
import { Shield, Twitch, Gamepad2 } from "lucide-react";

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLocalGame, setIsLocalGame] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { gameId: urlGameId } = useParams<{ gameId: string }>();
  
  // Handle WebSocket connection
  useEffect(() => {
    // For development, we're using a simulated WebSocket
    WebSocketService
      .onConnect(() => {
        setIsConnected(true);
        toast({
          title: "Connected to game server",
          description: "You're ready to play!",
        });
        
        // If there's a game ID in the URL, join that game
        if (urlGameId) {
          joinGame(urlGameId);
        }
      })
      .onDisconnect(() => {
        setIsConnected(false);
        toast({
          title: "Disconnected from game server",
          description: "Please refresh to reconnect",
          variant: "destructive",
        });
      })
      .onGameState((newGameState) => {
        console.log("New game state received:", newGameState);
        setGameState(newGameState);
        setWaitingForOpponent(false);
      })
      .onPlayerJoined(() => {
        toast({
          title: "Player joined!",
          description: "The game will start now",
        });
        setWaitingForOpponent(false);
      })
      .onError((error) => {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      });
    
    // Connect to WebSocket (or simulate connection for development)
    WebSocketService.simulateConnection();
    
    return () => {
      WebSocketService.disconnect();
    };
  }, [toast, urlGameId]);
  
  // Create a new online game
  const createGame = () => {
    setIsLocalGame(false);
    setWaitingForOpponent(true);
    
    // Simulate creating a game for development
    const gameId = WebSocketService.simulateCreateGame();
    
    // Update the URL without reloading the page
    navigate(`/game/${gameId}`);
  };
  
  // Join an existing game
  const joinGame = (gameId: string) => {
    setIsLocalGame(false);
    
    // Simulate joining a game for development
    WebSocketService.simulateJoinGame(gameId);
    
    // Update the URL without reloading the page
    navigate(`/game/${gameId}`);
  };
  
  // Start a local game (no WebSocket connection)
  const startLocalGame = () => {
    setIsLocalGame(true);
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
      gameId: "local",
    });
  };
  
  // Handle cell click
  const handleCellClick = (index: number) => {
    if (!gameState || gameState.board[index] !== null || gameState.winner) {
      return;
    }
    
    if (isLocalGame) {
      // For local games, update the state directly
      const newBoard = [...gameState.board];
      newBoard[index] = gameState.currentPlayer;
      
      // Check for winner
      const winner = checkWinner(newBoard);
      const isDraw = !winner && newBoard.every(cell => cell !== null);
      
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
        winner: winner ? winner : isDraw ? "draw" : null,
        gameId: gameState.gameId,
      });
    } else {
      // For online games, send the move to the WebSocket server
      // Only allow if it's this player's turn
      if (gameState.playerSymbol === gameState.currentPlayer) {
        WebSocketService.simulateMakeMove(
          index, 
          gameState.currentPlayer, 
          gameState
        );
      } else {
        // If it's not the player's turn, show a toast message
        toast({
          title: "Not your turn",
          description: "Please wait for your opponent to make a move",
        });
      }
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState(null);
    setWaitingForOpponent(false);
    setIsLocalGame(false);
    navigate("/game");
  };
  
  // Check for a winner
  const checkWinner = (board: Array<"X" | "O" | null>): "X" | "O" | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as "X" | "O";
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-page flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center">
          <Gamepad2 className="h-8 w-8 mr-2" />
          Tic-Tac-Toe
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Challenge your friends to a classic game of Tic-Tac-Toe online or play locally!
        </p>
      </header>
      
      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        {gameState ? (
          <>
            <GameStatus 
              gameState={gameState} 
              waitingForOpponent={waitingForOpponent} 
            />
            
            <TicTacToeBoard
              gameState={gameState}
              onCellClick={handleCellClick}
              localPlayer={gameState.playerSymbol}
              disabled={waitingForOpponent}
            />
            
            <GameControls
              gameState={gameState}
              onCreateGame={createGame}
              onJoinGame={joinGame}
              onPlayLocal={startLocalGame}
              onReset={resetGame}
              isPlaying={true}
            />
          </>
        ) : (
          <div className="w-full">
            <div className="text-center mb-6">
              <p className="text-xl font-medium mb-4">How would you like to play?</p>
            </div>
            
            <GameControls
              gameState={null}
              onCreateGame={createGame}
              onJoinGame={joinGame}
              onPlayLocal={startLocalGame}
              onReset={resetGame}
              isPlaying={false}
            />
          </div>
        )}
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center space-x-1">
          <Shield className="h-4 w-4" />
          <p>Secure real-time gameplay</p>
        </div>
      </footer>
    </div>
  );
};

export default Game;
