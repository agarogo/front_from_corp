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
  const animationRef = useRef<number>();
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
    if (animationRef.current) {
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

  // Game loop
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
      if (animationRef.current) {
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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleClick();
  }, [handleClick]);

  // Render blocks
  const renderBlocks = () => {
    return gameState.blocks.map((block: Block, index: number) => (
      <div
        key={index}
        className="absolute bg-gradient-to-r from-blue-500 to-purple-600 rounded-sm"
        style={{
          left: `${(block.x / CONTAINER_WIDTH) * 100}%`,
          top: `${(block.y / CONTAINER_HEIGHT) * 100}%`,
          width: `${(block.width / CONTAINER_WIDTH) * 100}%`,
          height: `${(block.height / CONTAINER_HEIGHT) * 100}%`,
        }}
      />
    ));
  };

  // Render current sliding block
  const renderCurrentBlock = () => {
    if (!gameState.started || gameState.gameOver) return null;
    
    const lastBlock = gameState.blocks[gameState.blocks.length - 1];
    return (
      <div
        className="absolute bg-gradient-to-r from-green-400 to-blue-500 rounded-sm opacity-80"
        style={{
          left: `${(gameState.currentX / CONTAINER_WIDTH) * 100}%`,
          top: `${(lastBlock.y + lastBlock.height) / CONTAINER_HEIGHT * 100}%`,
          width: `${(lastBlock.width / CONTAINER_WIDTH) * 100}%`,
          height: `${(lastBlock.height / CONTAINER_HEIGHT) * 100}%`,
        }}
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-bold text-white">Score: {gameState.score}</div>
      
      <div
        className="relative bg-gray-900 border-2 border-gray-700 rounded-lg overflow-hidden cursor-pointer"
        style={{
          width: `${CONTAINER_WIDTH}px`,
          height: `${CONTAINER_HEIGHT}px`,
          maxWidth: '100%',
          aspectRatio: `${CONTAINER_WIDTH}/${CONTAINER_HEIGHT}`,
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
      >
        {renderBlocks()}
        {renderCurrentBlock()}
        
        {!gameState.started && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-xl font-bold">Click to Start</div>
          </div>
        )}
        
        {gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="text-center">
              <div className="text-white text-2xl font-bold mb-2">Game Over!</div>
              <div className="text-gray-300 text-lg mb-4">Score: {gameState.score}</div>
              <div className="text-gray-400">Click to Restart</div>
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
