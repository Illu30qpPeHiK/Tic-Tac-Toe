
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

  // Calculate winning cells for highlighting
  const getWinningCells = (): number[] => {
    if (!winner || winner === "draw") return [];
    
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        board[a] && 
        board[a] === board[b] && 
        board[a] === board[c] &&
        board[a] === winner
      ) {
        return pattern;
      }
    }
    
    return [];
  };

  const winningCells = getWinningCells();

  // Calculate the class for a cell based on its state
  const getCellClasses = (index: number) => {
    const isOccupied = board[index] !== null;
    const isWinningCell = winningCells.includes(index);
    
    // For local games, both X and O can take turns
    // For online games, a player can only make a move if it's their turn
    const isMyTurn = playerSymbol === currentPlayer;
    const isLocalGame = playerSymbol === undefined;
    const isPlayable = !isOccupied && !winner && !disabled && 
      (isLocalGame || isMyTurn);

    return `board-cell w-full h-full aspect-square ${
      isOccupied ? "occupied" : ""
    } ${isWinningCell ? "winning bg-amber-100" : ""} ${
      isPlayable ? "playable hover:bg-gray-100" : ""
    }`;
  };

  // Render the mark (X or O) for a cell
  const renderMark = (index: number) => {
    const isWinningCell = winningCells.includes(index);
    
    if (board[index] === "X") {
      return <X className={`w-12 h-12 mark-x ${isWinningCell ? "text-player-x animate-bounce-small" : ""}`} strokeWidth={3} />;
    } else if (board[index] === "O") {
      return <Circle className={`w-10 h-10 mark-o ${isWinningCell ? "text-player-o animate-bounce-small" : ""}`} strokeWidth={3} />;
    }
    return null;
  };

  // Determine if the cell is clickable
  const isCellClickable = (index: number) => {
    const isLocalGame = playerSymbol === undefined;
    const isMyTurn = isLocalGame || playerSymbol === currentPlayer;
    
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
