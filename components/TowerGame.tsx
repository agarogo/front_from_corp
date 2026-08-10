'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Block, tick, dropBlock, resetGame } from '@/lib/tower-game';

const CONTAINER_WIDTH = 400;
const CONTAINER_HEIGHT = 600;

interface TowerGameProps {
  onGameOver?: (score: number) => void;
}

export default function TowerGame({ onGameOver }: TowerGameProps) {
  const [gameState, setGameState] = useState<GameState>(() =>
    resetGame(CONTAINER_WIDTH)
  );
  const animationRef = useRef<number | null>(null);
  const stateRef = useRef(gameState);
  const gameOverHandledRef = useRef(false);

  // Keep ref in sync
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, started: true, running: true }));
    gameOverHandledRef.current = false;
  }, []);

  const handleDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.running || prev.gameOver) return prev;
      return dropBlock(prev);
    });
  }, []);

  const restartGame = useCallback(() => {
    // Cancel any running animation
    if (animationRef.current != null) {
      cancelAnimationFrame(animationRef.current);
    }
    setGameState(resetGame(CONTAINER_WIDTH));
    gameOverHandledRef.current = false;
  }, []);

  // Notify parent of game over (only once)
  useEffect(() => {
    if (gameState.gameOver && !gameOverHandledRef.current && onGameOver) {
      gameOverHandledRef.current = true;
      onGameOver(gameState.score);
    }
  }, [gameState.gameOver, gameState.score, onGameOver]);

  // Game loop — single RAF loop while running and not game over
  useEffect(() => {
    if (!gameState.running || gameState.gameOver) return;

    const animate = () => {
      setGameState(prev => {
        if (!prev.running || prev.gameOver) return prev;
        return tick(prev, CONTAINER_WIDTH);
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current != null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.running, gameState.gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (!gameState.started) {
          startGame();
        } else if (gameState.running) {
          handleDrop();
        } else if (gameState.gameOver) {
          restartGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.started, gameState.running, gameState.gameOver, startGame, handleDrop, restartGame]);

  const handleClick = useCallback(() => {
    if (!gameState.started) {
      startGame();
    } else if (gameState.running) {
      handleDrop();
    } else if (gameState.gameOver) {
      restartGame();
    }
  }, [gameState.started, gameState.running, gameState.gameOver, startGame, handleDrop, restartGame]);

  // Compute the visual offset for rendering blocks with camera follow
  const cameraY = gameState.cameraY;
  // Base Y position: bottom of container minus some padding
  const baseY = CONTAINER_HEIGHT - 60;

  // Render blocks with camera offset
  const renderBlocks = () => {
    return gameState.blocks.map((block: Block, index: number) => {
      // Apply camera offset: block.y is negative (upward), so we add cameraY to shift down
      const visualY = baseY + block.y + cameraY;

      // Color gradient based on height in tower
      const hue = Math.max(0, 220 - index * 8);

      return (
        <div
          key={index}
          className="absolute rounded-sm"
          style={{
            left: `${(block.x / CONTAINER_WIDTH) * 100}%`,
            top: `${(visualY / CONTAINER_HEIGHT) * 100}%`,
            width: `${(block.width / CONTAINER_WIDTH) * 100}%`,
            height: `${(block.height / CONTAINER_HEIGHT) * 100}%`,
            background: `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${hue + 30}, 80%, 45%))`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />
      );
    });
  };

  // Render current sliding block
  const renderCurrentBlock = () => {
    if (!gameState.started || gameState.gameOver) return null;

    const lastBlock = gameState.blocks[gameState.blocks.length - 1];
    // Sliding block appears above the last placed block
    const visualY = baseY + (lastBlock.y - 28) + cameraY;

    return (
      <div
        className="absolute rounded-sm opacity-90"
        style={{
          left: `${(gameState.currentX / CONTAINER_WIDTH) * 100}%`,
          top: `${(visualY / CONTAINER_HEIGHT) * 100}%`,
          width: `${(lastBlock.width / CONTAINER_WIDTH) * 100}%`,
          height: `${(lastBlock.height / CONTAINER_HEIGHT) * 100}%`,
          background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
          boxShadow: '0 0 12px rgba(74, 222, 128, 0.5)',
        }}
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-bold text-white drop-shadow-lg">
        Score: {gameState.score}
      </div>

      <div
        className="relative border-2 rounded-xl overflow-hidden cursor-pointer shadow-2xl"
        style={{
          width: `${CONTAINER_WIDTH}px`,
          height: `${CONTAINER_HEIGHT}px`,
          maxWidth: '100%',
          aspectRatio: `${CONTAINER_WIDTH}/${CONTAINER_HEIGHT}`,
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          borderColor: '#475569',
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {/* Ground line */}
        <div
          className="absolute w-full"
          style={{
            top: `${(baseY + 28) / CONTAINER_HEIGHT * 100}%`,
            height: '4px',
            background: 'linear-gradient(90deg, #64748b, #94a3b8, #64748b)',
          }}
        />

        {renderBlocks()}
        {renderCurrentBlock()}

        {!gameState.started && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xl font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startGame();
              }}
            >
              ▶ Start Game
            </button>
          </div>
        )}

        {gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center p-6">
              <div className="text-white text-3xl font-bold mb-2 drop-shadow-lg">
                Game Over!
              </div>
              <div className="text-gray-300 text-xl mb-4">
                Score: {gameState.score}
              </div>
              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xl font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  restartGame();
                }}
              >
                ↻ Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-gray-400 text-sm">
        Click, tap, or press Space/Enter to drop blocks
      </div>
    </div>
  );
}
