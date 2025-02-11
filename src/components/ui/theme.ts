import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

import {
  Amiri_Quran,
  Poppins,
  Prosto_One,
  Roboto_Serif,
  Scheherazade_New,
} from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '500', '600', '900'],
  subsets: ['latin'],
  display: 'swap',
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

const customConfig = defineConfig({
  cssVarsPrefix: 'mc',
  theme: {
    tokens: {
      fonts: {
        body: { value: poppins.style.fontFamily },
        heading: { value: headerFont.style.fontFamily },
        quran: { value: quranFont.style.fontFamily },
        arabic: { value: arabicFont.style.fontFamily },
        poppins: { value: poppins.style.fontFamily },
      },
    },
  },
  globalCss: {
    '*::placeholder': {
      opacity: 1,
      color: 'fg.subtle',
    },
    '*::selection': {
      bg: 'green.200',
    },
    '::-webkit-scrollbar': {
      width: 15,
      height: 15,
    },
    '::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 2px grey',
      borderRadius: '6px',
      border: 'solid 2.5px transparent',
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: '6px',
      boxShadow: 'inset 0 0 10px #888',
      border: 'solid 2.5px transparent',
    },
    '::-webkit-scrollbar-thumb:hover': {
      boxShadow: 'inset 0 0 10px #555',
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
