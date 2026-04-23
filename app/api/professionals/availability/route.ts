import { NextResponse } from 'next/server'
import { apiMutate } from '@/lib/api-server'

export async function PUT() {
  const res = await apiMutate('/professionals/availability', 'PUT')
  const data = await res.json().catch(() => null)
  return NextResponse.json(data, { status: res.status })
}
