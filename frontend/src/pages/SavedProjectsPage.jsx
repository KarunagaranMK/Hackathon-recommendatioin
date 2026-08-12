import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Paper, Button, Chip, Alert, Skeleton, IconButton,
} from "@mui/material";
import BookmarkIcon    from "@mui/icons-material/Bookmark";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AccessTimeIcon  from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import AppShell        from "../components/AppShell";
import EmptyState      from "../components/EmptyState";
import { favoriteService } from "../services/project.service";
import toast from "react-hot-toast";

const DIFF_COLORS = {
  Beginner:     { bg: "#F0FDF4", color: "#166534" },
  Intermediate: { bg: "#FFFBEB", color: "#92400E" },
  Advanced:     { bg: "#FEF2F2", color: "#991B1B" },
};

function FavCard({ fav, onRemove }) {
  const navigate = useNavigate();
  const diff = DIFF_COLORS[fav.difficulty] || DIFF_COLORS.Intermediate;
  return (
    <Paper
      sx={{
        p: 2.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
        <Box>
          <Box display="flex" gap={0.75} mb={1} flexWrap="wrap">
            <Chip label={fav.domain} size="small" sx={{ background: "#EEF2FF", color: "#4F46E5", fontWeight: 600 }} />
            <Chip
              label={fav.difficulty}
              size="small"
              sx={{ background: diff.bg, color: diff.color, fontWeight: 600 }}
            />
          </Box>
          <Typography variant="subtitle2" fontWeight={600} lineHeight={1.4}>{fav.title}</Typography>
        </Box>
        <IconButton
          size="small"
          onClick={() => onRemove(fav.project_id)}
          sx={{ color: "#94A3B8", flexShrink: 0, "&:hover": { color: "#DC2626", background: "#FEF2F2" } }}
          aria-label="Remove from saved"
        >
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      {fav.saved_at && (
        <Box display="flex" alignItems="center" gap={0.5} mt="auto">
          <AccessTimeIcon sx={{ fontSize: 13, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Saved {new Date(fav.saved_at).toLocaleDateString()}
          </Typography>
        </Box>
      )}

      <Button
        variant="outlined"
        size="small"
        fullWidth
        onClick={() => navigate(`/project/${fav.project_id}`)}
      >
        View Project
      </Button>
    </Paper>
  );
}

export default function SavedProjectsPage() {
  const navigate = useNavigate();
  const [favs,    setFavs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    let cancelled = false;
    favoriteService.getFavorites()
      .then((res) => { if (!cancelled) setFavs(res.data?.favorites || []); })
      .catch(() => { if (!cancelled) setError("Failed to load saved projects."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleRemove = async (projectId) => {
    const prev = [...favs];
    setFavs((f) => f.filter((x) => x.project_id !== projectId));
    try {
      await favoriteService.toggleFavorite(projectId);
      toast.success("Removed from saved projects");
    } catch {
      setFavs(prev);
      toast.error("Could not remove project");
    }
  };

  return (
    <AppShell>
      <Box mb={3}>
        <Typography variant="h1" mb={0.5}>Saved Projects</Typography>
        <Typography variant="body2" color="text.secondary">
          Projects you've bookmarked for later.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

      {loading && (
        <Grid container spacing={2}>
          {[1,2,3,4].map((i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Skeleton height={160} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && favs.length === 0 && !error && (
        <EmptyState
          title="No saved projects"
          description="You haven't saved any projects yet. Explore recommendations to find projects you like."
          action={() => navigate("/recommendations")}
          actionLabel="Browse Recommendations"
        />
      )}

      {!loading && favs.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {favs.length} saved {favs.length === 1 ? "project" : "projects"}
          </Typography>
          <Grid container spacing={2}>
            {favs.map((fav) => (
              <Grid item xs={12} sm={6} lg={4} key={fav.project_id}>
                <FavCard fav={fav} onRemove={handleRemove} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </AppShell>
  );
}
