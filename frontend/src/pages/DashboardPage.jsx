import { useEffect, useState } from "react";
import {
  Box, Grid, Typography, Button, Paper, LinearProgress,
  Skeleton, Chip, Divider,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import PersonOutlinedIcon     from "@mui/icons-material/PersonOutlined";
import BookmarkBorderIcon     from "@mui/icons-material/BookmarkBorder";
import SchoolOutlinedIcon     from "@mui/icons-material/SchoolOutlined";
import EastIcon               from "@mui/icons-material/East";
import { useNavigate }  from "react-router-dom";
import { useAuth }      from "../context/AuthContext";
import AppShell         from "../components/AppShell";
import { profileService } from "../services/profile.service";
import { favoriteService }  from "../services/project.service";
import { recommendationService } from "../services/recommendation.service";

function StatCard({ icon, label, value, sub, action, onClick, loading }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        border: "1.5px solid #E2EDED",
        borderRadius: "14px",
        transition: "all 0.2s ease",
        "&:hover": onClick ? {
          boxShadow: "0 8px 24px rgba(26,169,154,0.12)",
          borderColor: "#A7D9D5",
          transform: "translateY(-3px)",
        } : {},
      }}
      onClick={onClick}
    >
      {loading ? (
        <>
          <Skeleton width={36} height={36} variant="rectangular" sx={{ borderRadius: 2 }} />
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={28} />
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: "10px",
              background: "linear-gradient(135deg, rgba(26,169,154,0.12) 0%, rgba(245,166,35,0.08) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(26,169,154,0.2)",
            }}
          >
            <Box sx={{ color: "#1AA99A" }}>{icon}</Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
            <Typography variant="h3" color="#12342F" mt={0.25} fontWeight={700}>{value}</Typography>
            {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
          </Box>
          {action && (
            <Typography
              variant="caption"
              sx={{ color: "#1AA99A", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5, mt: "auto" }}
            >
              {action} <EastIcon sx={{ fontSize: 13 }} />
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
}

function getProfileCompletion(profile) {
  if (!profile) return 0;
  const fields = [
    "name", "department", "college", "year", "experience_level", "hackathon_theme",
  ];
  const lists = [
    "programming_languages", "frameworks", "interested_domains", "preferred_technologies",
  ];
  let filled = 0;
  const total = fields.length + lists.length;
  fields.forEach((f) => { if (profile[f]) filled++; });
  lists.forEach((f)  => { if ((profile[f] || []).length > 0) filled++; });
  return Math.round((filled / total) * 100);
}

function getGreeting(name) {
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${greeting}, ${(name || "").split(" ")[0] || "there"}`;
}

export default function DashboardPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [loading,  setLoading]  = useState(true);
  const [profile,  setProfile]  = useState(null);
  const [savedCount, setSaved]  = useState(0);
  const [recCount,   setRec]    = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [profRes, favRes, recRes] = await Promise.allSettled([
          profileService.getProfile(),
          favoriteService.getFavorites(),
          recommendationService.getHistory(),
        ]);
        if (cancelled) return;
        if (profRes.status === "fulfilled") setProfile(profRes.value.data?.profile || null);
        if (favRes.status  === "fulfilled") setSaved(favRes.value.data?.favorites?.length || 0);
        if (recRes.status  === "fulfilled") setRec(recRes.value.data?.total || 0);
      } catch {
        // silent — stats just show 0
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const profilePct = getProfileCompletion(profile);
  const hasProfile = profilePct >= 30;

  return (
    <AppShell>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h1" mb={0.5}>
          {loading ? <Skeleton width={240} /> : getGreeting(user?.name)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Discover hackathon projects that match your skills and interests.
        </Typography>
      </Box>

      {/* Primary CTA */}
      <Paper
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          gap: 2.5,
          background: "linear-gradient(135deg, rgba(26,169,154,0.10) 0%, rgba(245,166,35,0.08) 100%)",
          border: "1.5px solid rgba(26,169,154,0.25)",
          borderRadius: "16px",
        }}
      >
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <AutoAwesomeRoundedIcon sx={{ color: "#F5A623", fontSize: 22 }} />
            <Typography variant="h5" color="#12342F" fontWeight={700}>AI Recommendations</Typography>
          </Box>
          <Typography variant="body2" color="#5F7A76">
            {hasProfile
              ? "Your profile is set up. Get AI-matched hackathon projects now."
              : "Complete your profile to get personalized project recommendations."}
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} flexShrink={0} flexWrap="wrap">
          {hasProfile ? (
            <Button
              variant="contained"
              onClick={() => navigate("/recommendations")}
              endIcon={<EastIcon />}
              sx={{
                borderRadius: "50px",
                px: 3,
                background: "linear-gradient(135deg, #F5A623 0%, #D4891A 100%)",
                color: "#fff",
                fontWeight: 700,
                "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
              }}
            >
              Find My Projects
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={() => navigate("/profile")}
                sx={{
                  borderRadius: "50px",
                  px: 3,
                  background: "linear-gradient(135deg, #1AA99A 0%, #12857A 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
                }}
              >
                Complete Profile
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/recommendations")}
                sx={{ borderRadius: "50px", px: 3, borderColor: "#1AA99A", color: "#1AA99A" }}
              >
                Browse Anyway
              </Button>
            </>
          )}
        </Box>
      </Paper>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            loading={loading}
            icon={<PersonOutlinedIcon fontSize="small" />}
            label="Profile Completion"
            value={`${profilePct}%`}
            sub={profilePct < 100 ? "Add more details to improve matches" : "Profile complete"}
            action={profilePct < 100 ? "Complete profile" : null}
            onClick={() => navigate("/profile")}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            loading={loading}
            icon={<AutoAwesomeRoundedIcon fontSize="small" />}
            label="Recommended Projects"
            value={recCount}
            sub={recCount > 0 ? "Based on your profile" : "Get recommendations"}
            action={recCount === 0 ? "Get recommendations" : "View all"}
            onClick={() => navigate("/recommendations")}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            loading={loading}
            icon={<BookmarkBorderIcon fontSize="small" />}
            label="Saved Projects"
            value={savedCount}
            sub={savedCount > 0 ? "Projects you bookmarked" : "No saved projects yet"}
            action={savedCount > 0 ? "View saved" : null}
            onClick={() => navigate("/saved")}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            loading={loading}
            icon={<SchoolOutlinedIcon fontSize="small" />}
            label="Learning Progress"
            value="Track"
            sub="View your roadmap progress"
            action="Open learning"
            onClick={() => navigate("/learning")}
          />
        </Grid>
      </Grid>

      {/* Profile completion bar */}
      {!loading && profilePct < 100 && (
        <Paper
          sx={{
            p: 2.5,
            border: "1.5px solid rgba(26,169,154,0.2)",
            borderRadius: "14px",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Box>
              <Typography variant="subtitle2" color="#12342F">Profile Completion</Typography>
              <Typography variant="caption" color="text.secondary">
                A complete profile improves recommendation accuracy
              </Typography>
            </Box>
            <Typography variant="h4" color="#1AA99A" fontWeight={800}>{profilePct}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={profilePct}
            sx={{
              mb: 1.5,
              height: 8,
              borderRadius: 4,
              background: "rgba(26,169,154,0.15)",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #1AA99A 0%, #F5A623 100%)",
                borderRadius: 4,
              },
            }}
          />
          <Button
            size="small"
            onClick={() => navigate("/profile")}
            variant="contained"
            sx={{
              borderRadius: "50px",
              px: 2.5,
              background: "linear-gradient(135deg, #1AA99A 0%, #12857A 100%)",
              color: "#fff",
              fontWeight: 700,
              "&:hover": { opacity: 0.9 },
            }}
          >
            Complete Profile
          </Button>
        </Paper>
      )}
    </AppShell>
  );
}
