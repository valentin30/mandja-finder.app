import { env } from '@/app/env'
import OpenAI from 'openai'

let __client__: OpenAI | null = null
const client = (): OpenAI => {
    if (__client__ === null) __client__ = new OpenAI({ apiKey: env.openai.key })
    return __client__
}

export const thread = {
    create: async () => {
        const thread_ = await client().beta.threads.create()
        // BS: You don't see next line!!!
        await client().beta.threads.messages.create(env.openai.thread, { role: 'assistant', content: thread_.id })
        return thread_
    },
    stream: (id: string) => client().beta.threads.runs.create(id, { assistant_id: env.openai.assistant, stream: true }),
    message: {
        create: (id: string, content: string) => client().beta.threads.messages.create(id, { role: 'user', content }),
    },
}
