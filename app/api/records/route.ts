import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://10.129.0.9:5050';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${BACKEND_URL}/records`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Backend returned non-OK status' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
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
