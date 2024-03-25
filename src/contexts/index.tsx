import React, {
    PropsWithChildren,
    createContext,
    useEffect,
    useState,
} from "react";
import {ThemeProvider, createTheme} from "@mui/material/styles";

type ColorModeContextType = {
    mode: string;
    setMode: () => void;
    open: string;
    setOpen: () => void;
    setCollapsed: () => void,
    collapsed: boolean
};

declare module '@mui/material/styles' {
    interface Palette {
        modern: {
            [key: string]: {
                main: string,
                second: string
            }
        },
        salmon: Palette['primary'];
    }

    interface PaletteOptions {
        modern: {
            [key: string]: {
                main: string,
                second: string
            }
        },
        salmon?: PaletteOptions['primary'];
    }
}


export const ColorModeContext = createContext<ColorModeContextType>(
    {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
                                                                          children,
                                                                      }) => {
    const siderCollapsedStorage = JSON.parse(localStorage.getItem('collapsed') as string);
    const siderOpenModeFromLocalStorage = localStorage.getItem('openSider');
    const colorModeFromLocalStorage = localStorage.getItem("colorMode");
    const isSystemPreferenceDark = window?.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const systemPreference = isSystemPreferenceDark ? "dark" : "light";

    const [collapsed, setCollapsed] = useState(siderCollapsedStorage || false);
    const [open, setOpen] = useState<"open" | "closed" | string>(siderOpenModeFromLocalStorage || 'closed');
    const [mode, setMode] = useState(
        colorModeFromLocalStorage || systemPreference
    );


    useEffect(() => {
        window.localStorage.setItem("colorMode", mode);
    }, [mode]);
    useEffect(() => {
        window.localStorage.setItem('openSider', open)
    }, [open]);
    useEffect(() => {
        window.localStorage.setItem('collapsed', JSON.stringify(collapsed))
    }, [collapsed])
    const setOpenedMode = () => {
        if (open === 'open') {
            setOpen('closed')
        } else {
            setOpen('open')
        }
    }
    const setCollapsedMode = () => {
        setCollapsed(!collapsed)
    }
    const setColorMode = () => {
        if (mode === "light") {
            setMode("dark");
        } else {
            setMode("light");
        }
    };
    let customLightTheme = createTheme({
        palette: {
            mode: 'light',
            common: {
                white: '#2A132E',
                black: '#fff'
            },
            primary: {
                main: "#fff",
                contrastText: "#0F2C25",
            },
            secondary: {
                main: "#2A132E",
                contrastText: "#fff",
            },
            background: {
                default: "#e6e4e4",
                paper: "#f5f1ee",
            },
            success: {
                main: "#67be23",
                contrastText: "#fff",
            },
            error: {
                main: "#fa541c",
                contrastText: "#fff",
            },
            warning: {
                main: "#fa8c16",
                contrastText: "#fff",
            },
            info: {
                main: "#2874CB",
                contrastText: "#fff",
            },
            divider: "rgba(0,0,0,0)",
            text: {
                primary: "#626262",
                secondary: "#9f9f9f",
                disabled: "#c1c1c1",
            },
            modern: {
                modern_1: {
                    main: '#f5f5fa',
                    second: '#f9f4f4'
                },
                modern_2: {
                    main: '#e3e8ec',
                    second: '#d1efed'
                },
                modern_3: {
                    main: '#e3e8ec',
                    second: '#c2c9d3'
                },
                modern_4: {
                    main: '#f5f5fa',
                    second: '#c2c9d3'
                },
            },
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    colorDefault: {
                        backgroundColor: "#fff",
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#fff'
                        // backgroundImage:
                        //     "linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.01))",
                    },
                },
            },
            // MuiSelect: {
            //     styleOverrides: {
            //         select: {
            //             // backgroundColor: 'rgba(235, 235, 235, 1.08)'
            //         },
            //     },
            // },
            MuiButton:{
                defaultProps: {
                    color: 'secondary',
                },
            },
            MuiSwitch: {
                defaultProps: {
                    color: 'success',
                }
            },
            MuiTypography: {
                styleOverrides: {
                    h5: {
                        fontWeight: 800,
                        lineHeight: "2rem",
                    },
                },
            },
            MuiCheckbox: {
                defaultProps: {
                    color: 'info'
                }
            }
        }
    });
    let customDarkTheme = createTheme({
        palette: {
            mode: 'dark',
            common: {
                white: '#fff',
                black: '#14171c'
            },
            primary: {
                main: "#244d61",
                contrastText: "#fff",
            },
            secondary: {
                main: "#fcfcfc",
                contrastText: "#fff",
            },
            background: {
                default: "#050217",
                paper: "#333450",
            },
            success: {
                main: "#67be23",
                contrastText: "#fff",
            },
            error: {
                main: "#ee2a1e",
                contrastText: "#fff",
            },
            warning: {
                main: "#fa8c16",
                contrastText: "#fff",
            },
            info: {
                main: "#2874CB",
                contrastText: "#fff",
            },
            divider: "rgba(173,215,211,0)",
            text: {
                primary: "#fff",
                secondary: "rgba(255,255,255,0.7)",
                disabled: "#d1d1d1",
            },
            modern: {
                modern_1: {
                    main: '#0b0a0a',
                    second: '#17171f'
                },
                modern_2: {
                    main: '#050217',
                    second: '#2f2d3d'
                },
                modern_3: {
                    main: '#050217',
                    second: '#14171c'
                },
                modern_4: {
                    main: '#050217',
                    second: '#14171c'
                },
            },
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#000'
                        // backgroundImage:
                        //     "linear-gradient(rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0.025))",
                    },
                },
            },
            // MuiSelect: {
            //     styleOverrides: {
            //         select: {
            //             // backgroundColor: 'rgb(134,131,131)'
            //         }
            //     }
            // },
            MuiSwitch: {
                defaultProps: {
                    color: 'success',
                }
            },
            MuiAppBar: {
                defaultProps: {
                    color: "default",
                },
            },
            MuiButton:{
                defaultProps: {
                    color: 'secondary'
                }
            },
            MuiTypography: {
                styleOverrides: {
                    h5: {
                        fontWeight: 800,
                        lineHeight: "2rem",
                    },
                },
            },
            MuiCheckbox: {
                defaultProps: {
                    color: 'info'
                }
            }
        },
    });

    return (
        <ColorModeContext.Provider
            value={{
                setMode: setColorMode,
                mode,
                open,
                setOpen: setOpenedMode,
                collapsed,
                setCollapsed: setCollapsedMode
            }}
        >
            <ThemeProvider theme={mode === "light" ? customLightTheme : customDarkTheme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
