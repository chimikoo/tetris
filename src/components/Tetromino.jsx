import { Box, Line } from "@react-three/drei";

// Renders the current falling tetromino
export default function Tetromino({ position, shape, currentColor }) {
  return (
    <>
      {shape.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <Box
              key={`${x}-${y}`}
              args={[1, 1, 0.1]}
              position={[position.x + x - 5, 10 - (position.y + y), 0]}
            >
              <meshStandardMaterial
                attach="material"
                color={currentColor}
                emissive={currentColor}
                emissiveIntensity={0.4}
                metalness={0.5}
                roughness={0.3}
              />
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
            </Box>
          ) : null
        )
      )}
    </>
  );
}
