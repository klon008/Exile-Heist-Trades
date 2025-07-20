
// /src/app/api/poe-items/route.ts
import { NextResponse } from 'next/server';
import { fetchAllItems } from '@/lib/poe-data';

export const dynamic = 'force-dynamic'; // force dynamic rendering

export async function GET() {
  try {
    const { items, currencyIcons } = await fetchAllItems();
    return NextResponse.json({ items, currencyIcons });
  } catch (error) {
    console.error('Error fetching PoE items:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Failed to fetch data from poe.ninja: ${errorMessage}` }, { status: 500 });
  }
}
