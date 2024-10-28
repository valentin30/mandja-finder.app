'use client'

import { client } from '@/app/client'
import { Heading, Hint, IconButton, PrimaryIconButton, Spacer, UnstyledInput } from '@/app/ui'
import { useRead } from '@/lib/use-read'
import { cn } from '@/lib/utils'
import { MoonIcon, PlayIcon, SunIcon } from '@radix-ui/react-icons'
import { LoaderCircle } from 'lucide-react'
import { ThemeProvider, useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import Markdown from 'react-markdown'

export const MandjaFinder: React.FunctionComponent<MandjaFinderBodyProps> = props => {
    useEffect(() => {
        client.init()
    }, [])
    return (
        <MandjaFinderBody {...props}>
            <MandjaFinderHeader />
            <MandjaFinderMain>
                <MandjaFinderHeading />
                <MandjaFinderHint />
                <MandjaFinderChat>
                    <MandjaFinderMessages />
                    <Spacer />
                    <MandjaFinderForm />
                </MandjaFinderChat>
            </MandjaFinderMain>
            <MandjaFinderModeToggle />
            <MandjaFinderLoader />
        </MandjaFinderBody>
    )
}

export type MandjaFinderBodyProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>
export const MandjaFinderBody: React.FunctionComponent<MandjaFinderBodyProps> = props => {
    const { className, children, ...rest } = props

    return (
        <body
            className={cn(
                'fixed inset-0',
                'flex flex-col items-center justify-center',
                'bg-background font-[family-name:var(--font-nunito)] text-foreground antialiased',
                className,
            )}
            {...rest}
        >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
            </ThemeProvider>
        </body>
    )
}

export type MandjaFinderHeaderProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
export const MandjaFinderHeader: React.FunctionComponent<MandjaFinderHeaderProps> = props => {
    const { className, ...rest } = props
    const view = useRead(client.view)
    if (view !== 'conversation') return null
    return (
        <header
            className={cn(
                'fixed left-4 right-4 top-0 z-40 h-24 bg-background/90 backdrop-blur-sm backdrop-saturate-150 sm:h-[136px]',
                className,
            )}
            {...rest}
        />
    )
}

export type MandjaFinderMainProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
export const MandjaFinderMain: React.FunctionComponent<MandjaFinderMainProps> = props => {
    const { className, ...rest } = props
    return <main className={cn('flex min-w-full flex-col items-center justify-center pb-4 pt-4 sm:pb-8', className)} {...rest} />
}

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
                    element.style.setProperty('position', 'fixed')
                    element.style.setProperty('transform', 'scale(0.5)')
                    element.style.setProperty('top', `${rect.top}px`)
                    element.style.setProperty('left', `${rect.left}px`)
                    requestAnimationFrame(() => {
                        element.style.setProperty('top', `${24 - rect.height / 4}px`)
                        element.style.setProperty('left', `${24 - rect.width / 4}px`)
                    })
                })
            }),
        [],
    )

    return (
        <div ref={ref} className={cn('z-50 transition-[top,_left,_transform] duration-1000', className)} {...rest}>
            <div className="relative w-fit p-6 pt-12 sm:pt-20">
                <Image
                    className={cn(
                        'absolute left-[-68px] top-[-60px] sm:left-[-112px] sm:top-[-80px]',
                        'size-[200px] sm:size-[296px]',
                        'pointer-events-none select-none',
                    )}
                    src="/logo.png"
                    alt="Mandja Finder"
                    width={296}
                    height={296}
                    priority
                />
                <Heading>Mandja Finder</Heading>
            </div>
        </div>
    )
}

export type MandjaFinderHintProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
export const MandjaFinderHint: React.FunctionComponent<MandjaFinderHintProps> = props => {
    const { className, ...rest } = props
    const view = useRead(client.view)
    if (view === 'conversation') return null
    return (
        <Hint
            className={cn(
                'text-center',
                'px-6 pb-12 sm:pt-2',
                'max-w-[688px]',
                'transition-opacity duration-1000',
                'data-[view="home"]:opacity-100',
                'data-[view="splash"]:opacity-0 data-[view="splash"]:duration-0',
                className,
            )}
            data-view={view}
            {...rest}
        >
            Тук ще намерите най-добрите оферти за хранителни продукти около вас и вкусни рецепти, съобразени с вашите предпочитания.
        </Hint>
    )
}

export type MandjaFinderLoaderProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export const MandjaFinderLoader: React.FunctionComponent<MandjaFinderLoaderProps> = props => {
    const { className, ...rest } = props
    const view = useRead(client.view)

    if (view !== 'splash') return null

    return (
        <div className={cn('absolute bottom-24 animate-spin', className)} {...rest}>
            <LoaderCircle className="size-12 text-primary" />
        </div>
    )
}

export type MandjaFinderModeToggleProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export const MandjaFinderModeToggle: React.FunctionComponent<MandjaFinderModeToggleProps> = props => {
    const { className, ...rest } = props
    const { setTheme, theme } = useTheme()

    return (
        <IconButton
            className={cn('fixed right-6 top-6 z-50', className)}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            {...rest}
        >
            <SunIcon className="absolute rotate-0 scale-100 text-secondary-foreground dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute rotate-90 scale-0 text-secondary-foreground dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </IconButton>
    )
}

export type MandjaFinderChatProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export const MandjaFinderChat: React.FunctionComponent<MandjaFinderChatProps> = props => {
    const { className, children, ...rest } = props
    const ref = useRef<HTMLDivElement>(null)
    const view = useRead(client.view)

    useEffect(
        () =>
            client.view.subscribe(() => {
                const element = ref.current
                if (!element) return

                if (client.view.get() !== 'conversation') {
                    element.style.removeProperty('position')
                    element.style.removeProperty('top')
                    element.style.removeProperty('bottom')
                    element.style.removeProperty('height')

                    return
                }

                const rect = element.getBoundingClientRect()
                requestAnimationFrame(() => {
                    element.style.setProperty('position', 'fixed')
                    element.style.setProperty('top', `${rect.top}px`)
                    element.style.setProperty('bottom', `${window.innerHeight - rect.bottom}px`)
                    element.style.setProperty('height', `${rect.height}px`)

                    requestAnimationFrame(() => {
                        element.style.setProperty('top', `0px`)
                        element.style.setProperty('bottom', `0px`)
                        element.style.setProperty('height', `100%`)
                    })
                })
            }),
        [],
    )
    return (
        <div
            ref={ref}
            className={cn(
                'flex flex-col items-center justify-center',
                'left-0 right-0 z-30',
                'w-full',
                'pb-6 sm:pb-8',
                'transition-all duration-1000',
                'data-[view="splash"]:opacity-0 data-[view="splash"]:duration-0',
                className,
            )}
            data-view={view}
            {...rest}
        >
            {children}
        </div>
    )
}

export type MandjaFinderMessagesProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export const MandjaFinderMessages: React.FunctionComponent<MandjaFinderMessagesProps> = props => {
    const { className, ...rest } = props
    const ref = useRef<HTMLDivElement>(null)
    const view = useRead(client.view)
    const messages = useRead(client.messages)
    const message = useRead(client.message)
    const thinking = useRead(client.thinking)

    useEffect(
        () =>
            client.message.subscribe(() => {
                const element = ref.current
                if (!element) return
                const scrollHeight = element.scrollHeight
                requestAnimationFrame(() => {
                    element.scrollTop = scrollHeight
                })
            }),
        [],
    )

    useEffect(() => {
        if (view !== 'conversation') return
        const element = ref.current
        if (!element) return
        const scrollHeight = element.scrollHeight
        requestAnimationFrame(() => {
            element.scrollTop = scrollHeight
        })
    }, [view])

    return (
        <div
            {...rest}
            ref={ref}
            className={cn(
                'flex flex-shrink flex-grow flex-col items-center gap-6',
                'min-h-0 w-full overflow-y-scroll px-6',
                'data-[view="home"]:hidden data-[view="home"]:h-0',
                'data-[view="splash"]:hidden data-[view="splash"]:h-0',
                className,
            )}
            data-view={view}
        >
            {view === 'conversation' && (
                <>
                    <div className="h-[136px] flex-shrink-0 flex-grow-0 sm:h-[176px]" />
                    {messages.map(m => (
                        <MandjaFinderMessage key={m.id} message={m} />
                    ))}
                    {thinking && <MandjaFinderMessage message={message} />}
                    <div className="h-10 flex-shrink-0 flex-grow-0" />
                </>
            )}
        </div>
    )
}

export type MandjaFinderMessageProps = { message: client.Message }
export const MandjaFinderMessage: React.FunctionComponent<MandjaFinderMessageProps> = React.memo(props => {
    if (props.message.role === 'user') {
        return (
            <div className="w-full max-w-[712px]">
                <div className="ml-auto w-fit max-w-[640px] rounded-sm bg-secondary px-4 py-2 text-base text-foreground sm:text-lg">
                    {props.message.content}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-[712px]">
            <Markdown className="markdown text-left text-base text-foreground sm:text-lg">{props.message.content}</Markdown>
        </div>
    )
})

MandjaFinderMessage.displayName = 'MandjaFinderMessage'

export type MandjaFinderFormProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLFormElement>, HTMLFormElement>
export const MandjaFinderForm: React.FunctionComponent<MandjaFinderFormProps> = props => {
    const { className, ...rest } = props
    const value = useRead(client.value)
    const thinking = useRead(client.thinking)
    const disabled = value.length === 0 || thinking

    return (
        <form
            {...rest}
            className={cn('flex w-full flex-shrink-0 flex-grow-0 items-center justify-center px-6', className)}
            onSubmit={e => {
                e.preventDefault()
                client.send()
            }}
        >
            <div className="flex w-full max-w-[712px] flex-row items-center rounded-sm bg-muted p-2 shadow-sm transition-[box-shadow,_color,_background-color] duration-300 focus-within:bg-secondary focus-within:shadow-lg">
                <UnstyledInput
                    className="mt-0.5 flex-grow px-3 py-1"
                    placeholder="Hello from gpt"
                    value={value}
                    onChange={e => client.value.set(e.target.value)}
                />
                <PrimaryIconButton type="submit" disabled={disabled}>
                    <PlayIcon />
                </PrimaryIconButton>
            </div>
        </form>
    )
}
