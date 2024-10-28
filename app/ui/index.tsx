import { cn } from '@/lib/utils'
import React from 'react'

export type HeadingProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
export const Heading: React.FunctionComponent<HeadingProps> = props => {
    const { className, children, ...rest } = props
    return (
        <h1 className={cn('font-[family-name:var(--font-reklame-script)] text-6xl sm:text-8xl', className)} {...rest}>
            {children}
        </h1>
    )
}

export type HintProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
export const Hint: React.FunctionComponent<HintProps> = props => {
    const { className, children, ...rest } = props
    return (
        <p className={cn('text-base font-light text-secondary-foreground sm:text-lg', className)} {...rest}>
            {children}
        </p>
    )
}

export type SpacerProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
export const Spacer: React.FunctionComponent<SpacerProps> = props => {
    const { className, ...rest } = props
    return <div className={cn('flex-grow', className)} {...rest} />
}

export type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export const ButtonBase: React.FunctionComponent<ButtonProps> = props => {
    const { className, children, ...rest } = props
    return (
        <button
            className={cn(
                'flex items-center justify-center',
                'h-10 rounded-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'disabled:pointer-events-none',
                '[&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0',
                className,
            )}
            {...rest}
        >
            {children}
        </button>
    )
}

export const IconButton: React.FunctionComponent<ButtonProps> = props => {
    const { className, children, ...rest } = props
    return (
        <ButtonBase className={cn('size-10', className)} {...rest}>
            {children}
        </ButtonBase>
    )
}

export const PrimaryIconButton: React.FunctionComponent<ButtonProps> = props => {
    const { className, children, ...rest } = props
    return (
        <IconButton className={cn('bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90', className)} {...rest}>
            {children}
        </IconButton>
    )
}

export type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const UnstyledInput: React.FunctionComponent<InputProps> = props => {
    const { className, ...rest } = props
    return (
        <input
            className={cn(
                'bg-transparent text-base font-medium sm:text-lg',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none',
                className,
            )}
            {...rest}
        />
    )
}
