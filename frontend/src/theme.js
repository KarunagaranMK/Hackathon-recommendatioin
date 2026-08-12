import { createTheme } from "@mui/material/styles";

// ─── Design Tokens ───────────────────────────────────────────────
const PRIMARY   = "#4F46E5"; // indigo-600
const PRIMARY_L = "#6366F1"; // indigo-500
const PRIMARY_D = "#4338CA"; // indigo-700
const BG        = "#F8FAFC"; // slate-50
const SURFACE   = "#FFFFFF";
const BORDER    = "#E2E8F0"; // slate-200
const TEXT_PRI  = "#0F172A"; // slate-900
const TEXT_SEC  = "#64748B"; // slate-500

const theme = createTheme({
  palette: {
    mode: "light",
    primary:    { main: PRIMARY, light: PRIMARY_L, dark: PRIMARY_D, contrastText: "#fff" },
    secondary:  { main: "#0891B2", light: "#06B6D4", dark: "#0E7490", contrastText: "#fff" },
    background: { default: BG, paper: SURFACE },
    error:      { main: "#DC2626" },
    warning:    { main: "#D97706" },
    success:    { main: "#059669" },
    info:       { main: PRIMARY },
    text:       { primary: TEXT_PRI, secondary: TEXT_SEC, disabled: "#94A3B8" },
    divider:    BORDER,
    action: {
      hover:    "rgba(79,70,229,0.06)",
      selected: "rgba(79,70,229,0.10)",
    },
  },

  typography: {
    fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
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

  shape: { borderRadius: 8 },

  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.10)",
    "0 1px 3px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.08)",
    "0 2px 6px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.07)",
    "0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
    ...Array(20).fill("0 4px 16px rgba(0,0,0,0.10)"),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": { boxSizing: "border-box" },
        html: { height: "100%" },
        body: {
          background: BG,
          color: TEXT_PRI,
          fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          minHeight: "100%",
          scrollbarWidth: "thin",
          scrollbarColor: `${BORDER} transparent`,
        },
        "#root": { minHeight: "100vh" },
        // Fix browser autofill for light theme
        "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus": {
          WebkitBoxShadow: `0 0 0 60px #ffffff inset`,
          WebkitTextFillColor: TEXT_PRI,
          caretColor: TEXT_PRI,
        },
        "::-webkit-scrollbar": { width: "6px", height: "6px" },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": { background: BORDER, borderRadius: "4px" },
        "::selection": { background: "rgba(79,70,229,0.15)", color: TEXT_PRI },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "8px 18px",
          transition: "all 0.15s ease",
          "&:focus-visible": { outline: `2px solid ${PRIMARY}`, outlineOffset: 2 },
        },
        containedPrimary: {
          background: PRIMARY,
          "&:hover": { background: PRIMARY_D },
          "&:disabled": { background: "#CBD5E1", color: "#94A3B8" },
        },
        outlinedPrimary: {
          borderColor: "#C7D2FE",
          "&:hover": { borderColor: PRIMARY, background: "rgba(79,70,229,0.04)" },
        },
        sizeLarge: { padding: "10px 24px", fontSize: "0.9375rem" },
        sizeSmall: { padding: "5px 12px", fontSize: "0.8125rem" },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 10,
          transition: "box-shadow 0.15s ease, border-color 0.15s ease",
          backgroundImage: "none",
          "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)", borderColor: "#CBD5E1" },
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: "none", background: SURFACE, border: `1px solid ${BORDER}` },
        rounded: { borderRadius: 10 },
      },
    },

    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            background: SURFACE,
            fontSize: "0.9rem",
            "& fieldset": { borderColor: BORDER },
            "&:hover fieldset": { borderColor: "#94A3B8" },
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
        root: { borderRadius: 6, fontWeight: 500, fontSize: "0.8rem" },
        sizeSmall: { height: 24, fontSize: "0.75rem" },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6, backgroundColor: "#EEF2FF" },
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
          borderRadius: 8,
          margin: "1px 8px",
          padding: "8px 12px",
          "&:hover": { background: "#F1F5F9" },
          "&.Mui-selected": {
            background: "#EEF2FF",
            "&:hover": { background: "#E0E7FF" },
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, fontSize: "0.875rem" },
      },
    },

    MuiSkeleton: {
      styleOverrides: { root: { borderRadius: 6, backgroundColor: "#F1F5F9" } },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: TEXT_PRI, color: "#fff",
          fontSize: "0.775rem", fontWeight: 500,
          borderRadius: 6, padding: "5px 10px",
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
        indicator: { background: PRIMARY, height: 2, borderRadius: 1 },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:focus-visible": { outline: `2px solid ${PRIMARY}`, outlineOffset: 2 },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        outlined: { borderRadius: 8, fontSize: "0.875rem" },
      },
    },

    MuiFormControl: {
      defaultProps: { size: "small" },
    },

    MuiAvatar: {
      styleOverrides: {
        root: { background: PRIMARY, color: "#fff", fontWeight: 600, fontSize: "0.875rem" },
      },
    },
  },
});

export default theme;
