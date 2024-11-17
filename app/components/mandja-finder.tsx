'use client'

import { client } from '@/app/client'
import { MandjaFinderHeading } from '@/app/components/mandja-finder/header'
import { Hint, IconButton, PrimaryIconButton, Skeleton, Spacer, UnstyledInput } from '@/app/ui'
import { useRead } from '@/lib/use-read'
import { cn } from '@/lib/utils'
import { Cross1Icon, GearIcon, MoonIcon, PlayIcon, SunIcon } from '@radix-ui/react-icons'
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group'
import { LoaderCircle } from 'lucide-react'
import { ThemeProvider, useTheme } from 'next-themes'
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
                <MandjaFinderHeading className="z-50" />
                <MandjaFinderHint />
                <MandjaFinderChat>
                    <MandjaFinderMessages />
                    <Spacer />
                    <MandjaFinderForm />
                </MandjaFinderChat>
            </MandjaFinderMain>
            <MandjaFinderSettings />
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

export type MandjaFinderSettingsProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export const MandjaFinderSettings: React.FunctionComponent<MandjaFinderSettingsProps> = props => {
    const { className, ...rest } = props
    const [open, setOpen] = React.useState(false)
    const { setTheme, theme } = useTheme()
    const view = useRead(client.view)
    if (view === 'splash') return null
    return (
        <>
            <IconButton className={cn('fixed right-6 top-6 z-50', className)} aria-label="Settings" onClick={() => setOpen(true)} {...rest}>
                <GearIcon className="text-secondary-foreground" />
                <span className="sr-only">Settings</span>
            </IconButton>
            {open && (
                <div className="fixed inset-0 z-[100] bg-background">
                    <IconButton className="fixed right-6 top-6" aria-label="Close" onClick={() => setOpen(false)} {...rest}>
                        <Cross1Icon className="text-secondary-foreground" />
                        <span className="sr-only">Close</span>
                    </IconButton>
                    <div className="mt-14 flex w-full flex-col items-center p-6">
                        <div className="w-full max-w-[712px]">
                            <p className="text-base font-semibold text-foreground sm:text-lg">Theme</p>
                            <p className="text-sm font-light text-secondary-foreground sm:text-base">Select the theme for the app.</p>
                            <RadioGroup name="theme" className="mt-2 flex flex-row gap-2" value={theme} onValueChange={v => setTheme(v)}>
                                <label htmlFor="light" className="cursor-pointer [&:has([data-state=checked])>div]:border-primary">
                                    <RadioGroupItem id="light" value="light" className="sr-only"></RadioGroupItem>
                                    <div className="bg-light items-center rounded-md border-2 border-muted p-1">
                                        <div className="bg-light-secondary w-fit space-y-2 rounded-sm p-2">
                                            <div className="bg-light space-y-2 rounded-md p-2 shadow-sm">
                                                <div className="bg-light-secondary h-2 w-[80px] rounded-lg" />
                                                <div className="bg-light-secondary h-2 w-[100px] rounded-lg" />
                                            </div>
                                            <div className="bg-light flex items-center space-x-2 rounded-md p-2 shadow-sm">
                                                <div className="bg-light-secondary h-4 w-4 rounded-full" />
                                                <div className="bg-light-secondary h-2 w-[100px] rounded-lg" />
                                            </div>
                                            <div className="bg-light flex items-center space-x-2 rounded-md p-2 shadow-sm">
                                                <div className="bg-light-secondary h-4 w-4 rounded-full" />
                                                <div className="bg-light-secondary h-2 w-[100px] rounded-lg" />
                                            </div>
                                        </div>
                                    </div>
                                </label>

                                <label htmlFor="dark" className="cursor-pointer [&:has([data-state=checked])>div]:border-primary">
                                    <RadioGroupItem id="dark" value="dark" className="sr-only"></RadioGroupItem>
                                    <div className="bg-dark items-center rounded-md border-2 border-muted bg-popover p-1">
                                        <div className="bg-dark-secondary space-y-2 rounded-sm p-2">
                                            <div className="space-y-2 rounded-md bg-dark-muted p-2 shadow-sm">
                                                <div className="h-2 w-[80px] rounded-lg bg-dark-muted-foreground" />
                                                <div className="h-2 w-[100px] rounded-lg bg-dark-muted-foreground" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-dark-muted p-2 shadow-sm">
                                                <div className="h-4 w-4 rounded-full bg-dark-muted-foreground" />
                                                <div className="h-2 w-[100px] rounded-lg bg-dark-muted-foreground" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-dark-muted p-2 shadow-sm">
                                                <div className="h-4 w-4 rounded-full bg-dark-muted-foreground" />
                                                <div className="h-2 w-[100px] rounded-lg bg-dark-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="fixed bottom-8 flex w-full flex-row items-center justify-center gap-4 p-2">
                        <a href="https://www.instagram.com/mandja_finder" aria-label="Instagram">
                            <InstagramIcon className="size-9" />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61566802165438" aria-label="Facebook">
                            <FacebookIcon className="size-9" />
                        </a>
                        <a href="https://www.tiktok.com/@mandja.finder" aria-label="TikTok">
                            <TikTokIcon className="size-9" />
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}

const InstagramIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = props => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.87 28.87" id="instagram" {...props}>
            <defs>
                <linearGradient id="linear-gradient" x1="-1.84" x2="32.16" y1="30.47" y2="-3.03" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fed576"></stop>
                    <stop offset=".26" stopColor="#f47133"></stop>
                    <stop offset=".61" stopColor="#bc3081"></stop>
                    <stop offset="1" stopColor="#4c63d2"></stop>
                </linearGradient>
            </defs>
            <g id="Layer_2">
                <g id="Layer_1-2">
                    <rect width="28.87" height="28.87" rx="6.48" ry="6.48" fill="url(#linear-gradient)"></rect>
                    <g id="_Group_">
                        <path
                            id="_Compound_Path_"
                            d="M10 5h9c.2.1.5.1.7.2a4.78 4.78 0 0 1 3.8 3.3 8 8 0 0 1 .3 1.5v8.8a6.94 6.94 0 0 1-1.2 3.1 5.51 5.51 0 0 1-4.5 1.9h-7.5a5.49 5.49 0 0 1-3.7-1.2A5.51 5.51 0 0 1 5 18.14v-7a7.57 7.57 0 0 1 .1-1.5 4.9 4.9 0 0 1 3.8-4.3zm-3.1 9.5v3.9a3.42 3.42 0 0 0 3.7 3.7q3.9.15 7.8 0c2.3 0 3.6-1.4 3.7-3.7q.15-3.9 0-7.8a3.52 3.52 0 0 0-3.7-3.7q-3.9-.15-7.8 0a3.42 3.42 0 0 0-3.7 3.7z"
                            fill="#fff"
                        ></path>
                        <path
                            id="_Compound_Path_2"
                            d="M9.64 14.54a4.91 4.91 0 0 1 4.9-4.9 5 5 0 0 1 4.9 4.9 4.91 4.91 0 0 1-4.9 4.9 5 5 0 0 1-4.9-4.9zm4.9-3.1a3.05 3.05 0 1 0 3 3 3 3 0 0 0-3-3z"
                            fill="#fff"
                        ></path>
                        <path
                            id="_Path_"
                            d="M18.34 9.44a1.16 1.16 0 0 1 1.2-1.2 1.29 1.29 0 0 1 1.2 1.2 1.2 1.2 0 0 1-2.4 0z"
                            fill="#fff"
                        ></path>
                    </g>
                </g>
            </g>
        </svg>
    )
}

const FacebookIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = props => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 16 16" id="facebook" {...props}>
            <path fill="#1976D2" d="M14 0H2C.897 0 0 .897 0 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V2c0-1.103-.897-2-2-2z"></path>
            <path
                fill="#FAFAFA"
                fillRule="evenodd"
                d="M13.5 8H11V6c0-.552.448-.5 1-.5h1V3h-2a3 3 0 0 0-3 3v2H6v2.5h2V16h3v-5.5h1.5l1-2.5z"
                clipRule="evenodd"
            ></path>
        </svg>
    )
}

const TikTokIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = props => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.51 38.51" id="tiktok" {...props}>
            <defs>
                <linearGradient id="a" x1="3.65" x2="34.85" y1=".66" y2="37.84" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#323232"></stop>
                    <stop offset="1"></stop>
                </linearGradient>
                <linearGradient id="b" x1="3.85" x2="35.05" y1=".5" y2="37.68" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#646464"></stop>
                    <stop offset=".43" stopColor="#1d1d1d"></stop>
                    <stop offset=".6"></stop>
                </linearGradient>
            </defs>
            <g style={{ isolation: 'isolate' }}>
                <g>
                    <g>
                        <g>
                            <rect width="38.51" height="38.51" fill="url(#a)" rx="6.97" ry="6.97"></rect>
                            <g>
                                <path
                                    fill="url(#b)"
                                    d="M38.51,31.54v-11.64c-2.31-2.35-4.72-4.62-6.98-7.03-.45,0-.9-.05-1.33-.14v3.59c-2.37,0-4.56-.75-6.35-2.03v9.3c0,4.65-3.77,8.42-8.43,8.42-1.74,0-3.35-.52-4.69-1.42,2.69,2.67,5.27,5.27,7.92,7.92h12.9c3.83,0,6.97-3.14,6.97-6.97Z"
                                ></path>
                                <path
                                    fill="#ff1753"
                                    d="M38.51,31.54v-11.64c-2.31-2.35-4.72-4.62-6.98-7.03-.45,0-.9-.05-1.33-.14v3.59c-2.37,0-4.56-.75-6.35-2.03v9.3c0,4.65-3.77,8.42-8.43,8.42-1.74,0-3.35-.52-4.69-1.42,2.69,2.67,5.27,5.27,7.92,7.92h12.9c3.83,0,6.97-3.14,6.97-6.97Z"
                                    style={{
                                        mixBlendMode: 'multiply',
                                    }}
                                ></path>
                            </g>
                            <g>
                                <g>
                                    <path
                                        fill="#ff1753"
                                        fillRule="evenodd"
                                        d="M26.82,10.8c-.92-1-1.52-2.29-1.65-3.72v-.59h-1.26c.32,1.81,1.4,3.37,2.91,4.31h0ZM13.66,27.02c-.51-.67-.79-1.49-.79-2.33,0-2.13,1.73-3.85,3.86-3.85.4,0,.79.06,1.17.18v-4.66c-.44-.06-.89-.09-1.33-.08v3.63c-.38-.12-.77-.18-1.17-.18-2.13,0-3.86,1.73-3.86,3.85,0,1.5.86,2.81,2.12,3.44Z"
                                        opacity=".8"
                                    ></path>
                                    <path
                                        fill="#fff"
                                        fillRule="evenodd"
                                        d="M23.84,14.29c1.79,1.28,3.99,2.03,6.35,2.03v-3.59c-1.32-.28-2.49-.97-3.37-1.93-1.51-.94-2.59-2.49-2.91-4.31h-3.32v18.2c0,2.12-1.73,3.84-3.86,3.84-1.25,0-2.36-.6-3.07-1.52-1.26-.63-2.12-1.94-2.12-3.44,0-2.13,1.73-3.85,3.86-3.85.41,0,.8.06,1.17.18v-3.63c-4.57.09-8.25,3.83-8.25,8.42,0,2.29.92,4.37,2.4,5.89,1.34.9,2.96,1.42,4.69,1.42,4.65,0,8.43-3.77,8.43-8.42v-9.3Z"
                                    ></path>
                                    <path
                                        fill="#00c9d0"
                                        fillRule="evenodd"
                                        d="M30.19,12.73v-.97c-1.19,0-2.36-.33-3.37-.96.9.98,2.08,1.66,3.37,1.93ZM23.91,6.49c-.03-.17-.05-.35-.07-.52v-.59h-4.59v18.2c0,2.12-1.73,3.84-3.86,3.84-.62,0-1.21-.15-1.73-.41.7.92,1.82,1.52,3.07,1.52,2.12,0,3.85-1.72,3.86-3.84V6.49h3.32ZM16.57,16.28v-1.03c-.38-.05-.77-.08-1.16-.08-4.66,0-8.43,3.77-8.43,8.42,0,2.92,1.48,5.49,3.74,7-1.49-1.52-2.4-3.6-2.4-5.89,0-4.59,3.68-8.33,8.25-8.42h0Z"
                                    ></path>
                                </g>
                                <path
                                    fill="#ff1753"
                                    fillRule="evenodd"
                                    d="M25.17,15.4c1.79,1.28,3.99,2.03,6.35,2.03v-4.56c-.45,0-.9-.05-1.33-.14v3.59c-2.37,0-4.56-.75-6.35-2.03v9.3c0,4.65-3.77,8.42-8.43,8.42-1.74,0-3.35-.52-4.69-1.42,1.53,1.56,3.66,2.53,6.03,2.53,4.66,0,8.43-3.77,8.43-8.42v-9.3h0Z"
                                    opacity=".8"
                                ></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
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
            aria-label="Toggle Theme"
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
    if (props.message.id === 'loading' && props.message.content === '') {
        return (
            <div className="flex w-full max-w-[712px] flex-col gap-1">
                <div className="flex flex-row items-center gap-1">
                    <Skeleton className="h-3 w-[7%] delay-75 duration-1000" />
                    <Skeleton className="h-3 w-[4%]" />
                    <Skeleton className="h-3 w-[3%] delay-75" />
                    <Skeleton className="h-3 w-[10%]" />
                    <Skeleton className="h-3 w-[6%] duration-1000" />
                    <Skeleton className="h-3 w-[9%]" />
                    <Skeleton className="h-3 w-[11%] delay-75" />
                    <Skeleton className="h-3 w-[9%]" />
                    <Skeleton className="h-3 w-[8%] duration-1000" />
                    <Skeleton className="h-3 w-[5%]" />
                </div>
                <div className="flex flex-row items-center gap-1">
                    <Skeleton className="h-3 w-[10%]" />
                    <Skeleton className="h-3 w-[7%]" />
                    <Skeleton className="h-3 w-[9%] delay-75 duration-1000" />
                    <Skeleton className="h-3 w-[4%]" />
                    <Skeleton className="h-3 w-[7%]" />
                    <Skeleton className="h-3 w-[6%]" />
                    <Skeleton className="h-3 w-[9%] delay-75" />
                    <Skeleton className="h-3 w-[11%]" />
                    <Skeleton className="h-3 w-[5%] duration-1000" />
                    <Skeleton className="h-3 w-[8%]" />
                    <Skeleton className="h-3 w-[3%] delay-75" />
                </div>
                <div className="flex flex-row items-center gap-1">
                    <Skeleton className="h-3 w-[6%]" />
                    <Skeleton className="h-3 w-[9%] delay-75" />
                    <Skeleton className="h-3 w-[3%] duration-1000" />
                </div>
            </div>
        )
    }

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
            <div className="flex w-full max-w-[712px] flex-row items-center rounded-sm bg-dark-muted p-2 shadow-sm transition-[box-shadow,_color,_background-color] duration-300 focus-within:bg-secondary focus-within:shadow-lg">
                <UnstyledInput
                    className="mt-0.5 flex-grow px-3 py-1"
                    placeholder="Попитай за рецепти и намаления."
                    value={value}
                    onChange={e => client.value.set(e.target.value)}
                />
                <PrimaryIconButton type="submit" disabled={disabled} aria-label="Send Message">
                    <PlayIcon />
                </PrimaryIconButton>
            </div>
        </form>
    )
}
