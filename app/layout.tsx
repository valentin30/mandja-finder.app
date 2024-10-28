import { MandjaFinder } from '@/app/components/mandja-finder'
import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const reklameScript = localFont({
    src: './fonts/ReklameScript.otf',
    variable: '--font-reklame-script',
    weight: '100 900',
})

const nunito = Nunito({
    variable: '--font-nunito',
    weight: ['200', '300', '400', '500', '600', '700', '800', '900', '1000'],
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Mandja Finder',
    applicationName: 'Mandja Finder',
    description: 'Mandja Finder is an app that helps you find recipes and ingredient discounts.',
    keywords: [
        'food',
        'drink',
        'recipes',
        'cooking',
        'baking',
        'eating',
        'dining',
        'cuisine',
        'restaurant',
        'kitchen',
        'meal',
        'dish',
        'menu',
        'taste',
        'flavor',
        'ingredient',
        'recipe',
        'cook',
        'bake',
        'eat',
        'dine',
        'cuisine',
        'restaurant',
        'kitchen',
        'meal',
        'dish',
        'menu',
        'taste',
        'flavor',
        'ingredient',
    ],
    robots: 'index, follow',
}

export const viewport: Viewport = {
    initialScale: 1,
    colorScheme: 'light dark',
    userScalable: true,
    width: 'device-width',
    height: 'device-height',
}

export default function App() {
    return (
        <html lang="bg" suppressHydrationWarning>
            <MandjaFinder className={`${reklameScript.variable} ${nunito.variable}`} />
        </html>
    )
}
