import { useState } from "react";
import {
  Box, AppBar, Toolbar, Typography, IconButton,
  Avatar, Menu, MenuItem, Divider, useMediaQuery, useTheme, Tooltip,
} from "@mui/material";
import MenuRoundedIcon      from "@mui/icons-material/MenuRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon           from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";

const PAGE_TITLES = {
  "/dashboard":      "Dashboard",
  "/profile":        "My Profile",
  "/recommendations":"Recommendations",
  "/saved":          "Saved Projects",
  "/learning":       "Learning Progress",
  "/history":        "History",
  "/settings":       "Settings",
};

function getPageTitle(pathname) {
  if (pathname.startsWith("/project/")) return "Project Details";
  if (pathname.startsWith("/learning/")) return "Learning Progress";
  return PAGE_TITLES[pathname] || "HackMatch AI";
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();
  const theme       = useTheme();
  const isMobile    = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen]   = useState(false);
  const [anchorEl, setAnchorEl]       = useState(null);
  const menuOpen = Boolean(anchorEl);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          ml: isMobile ? 0 : 0,
        }}
      >
        {/* Top Bar */}
        <AppBar
          position="sticky"
          sx={{
            top: 0,
            zIndex: 1100,
            width: "100%",
          }}
        >
          <Toolbar
            sx={{
              px: { xs: 2, sm: 3 },
              minHeight: "60px !important",
              gap: 2,
            }}
          >
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <MenuRoundedIcon />
              </IconButton>
            )}

            {/* Page title */}
            <Typography
              variant="h6"
              sx={{ flex: 1, fontWeight: 600, fontSize: "0.9375rem", color: "text.primary" }}
            >
              {pageTitle}
            </Typography>

            {/* User avatar + menu */}
            <Tooltip title={user?.name || "Account"} arrow>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="small"
                aria-label="Open account menu"
                aria-controls={menuOpen ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem" }}>
                  {initials}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  "& .MuiMenuItem-root": {
                    fontSize: "0.875rem",
                    px: 2,
                    py: 1,
                    gap: 1.5,
                    borderRadius: "6px",
                    mx: 0.5,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.25 }}>
                <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                  {user?.email}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={() => { setAnchorEl(null); navigate("/settings"); }}>
                <SettingsOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                Settings
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ color: "#DC2626 !important" }}>
                <LogoutIcon fontSize="small" />
                Log out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2.5, sm: 3 },
            maxWidth: 1280,
            width: "100%",
          }}
          className="page-enter"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
