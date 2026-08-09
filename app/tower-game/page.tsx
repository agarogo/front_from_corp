"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface Block {
  x: number; // left position relative to canvas center offset
  width: number;
  y: number;
  color: string;
}

export default function TowerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">(
    "idle"
  );
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Game refs (to avoid stale closures in animation loop)
  const blocksRef = useRef<Block[]>([]);
  const currentBlockRef = useRef<{
    x: number; // offset from center (-maxMove .. +maxMove)
    width: number;
    speed: number;
    direction: number;
  } | null>(null);
  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(score);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }>
  >([]);
  const droppedRef = useRef(false); // prevent double-tap

  // Sync refs with state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const BLOCK_HEIGHT = 28;
  const INITIAL_WIDTH_RATIO = 0.75; // 75% of canvas width
  const BASE_SPEED = 3;

  const getColor = useCallback((index: number) => {
    const colors = [
      "#a855f7", // purple-500
      "#c084fc", // purple-400
      "#e879f9", // fuchsia-400
      "#f472b6", // pink-400
      "#fb7185", // rose-400
      "#f87171", // red-400
      "#ef4444", // red-500
      "#dc2626", // red-600
    ];
    return colors[index % colors.length];
  }, []);

  const spawnParticles = useCallback(
    (x: number, y: number, color: string) => {
      const newParticles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        color: string;
      }> = [];
      for (let i = 0; i < 12; i++) {
        newParticles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6 - 2,
          life: 1,
          color,
        });
      }
      particlesRef.current = [...particlesRef.current, ...newParticles];
    },
    []
  );

  const spawnGameOverParticles = useCallback(
    (x: number, y: number) => {
      const colors = ["#ef4444", "#f87171", "#fb7185", "#a855f7"];
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10 - 3,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    },
    []
  );

  const resetGame = useCallback(() => {
    blocksRef.current = [];
    droppedRef.current = false;

    const canvas = canvasRef.current;
    if (canvas) {
      currentBlockRef.current = {
        x: 0,
        width: canvas.width * INITIAL_WIDTH_RATIO,
        speed: BASE_SPEED,
        direction: 1,
      };
    }

    particlesRef.current = [];
    setScore(0);
    scoreRef.current = 0;
    setGameState("playing");
  }, []);

  const dropBlock = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    if (droppedRef.current) return; // prevent double-tap
    droppedRef.current = true;

    const current = currentBlockRef.current;
    if (!current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.width;
    const centerX = canvasWidth / 2;

    // Current block absolute position on canvas
    const maxMove = (canvasWidth - current.width) / 2;
    const currentLeft = centerX + current.x - current.width / 2;

    let targetX: number;
    let targetWidth: number;

    if (blocksRef.current.length === 0) {
      // First block — always lands perfectly as base, centered
      targetX = centerX - current.width / 2;
      targetWidth = current.width;
    } else {
      // Find overlap with the top block
      const topBlock = blocksRef.current[blocksRef.current.length - 1];
      const topLeft = topBlock.x;
      const topRight = topBlock.x + topBlock.width;

      const currentRight = currentLeft + current.width;

      const overlapLeft = Math.max(currentLeft, topLeft);
      const overlapRight = Math.min(currentRight, topRight);

      if (overlapLeft >= overlapRight) {
        // Missed completely — game over
        spawnGameOverParticles(
          (currentLeft + currentRight) / 2,
          canvas.height - (blocksRef.current.length + 1) * BLOCK_HEIGHT
        );
        setBestScore((prev) => Math.max(prev, scoreRef.current));
        setGameState("gameover");
        return;
      }

      targetWidth = overlapRight - overlapLeft;
      targetX = overlapLeft;

      // Spawn particles on successful drop
      const y = canvas.height - (blocksRef.current.length + 1) * BLOCK_HEIGHT;
      spawnParticles(
        (overlapLeft + overlapRight) / 2,
        y + BLOCK_HEIGHT / 2,
        getColor(blocksRef.current.length)
      );
    }

    const y = canvas.height - (blocksRef.current.length + 1) * BLOCK_HEIGHT;

    blocksRef.current.push({
      x: targetX,
      width: targetWidth,
      y: y,
      color: getColor(blocksRef.current.length),
    });

    const newScore = scoreRef.current + 1;
    setScore(newScore);
    scoreRef.current = newScore;

    // If block became too small (< 3px), game over
    if (targetWidth < 3) {
      setBestScore((prev) => Math.max(prev, newScore));
      setGameState("gameover");
      return;
    }

    // Prepare next block with same width as the trimmed one
    const speedIncrease = Math.min(blocksRef.current.length * 0.12, 5);
    currentBlockRef.current = {
      x: 0,
      width: targetWidth,
      speed: BASE_SPEED + speedIncrease,
      direction: blocksRef.current.length % 2 === 0 ? 1 : -1,
    };

    // Reset dropped flag after a short delay to prevent rapid double-tap
    setTimeout(() => {
      droppedRef.current = false;
    }, 100);
  }, [getColor, spawnParticles, spawnGameOverParticles]);

  // Game loop — stable reference via useRef
  const gameLoopRef = useRef<() => void>(null!);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const container = containerRef.current;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // If idle, recalculate initial block width
        if (gameStateRef.current === "idle" && currentBlockRef.current) {
          currentBlockRef.current.width = canvas.width * INITIAL_WIDTH_RATIO;
        }
      }
    };
    resize();
    window.addEventListener("resize", resize);

    gameLoopRef.current = () => {
      if (!ctx || !canvas) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#0a0a0f");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw subtle grid pattern
      ctx.strokeStyle = "rgba(139, 92, 246, 0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvasWidth; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasHeight);
        ctx.stroke();
      }
      for (let i = 0; i < canvasHeight; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasWidth, i);
        ctx.stroke();
      }

      const state = gameStateRef.current;

      // Camera offset: scroll up as tower grows
      let cameraY = 0;
      if (blocksRef.current.length > 15) {
        cameraY = (blocksRef.current.length - 15) * BLOCK_HEIGHT;
      }

      ctx.save();
      ctx.translate(0, cameraY);

      // Draw placed blocks with glow effect
      blocksRef.current.forEach((block, index) => {
        // Glow effect
        ctx.shadowColor = block.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, BLOCK_HEIGHT);

        // Block face highlight (top edge lighter)
        const faceGradient = ctx.createLinearGradient(
          block.x,
          block.y,
          block.x,
          block.y + BLOCK_HEIGHT
        );
        faceGradient.addColorStop(0, "rgba(255,255,255,0.25)");
        faceGradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = faceGradient;
        ctx.fillRect(block.x, block.y, block.width, BLOCK_HEIGHT);

        // Subtle border
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.strokeRect(block.x, block.y, block.width, BLOCK_HEIGHT);
      });

      // Draw current moving block
      if (state === "playing" && currentBlockRef.current) {
        const current = currentBlockRef.current;
        const centerX = canvasWidth / 2;
        const maxMove = (canvasWidth - current.width) / 2;

        // Update position
        current.x += current.speed * current.direction;

        // Bounce off walls
        if (current.x >= maxMove) {
          current.x = maxMove;
          current.direction = -1;
        } else if (current.x <= -maxMove) {
          current.x = -maxMove;
          current.direction = 1;
        }

        const y =
          canvasHeight - (blocksRef.current.length + 1) * BLOCK_HEIGHT;
        const drawX = centerX + current.x - current.width / 2;

        // Glow effect for moving block
        ctx.shadowColor = getColor(blocksRef.current.length);
        ctx.shadowBlur = 15;
        ctx.fillStyle = getColor(blocksRef.current.length);
        ctx.fillRect(drawX, y, current.width, BLOCK_HEIGHT);

        // Highlight
        const moveGradient = ctx.createLinearGradient(
          drawX,
          y,
          drawX,
          y + BLOCK_HEIGHT
        );
        moveGradient.addColorStop(0, "rgba(255,255,255,0.3)");
        moveGradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = moveGradient;
        ctx.fillRect(drawX, y, current.width, BLOCK_HEIGHT);

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(drawX, y, current.width, BLOCK_HEIGHT);

        // Draw a subtle guide line from the block below
        if (blocksRef.current.length > 0) {
          const topBlock = blocksRef.current[blocksRef.current.length - 1];
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(topBlock.x, topBlock.y);
          ctx.lineTo(topBlock.x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(topBlock.x + topBlock.width, topBlock.y);
          ctx.lineTo(topBlock.x + topBlock.width, y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        p.vy += 0.15; // gravity

        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      ctx.restore();

      // Draw score (not affected by camera)
      if (state === "playing" || state === "gameover") {
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 36px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(scoreRef.current.toString(), canvasWidth / 2, 55);
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(gameLoopRef.current!);
    };

    // Start the loop
    animFrameRef.current = requestAnimationFrame(gameLoopRef.current);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [getColor]);

  // Handle tap/click
  const handleTap = useCallback(() => {
    if (gameState === "idle") {
      resetGame();
    } else if (gameState === "playing") {
      dropBlock();
    } else if (gameState === "gameover") {
      resetGame();
    }
  }, [gameState, resetGame, dropBlock]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleTap]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
        <Link href="/" className="group">
          <span className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer font-medium flex items-center gap-2">
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Назад к рецепту
          </span>
        </Link>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
          Tower Stack
        </h1>
        <div className="w-24" /> {/* Spacer for centering */}
      </header>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative">
        {/* Score display */}
        <div className="mb-4 text-center relative z-10">
          {gameState === "gameover" && (
            <div className="mb-2 animate-pulse">
              <p className="text-red-400 text-lg font-semibold">
                Игра окончена!
              </p>
              <p className="text-gray-400">
                Счёт:{" "}
                <span className="text-white font-bold">{score}</span>
                {bestScore > 0 && (
                  <span className="ml-4 text-purple-400">
                    Рекорд: {bestScore}
                  </span>
                )}
              </p>
            </div>
          )}
          {gameState === "playing" && (
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
              {score}
            </div>
          )}
        </div>

        {/* Canvas container */}
        <div
          ref={containerRef}
          className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden border-2 border-purple-500/30 bg-gradient-to-b from-gray-900 to-[#0a0a0f] shadow-2xl shadow-purple-500/10"
          onClick={handleTap}
          onTouchStart={(e) => {
            e.preventDefault();
            handleTap();
          }}
        >
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* Overlay for game over */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center px-6 animate-float">
                <p className="text-4xl font-bold text-red-400 mb-2">
                  💥 Промах!
                </p>
                <p className="text-gray-300 mb-1">Ваш счёт: {score}</p>
                {bestScore > 0 && (
                  <p className="text-purple-400 mb-4">Рекорд: {bestScore}</p>
                )}
                <div className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-red-600 rounded-full font-bold animate-pulse cursor-pointer hover:scale-105 transition-transform">
                  Тапните чтобы начать заново
                </div>
              </div>
            </div>
          )}

          {/* Overlay for idle */}
          {gameState === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="text-center px-6">
                <p className="text-5xl mb-4 animate-float">🏗️</p>
                <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                  Tower Stack
                </h2>
                <p className="text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
                  Тапайте по экрану, чтобы ставить блоки друг на друга. Не
                  промахнитесь!
                </p>
                <div className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-red-600 rounded-full font-bold animate-pulse cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-purple-500/30">
                  Тапните чтобы начать
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 max-w-lg text-center relative z-10">
          <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Правила игры
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
            <div className="bg-gradient-to-br from-gray-900/60 to-purple-950/30 rounded-lg p-3 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
              <span className="text-purple-400 font-bold">1.</span> Блоки ездят
              влево-вправо
            </div>
            <div className="bg-gradient-to-br from-gray-900/60 to-red-950/30 rounded-lg p-3 border border-red-500/10 hover:border-red-500/30 transition-colors">
              <span className="text-red-400 font-bold">2.</span> Тап роняет блок
            </div>
            <div className="bg-gradient-to-br from-gray-900/60 to-purple-950/30 rounded-lg p-3 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
              <span className="text-purple-400 font-bold">3.</span> Неточное
              попадание = меньше блок
            </div>
            <div className="bg-gradient-to-br from-gray-900/60 to-red-950/30 rounded-lg p-3 border border-red-500/10 hover:border-red-500/30 transition-colors">
              <span className="text-red-400 font-bold">4.</span> Промах = конец
              игры
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-gray-800/50 py-4 text-center text-gray-600 text-sm backdrop-blur-sm bg-black/20">
        <p>© 2025 Tower Stack</p>
      </footer>
    </div>
  );
}
