import type React from 'react'
import type { Metadata } from 'next'
import {
  Amiri_Quran,
  Poppins,
  Prosto_One,
  Roboto_Serif,
  Scheherazade_New,
} from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const poppins = Poppins({
  weight: ['400', '500', '600', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--mc-fonts-poppins',
})

const arabicFont = Scheherazade_New({
  variable: '--mc-fonts-arabic',
  subsets: ['latin'],
  weight: '400',
})

const headerFont = Prosto_One({
  variable: '--mc-fonts-header',
  subsets: ['latin'],
  weight: '400',
})

const bodyFont = Roboto_Serif({
  variable: '--mc-fonts-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const quranFont = Amiri_Quran({
  variable: '--mc-fonts-quran',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Mirrored',
  description: 'Aynalı tefsir',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${arabicFont.variable} ${headerFont.variable} ${bodyFont.variable} ${quranFont.variable} ${poppins.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
