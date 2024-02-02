import { createTheme } from "@mui/material";

const theme = createTheme(
    {
        components: {
            MuiAlert: {
                styleOverrides: {
                    filledError: {
                        backgroundColor: 'var(--color-error)',
                        color: 'var(--color-on-error)'
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'var(--color-surface)'
                    }
                }
            },
            MuiContainer: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'var(--color-surface)'
                    }
                }
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: 'var(--color-surface)'
                    }
                }
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        color: 'var(--color-tertiary)'
                    }
                }
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        color: 'var(--color-on-surface)'
                    }
                }
            }
        },
        palette: {
            primary: {
                main: '#006B57'
            },
            secondary: {
                main: '#7D968D'
            }
        }
    }
);

export default theme;