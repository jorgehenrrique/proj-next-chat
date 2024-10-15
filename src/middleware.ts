// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Adicione lógica de middleware aqui, se necessário
  console.log('Middleware', request);

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
