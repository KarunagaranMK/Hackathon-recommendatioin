import { Box, Typography, Button } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({ title, description, action, actionLabel }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}
    >
      <Box
        sx={{
          width: 56, height: 56,
          borderRadius: "12px",
          background: "#F1F5F9",
          display: "flex", alignItems: "center", justifyContent: "center",
          mb: 2,
        }}
      >
        <InboxIcon sx={{ fontSize: 28, color: "#94A3B8" }} />
      </Box>
      <Typography variant="h4" fontWeight={600} color="text.primary" mb={0.75}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" maxWidth={400} mb={3} lineHeight={1.65}>
        {description}
      </Typography>
      {action && actionLabel && (
        <Button variant="contained" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
