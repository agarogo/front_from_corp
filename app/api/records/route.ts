import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://10.129.0.9:5050';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${BACKEND_URL}/records`, {
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Normalize: accept both array and object with records field
    let records: Record<string, unknown>[];
    if (Array.isArray(data)) {
      records = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.records)) {
      records = data.records;
    } else {
      return NextResponse.json(
        { error: 'Unexpected response format from backend' },
        { status: 502 }
      );
    }

    // Normalize each entry to LeaderboardEntry shape
    const normalized = records.map((entry: Record<string, unknown>, index: number) => ({
      id: (entry.id ?? index),
      username: String(entry.username ?? 'Anonymous'),
      score: Number(entry.score ?? 0),
    }));

    return NextResponse.json(normalized, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Backend request timed out' },
        { status: 504 }
      );
    }

    console.error('Failed to fetch records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 502 }
    );
  }
}
