
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Users, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-page flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Gamepad2 className="h-16 w-16 text-player-x" />
              <div className="absolute -bottom-1 -right-1">
                <Sparkles className="h-6 w-6 text-player-o" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tic-Tac-Toe</h1>
          <p className="text-lg text-gray-700 mb-6">
            Challenge your friends to a classic game of Tic-Tac-Toe with real-time multiplayer!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              className="bg-player-x hover:bg-player-x/90 text-white"
              onClick={() => navigate("/game")}
            >
              Start Playing
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-center mb-4">
              <Users className="h-8 w-8 text-player-x" />
            </div>
            <h3 className="text-lg font-medium mb-2">Real-time Multiplayer</h3>
            <p className="text-gray-600 text-sm">
              Play with friends anywhere in the world with real-time game updates.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-center mb-4">
              <Gamepad2 className="h-8 w-8 text-player-o" />
            </div>
            <h3 className="text-lg font-medium mb-2">Classic Gameplay</h3>
            <p className="text-gray-600 text-sm">
              The timeless game of Tic-Tac-Toe with a modern, interactive interface.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-center mb-4">
              <Sparkles className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Smooth Experience</h3>
            <p className="text-gray-600 text-sm">
              Beautiful animations and responsive design for all devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
