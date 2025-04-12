
import React from "react";
import { X, Circle } from "lucide-react";
import { GameState } from "@/services/WebSocketService";

interface TicTacToeBoardProps {
  gameState: GameState;
  onCellClick: (index: number) => void;
  localPlayer?: "X" | "O";
  disabled?: boolean;
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({
  gameState,
  onCellClick,
  localPlayer,
  disabled = false,
}) => {
  const { board, currentPlayer, winner, playerSymbol } = gameState;

  // Calculate the class for a cell based on its state
  const getCellClasses = (index: number) => {
    const isOccupied = board[index] !== null;
    const isWinningCell = false; // TODO: Implement highlighting winning cells
    const isPlayable = !isOccupied && !winner && !disabled && 
      (localPlayer === undefined || localPlayer === currentPlayer || playerSymbol === currentPlayer);

    return `board-cell w-full h-full aspect-square ${
      isOccupied ? "occupied" : ""
    } ${isWinningCell ? "winning" : ""} ${
      isPlayable ? "playable hover:bg-gray-100" : ""
    }`;
  };

  // Render the mark (X or O) for a cell
  const renderMark = (index: number) => {
    if (board[index] === "X") {
      return <X className="w-12 h-12 mark-x" strokeWidth={3} />;
    } else if (board[index] === "O") {
      return <Circle className="w-10 h-10 mark-o" strokeWidth={3} />;
    }
    return null;
  };

  // Determine if the cell is clickable
  const isCellClickable = (index: number) => {
    // In local game or if it's this player's turn in online game
    const isMyTurn = playerSymbol === undefined || playerSymbol === currentPlayer;
    
    return (
      !winner &&
      board[index] === null &&
      !disabled &&
      isMyTurn
    );
  };

  return (
    <div className="w-full max-w-md aspect-square">
      <div className="board-grid w-full h-full">
        {board.map((_, index) => (
          <div
            key={index}
            className={getCellClasses(index)}
            onClick={() => isCellClickable(index) && onCellClick(index)}
            style={{ 
              opacity: isCellClickable(index) ? 1 : 0.8,
              cursor: isCellClickable(index) ? "pointer" : "not-allowed"
            }}
          >
            {renderMark(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToeBoard;
