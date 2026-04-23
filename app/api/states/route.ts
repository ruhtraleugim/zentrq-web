import { NextResponse } from 'next/server'

const BASE = process.env.API_URL!

export async function GET() {
  const res = await fetch(`${BASE}/states`, { cache: 'no-store' })
  const data = await res.json().catch(() => [])
  return NextResponse.json(data, { status: res.status })
}
