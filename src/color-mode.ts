import { ColorMode } from '@chakra-ui/react'

type Mode = ColorMode | 'system' | undefined

// Code from https://github.com/chakra-ui/chakra-ui/blob/75edcf41e7ff4acc2569f2169949063c164d8f6e/packages/color-mode/src/color-mode-script.tsx
// I couldn't get the expected behavior with the `<ColorModeScript>`
export function initializeColorMode(initialValue: Mode) {
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const systemPreference = mql.matches ? 'dark' : 'light'

  let persistedPreference: Mode

  try {
    persistedPreference = localStorage.getItem('chakra-ui-color-mode') as Mode
  } catch (error) {
    console.log(
      'Chakra UI: localStorage is not available. Color mode persistence might not work as expected'
    )
  }

  const isInStorage = typeof persistedPreference === 'string'

  let colorMode: Mode

  if (isInStorage) {
    colorMode = persistedPreference
  } else {
    colorMode = initialValue === 'system' ? systemPreference : initialValue
  }

  if (colorMode) {
    const root = document.documentElement
    root.style.setProperty('--chakra-ui-color-mode', colorMode)
  }
}
