'use client'

import { managed } from '@/lib/managed'
import { delay } from '@/lib/utils'
import OpenAI from 'openai'
import { AssistantStream } from 'openai/lib/AssistantStream'

export type View = 'splash' | 'conversation' | 'home'
export type Message = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export const start = 'splash'
export const view = managed<View>('splash')
export const value = managed<string>('')
export const thread = managed<string | null>(null)
export const thinking = managed<boolean>(false)
export const message = managed<Message>({ id: 'loading', role: 'assistant', content: '' })
export const messages = managed<Message[]>([])

thread.subscribe(() => localStorage.setItem('thread', thread.get() || ''))
messages.subscribe(() => localStorage.setItem('messages', JSON.stringify(messages.get())))

export const id = () => Math.random().toString(36)

export const init = async () => {
    value.set('')
    thinking.set(false)

    await delay(1000)

    try {
        thread.set(localStorage.getItem('thread'))
        const data = localStorage.getItem('messages')
        if (data) messages.set(JSON.parse(data))
    } catch (error) {
        console.error(error)
    }

    if (!thread.get()) view.set('home')
    else view.set('conversation')
}

export const reset = () => {
    view.set('splash')
    thread.set(null)
    messages.set([])
    init()
}

export const send = async () => {
    if (thinking.get()) return
    if (!value.get()) return

    if (value.get() === ':~q') {
        reset()
        return
    }

    const content = value.get()
    value.set('')
    messages.set([...messages.get(), { id: id(), role: 'user', content }])

    if (view.get() !== 'conversation') view.set('conversation')

    thinking.set(true)
    message.set({ id: 'loading', role: 'assistant', content: '' })

    if (!thread.get()) {
        try {
            const response = await fetch('/api/threads', { method: 'POST' })
            const data: OpenAI.Beta.Threads.Thread = await response.json()
            thread.set(data.id)
        } catch (error) {
            console.error(error)
            thinking.set(false)
            return
        }
    }

    const response = await fetch(`/api/threads/${thread.get()}/messages`, { method: 'POST', body: JSON.stringify({ content }) })
    if (!response.body) return

    const runner = AssistantStream.fromReadableStream(response.body)
    runner.on('error', error => console.error(error))
    runner.on('messageCreated', message => thread.set(message.thread_id))
    runner.on('textDelta', (_, contentSnapshot) => message.set({ ...message.get(), content: contentSnapshot.value }))
    runner.on('messageDone', message => {
        const final = message.content[0].type == 'text' ? message.content[0].text.value : ''
        messages.set([...messages.get(), { id: id(), role: 'assistant', content: final }])
        thinking.set(false)
    })
}
