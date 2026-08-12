import { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar,
  Menu, MenuItem, Divider, useScrollTrigger, Slide, Badge,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RecommendIcon from "@mui/icons-material/Recommend";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
  { label: "Recommendations", path: "/recommendations", icon: <RecommendIcon fontSize="small" /> },
  { label: "Profile", path: "/profile", icon: <PersonIcon fontSize="small" /> },
];

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <HideOnScroll>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ maxWidth: 1400, mx: "auto", width: "100%", px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer", flexGrow: { xs: 1, md: 0 } }}
            onClick={() => navigate("/dashboard")}
          >
            <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              HackAI
            </Typography>
          </Box>

          {/* Nav Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: 4, flexGrow: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? "primary.main" : "text.secondary",
                  backgroundColor:
                    location.pathname === item.path ? "rgba(108,99,255,0.12)" : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(108,99,255,0.1)",
                    color: "primary.light",
                  },
                  borderRadius: 2,
                  px: 2,
                  transition: "all 0.2s",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* User Avatar */}
          <Box>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(108,99,255,0.4)",
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  border: "1px solid rgba(108,99,255,0.2)",
                },
              }}
            >
              <Box px={2} py={1.5}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
              {NAV_ITEMS.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => { setAnchorEl(null); navigate(item.path); }}
                  sx={{ gap: 1.5, "& svg": { color: "primary.main" } }}
                >
                  {item.icon}
                  {item.label}
                </MenuItem>
              ))}
              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
              <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: "#FF4D6D" }}>
                <LogoutIcon fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
