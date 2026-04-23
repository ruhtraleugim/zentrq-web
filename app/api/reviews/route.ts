import { NextRequest, NextResponse } from 'next/server'
import { apiMutate } from '@/lib/api-server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await apiMutate('/reviews', 'POST', body)
  const data = await res.json().catch(() => null)
  return NextResponse.json(data, { status: res.status })
}
