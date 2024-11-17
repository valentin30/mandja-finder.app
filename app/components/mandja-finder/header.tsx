'use client'

import { client } from '@/app/client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export type MandjaFinderHeadingPosition = 'top' | 'center'

export class MandjaFinderHeadingElement {}

export type MandjaFinderHeadingProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export const MandjaFinderHeading: React.FunctionComponent<MandjaFinderHeadingProps> = props => {
    const { className, ...rest } = props
    const ref = useRef<HTMLDivElement>(null)

    useEffect(
        () =>
            client.view.subscribe(() => {
                const element = ref.current
                if (!element) return

                const view = client.view.get()

                if (view !== 'conversation') {
                    element.style.removeProperty('position')
                    element.style.removeProperty('top')
                    element.style.removeProperty('left')
                    element.style.removeProperty('transform')
                    element.style.setProperty('transition', 'none', 'important')
                    requestAnimationFrame(() => {
                        element.style.removeProperty('transition')
                    })
                    return
                }

                const rect = element.getBoundingClientRect()
                requestAnimationFrame(() => {
                    element.style.position = 'fixed'
                    element.style.top = `${rect.top}px`
                    element.style.left = `${rect.left}px`
                    requestAnimationFrame(() => {
                        element.style.transform = `translateX(${-(rect.x + rect.width / 4)}px) translateY(${-(rect.y + rect.height / 4)}px) scale(0.5)`
                    })
                })
            }),
        [],
    )

    return (
        <div ref={ref} className={cn('text-6xl transition-transform duration-1000 sm:text-8xl', className)} {...rest}>
            <div className="relative w-fit px-[0.75em] pb-[0.5em] pt-[1.3em]">
                <Image
                    className="pointer-events-none absolute left-[-0.75em] top-[-0.5em] size-[3.25em] select-none"
                    src="/logo.png"
                    alt="Mandja Finder"
                    width={288}
                    height={288}
                    priority
                />
                <h1 className="font-[family-name:var(--font-reklame-script)]">Mandja Finder</h1>
            </div>
        </div>
    )
}
