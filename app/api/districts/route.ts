import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stateId = searchParams.get('stateId');

    if (!stateId) {
      return NextResponse.json({ error: 'State ID is required' }, { status: 400 });
    }

    // Replace this with your actual data source
    const districts = [
      { id: '1', name: 'District 1', stateId: '1' },
      { id: '2', name: 'District 2', stateId: '1' },
      { id: '3', name: 'District 3', stateId: '2' },
      { id: '4', name: 'District 4', stateId: '2' },
      { id: '5', name: 'District 5', stateId: '3' },
      { id: '6', name: 'District 6', stateId: '3' },
    ].filter(district => district.stateId === stateId);

    return NextResponse.json(districts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch districts' }, { status: 500 });
  }
} 