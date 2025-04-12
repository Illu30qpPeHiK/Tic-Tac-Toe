
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GameState } from "@/services/WebSocketService";

interface GameControlsProps {
  gameState: GameState | null;
  onCreateGame: () => void;
  onJoinGame: (gameId: string) => void;
  onPlayLocal: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onCreateGame,
  onJoinGame,
  onPlayLocal,
  onReset,
  isPlaying,
}) => {
  const [gameIdInput, setGameIdInput] = useState("");
  const { toast } = useToast();

  const handleJoinGame = () => {
    if (gameIdInput.trim()) {
      onJoinGame(gameIdInput.trim());
      setGameIdInput("");
    } else {
      toast({
        title: "Game ID Required",
        description: "Please enter a valid game ID to join",
        variant: "destructive",
      });
    }
  };

  const handleCopyGameId = () => {
    if (gameState?.gameId) {
      navigator.clipboard.writeText(gameState.gameId);
      toast({
        title: "Game ID Copied",
        description: "Share this with your friend to play together",
      });
    }
  };

  // Render controls based on game state
  if (!isPlaying) {
    return (
      <div className="flex flex-col space-y-4 w-full max-w-md animate-fade-in">
        <Button onClick={onCreateGame} className="bg-player-x hover:bg-player-x/90">
          Create New Game
        </Button>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Enter Game ID"
            value={gameIdInput}
            onChange={(e) => setGameIdInput(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleJoinGame} className="bg-player-o hover:bg-player-o/90">
            Join
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onPlayLocal}
          className="border-gray-300 hover:bg-gray-100"
        >
          Play Locally
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 w-full max-w-md animate-fade-in">
      {gameState?.gameId && (
        <div className="flex items-center justify-between w-full p-2 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <Share2 className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Game ID: {gameState.gameId}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyGameId}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Button 
        variant="outline" 
        onClick={onReset}
        className="border-gray-300 hover:bg-gray-100"
      >
        {gameState?.winner ? "New Game" : "Quit Game"}
      </Button>
    </div>
  );
};

export default GameControls;
