export type Callback = () => void

export interface Subscription {
    subscribe(callback: Callback): Callback
}

export const subscription = (): [Callback, Subscription] => {
    const listeners = new Set<Callback>()

    return [
        () => listeners.forEach(listener => listener()),
        { subscribe: callback => listeners.add(callback).delete.bind(listeners, callback) },
    ]
}
