import type { Metadata } from 'next'
import localFont from 'next/font/local'
import {
  Prosto_One,
  Roboto_Serif,
  Amiri_Quran,
  Scheherazade_New,
} from 'next/font/google'

import { ColorModeProvider } from '@chakra/color-mode'
import { Provider } from '@chakra/provider'

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
    <html lang="en">
      <body
        className={`${arabicFont.variable} ${headerFont.variable} ${bodyFont.variable} ${quranFont.variable}`}
      >
        <Provider>
          <ColorModeProvider>{children}</ColorModeProvider>
        </Provider>
      </body>
    </html>
  )
}
