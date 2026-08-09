// Typed API adapter for Tower Stack leaderboard
// Uses Next.js route handlers as proxy - never calls backend directly from browser

export interface LeaderboardEntry {
  id?: string | number;
  username: string;
  score: number;
}

// Fetch leaderboard from our Next.js proxy
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch('/api/records');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

// Submit score through our Next.js proxy
export async function submitScore(username: string, score: number): Promise<void> {
  const response = await fetch('/api/record', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, score }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to submit score: ${response.status}`);
  }
}
