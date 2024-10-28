import { service } from '@/app/service'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

type Params = { id: string }
type Ctx = { params: Promise<Params> }

export async function POST(request: NextRequest, ctx: Ctx) {
    const params = await ctx.params
    if (!params.id) return Response.error()
    const data = await request.json()
    await service.thread.message.create(params.id, data.content)
    const stream = await service.thread.stream(params.id)
    return new Response(stream.toReadableStream())
}
