import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Button, Grid, TextField, Select, MenuItem,
  FormControl, InputLabel, Alert, Skeleton, InputAdornment, Chip,
} from "@mui/material";
import SearchIcon          from "@mui/icons-material/Search";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useNavigate }     from "react-router-dom";
import AppShell            from "../components/AppShell";
import ProjectCard         from "../components/ProjectCard";
import EmptyState          from "../components/EmptyState";
import { recommendationService } from "../services/recommendation.service";
import { favoriteService }       from "../services/project.service";

const DOMAINS = ["All", "Healthcare", "FinTech", "EdTech", "AgriTech", "Environment", "Smart City", "Cybersecurity", "Social Impact", "IoT", "Blockchain"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const SORT_OPTIONS = [
  { value: "match",    label: "Best Match" },
  { value: "skill",    label: "Skill Match" },
  { value: "az",       label: "A → Z" },
];

function CardSkeleton() {
  return (
    <Box sx={{ p: 2.5, border: "1px solid #E2E8F0", borderRadius: "10px", background: "#fff" }}>
      <Skeleton width="30%" height={22} sx={{ mb: 1 }} />
      <Skeleton width="85%" height={20} sx={{ mb: 0.5 }} />
      <Skeleton width="100%" height={18} sx={{ mb: 0.5 }} />
      <Skeleton width="70%" height={18} sx={{ mb: 2 }} />
      <Skeleton width="100%" height={6} sx={{ mb: 1.5 }} />
      <Box display="flex" gap={1}>
        <Skeleton width={60} height={24} sx={{ borderRadius: 1 }} />
        <Skeleton width={60} height={24} sx={{ borderRadius: 1 }} />
        <Skeleton width={60} height={24} sx={{ borderRadius: 1 }} />
      </Box>
    </Box>
  );
}

export default function RecommendationPage() {
  const navigate   = useNavigate();
  const [recs,     setRecs]     = useState([]);
  const [favIds,   setFavIds]   = useState(new Set());
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [domain,   setDomain]   = useState("All");
  const [diff,     setDiff]     = useState("All");
  const [sort,     setSort]     = useState("match");

  // Load persisted recommendations + favorite IDs on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setFetching(true);
      try {
        const [recRes, favRes] = await Promise.allSettled([
          recommendationService.getHistory(),
          favoriteService.getFavoriteIds(),
        ]);
        if (cancelled) return;
        if (recRes.status === "fulfilled") setRecs(recRes.value.data?.recommendations || []);
        if (favRes.status === "fulfilled") setFavIds(new Set(favRes.value.data?.favorite_ids || []));
      } catch {
        // silent
      } finally {
        if (!cancelled) setFetching(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await recommendationService.getRecommendations(15);
      setRecs(res.data?.recommendations || []);
    } catch (err) {
      const msg = err?.response?.data?.detail || "";
      if (msg.toLowerCase().includes("profile"))
        setError("Please complete your profile before getting recommendations.");
      else if (msg.toLowerCase().includes("no projects"))
        setError("No projects found in database. Please contact support.");
      else
        setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (projectId) => {
    try {
      await favoriteService.toggleFavorite(projectId);
      setFavIds((prev) => {
        const next = new Set(prev);
        if (next.has(projectId)) next.delete(projectId);
        else next.add(projectId);
        return next;
      });
    } catch {
      // silent
    }
  };

  // Filter + sort
  const filtered = recs
    .filter((r) => {
      const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
      const matchDomain = domain === "All" || r.domain === domain;
      const matchDiff   = diff   === "All" || r.difficulty === diff;
      return matchSearch && matchDomain && matchDiff;
    })
    .sort((a, b) => {
      if (sort === "match") return (b.similarity_score || 0) - (a.similarity_score || 0);
      if (sort === "skill") return (b.skill_gap?.match_percentage || 0) - (a.skill_gap?.match_percentage || 0);
      if (sort === "az")    return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <AppShell>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h1" mb={0.5}>Recommendations</Typography>
        <Typography variant="body2" color="text.secondary">
          AI-powered project matches based on your skills and interests.
        </Typography>
      </Box>

      {/* Action row */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
        <Button
          variant="contained"
          startIcon={<AutoAwesomeRoundedIcon />}
          onClick={handleGetRecommendations}
          disabled={loading}
        >
          {loading ? "Finding projects…" : "Get Recommendations"}
        </Button>
        {recs.length > 0 && (
          <Chip label={`${recs.length} projects found`} size="small" variant="outlined" />
        )}
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2.5 }}
          action={
            error.includes("profile") ? (
              <Button size="small" onClick={() => navigate("/profile")}>Complete Profile</Button>
            ) : (
              <Button size="small" onClick={handleGetRecommendations}>Retry</Button>
            )
          }
        >
          {error}
        </Alert>
      )}

      {/* Filters — only show when there are results */}
      {recs.length > 0 && (
        <Box
          display="flex"
          gap={1.5}
          mb={2.5}
          flexWrap="wrap"
          alignItems="center"
        >
          <TextField
            placeholder="Search projects…"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 220, flex: { xs: "1 1 100%", sm: "0 1 220px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Domain</InputLabel>
            <Select value={domain} label="Domain" onChange={(e) => setDomain(e.target.value)}>
              {DOMAINS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select value={diff} label="Difficulty" onChange={(e) => setDiff(e.target.value)}>
              {DIFFICULTIES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort by</InputLabel>
            <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Loading skeletons */}
      {(loading || fetching) && !recs.length && (
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <CardSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Results */}
      {!loading && !fetching && recs.length > 0 && filtered.length === 0 && (
        <EmptyState
          title="No matches for your filters"
          description="Try adjusting the search or filters above."
          action={() => { setSearch(""); setDomain("All"); setDiff("All"); }}
          actionLabel="Clear filters"
        />
      )}

      {!loading && !fetching && filtered.length > 0 && (
        <Grid container spacing={2}>
          {filtered.map((rec, idx) => (
            <Grid item xs={12} sm={6} lg={4} key={rec.project_id}>
              <ProjectCard
                project={rec}
                rank={idx + 1}
                isFavorited={favIds.has(rec.project_id)}
                onFavorite={handleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty state — no recommendations yet */}
      {!loading && !fetching && recs.length === 0 && !error && (
        <EmptyState
          title="No recommendations yet"
          description='Click "Get Recommendations" to let AI find hackathon projects that match your skills and interests.'
          action={handleGetRecommendations}
          actionLabel="Get Recommendations"
        />
      )}
    </AppShell>
  );
}
