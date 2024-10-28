import { clsx, type ClassValue } from 'clsx'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function cast<T>(value: unknown): T {
    return value as T
}

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const merge =
    <T>(...refs: Array<React.Ref<T> | React.LegacyRef<T> | undefined>): React.Ref<T> =>
    value =>
        refs.forEach(ref => assign(ref, value))

const assign = <T>(ref: React.Ref<T> | React.LegacyRef<T> | undefined, value: T): void => {
    if (!ref) return
    if (typeof ref === 'function') ref(value)
    else cast<React.MutableRefObject<T>>(ref).current = value
}

export const Ref = { merge, assign }
