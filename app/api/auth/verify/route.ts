import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('BODY:', body)

    const backendRes = await fetch(`${process.env.API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const text = await backendRes.text()

    return new NextResponse(text, { status: backendRes.status })

  } catch (err) {
    console.error('ERRO NO ROUTE:', err)
    return NextResponse.json({ error: 'Falha no parsing JSON' }, { status: 400 })
  }
}