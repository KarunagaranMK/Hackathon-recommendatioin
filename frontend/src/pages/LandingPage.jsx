import { Box, Typography, Button, Chip } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import EastIcon from "@mui/icons-material/East";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI-Powered Matching",
    desc: "Our AI analyzes your skills and interests to find the most relevant hackathon projects for you.",
    color: "#EBF8F6",
    border: "#A7D9D5",
  },
  {
    icon: "📊",
    title: "Skill Gap Analysis",
    desc: "Understand exactly what skills you have and what you need to learn to take on any project.",
    color: "#FEF9ED",
    border: "#F5D89A",
  },
  {
    icon: "🗺️",
    title: "Learning Roadmap",
    desc: "Get a step-by-step roadmap to acquire missing skills and grow as a developer.",
    color: "#EBF8F6",
    border: "#A7D9D5",
  },
];

const PERKS = [
  "Personalized project recommendations",
  "Skill gap identification",
  "Step-by-step learning paths",
  "Save and track your projects",
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ background: "linear-gradient(135deg, #EBF8F6 0%, #FEFDF5 60%, #FEF9ED 100%)", minHeight: "100vh", overflow: "hidden", position: "relative" }}>

      {/* Decorative blobs */}
      <Box sx={{ position: "absolute", top: -80, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", bottom: 100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,169,154,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── Navbar ── */}
      <Box
        component="header"
        sx={{
          px: { xs: 2, sm: 4, md: 8 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.75)",
          borderBottom: "1px solid rgba(26,169,154,0.15)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.25} sx={{ cursor: "pointer" }} onClick={() => {}}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: "10px",
              background: "linear-gradient(135deg, #1AA99A 0%, #25C4B3 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(26,169,154,0.35)",
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Typography
            fontWeight={700}
            fontSize="1rem"
            sx={{
              background: "linear-gradient(135deg, #12857A 0%, #1AA99A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.01em",
            }}
          >
            HackMatch AI
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4, alignItems: "center" }}>
          {["Home", "About us", "Features", "Pricing"].map((item) => (
            <Typography
              key={item}
              variant="body2"
              fontWeight={500}
              sx={{ color: "#5F7A76", cursor: "pointer", "&:hover": { color: "#1AA99A" }, transition: "color 0.2s" }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {/* CTA */}
        <Box display="flex" gap={1.5} alignItems="center">
          <Button
            size="small"
            onClick={() => navigate("/login")}
            sx={{ color: "#1AA99A", fontWeight: 600 }}
          >
            Sign In
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => navigate("/register")}
            sx={{
              borderRadius: "50px",
              px: 2.5,
              background: "#F5A623",
              color: "#fff",
              fontWeight: 700,
              "&:hover": { background: "#D4891A" },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* ── Hero Section ── */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 3, md: 8 },
          pt: { xs: 8, md: 10 },
          pb: { xs: 6, md: 8 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 6, md: 8 },
          alignItems: "center",
        }}
      >
        {/* Left: Text */}
        <Box>
          <Chip
            label="✨ AI-Powered Recommendations"
            size="small"
            sx={{
              background: "rgba(26,169,154,0.12)",
              color: "#1AA99A",
              fontWeight: 700,
              mb: 3,
              fontSize: "0.75rem",
              border: "1px solid rgba(26,169,154,0.25)",
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.2rem" },
              fontWeight: 800,
              lineHeight: 1.12,
              mb: 2.5,
              letterSpacing: "-0.04em",
              color: "#12342F",
            }}
          >
            Find Your{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #1AA99A 0%, #F5A623 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Perfect Project
            </Box>
            <br />
            for Every Hackathon
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 4, color: "#5F7A76", maxWidth: 480, lineHeight: 1.75 }}
          >
            HackMatch AI analyzes your skills, interests, and experience to recommend
            the perfect hackathon project. Get personalized learning roadmaps to fill skill gaps.
          </Typography>

          {/* Perk list */}
          <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1.25 }}>
            {PERKS.map((perk) => (
              <Box key={perk} display="flex" alignItems="center" gap={1.25}>
                <CheckCircleOutlineIcon sx={{ color: "#1AA99A", fontSize: 18 }} />
                <Typography variant="body2" fontWeight={500} color="#3A5A56">
                  {perk}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              endIcon={<EastIcon />}
              onClick={() => navigate("/register")}
              sx={{
                borderRadius: "50px",
                px: 4,
                background: "#F5A623",
                color: "#fff",
                fontWeight: 700,
                "&:hover": { background: "#D4891A", transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(245,166,35,0.4)" },
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: "50px",
                px: 4,
                borderColor: "#1AA99A",
                color: "#1AA99A",
                fontWeight: 600,
                "&:hover": { borderColor: "#12857A", background: "rgba(26,169,154,0.06)" },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* Right: Illustration */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Background shape */}
          <Box
            sx={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: "rgba(245,166,35,0.10)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 340,
              height: 340,
              borderRadius: "50%",
              background: "rgba(26,169,154,0.08)",
              top: "50%",
              left: "50%",
              transform: "translate(-40%, -45%)",
            }}
          />
          <Box
            component="img"
            src="/hero_illustration.png"
            alt="HackMatch AI hero illustration"
            sx={{
              width: "100%",
              maxWidth: 480,
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 20px 40px rgba(26,169,154,0.2))",
              animation: "float 4s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-12px)" },
              },
            }}
          />
        </Box>
      </Box>

      {/* ── Feature Cards ── */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 3, md: 8 },
          pb: { xs: 8, md: 12 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {FEATURES.map((f) => (
          <Box
            key={f.title}
            sx={{
              p: 3.5,
              background: f.color,
              border: `1.5px solid ${f.border}`,
              borderRadius: "16px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px rgba(26,169,154,0.15)",
              },
            }}
          >
            <Typography fontSize="2rem" mb={2}>{f.icon}</Typography>
            <Typography variant="h5" mb={1} fontWeight={700} color="#12342F">
              {f.title}
            </Typography>
            <Typography variant="body2" color="#5F7A76" lineHeight={1.7}>
              {f.desc}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Footer ── */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          borderTop: "1px solid rgba(26,169,154,0.15)",
          background: "rgba(255,255,255,0.6)",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © 2025 HackMatch AI · Built for Hackathon Champions
        </Typography>
      </Box>
    </Box>
  );
}
