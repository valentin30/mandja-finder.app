import { service } from '@/app/service'

export const runtime = 'edge'

export async function POST() {
    const thread = await service.thread.create()
    return Response.json(thread)
}
