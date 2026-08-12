import { createTheme } from "@mui/material/styles";

// ─── Design Tokens ─────────────────────────────────────────────────
// New palette: Teal primary + Golden accent (inspired by reference screenshot)
const PRIMARY   = "#1AA99A"; // teal
const PRIMARY_L = "#25C4B3"; // teal light
const PRIMARY_D = "#12857A"; // teal dark
const ACCENT    = "#F5A623"; // golden yellow
const ACCENT_D  = "#D4891A"; // golden dark
const BG        = "#F7FAFA"; // very light teal-tinted bg
const SURFACE   = "#FFFFFF";
const BORDER    = "#E2EDED"; // teal-tinted border
const TEXT_PRI  = "#1A2E2C"; // dark teal-green
const TEXT_SEC  = "#5F7A76"; // muted teal-grey

const theme = createTheme({
  palette: {
    mode: "light",
    primary:    { main: PRIMARY, light: PRIMARY_L, dark: PRIMARY_D, contrastText: "#fff" },
    secondary:  { main: ACCENT, light: "#FAC05A", dark: ACCENT_D, contrastText: "#fff" },
    background: { default: BG, paper: SURFACE },
    error:      { main: "#DC2626" },
    warning:    { main: ACCENT },
    success:    { main: "#059669" },
    info:       { main: PRIMARY },
    text:       { primary: TEXT_PRI, secondary: TEXT_SEC, disabled: "#94A3B8" },
    divider:    BORDER,
    action: {
      hover:    "rgba(26,169,154,0.06)",
      selected: "rgba(26,169,154,0.10)",
    },
  },

  typography: {
    fontFamily: '"Poppins", "Inter", "Helvetica Neue", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "2rem",    lineHeight: 1.2, letterSpacing: "-0.025em" },
    h2: { fontWeight: 700, fontSize: "1.5rem",  lineHeight: 1.3, letterSpacing: "-0.02em" },
    h3: { fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.4, letterSpacing: "-0.01em" },
    h4: { fontWeight: 600, fontSize: "1.125rem", lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: "1rem",    lineHeight: 1.5 },
    h6: { fontWeight: 600, fontSize: "0.875rem", lineHeight: 1.5 },
    body1: { fontSize: "0.9375rem", lineHeight: 1.65 },
    body2: { fontSize: "0.875rem",  lineHeight: 1.6 },
    caption: { fontSize: "0.75rem", lineHeight: 1.5, color: TEXT_SEC },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: "0" },
    subtitle1: { fontWeight: 600, fontSize: "0.9375rem" },
    subtitle2: { fontWeight: 600, fontSize: "0.875rem" },
  },

  shape: { borderRadius: 10 },

  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.08)",
    "0 1px 3px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.06)",
    "0 2px 6px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06)",
    "0 4px 12px rgba(26,169,154,0.10), 0 8px 24px rgba(0,0,0,0.05)",
    ...Array(20).fill("0 4px 16px rgba(0,0,0,0.09)"),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": { boxSizing: "border-box" },
        html: { height: "100%" },
        body: {
          background: BG,
          color: TEXT_PRI,
          fontFamily: '"Poppins", "Inter", "Helvetica Neue", "Arial", sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          minHeight: "100%",
          scrollbarWidth: "thin",
          scrollbarColor: `${BORDER} transparent`,
        },
        "#root": { minHeight: "100vh" },
        "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus": {
          WebkitBoxShadow: `0 0 0 60px #ffffff inset`,
          WebkitTextFillColor: TEXT_PRI,
          caretColor: TEXT_PRI,
        },
        "::-webkit-scrollbar": { width: "6px", height: "6px" },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": { background: BORDER, borderRadius: "4px" },
        "::selection": { background: "rgba(26,169,154,0.15)", color: TEXT_PRI },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "8px 18px",
          transition: "all 0.18s ease",
          "&:focus-visible": { outline: `2px solid ${PRIMARY}`, outlineOffset: 2 },
        },
        containedPrimary: {
          background: PRIMARY,
          "&:hover": { background: PRIMARY_D, transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(26,169,154,0.35)" },
          "&:disabled": { background: "#CBD5E1", color: "#94A3B8" },
        },
        containedSecondary: {
          background: ACCENT,
          color: "#fff",
          "&:hover": { background: ACCENT_D, transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(245,166,35,0.35)" },
        },
        outlinedPrimary: {
          borderColor: PRIMARY,
          color: PRIMARY,
          "&:hover": { borderColor: PRIMARY_D, background: "rgba(26,169,154,0.06)" },
        },
        sizeLarge: { padding: "11px 28px", fontSize: "0.9375rem" },
        sizeSmall: { padding: "5px 12px", fontSize: "0.8125rem" },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
          backgroundImage: "none",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(26,169,154,0.12)",
            borderColor: "#A7D9D5",
            transform: "translateY(-2px)",
          },
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: "none", background: SURFACE, border: `1px solid ${BORDER}` },
        rounded: { borderRadius: 12 },
      },
    },

    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            background: SURFACE,
            fontSize: "0.9rem",
            "& fieldset": { borderColor: BORDER },
            "&:hover fieldset": { borderColor: "#99C4C0" },
            "&.Mui-focused fieldset": { borderColor: PRIMARY, borderWidth: "1.5px" },
            "& input:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 60px ${SURFACE} inset`,
              WebkitTextFillColor: TEXT_PRI,
            },
          },
          "& .MuiInputLabel-root": { fontSize: "0.875rem", color: TEXT_SEC },
          "& .MuiInputLabel-root.Mui-focused": { color: PRIMARY },
          "& .MuiFormHelperText-root": { marginLeft: 0, fontSize: "0.775rem" },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: "0.8rem",
          height: 32,
          margin: "2px",
        },
        sizeSmall: { height: 24, fontSize: "0.75rem" },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6, backgroundColor: "#D0EDEA" },
        bar: { background: PRIMARY, borderRadius: 4 },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { background: SURFACE, borderBottom: `1px solid ${BORDER}`, color: TEXT_PRI },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: { background: SURFACE, borderRight: `1px solid ${BORDER}` },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: "1px 8px",
          padding: "8px 12px",
          "&:hover": { background: "rgba(26,169,154,0.07)" },
          "&.Mui-selected": {
            background: "rgba(26,169,154,0.12)",
            "&:hover": { background: "rgba(26,169,154,0.16)" },
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: "0.875rem" },
      },
    },

    MuiSkeleton: {
      styleOverrides: { root: { borderRadius: 8, backgroundColor: "#EEF5F4" } },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: TEXT_PRI, color: "#fff",
          fontSize: "0.775rem", fontWeight: 500,
          borderRadius: 8, padding: "5px 10px",
        },
        arrow: { color: TEXT_PRI },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: BORDER } },
    },

    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500, fontSize: "0.875rem", minHeight: 40 },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: { background: PRIMARY, height: 3, borderRadius: 2 },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&:focus-visible": { outline: `2px solid ${PRIMARY}`, outlineOffset: 2 },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        outlined: { borderRadius: 10, fontSize: "0.875rem" },
      },
    },

    MuiFormControl: {
      defaultProps: { size: "small" },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_L} 100%)`,
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.875rem",
        },
      },
    },
  },
});

export default theme;
