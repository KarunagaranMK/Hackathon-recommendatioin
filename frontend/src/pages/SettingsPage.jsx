import {
  Box, Typography, Paper, Button, Switch, Divider, Alert,
} from "@mui/material";
import AppShell  from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function SettingRow({ label, description, control }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      py={1.75}
    >
      <Box>
        <Typography variant="body2" fontWeight={500}>{label}</Typography>
        {description && (
          <Typography variant="caption" color="text.secondary">{description}</Typography>
        )}
      </Box>
      {control}
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Paper sx={{ mb: 2.5, overflow: "hidden" }}>
      <Box px={2.5} py={2} sx={{ borderBottom: "1px solid #F1F5F9" }}>
        <Typography variant="h5" fontWeight={600}>{title}</Typography>
      </Box>
      <Box px={2.5}>{children}</Box>
    </Paper>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AppShell>
      <Box mb={3}>
        <Typography variant="h1" mb={0.5}>Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account and preferences.
        </Typography>
      </Box>

      {/* Account */}
      <Section title="Account">
        <SettingRow
          label="Name"
          description={user?.name}
          control={
            <Button size="small" variant="outlined" onClick={() => navigate("/profile")}>
              Edit Profile
            </Button>
          }
        />
        <Divider />
        <SettingRow
          label="Email"
          description={user?.email}
          control={null}
        />
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <SettingRow
          label="Email Notifications"
          description="Receive project recommendation updates"
          control={<Switch defaultChecked size="small" />}
        />
        <Divider />
        <SettingRow
          label="Profile Visibility"
          description="Allow project administrators to view your profile"
          control={<Switch size="small" />}
        />
      </Section>

      {/* Danger zone */}
      <Paper sx={{ border: "1px solid #FECACA" }}>
        <Box px={2.5} py={2} sx={{ borderBottom: "1px solid #FECACA" }}>
          <Typography variant="h5" fontWeight={600} color="#DC2626">Danger Zone</Typography>
        </Box>
        <Box px={2.5}>
          <SettingRow
            label="Log out"
            description="End your current session"
            control={
              <Button size="small" variant="outlined" color="error" onClick={handleLogout}>
                Log Out
              </Button>
            }
          />
        </Box>
      </Paper>
    </AppShell>
  );
}
