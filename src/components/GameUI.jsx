// Displays the game UI, including score, level, and a game-over message with restart functionality
export default function GameUI({ score, level, gameOver, onRestart }) {
    return (
      <div className="game-ui">
        <div>Score: {score}</div>
        <div>Level: {level}</div>
        {gameOver && (
          <div className="game-over-container">
            <div className="game-over">Game Over!</div>
            <button onClick={onRestart}>Restart Game</button>
          </div>
        )}
      </div>
    );
  }
  