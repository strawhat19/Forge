import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    ok: true,
    app: 'Forge',
    status: 'Next App Ready',
  });
}
