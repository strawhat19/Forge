import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    app: 'Forge',
    status: 'API Ready',
    routes: ['/api/health'],
  });
}
