import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const clienteRoutes = ['/cliente']
const profissionalRoutes = ['/profissional']
const authRoutes = ['/login', '/register', '/verify']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  const isClienteRoute = clienteRoutes.some(r => pathname.startsWith(r))
  const isProfissionalRoute = profissionalRoutes.some(r => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))

  if ((isClienteRoute || isProfissionalRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/cliente/jobs', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cliente/:path*',
    '/profissional/:path*',
    '/login',
    '/register',
    '/verify',
  ],
}
