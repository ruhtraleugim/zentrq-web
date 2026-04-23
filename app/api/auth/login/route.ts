import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const backendRes = await fetch(`${process.env.API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!backendRes.ok) {
    const err = await backendRes.json().catch(() => ({ message: 'Credenciais inválidas' }))
    return NextResponse.json(err, { status: backendRes.status })
  }

  const data: { token: string; role: string } = await backendRes.json()

  const res = NextResponse.json({ role: data.role })
  res.cookies.set('token', data.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
