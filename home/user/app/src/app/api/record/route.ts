import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://10.129.0.9:5050';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, score } = body;

    if (!username || typeof username !== 'string' || !score || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body. Expected username (string) and score (number).' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length === 0 || trimmedUsername.length > 20) {
      return NextResponse.json(
        { error: 'Username must be between 1 and 20 characters.' },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${BACKEND_URL}/record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: trimmedUsername, score }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Backend returned non-OK status' },
        { status: response.status }
      );
    }

    // Try to parse response, but don't fail if backend returns non-JSON
    let data;
    try {
      data = await response.json();
    } catch {
      data = { success: true };
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Backend request timed out' },
        { status: 504 }
      );
    }
    
    console.error('Failed to submit record:', error);
    return NextResponse.json(
      { error: 'Failed to submit record' },
      { status: 502 }
    );
  }
}
