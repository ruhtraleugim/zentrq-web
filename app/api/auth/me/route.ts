import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json(null, { status: 401 })

  const backendRes = await fetch(`${process.env.API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!backendRes.ok) {
    const res = NextResponse.json(null, { status: 401 })
    res.cookies.set('token', '', { maxAge: 0, path: '/' })
    return res
  }

  const user = await backendRes.json()
  return NextResponse.json(user)
}
