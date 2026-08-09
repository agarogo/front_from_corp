'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TowerGame from '@/components/TowerGame';
import { LeaderboardEntry, fetchLeaderboard, submitScore } from '@/lib/api';

export default function TowerGamePage() {
  const [gameScore, setGameScore] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load leaderboard on mount
  useEffect(() => {
    loadLeaderboard();
  }, []);

  const handleGameOver = useCallback((score: number) => {
    setGameScore(score);
  }, []);

  const handleSubmitScore = async () => {
    if (!username.trim() || !gameScore || gameScore === 0) return;

    try {
      setSubmitting(true);
      await submitScore(username.trim(), gameScore);
      // Refresh leaderboard after successful submission
      await loadLeaderboard();
    } catch (err) {
      setError('Failed to save score');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Tower Stack</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Area */}
          <div className="flex flex-col items-center">
            <TowerGame onGameOver={handleGameOver} />

            {gameScore !== null && gameScore > 0 && (
              <div className="mt-6 w-full max-w-md bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Save Your Score</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                    placeholder="Enter username"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    maxLength={20}
                  />
                  <button
                    onClick={handleSubmitScore}
                    disabled={submitting || !username.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded font-semibold transition-colors"
                  >
                    {submitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>

            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : leaderboard.length === 0 ? (
              <div className="text-gray-400">No scores yet. Be the first!</div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id || index}
                    className="flex justify-between items-center p-3 bg-gray-700 rounded"
                  >
                    <span className="font-semibold">{entry.username}</span>
                    <span className="text-blue-400 font-bold">{entry.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
