import { StrictMode } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import theme from "./theme";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: '"Inter", sans-serif',
                background: "#fff",
                color: "#0F172A",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 500,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                padding: "10px 14px",
              },
              success: { iconTheme: { primary: "#059669", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
