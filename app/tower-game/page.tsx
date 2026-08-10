'use client';

import React, { useState, useCallback } from 'react';
import TowerGame from '@/components/TowerGame';
import { submitScore } from '@/lib/api';
import Link from 'next/link';

export default function TowerGamePage() {
  const [gameScore, setGameScore] = useState<number | null>(null);
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tower-game-username') || '';
    }
    return '';
  });
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    if (!username.trim()) return;
    localStorage.setItem('tower-game-username', username.trim());
    setStarted(true);
  };

  // Auto-save best score on game over
  const handleGameOver = useCallback(async (score: number) => {
    setGameScore(score);

    // Auto-submit if we have a username and score > 0
    if (username.trim() && score > 0 && !submitting) {
      try {
        setSubmitting(true);
        await submitScore(username.trim(), score);
      } catch (err) {
        setError('Failed to save score automatically');
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  }, [username, submitting]);

  const handleRestart = () => {
    setGameScore(null);
    setError(null);
  };

  // --- Screen: Enter username first ---
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tower Stack
            </h1>
            <p className="text-gray-400">Stack blocks as high as you can!</p>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStart();
              }}
            />

            <button
              onPointerDown={(e) => {
                e.preventDefault();
                handleStart();
              }}
              disabled={!username.trim()}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
            >
              ▶ Start Playing
            </button>

            <div className="mt-4 text-center">
              <Link
                href="/leaderboard"
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                🏆 View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Screen: Game ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tower Stack
          </h1>
          <div className="flex gap-3">
            <Link
              href="/leaderboard"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium border border-gray-700"
            >
              🏆 Leaderboard
            </Link>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                setStarted(false);
              }}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium border border-gray-700"
            >
              ← Menu
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex flex-col items-center">
          <TowerGame onGameOver={handleGameOver} />

          {gameScore !== null && gameScore > 0 && (
            <div className="mt-6 w-full max-w-md bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-center">
                {submitting ? 'Saving score...' : 'Game Over!'}
              </h3>
              {error && (
                <p className="text-red-400 text-sm text-center mb-2">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleRestart();
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition-all"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
