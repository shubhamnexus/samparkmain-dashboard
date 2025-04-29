import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace this with your actual data source
    const states = [
      { id: '1', name: 'State 1' },
      { id: '2', name: 'State 2' },
      { id: '3', name: 'State 3' },
    ];

    return NextResponse.json(states);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 });
  }
} 