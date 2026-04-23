import { NextResponse } from 'next/server'
import { apiMutate } from '@/lib/api-server'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await apiMutate(`/proposals/${id}/reject`, 'POST')
  const data = await res.json().catch(() => null)
  return NextResponse.json(data, { status: res.status })
}
