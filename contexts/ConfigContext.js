'use client'

import * as React from 'react'

import { GlobalStyles } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { BaseTheme, Palettes, extendTheme } from '@/styles'

const ConfigContext = React.createContext({})

const STORAGE_KEY = 'pog-color-mode'

const COLOR_MODES = {
    light: 'light',
    dark: 'dark',
}

export function ConfigProvider({ children }) {
    const [colorMode, setColorMode] = React.useState(COLOR_MODES.dark)

    const theme = React.useMemo(() => {
        const nextTheme = createTheme({
            ...BaseTheme,
            palette: Palettes[colorMode],
        })

        extendTheme(nextTheme)
        return nextTheme
    }, [colorMode])

    const toggleColorMode = React.useCallback(() => {
        setColorMode((currentMode) => {
            const nextMode =
                currentMode === COLOR_MODES.dark
                    ? COLOR_MODES.light
                    : COLOR_MODES.dark

            localStorage.setItem(STORAGE_KEY, nextMode)
            return nextMode
        })
    }, [])

    React.useEffect(() => {
        const storedMode = localStorage.getItem(STORAGE_KEY)

        if (storedMode && Object.values(COLOR_MODES).includes(storedMode)) {
            setColorMode(storedMode)
        }
    }, [])

    return (
        <ConfigContext.Provider
            value={{
                colorMode,
                toggleColorMode,
                COLOR_MODES,
                theme,
            }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        body:
                            typeof theme.scroll === 'function'
                                ? theme.scroll({ theme })
                                : theme.scroll,
                    }}
                />
                {children}
            </ThemeProvider>
        </ConfigContext.Provider>
    )
}

export function useConfig() {
    return React.useContext(ConfigContext)
}