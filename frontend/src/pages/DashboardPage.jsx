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
      sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5, height: "100%", cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      {loading ? (
        <>
          <Skeleton width={32} height={32} variant="rectangular" sx={{ borderRadius: 1 }} />
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={28} />
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: "8px",
              background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Box sx={{ color: "#4F46E5" }}>{icon}</Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
            <Typography variant="h3" color="text.primary" mt={0.25}>{value}</Typography>
            {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
          </Box>
          {action && (
            <Typography
              variant="caption"
              sx={{ color: "#4F46E5", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5, mt: "auto" }}
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
          p: { xs: 2.5, sm: 3 },
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          gap: 2,
          background: "#EEF2FF",
          border: "1px solid #C7D2FE",
        }}
      >
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <AutoAwesomeRoundedIcon sx={{ color: "#4F46E5", fontSize: 20 }} />
            <Typography variant="h5" color="#4F46E5">AI Recommendations</Typography>
          </Box>
          <Typography variant="body2" color="#4338CA">
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
            >
              Find My Projects
            </Button>
          ) : (
            <>
              <Button variant="contained" onClick={() => navigate("/profile")}>
                Complete Profile
              </Button>
              <Button variant="outlined" onClick={() => navigate("/recommendations")}>
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
        <Paper sx={{ p: 2.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Box>
              <Typography variant="subtitle2" color="text.primary">Profile Completion</Typography>
              <Typography variant="caption" color="text.secondary">
                A complete profile improves recommendation accuracy
              </Typography>
            </Box>
            <Typography variant="h4" color="#4F46E5">{profilePct}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={profilePct} sx={{ mb: 1.5 }} />
          <Button size="small" onClick={() => navigate("/profile")} variant="outlined">
            Complete Profile
          </Button>
        </Paper>
      )}
    </AppShell>
  );
}
