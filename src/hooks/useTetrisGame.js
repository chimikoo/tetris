import { useState, useEffect, useMemo, useRef } from "react";

export default function useTetrisGame() {
  // Initialize the grid state
  const [grid, setGrid] = useState(
    Array(20)
      .fill()
      .map(() => Array(10).fill(0))
  );

  // Define the shapes and their rotations
  const shapes = useMemo(
    () => [
      {
        id: "L",
        rotations: [
          [[1, 0], [1, 0], [1, 1]],
          [[1, 1, 1], [1, 0, 0]],
          [[1, 1], [0, 1], [0, 1]],
          [[0, 0, 1], [1, 1, 1]],
        ],
      },
      { id: "O", rotations: [[[1, 1], [1, 1]]] },
      {
        id: "T",
        rotations: [
          [[0, 1, 0], [1, 1, 1]],
          [[1, 0], [1, 1], [1, 0]],
          [[1, 1, 1], [0, 1, 0]],
          [[0, 1], [1, 1], [0, 1]],
        ],
      },
      { id: "I", rotations: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]] },
      {
        id: "S",
        rotations: [
          [[0, 1, 1], [1, 1, 0]],
          [[1, 0], [1, 1], [0, 1]],
        ],
      },
      {
        id: "Z",
        rotations: [
          [[1, 1, 0], [0, 1, 1]],
          [[0, 1], [1, 1], [1, 0]],
        ],
      },
    ],
    []
  );

  // Define vibrant colors for the blocks
  const vibrantColors = [
    "#ff5733",
    "#33ff57",
    "#3357ff",
    "#ff33a8",
    "#ffd733",
    "#33fff5",
    "#a833ff",
  ];

  // State variables for game logic
  const [rotation, setRotation] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [currentShape, setCurrentShape] = useState(shapes[0].rotations[0]);
  const [currentColor, setCurrentColor] = useState(vibrantColors[0]);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  // Reference for the game loop interval
  const gameLoopRef = useRef(null);

  // Returns a random color from the vibrantColors array
  const getRandomColor = () => {
    return vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
  };

  // Updates the grid with the current shape and its position
  const updateGridWithShape = (grid, shape, position, color) => {
    const newGrid = grid.map((row) => [...row]);
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const gridX = position.x + x;
          const gridY = position.y + y;
          if (gridX >= 0 && gridX < newGrid[0].length && gridY >= 0 && gridY < newGrid.length) {
            newGrid[gridY][gridX] = color;
          }
        }
      });
    });
    return newGrid;
  };

  // Clears completed lines and shifts remaining lines down
  const clearCompletedLines = (grid) => {
    const newGrid = grid.filter((row) => !row.every((cell) => cell !== 0));
    const linesCleared = grid.length - newGrid.length;
    while (newGrid.length < 20) {
      newGrid.unshift(Array(10).fill(0));
    }
    return { newGrid, linesCleared };
  };

  // Checks if a shape can move to the specified position
  const canMove = (newX, newY, shape) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const gridX = newX + x;
          const gridY = newY + y;
          if (
            gridX < 0 ||
            gridX >= grid[0].length ||
            gridY >= grid.length ||
            (gridY >= 0 && grid[gridY][gridX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Places the current shape on the grid and spawns the next shape
  const placeTetromino = () => {
    if (gameOver) return;

    const newGrid = updateGridWithShape(grid, currentShape, position, currentColor);
    const { newGrid: clearedGrid, linesCleared } = clearCompletedLines(newGrid);

    setGrid(clearedGrid);
    if (linesCleared > 0) {
      setScore((prev) => prev + linesCleared * 100);
      setLevel((prev) => prev + Math.floor(linesCleared / 10));
    }

    const nextShapeIndex = Math.floor(Math.random() * shapes.length);
    const nextShape = shapes[nextShapeIndex].rotations[0];
    const nextColor = getRandomColor();

    if (!canMove(4, 0, nextShape)) {
      setGameOver(true);
      return;
    }

    setCurrentShapeIndex(nextShapeIndex);
    setCurrentShape(nextShape);
    setCurrentColor(nextColor);
    setRotation(0);
    setPosition({ x: 4, y: 0 });
  };

  // Resets the game to the initial state
  const restartGame = () => {
    setGrid(
      Array(20)
        .fill()
        .map(() => Array(10).fill(0))
    );
    setGameOver(false);
    setCurrentShapeIndex(0);
    setCurrentShape(shapes[0].rotations[0]);
    setCurrentColor(vibrantColors[0]);
    setPosition({ x: 4, y: 0 });
    setScore(0);
    setLevel(1);
    setRotation(0);
  };

  // Handles the game loop, moving the shape down automatically
  useEffect(() => {
    if (gameOver) {
      clearInterval(gameLoopRef.current);
      return;
    }

    const gameLoop = () => {
      setPosition((prevPosition) => {
        const newY = prevPosition.y + 1;
        if (canMove(prevPosition.x, newY, currentShape)) {
          return { ...prevPosition, y: newY };
        } else {
          placeTetromino();
          return prevPosition;
        }
      });
    };

    gameLoopRef.current = setInterval(gameLoop, 500 / level);

    return () => clearInterval(gameLoopRef.current);
  }, [grid, position, currentShape, gameOver, level]);

  // Handles user inputs for moving and rotating the shape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver) return;

      let newX = position.x;
      let newY = position.y;
      let newRotation = rotation;

      if (event.key === "a") {
        newX -= 1;
      } else if (event.key === "d") {
        newX += 1;
      } else if (event.key === "s") {
        newY += 1;
      } else if (event.key === "w") {
        newRotation = (rotation + 1) % shapes[currentShapeIndex].rotations.length;
        const rotatedShape = shapes[currentShapeIndex].rotations[newRotation];
        if (canMove(position.x, position.y, rotatedShape)) {
          setRotation(newRotation);
          setCurrentShape(rotatedShape);
          return;
        }
      }

      if (canMove(newX, newY, currentShape)) {
        setPosition({ x: newX, y: newY });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, rotation, currentShape, gameOver]);

  // Expose game state and functions
  return { grid, position, shape: currentShape, currentColor, score, level, gameOver, restartGame };
}
