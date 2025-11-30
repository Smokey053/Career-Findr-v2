import { createTheme, alpha } from "@mui/material/styles";

// Professional LinkedIn-inspired color palette
const palette = {
  primary: {
    main: "#0A66C2", // LinkedIn Blue
    light: "#378FE9",
    dark: "#004182",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#057642", // LinkedIn Green (for success/growth)
    light: "#44712E",
    dark: "#034832",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#F4F2EE", // LinkedIn's warm gray background
    paper: "#FFFFFF",
    card: "#FFFFFF",
    elevated: "#FFFFFF",
  },
  text: {
    primary: "rgba(0, 0, 0, 0.9)",
    secondary: "rgba(0, 0, 0, 0.6)",
    disabled: "rgba(0, 0, 0, 0.38)",
    hint: "rgba(0, 0, 0, 0.38)",
  },
  success: {
    main: "#057642",
    light: "#7FC15E",
    dark: "#034832",
  },
  error: {
    main: "#CC1016",
    light: "#E75B5B",
    dark: "#8C0A0E",
  },
  warning: {
    main: "#B24020",
    light: "#E78B5A",
    dark: "#7A2B15",
  },
  info: {
    main: "#0A66C2",
    light: "#378FE9",
    dark: "#004182",
  },
  grey: {
    50: "#F9FAFB",
    100: "#F4F2EE",
    200: "#E9E5DF",
    300: "#DCD9D4",
    400: "#B4B2AE",
    500: "#86888A",
    600: "#666666",
    700: "#474747",
    800: "#313131",
    900: "#1D1D1D",
  },
  divider: "rgba(0, 0, 0, 0.08)",
};

// Professional shadow system - more subtle
const shadows = [
  "none",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)",
  "0 4px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)",
  "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)",
  "0 8px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)",
  "0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
  "0 12px 28px rgba(0, 0, 0, 0.12)",
  "0 16px 32px rgba(0, 0, 0, 0.12)",
  "0 20px 40px rgba(0, 0, 0, 0.12)",
  "0 24px 48px rgba(0, 0, 0, 0.14)",
  "0 28px 56px rgba(0, 0, 0, 0.14)",
  "0 32px 64px rgba(0, 0, 0, 0.16)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
  "0 0 0 1px rgba(0, 0, 0, 0.08)",
];

const theme = createTheme({
  palette,
  shadows,
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "-0.01em",
      color: palette.text.primary,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
      color: palette.text.primary,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.35,
      color: palette.text.primary,
    },
    h4: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: palette.text.primary,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
      color: palette.text.primary,
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.5,
      color: palette.text.primary,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: palette.text.primary,
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
      color: palette.text.secondary,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.875rem",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      color: palette.text.secondary,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.05em",
      lineHeight: 1.5,
      textTransform: "uppercase",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: "0.8125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
  },
  spacing: 8,
  transitions: {
    duration: {
      shortest: 120,
      shorter: 160,
      short: 200,
      standard: 240,
      complex: 300,
      enteringScreen: 200,
      leavingScreen: 160,
    },
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          backgroundColor: palette.background.default,
          color: palette.text.primary,
        },
        "::selection": {
          backgroundColor: alpha(palette.primary.main, 0.15),
          color: palette.primary.dark,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          padding: "8px 16px",
          fontSize: "0.875rem",
          fontWeight: 600,
          boxShadow: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        },
        contained: {
          backgroundColor: palette.primary.main,
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: palette.primary.dark,
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: palette.primary.main,
          "&:hover": {
            backgroundColor: "#004182",
          },
        },
        containedSecondary: {
          backgroundColor: palette.secondary.main,
          "&:hover": {
            backgroundColor: palette.secondary.dark,
          },
        },
        outlined: {
          borderWidth: "1px",
          borderColor: palette.primary.main,
          color: palette.primary.main,
          backgroundColor: "transparent",
          "&:hover": {
            borderWidth: "1px",
            backgroundColor: alpha(palette.primary.main, 0.08),
            borderColor: palette.primary.dark,
          },
        },
        outlinedPrimary: {
          borderColor: palette.primary.main,
          "&:hover": {
            backgroundColor: alpha(palette.primary.main, 0.08),
            borderColor: palette.primary.dark,
          },
        },
        text: {
          color: palette.primary.main,
          "&:hover": {
            backgroundColor: alpha(palette.primary.main, 0.08),
          },
        },
        sizeLarge: {
          padding: "12px 24px",
          fontSize: "1rem",
        },
        sizeSmall: {
          padding: "4px 12px",
          fontSize: "0.8125rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)",
          border: "none",
          transition: "box-shadow 0.15s ease",
          "&:hover": {
            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px",
          "&:last-child": {
            paddingBottom: "16px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundImage: "none",
        },
        elevation0: {
          boxShadow: "none",
        },
        elevation1: {
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.08)",
        },
        elevation2: {
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)",
        },
        elevation3: {
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: palette.background.paper,
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: palette.grey[300],
              borderWidth: "1px",
            },
            "&:hover": {
              "& fieldset": {
                borderColor: palette.grey[400],
              },
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 2px ${alpha(palette.primary.main, 0.2)}`,
              "& fieldset": {
                borderColor: palette.primary.main,
                borderWidth: "1px",
              },
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 400,
            color: palette.text.secondary,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          fontWeight: 600,
          fontSize: "0.75rem",
          height: "24px",
        },
        filled: {
          backgroundColor: alpha(palette.primary.main, 0.1),
          color: palette.primary.dark,
          "&:hover": {
            backgroundColor: alpha(palette.primary.main, 0.15),
          },
        },
        outlined: {
          borderColor: palette.grey[300],
          "&:hover": {
            backgroundColor: palette.grey[100],
          },
        },
        colorPrimary: {
          backgroundColor: alpha(palette.primary.main, 0.1),
          color: palette.primary.dark,
        },
        colorSuccess: {
          backgroundColor: alpha(palette.success.main, 0.1),
          color: palette.success.dark,
        },
        colorError: {
          backgroundColor: alpha(palette.error.main, 0.1),
          color: palette.error.dark,
        },
        colorWarning: {
          backgroundColor: alpha(palette.warning.main, 0.1),
          color: palette.warning.dark,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          border: "none",
          fontWeight: 400,
          fontSize: "0.875rem",
        },
        standardSuccess: {
          backgroundColor: alpha(palette.success.main, 0.1),
          color: palette.success.dark,
          "& .MuiAlert-icon": {
            color: palette.success.main,
          },
        },
        standardError: {
          backgroundColor: alpha(palette.error.main, 0.1),
          color: palette.error.dark,
          "& .MuiAlert-icon": {
            color: palette.error.main,
          },
        },
        standardWarning: {
          backgroundColor: alpha(palette.warning.main, 0.1),
          color: palette.warning.dark,
          "& .MuiAlert-icon": {
            color: palette.warning.main,
          },
        },
        standardInfo: {
          backgroundColor: alpha(palette.primary.main, 0.1),
          color: palette.primary.dark,
          "& .MuiAlert-icon": {
            color: palette.primary.main,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "50%",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: alpha(palette.text.primary, 0.08),
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: "4px",
          padding: "8px 12px",
          fontSize: "0.75rem",
          fontWeight: 500,
          backgroundColor: palette.grey[900],
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        },
        arrow: {
          color: palette.grey[900],
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08)",
          marginTop: "4px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "0",
          padding: "8px 16px",
          fontSize: "0.875rem",
          transition: "background 0.1s ease",
          "&:hover": {
            backgroundColor: alpha(palette.text.primary, 0.08),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(palette.primary.main, 0.08),
            "&:hover": {
              backgroundColor: alpha(palette.primary.main, 0.12),
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: palette.divider,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          border: "none",
        },
        colorDefault: {
          backgroundColor: palette.primary.main,
          color: "#FFFFFF",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: "0",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.08)",
          backgroundColor: palette.background.paper,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: "0",
          minHeight: "52px",
          fontWeight: 600,
          fontSize: "0.875rem",
          transition: "all 0.15s ease",
          color: palette.text.secondary,
          "&:hover": {
            color: palette.text.primary,
            backgroundColor: alpha(palette.text.primary, 0.04),
          },
          "&.Mui-selected": {
            color: palette.primary.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: "2px",
          borderRadius: "2px 2px 0 0",
          backgroundColor: palette.primary.main,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          height: "4px",
          backgroundColor: palette.grey[200],
        },
        bar: {
          borderRadius: "4px",
          backgroundColor: palette.primary.main,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          color: palette.primary.main,
          textDecoration: "none",
          transition: "all 0.15s ease",
          "&:hover": {
            textDecoration: "underline",
            color: palette.primary.dark,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: "0",
          transition: "background 0.1s ease",
          "&:hover": {
            backgroundColor: alpha(palette.text.primary, 0.04),
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: alpha(palette.text.primary, 0.08),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(palette.primary.main, 0.08),
            "&:hover": {
              backgroundColor: alpha(palette.primary.main, 0.12),
            },
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: "0.625rem",
          fontWeight: 600,
          minWidth: "18px",
          height: "18px",
          padding: "0 4px",
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: palette.grey[200],
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "8px",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.125rem",
          fontWeight: 600,
          padding: "16px 24px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 24px 16px",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiSnackbarContent-root": {
            borderRadius: "8px",
            backgroundColor: palette.grey[900],
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: palette.divider,
          padding: "12px 16px",
          fontSize: "0.875rem",
        },
        head: {
          fontWeight: 600,
          backgroundColor: palette.grey[100],
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha(palette.text.primary, 0.02),
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          border: "1px solid",
          borderColor: palette.grey[300],
          transition: "all 0.15s ease",
          "&.Mui-selected": {
            backgroundColor: alpha(palette.primary.main, 0.1),
            borderColor: palette.primary.main,
            color: palette.primary.main,
            "&:hover": {
              backgroundColor: alpha(palette.primary.main, 0.15),
            },
          },
          "&:hover": {
            backgroundColor: alpha(palette.text.primary, 0.04),
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          "& .MuiStepIcon-root": {
            color: palette.grey[400],
            "&.Mui-active": {
              color: palette.primary.main,
            },
            "&.Mui-completed": {
              color: palette.success.main,
            },
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.08)",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: "48px",
          "&.Mui-expanded": {
            minHeight: "48px",
          },
        },
        content: {
          "&.Mui-expanded": {
            margin: "12px 0",
          },
        },
      },
    },
  },
});

export default theme;
