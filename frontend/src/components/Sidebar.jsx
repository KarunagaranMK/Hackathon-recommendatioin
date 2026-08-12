import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Divider, Tooltip, useMediaQuery, useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import DashboardOutlinedIcon    from "@mui/icons-material/DashboardOutlined";
import PersonOutlinedIcon       from "@mui/icons-material/PersonOutlined";
import AutoAwesomeOutlinedIcon  from "@mui/icons-material/AutoAwesomeOutlined";
import BookmarkBorderIcon       from "@mui/icons-material/BookmarkBorder";
import SchoolOutlinedIcon       from "@mui/icons-material/SchoolOutlined";
import HistoryIcon              from "@mui/icons-material/History";
import SettingsOutlinedIcon     from "@mui/icons-material/SettingsOutlined";
import LogoutIcon               from "@mui/icons-material/Logout";
import AutoAwesomeRoundedIcon   from "@mui/icons-material/AutoAwesomeRounded";

export const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Dashboard",       path: "/dashboard",       icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: "My Profile",      path: "/profile",          icon: <PersonOutlinedIcon    fontSize="small" /> },
  { label: "Recommendations", path: "/recommendations",  icon: <AutoAwesomeOutlinedIcon fontSize="small" /> },
  { label: "Saved Projects",  path: "/saved",            icon: <BookmarkBorderIcon    fontSize="small" /> },
  { label: "Learning",        path: "/learning",         icon: <SchoolOutlinedIcon    fontSize="small" /> },
  { label: "History",         path: "/history",          icon: <HistoryIcon           fontSize="small" /> },
  { label: "Settings",        path: "/settings",         icon: <SettingsOutlinedIcon  fontSize="small" /> },
];

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const theme      = useTheme();
  const PRIMARY    = theme.palette.primary.main;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (onClose) onClose();
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Box
        sx={{ px: 2.5, height: 60, display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}
      >
        <Box
          sx={{
            width: 32, height: 32,
            borderRadius: "8px",
            background: PRIMARY,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ color: "#fff", fontSize: 18 }} />
        </Box>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.9375rem",
            color: "text.primary",
            letterSpacing: "-0.01em",
          }}
        >
          HackMatch AI
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", py: 1.5 }}>
        <List disablePadding>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItemButton
                key={item.path}
                selected={active}
                onClick={() => handleNav(item.path)}
                sx={{
                  borderRadius: "8px",
                  mx: 1,
                  mb: 0.25,
                  px: 1.5,
                  py: 0.875,
                  minHeight: 40,
                  "&.Mui-selected": {
                    background: "#EEF2FF",
                    "& .MuiListItemIcon-root": { color: PRIMARY },
                    "& .MuiListItemText-primary": { color: PRIMARY, fontWeight: 600 },
                  },
                  "&.Mui-selected:hover": { background: "#E0E7FF" },
                  "&:hover": { background: "#F8FAFC" },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 32,
                    color: active ? PRIMARY : "text.secondary",
                    transition: "color 0.15s",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? PRIMARY : "text.secondary",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* User section */}
      <Box sx={{ p: 1.5 }}>
        {/* User info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.25,
            borderRadius: "8px",
            mb: 0.5,
            cursor: "pointer",
            "&:hover": { background: "#F1F5F9" },
          }}
          onClick={() => handleNav("/profile")}
        >
          <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem", background: PRIMARY }}>
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.primary"
              noWrap
              sx={{ fontSize: "0.8125rem", lineHeight: 1.3 }}
            >
              {user?.name || "User"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ fontSize: "0.7rem", display: "block" }}
            >
              {user?.email || ""}
            </Typography>
          </Box>
        </Box>

        {/* Logout */}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "8px",
            px: 1.5,
            py: 0.875,
            color: "#DC2626",
            "&:hover": { background: "#FEF2F2" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Log out"
            primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500, color: "inherit" }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            border: "none",
            boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
          },
        }}
      >
        <SidebarContent onClose={onMobileClose} />
      </Drawer>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .sidebar-paper": {
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: SIDEBAR_WIDTH,
          borderRight: "1px solid #E2E8F0",
          background: "#fff",
          zIndex: 1200,
          overflowX: "hidden",
        },
      }}
    >
      <Box className="sidebar-paper">
        <SidebarContent />
      </Box>
    </Box>
  );
}
