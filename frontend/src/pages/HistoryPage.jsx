import { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Chip, Alert, Skeleton, Divider,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import EmptyState from "../components/EmptyState";
import { recommendationService } from "../services/recommendation.service";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [recs,    setRecs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    let cancelled = false;
    recommendationService.getHistory()
      .then((res) => { if (!cancelled) setRecs(res.data?.recommendations || []); })
      .catch(() => { if (!cancelled) setError("Failed to load history."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <AppShell>
      <Box mb={3}>
        <Typography variant="h1" mb={0.5}>History</Typography>
        <Typography variant="body2" color="text.secondary">
          Your previously recommended projects.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

      {loading && (
        <Box>
          {[1,2,3,4,5].map((i) => (
            <Skeleton key={i} height={72} sx={{ mb: 1, borderRadius: 1 }} />
          ))}
        </Box>
      )}

      {!loading && recs.length === 0 && !error && (
        <EmptyState
          title="No history yet"
          description="Your recommendation history will appear here after you run your first recommendations."
          action={() => navigate("/recommendations")}
          actionLabel="Get Recommendations"
        />
      )}

      {!loading && recs.length > 0 && (
        <Paper>
          {recs.map((rec, i) => (
            <Box key={rec.project_id}>
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  "&:hover": { background: "#F8FAFC" },
                  transition: "background 0.15s",
                }}
                onClick={() => navigate(`/project/${rec.project_id}`)}
              >
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: "8px",
                    background: "#EEF2FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <HistoryIcon sx={{ fontSize: 18, color: "#4F46E5" }} />
                </Box>
                <Box flex={1} minWidth={0}>
                  <Typography variant="subtitle2" fontWeight={600} noWrap>{rec.title}</Typography>
                  <Box display="flex" gap={1} mt={0.5} flexWrap="wrap">
                    <Typography variant="caption" color="text.secondary">{rec.domain}</Typography>
                    <Typography variant="caption" color="text.secondary">·</Typography>
                    <Typography variant="caption" color="text.secondary">{rec.difficulty}</Typography>
                  </Box>
                </Box>
                <Box textAlign="right" flexShrink={0}>
                  {rec.similarity_score != null && (
                    <Chip
                      label={`${Math.round(rec.similarity_score)}%`}
                      size="small"
                      sx={{ background: "#EEF2FF", color: "#4F46E5", fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Box>
              {i < recs.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>
      )}
    </AppShell>
  );
}
