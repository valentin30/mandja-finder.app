import { subscription, Subscription } from '@/lib/subscription'

export interface Managed<T> extends Subscription {
    get(): T
    set(value: T): void
}

export const managed = <T>(initial: T): Managed<T> => {
    let value = initial
    const [notify, engine] = subscription()

    return {
        ...engine,
        get: () => value,
        set: next => {
            if (value === next) return
            value = next
            notify()
        },
    }
}
