import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Chip, Grid, Divider,
  Skeleton, Alert, Paper,
} from "@mui/material";
import BookmarkBorderIcon    from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon          from "@mui/icons-material/Bookmark";
import SchoolOutlinedIcon    from "@mui/icons-material/SchoolOutlined";
import ArrowBackIcon         from "@mui/icons-material/ArrowBack";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AppShell   from "../components/AppShell";
import SkillGapChart   from "../components/SkillGapChart";
import RoadmapStepper  from "../components/RoadmapStepper";
import { projectService, favoriteService } from "../services/project.service";
import { recommendationService } from "../services/recommendation.service";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const DIFF_COLORS = {
  Beginner:     { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  Intermediate: { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  Advanced:     { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" },
};

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project,  setProject]  = useState(null);
  const [recData,  setRecData]  = useState(null); // skill gap + roadmap from recommendations
  const [loading,  setLoading]  = useState(true);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [projRes, histRes] = await Promise.allSettled([
          projectService.getProject(id),
          recommendationService.getHistory(),
        ]);
        if (cancelled) return;

        if (projRes.status === "fulfilled") {
          setProject(projRes.value.data);
        } else {
          setError("Project not found.");
        }

        // Find recommendation data (skill gap + roadmap) for this project
        if (histRes.status === "fulfilled") {
          const recs = histRes.value.data?.recommendations || [];
          const match = recs.find((r) => r.project_id === id);
          if (match) setRecData(match);
        }

        // Check if already saved
        const favRes = await favoriteService.getFavoriteIds();
        if (!cancelled) {
          setSaved((favRes.data?.favorite_ids || []).includes(id));
        }
      } catch {
        if (!cancelled) setError("Failed to load project. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleToggleSave = async () => {
    try {
      await favoriteService.toggleFavorite(id);
      setSaved((s) => !s);
      toast.success(saved ? "Removed from saved" : "Project saved");
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <AppShell>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Skeleton height={36} width="60%" sx={{ mb: 1 }} />
        <Skeleton height={20} width="40%" sx={{ mb: 3 }} />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={8}>
            <Skeleton height={200} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton height={200} sx={{ borderRadius: 1 }} />
          </Grid>
        </Grid>
      </AppShell>
    );
  }

  if (error || !project) {
    return (
      <AppShell>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
        <Alert severity="error" action={<Button size="small" onClick={() => window.location.reload()}>Retry</Button>}>
          {error || "Project not found."}
        </Alert>
      </AppShell>
    );
  }

  const diff = project.difficulty || "Intermediate";
  const diffStyle = DIFF_COLORS[diff] || DIFF_COLORS.Intermediate;
  const matchScore = recData?.similarity_score;

  return (
    <AppShell>
      {/* Back */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        Back to recommendations
      </Button>

      {/* Header */}
      <Box mb={3}>
        <Box display="flex" flexWrap="wrap" gap={1} mb={1.5} alignItems="center">
          <Chip
            label={project.domain}
            size="small"
            sx={{ background: "#EEF2FF", color: "#4F46E5", fontWeight: 600 }}
          />
          <Chip
            label={diff}
            size="small"
            sx={{ background: diffStyle.bg, color: diffStyle.color, border: `1px solid ${diffStyle.border}`, fontWeight: 600 }}
          />
          {project.estimated_duration && (
            <Chip
              icon={<AccessTimeOutlinedIcon sx={{ fontSize: "14px !important" }} />}
              label={project.estimated_duration}
              size="small"
              variant="outlined"
            />
          )}
          {matchScore != null && (
            <Chip
              label={`${Math.round(matchScore)}% match`}
              size="small"
              sx={{ background: "#F0FDF4", color: "#166534", fontWeight: 600 }}
            />
          )}
        </Box>
        <Typography variant="h1" mb={1}>{project.title}</Typography>
        <Typography variant="body1" color="text.secondary">{project.description}</Typography>
      </Box>

      {/* Action buttons */}
      <Box display="flex" gap={1.5} mb={3} flexWrap="wrap">
        <Button
          variant={saved ? "outlined" : "contained"}
          startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          onClick={handleToggleSave}
        >
          {saved ? "Saved" : "Save Project"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<SchoolOutlinedIcon />}
          onClick={() => navigate(`/learning/${id}`)}
        >
          Start Learning
        </Button>
      </Box>

      <Grid container spacing={2.5}>
        {/* Left column */}
        <Grid item xs={12} md={8}>
          {/* Problem statement */}
          {project.problem_statement && (
            <Paper sx={{ p: 2.5, mb: 2.5 }}>
              <Typography variant="h4" mb={1.5}>Problem Statement</Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                {project.problem_statement}
              </Typography>
            </Paper>
          )}

          {/* Architecture */}
          {project.architecture && (
            <Paper sx={{ p: 2.5, mb: 2.5 }}>
              <Typography variant="h4" mb={1.5}>Architecture Overview</Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                {project.architecture}
              </Typography>
            </Paper>
          )}

          {/* Modules */}
          {project.modules?.length > 0 && (
            <Paper sx={{ p: 2.5, mb: 2.5 }}>
              <Typography variant="h4" mb={1.5}>Project Modules</Typography>
              <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                {project.modules.map((m, i) => (
                  <Box component="li" key={i} sx={{ mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">{m}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {/* Skill Gap */}
          {recData?.skill_gap && (
            <Paper sx={{ p: 2.5, mb: 2.5 }}>
              <Typography variant="h4" mb={2}>Skill Analysis</Typography>
              <SkillGapChart skillGap={recData.skill_gap} />
            </Paper>
          )}

          {/* Roadmap */}
          {recData?.roadmap && (
            <Paper sx={{ p: 2.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Learning Roadmap</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(`/learning/${id}`)}
                >
                  Track Progress
                </Button>
              </Box>
              <RoadmapStepper roadmap={recData.roadmap} />
            </Paper>
          )}
        </Grid>

        {/* Right column */}
        <Grid item xs={12} md={4}>
          {/* Required skills */}
          <Paper sx={{ p: 2.5, mb: 2.5 }}>
            <Typography variant="h4" mb={1.5}>Required Skills</Typography>
            <Box display="flex" flexWrap="wrap" gap={0.75}>
              {(project.skills_required || []).map((s) => (
                <Chip key={s} label={s} size="small" variant="outlined" />
              ))}
              {!project.skills_required?.length && (
                <Typography variant="body2" color="text.secondary">No skills listed</Typography>
              )}
            </Box>
          </Paper>

          {/* Technologies */}
          <Paper sx={{ p: 2.5, mb: 2.5 }}>
            <Typography variant="h4" mb={1.5}>Technologies</Typography>
            <Box display="flex" flexWrap="wrap" gap={0.75}>
              {(project.technologies || []).map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  sx={{ background: "#EEF2FF", color: "#4F46E5" }}
                />
              ))}
              {!project.technologies?.length && (
                <Typography variant="body2" color="text.secondary">No technologies listed</Typography>
              )}
            </Box>
          </Paper>

          {/* Why this matches */}
          {recData && (
            <Paper sx={{ p: 2.5, mb: 2.5 }}>
              <Typography variant="h4" mb={1.5}>Why this matches you</Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Overall match</Typography>
                <Typography variant="body2" fontWeight={600} color="#4F46E5">
                  {matchScore != null ? `${Math.round(matchScore)}%` : "—"}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Skill match</Typography>
                <Typography variant="body2" fontWeight={600} color="#059669">
                  {recData.skill_gap?.match_percentage != null
                    ? `${Math.round(recData.skill_gap.match_percentage)}%`
                    : "—"}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Skills to learn</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {recData.skill_gap?.missing_skills?.length ?? "—"}
                </Typography>
              </Box>
            </Paper>
          )}

          {/* Duration */}
          {project.estimated_duration && (
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="h4" mb={1}>Estimated Duration</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTimeOutlinedIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary">{project.estimated_duration}</Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </AppShell>
  );
}
