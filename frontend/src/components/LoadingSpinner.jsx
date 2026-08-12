import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingSpinner({ message = "Loading…", fullScreen = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        ...(fullScreen ? { minHeight: "100vh", background: "#F8FAFC" } : { py: 8 }),
      }}
    >
      <CircularProgress size={32} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary">{message}</Typography>
      )}
    </Box>
  );
}
