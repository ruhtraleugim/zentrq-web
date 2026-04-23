import { NextResponse } from 'next/server'

const BASE = process.env.API_URL!

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`${BASE}/states/${id}/cities`, { cache: 'no-store' })
  const data = await res.json().catch(() => [])
  return NextResponse.json(data, { status: res.status })
}
