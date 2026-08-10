'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, fetchLeaderboard } from '@/lib/api';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLeaderboard();
        if (!cancelled) {
          setLeaderboard(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load leaderboard');
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Medal colors for top 3
  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRowBg = (index: number) => {
    if (index === 0) return 'bg-yellow-500/10 border-yellow-500/30';
    if (index === 1) return 'bg-gray-400/10 border-gray-400/30';
    if (index === 2) return 'bg-orange-600/10 border-orange-600/30';
    return 'bg-gray-700/50 border-gray-600/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <Link
            href="/tower-game"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium border border-gray-700"
          >
            ← Back to Game
          </Link>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              Loading scores...
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-red-400 mb-4">{error}</div>
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  loadLeaderboard();
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🎮</div>
              <div className="text-gray-400 mb-4">No scores yet. Be the first!</div>
              <Link
                href="/tower-game"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all inline-block"
              >
                Play Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700/50">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-900/50 text-sm font-medium text-gray-400 uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-7">Player</div>
                <div className="col-span-4 text-right">Score</div>
              </div>

              {/* Rows */}
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-700/30 ${getRowBg(index)} hover:bg-gray-600/20 transition-colors`}
                >
                  <div className="col-span-1 text-lg font-bold">
                    {getMedal(index)}
                  </div>
                  <div className="col-span-7 font-semibold truncate">
                    {entry.username}
                  </div>
                  <div className="col-span-4 text-right font-bold text-blue-400 text-lg">
                    {entry.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          Scores are saved automatically after each game
        </div>
      </div>
    </div>
  );
}
