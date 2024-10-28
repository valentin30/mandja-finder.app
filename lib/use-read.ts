import { Managed } from '@/lib/managed'
import { useEffect, useState } from 'react'

export const useRead = <const T>(value: Managed<T>): T => {
    const [state, setState] = useState(value.get())
    useEffect(() => value.subscribe(() => setState(value.get())), [value])
    return state
}
