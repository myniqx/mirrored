import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  cssVarsPrefix: 'mc',
  theme: {
    tokens: {
      fonts: {
        body: { value: 'var(--font-body)' },
        heading: { value: 'var(--font-header)' },
        arabic: { value: 'var(--font-arabic)' },
        quran: { value: 'var(--font-quran)' },
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
