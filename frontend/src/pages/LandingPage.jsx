import { Box, Typography, Button, Chip } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import EastIcon from "@mui/icons-material/East";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  { icon: "🤖", title: "AI-Powered Matching", desc: "Our AI analyzes your skills and interests to find the most relevant projects." },
  { icon: "📊", title: "Skill Gap Analysis", desc: "Understand exactly what skills you have and what you need to learn." },
  { icon: "🗺️", title: "Learning Roadmap", desc: "Get a step-by-step roadmap to acquire missing skills for any project." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Nav */}
      <Box
        component="header"
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E2E8F0",
          background: "#fff",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 30, height: 30, borderRadius: "7px", background: "#4F46E5",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ color: "#fff", fontSize: 16 }} />
          </Box>
          <Typography fontWeight={700} fontSize="0.9rem" color="text.primary">HackMatch AI</Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button size="small" onClick={() => navigate("/login")}>Sign In</Button>
          <Button size="small" variant="contained" onClick={() => navigate("/register")}>Get Started</Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          maxWidth: 760,
          mx: "auto",
          px: { xs: 2, sm: 4 },
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          textAlign: "center",
        }}
      >
        <Chip
          label="AI-Powered Recommendations"
          size="small"
          sx={{ background: "#EEF2FF", color: "#4F46E5", fontWeight: 600, mb: 3 }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: 700,
            lineHeight: 1.15,
            mb: 2,
            letterSpacing: "-0.03em",
            color: "#0F172A",
          }}
        >
          Find hackathon projects that match your skills
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 560, mx: "auto", fontSize: "1.0625rem" }}
        >
          HackMatch AI analyzes your skills, interests, and experience to recommend the perfect hackathon project. Get a personalized learning roadmap to fill any skill gaps.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            endIcon={<EastIcon />}
            onClick={() => navigate("/register")}
            sx={{ px: 4 }}
          >
            Get Started Free
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </Box>
      </Box>

      {/* Features */}
      <Box
        sx={{
          maxWidth: 960,
          mx: "auto",
          px: { xs: 2, sm: 4 },
          pb: { xs: 6, md: 10 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {FEATURES.map((f) => (
          <Box
            key={f.title}
            sx={{
              p: 3,
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: "10px",
            }}
          >
            <Typography fontSize="1.75rem" mb={1.5}>{f.icon}</Typography>
            <Typography variant="h5" mb={1} fontWeight={600}>{f.title}</Typography>
            <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
