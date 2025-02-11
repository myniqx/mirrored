import type { Metadata } from 'next'

import { ColorModeProvider } from '@chakra/color-mode'
import { Provider } from '@chakra/provider'

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
      // className={`${arabicFont.variable} ${headerFont.variable} ${bodyFont.variable} ${quranFont.variable}`}
      >
        <Provider>
          <ColorModeProvider>{children}</ColorModeProvider>
        </Provider>
      </body>
    </html>
  )
}
