import { Box, Typography, Button } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          width: 48, height: 48,
          borderRadius: "12px",
          background: "#EEF2FF",
          display: "flex", alignItems: "center", justifyContent: "center",
          mb: 3,
        }}
      >
        <AutoAwesomeRoundedIcon sx={{ color: "#4F46E5", fontSize: 24 }} />
      </Box>
      <Typography
        sx={{ fontSize: { xs: "4rem", sm: "6rem" }, fontWeight: 800, lineHeight: 1, color: "#E2E8F0", mb: 1 }}
      >
        404
      </Typography>
      <Typography variant="h2" mb={1}>Page not found</Typography>
      <Typography variant="body2" color="text.secondary" mb={3} maxWidth={360}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </Button>
    </Box>
  );
}
