
import React from "react";
import { Link } from "react-router-dom";
import { GameState } from "@/services/WebSocketService";
import { X, Circle, Clock, Trophy, RefreshCw } from "lucide-react";

interface GameStatusProps {
  gameState: GameState;
  waitingForOpponent?: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  gameState, 
  waitingForOpponent = false 
}) => {
  const { currentPlayer, winner, playerSymbol } = gameState;
  
  const isMyTurn = playerSymbol === currentPlayer;
  
  // Render the appropriate message based on game state
  const renderStatusMessage = () => {
    if (waitingForOpponent) {
      return (
        <div className="flex items-center space-x-2 text-amber-600">
          <Clock className="h-5 w-5 animate-pulse-slow" />
          <span>Waiting for opponent to join...</span>
        </div>
      );
    }
    
    if (winner === "X") {
      return (
        <div className="flex items-center space-x-2 text-player-x font-bold">
          <Trophy className="h-5 w-5" />
          <span>Player X wins!</span>
        </div>
      );
    }
    
    if (winner === "O") {
      return (
        <div className="flex items-center space-x-2 text-player-o font-bold">
          <Trophy className="h-5 w-5" />
          <span>Player O wins!</span>
        </div>
      );
    }
    
    if (winner === "draw") {
      return (
        <div className="flex items-center space-x-2 font-bold text-gray-700">
          <RefreshCw className="h-5 w-5" />
          <span>It's a draw!</span>
        </div>
      );
    }
    
    // Game is ongoing, show current player
    if (playerSymbol) {
      return (
        <div className="flex items-center space-x-2">
          {isMyTurn ? (
            <>
              <span className="font-medium">Your turn</span>
              {playerSymbol === "X" ? (
                <X className="h-5 w-5 text-player-x" />
              ) : (
                <Circle className="h-5 w-5 text-player-o" />
              )}
            </>
          ) : (
            <>
              <span className="font-medium">Opponent's turn</span>
              {playerSymbol === "X" ? (
                <Circle className="h-5 w-5 text-player-o" />
              ) : (
                <X className="h-5 w-5 text-player-x" />
              )}
            </>
          )}
        </div>
      );
    }
    
    // Local game without assigned player symbols
    return (
      <div className="flex items-center space-x-2">
        <span className="font-medium">Current player:</span>
        {currentPlayer === "X" ? (
          <X className="h-5 w-5 text-player-x" />
        ) : (
          <Circle className="h-5 w-5 text-player-o" />
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-12 bg-white rounded-lg shadow px-4 py-2 animate-fade-in">
      {renderStatusMessage()}
    </div>
  );
};

export default GameStatus;
