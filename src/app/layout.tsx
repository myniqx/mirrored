import type { Metadata } from 'next'
import localFont from 'next/font/local'

import { ColorModeProvider } from '@chakra/color-mode'
import { Provider } from '@chakra/provider'
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <ColorModeProvider forcedTheme="dark">{children}</ColorModeProvider>
        </Provider>
      </body>
    </html>
  )
}
