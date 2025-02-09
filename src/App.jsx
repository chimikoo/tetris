import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import TetrisGrid from "./components/TetrisGrid";
import Tetromino from "./components/Tetromino";
import GameUI from "./components/GameUI";
import useTetrisGame from "./hooks/useTetrisGame";
import "./App.css";

// Main app component for the Tetris game
export default function App() {
  const {
    grid,
    position,
    shape,
    score,
    level,
    gameOver,
    restartGame,
    currentColor,
  } = useTetrisGame();

  // Adjusts the canvas size to fit the container on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div id="app">
      <Canvas
        orthographic
        camera={{
          zoom: 35,
          position: [0, 0, 10],
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <TetrisGrid grid={grid} />
        <Tetromino position={position} shape={shape} currentColor={currentColor} />
      </Canvas>

      <GameUI
        score={score}
        level={level}
        gameOver={gameOver}
        onRestart={restartGame}
      />
    </div>
  );
}
