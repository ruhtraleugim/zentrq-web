import { NextResponse } from 'next/server'
import { apiMutate } from '@/lib/api-server'

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await apiMutate(`/jobs/${id}/cancel`, 'PATCH')
  const data = await res.json().catch(() => null)
  return NextResponse.json(data, { status: res.status })
}
