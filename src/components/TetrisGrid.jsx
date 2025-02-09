// Renders the Tetris grid and blocks with visual styling
import { Box, Line } from "@react-three/drei";

export default function TetrisGrid({ grid, gameOver }) {
  // Do not render the grid if the game is over
  if (gameOver) return null;

  return (
    <>
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <Box
            key={`${x}-${y}`}
            args={[1, 1, 0.1]} // Define block size
            position={[x - grid[0].length / 2, grid.length / 2 - y, 0]} // Calculate block position
          >
            {cell ? (
              <>
                <meshStandardMaterial
                  attach="material"
                  color={cell} // Apply block color
                  emissive={cell} // Add emissive color for vibrancy
                  emissiveIntensity={0.3}
                />
                {/* Draw black borders around filled cells */}
                <Line
                  points={[
                    [-0.5, -0.5, 0.05],
                    [0.5, -0.5, 0.05],
                    [0.5, 0.5, 0.05],
                    [-0.5, 0.5, 0.05],
                    [-0.5, -0.5, 0.05],
                  ]}
                  color="black"
                  lineWidth={1}
                />
              </>
            ) : (
              <meshStandardMaterial
                attach="material"
                color="#d3d3d3" // Apply light gray color for empty cells
              />
            )}
          </Box>
        ))
      )}
    </>
  );
}
