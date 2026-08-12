import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, Grid, LinearProgress, Chip,
  Button, Alert, Skeleton, Divider, TextField,
  Slider, Avatar, Tooltip, CircularProgress,
} from "@mui/material";
import CheckCircleIcon          from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AdjustIcon               from "@mui/icons-material/Adjust";
import GroupsIcon               from "@mui/icons-material/Groups";
import AccessTimeIcon           from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon          from "@mui/icons-material/AutoAwesome";
import OpenInNewIcon            from "@mui/icons-material/OpenInNew";
import AppShell                 from "../components/AppShell";
import { recommendationService } from "../services/recommendation.service";
import { projectService }        from "../services/project.service";
import api from "../services/api";
import toast from "react-hot-toast";

// ─── Helpers ───────────────────────────────────────────────────────────────

function getStepStatus(stepNum, completedSteps = []) {
  if (completedSteps.includes(stepNum)) return "completed";
  const maxCompleted = completedSteps.length > 0 ? Math.max(...completedSteps) : 0;
  if (stepNum === maxCompleted + 1) return "in_progress";
  return "not_started";
}

const STATUS_CFG = {
  completed:   { label: "Completed",   color: "#059669", bg: "#F0FDF4", Icon: CheckCircleIcon },
  in_progress: { label: "In Progress", color: "#4F46E5", bg: "#EEF2FF", Icon: AdjustIcon },
  not_started: { label: "Not Started", color: "#94A3B8", bg: "#F8FAFC", Icon: RadioButtonUncheckedIcon },
};

const MEMBER_COLORS = ["#4F46E5","#059669","#D97706","#DC2626","#7C3AED","#0891B2","#BE185D","#0F766E"];

// ─── Step Card ─────────────────────────────────────────────────────────────
function StepCard({ step, status, assignedTo, onMarkComplete, onUndo }) {
  const { label, color, bg, Icon } = STATUS_CFG[status];
  return (
    <Paper sx={{ p: 2, mb: 1.5 }}>
      <Box display="flex" alignItems="flex-start" gap={2}>
        <Box sx={{ pt: 0.25, flexShrink: 0 }}>
          <Icon sx={{ fontSize: 20, color }} />
        </Box>
        <Box flex={1} minWidth={0}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1} flexWrap="wrap" mb={0.5}>
            <Typography variant="subtitle2" fontWeight={700}>
              Step {step.step} — {step.skill}
            </Typography>
            <Box display="flex" gap={0.75} alignItems="center" flexWrap="wrap">
              {assignedTo && (
                <Chip
                  label={assignedTo.role}
                  size="small"
                  sx={{ background: assignedTo.color + "20", color: assignedTo.color, fontWeight: 600, border: `1px solid ${assignedTo.color}40` }}
                />
              )}
              <Chip label={label} size="small" sx={{ background: bg, color, fontWeight: 600 }} />
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={0.5}>{step.description}</Typography>

          {step.estimated_time && (
            <Box display="flex" alignItems="center" gap={0.5} mb={1}>
              <AccessTimeIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">{step.estimated_time}</Typography>
            </Box>
          )}

          {/* Resources */}
          {step.resources?.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap" mb={1.5}>
              {step.resources.slice(0, 3).map((url, i) => (
                <Button
                  key={i}
                  size="small"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  endIcon={<OpenInNewIcon sx={{ fontSize: "12px !important" }} />}
                  sx={{ fontSize: "0.72rem", py: 0.25, px: 1, minHeight: 0 }}
                >
                  {url.includes("github.com") ? "GitHub" : `Resource ${i + 1}`}
                </Button>
              ))}
            </Box>
          )}

          {/* Actions */}
          <Box display="flex" gap={1}>
            {status !== "completed" && (
              <Button size="small" variant="outlined" onClick={() => onMarkComplete(step.step)}>
                Mark Complete
              </Button>
            )}
            {status === "completed" && (
              <Button size="small" variant="text" sx={{ color: "text.secondary" }} onClick={() => onUndo(step.step)}>
                Undo
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

// ─── Team Card ─────────────────────────────────────────────────────────────
function TeamMemberCard({ member }) {
  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
        <Avatar sx={{ width: 36, height: 36, background: member.color, fontSize: "0.85rem", fontWeight: 700 }}>
          {member.id}
        </Avatar>
        <Box minWidth={0}>
          <Typography variant="subtitle2" fontWeight={700} noWrap>{member.name}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>{member.role}</Typography>
        </Box>
        <Chip label={member.total_time} size="small" sx={{ ml: "auto", background: member.color + "15", color: member.color, fontWeight: 600, flexShrink: 0 }} />
      </Box>
      <Divider sx={{ mb: 1.5 }} />
      {member.steps.length === 0 ? (
        <Typography variant="caption" color="text.secondary">No tasks assigned</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={0.75}>
          {member.steps.map((s) => (
            <Box key={s.step} sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}>
              <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: member.color + "20", color: member.color, fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.1 }}>
                {s.step}
              </Box>
              <Box>
                <Typography variant="caption" fontWeight={600}>{s.skill}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{s.estimated_time}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function LearningProgressPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [loading,         setLoading]         = useState(true);
  const [generating,      setGenerating]      = useState(false);
  const [project,         setProject]         = useState(null);
  const [roadmap,         setRoadmap]         = useState([]);
  const [roadmapStats,    setRoadmapStats]    = useState(null);
  const [completedSteps,  setCompletedSteps]  = useState([]);
  const [teamData,        setTeamData]        = useState(null);
  const [teamSize,        setTeamSize]        = useState(1);
  const [splitting,       setSplitting]       = useState(false);
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState("");
  const [activeProjectId, setActiveProjectId] = useState(projectId || null);
  const [skillGap,        setSkillGap]        = useState(null);

  // ── Load on mount ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        let pid = projectId;

        // Try recommendation history first
        const recRes = await recommendationService.getHistory();
        if (cancelled) return;
        const recs = recRes.data?.recommendations || [];

        let histRoadmap = [];
        let histSkillGap = null;

        if (pid) {
          const rec = recs.find((r) => r.project_id === pid);
          if (rec?.roadmap?.length) { histRoadmap = rec.roadmap; histSkillGap = rec.skill_gap; }
          try {
            const pr = await projectService.getProject(pid);
            if (!cancelled) setProject(pr.data);
          } catch { /* ignore */ }
        } else if (recs.length > 0) {
          const first = recs.find((r) => r.roadmap?.length > 0) || recs[0];
          if (first) {
            histRoadmap = first.roadmap || [];
            histSkillGap = first.skill_gap || null;
            pid = first.project_id;
            setActiveProjectId(first.project_id);
            try {
              const pr = await projectService.getProject(first.project_id);
              if (!cancelled) setProject(pr.data);
            } catch { /* ignore */ }
          }
        }

        if (!cancelled) {
          if (histRoadmap.length > 0) {
            setRoadmap(histRoadmap);
            setSkillGap(histSkillGap);
            // Compute stats locally
            const total = histRoadmap.reduce((acc, s) => acc + parseWeeks(s.estimated_time), 0);
            setRoadmapStats({ total_steps: histRoadmap.length, total_time: formatWeeks(total) });
          } else if (pid) {
            // No history roadmap → generate on-demand
            await generateRoadmap(pid, 1, false);
          }
        }

        // Load saved progress
        if (pid) {
          try {
            const pr = await api.get(`/progress/${pid}`);
            if (!cancelled) setCompletedSteps(pr.data?.completed_steps || []);
          } catch { if (!cancelled) setCompletedSteps([]); }
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [projectId]);

  // ── Generate roadmap on-demand ────────────────────────────────────
  const generateRoadmap = useCallback(async (pid, size = teamSize, showToast = true) => {
    const targetPid = pid || activeProjectId;
    if (!targetPid) return;
    setGenerating(true);
    try {
      const res = await api.post(`/projects/${targetPid}/roadmap`, {
        team_size: size,
        enrich_resources: true,
      });
      const data = res.data;
      setRoadmap(data.roadmap || []);
      setRoadmapStats(data.stats || null);
      setSkillGap(data.skill_gap || null);
      if (data.team && size > 1) setTeamData(data.team);
      if (showToast) toast.success("Roadmap generated with live resources!");
    } catch (e) {
      toast.error("Could not generate roadmap.");
    } finally {
      setGenerating(false);
    }
  }, [activeProjectId, teamSize]);

  // ── Team split ────────────────────────────────────────────────────
  const handleTeamSplit = async () => {
    if (!activeProjectId || roadmap.length === 0) return;
    setSplitting(true);
    try {
      const res = await api.post(`/projects/${activeProjectId}/team-split`, {
        team_size: teamSize,
        enrich_resources: false,
      });
      setTeamData(res.data.team);
      toast.success(`Split across ${teamSize} team members!`);
    } catch {
      toast.error("Could not split work.");
    } finally {
      setSplitting(false);
    }
  };

  // ── Progress persistence ─────────────────────────────────────────
  const ensureRecord = async (pid) => {
    try {
      await api.post("/progress", { project_id: pid, total_steps: roadmap.length, completed_steps: [] });
    } catch (e) {
      if (e?.response?.status !== 400) throw e;
    }
  };

  const handleMarkComplete = async (stepNum) => {
    const pid = activeProjectId;
    if (!pid) return;
    const prev = [...completedSteps];
    const next = [...new Set([...completedSteps, stepNum])];
    setCompletedSteps(next);
    try {
      await ensureRecord(pid);
      await api.put(`/progress/${pid}`, { project_id: pid, step_index: stepNum, completed: true });
      toast.success(next.length === roadmap.length ? "🎉 Roadmap complete!" : "Step completed!");
    } catch {
      setCompletedSteps(prev);
      toast.error("Could not save progress.");
    }
  };

  const handleUndo = async (stepNum) => {
    const pid = activeProjectId;
    if (!pid) return;
    const prev = [...completedSteps];
    setCompletedSteps(completedSteps.filter((s) => s !== stepNum));
    try {
      await api.put(`/progress/${pid}`, { project_id: pid, step_index: stepNum, completed: false });
      toast.success("Marked as incomplete");
    } catch {
      setCompletedSteps(prev);
      toast.error("Could not save progress.");
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────
  const total       = roadmap.length;
  const completed   = completedSteps.length;
  const pct         = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProg      = roadmap.filter((s) => getStepStatus(s.step, completedSteps) === "in_progress").length;
  const notStarted  = total - completed - inProg;

  // Get assignment for a step
  const getAssignment = (stepNum) => {
    if (!teamData) return null;
    return teamData.members?.find((m) => m.steps?.some((s) => s.step === stepNum)) || null;
  };

  // ── Loading skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <AppShell>
        <Typography variant="h1" mb={3}>Learning Progress</Typography>
        {[1,2,3].map((i) => <Skeleton key={i} height={100} sx={{ mb: 1.5, borderRadius: 1 }} />)}
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* ── Header ── */}
      <Box mb={3}>
        <Typography variant="h1" mb={0.5}>Learning Progress</Typography>
        <Typography variant="body2" color="text.secondary">
          Track your roadmap, estimate time, and split work across your team.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* ── Project banner ── */}
      {project && (
        <Box sx={{ mb: 2.5, px: 2, py: 1.5, background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: "8px" }}>
          <Typography variant="caption" color="#4F46E5" fontWeight={500}>Learning path for:</Typography>
          <Typography variant="subtitle2" color="#3730A3" fontWeight={700}>{project.title}</Typography>
        </Box>
      )}

      {/* ── No roadmap — generate CTA ── */}
      {roadmap.length === 0 && !generating && (
        <Paper sx={{ p: 4, textAlign: "center", mb: 3 }}>
          <AutoAwesomeIcon sx={{ fontSize: 40, color: "#C7D2FE", mb: 1.5 }} />
          <Typography variant="h4" fontWeight={600} mb={1}>Generate Your Learning Roadmap</Typography>
          <Typography variant="body2" color="text.secondary" mb={3} maxWidth={460} mx="auto">
            Get an AI-personalized step-by-step learning plan with live GitHub resources, total time estimate, and team work split.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => generateRoadmap(activeProjectId, 1)}
              disabled={!activeProjectId}
            >
              Generate Roadmap
            </Button>
            <Button variant="outlined" onClick={() => navigate("/recommendations")}>
              Get Recommendations
            </Button>
          </Box>
        </Paper>
      )}

      {/* ── Generating spinner ── */}
      {generating && (
        <Paper sx={{ p: 4, textAlign: "center", mb: 3 }}>
          <CircularProgress size={32} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Generating roadmap & fetching live GitHub resources…
          </Typography>
        </Paper>
      )}

      {/* ── Main content ── */}
      {roadmap.length > 0 && (
        <>
          {/* ── Stats cards ── */}
          <Grid container spacing={2} mb={3}>
            {[
              { value: `${pct}%`,        label: "Overall Progress",  color: "#4F46E5" },
              { value: completed,         label: "Completed",          color: "#059669" },
              { value: inProg,            label: "In Progress",        color: "#D97706" },
              { value: notStarted,        label: "Not Started",        color: "#94A3B8" },
            ].map((s) => (
              <Grid item xs={6} sm={3} key={s.label}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h2" sx={{ color: s.color, fontWeight: 700 }}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ── Progress bar ── */}
          <Paper sx={{ p: 2.5, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2">Roadmap Progress</Typography>
              <Typography variant="subtitle2" color="#4F46E5" fontWeight={700}>{completed} / {total} steps</Typography>
            </Box>
            <LinearProgress variant="determinate" value={pct} />
            {pct === 100 && (
              <Typography variant="caption" color="#059669" fontWeight={600} mt={1} display="block">
                🎉 Roadmap complete!
              </Typography>
            )}
          </Paper>

          {/* ── Time & Skill gap summary ── */}
          {(roadmapStats || skillGap) && (
            <Grid container spacing={2} mb={3}>
              {roadmapStats && (
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2.5, display: "flex", gap: 2, alignItems: "center" }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: "10px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <AccessTimeIcon sx={{ color: "#4F46E5" }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Total Estimated Time</Typography>
                      <Typography variant="h4" fontWeight={700} color="#4F46E5">{roadmapStats.total_time}</Typography>
                      <Typography variant="caption" color="text.secondary">{roadmapStats.total_steps} skills to learn</Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}
              {teamData && (
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2.5, display: "flex", gap: 2, alignItems: "center" }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: "10px", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <GroupsIcon sx={{ color: "#059669" }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">With {teamData.team_size} Members</Typography>
                      <Typography variant="h4" fontWeight={700} color="#059669">{teamData.total_time_parallel}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {teamData.time_saved_percent}% faster than solo ({teamData.total_time_sequential} alone)
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}

          {/* ── Skill gap chips ── */}
          {skillGap && (
            <Paper sx={{ p: 2.5, mb: 3 }}>
              <Typography variant="subtitle2" mb={1.5}>Skill Gap Overview</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="#059669" fontWeight={600} mb={0.75} display="block">
                    ✓ Your Skills ({skillGap.matched_skills?.length || 0})
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {(skillGap.matched_skills || []).map((s) => (
                      <Chip key={s} label={s} size="small" sx={{ background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }} />
                    ))}
                    {!skillGap.matched_skills?.length && <Typography variant="caption" color="text.secondary">None matched</Typography>}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="#DC2626" fontWeight={600} mb={0.75} display="block">
                    ✗ Skills to Learn ({skillGap.missing_skills?.length || 0})
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {(skillGap.missing_skills || []).map((s) => (
                      <Chip key={s} label={s} size="small" sx={{ background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }} />
                    ))}
                    {!skillGap.missing_skills?.length && (
                      <Typography variant="caption" color="#059669" fontWeight={600}>You have all required skills!</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* ── Team Split Panel ── */}
          <Paper sx={{ p: 2.5, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <GroupsIcon sx={{ color: "#4F46E5" }} />
              <Typography variant="subtitle2" fontWeight={700}>Team Work Split</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Select your team size and we'll randomly assign roadmap steps across members.
            </Typography>
            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap" mb={2}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                  Team Size: <strong>{teamSize} {teamSize === 1 ? "person" : "members"}</strong>
                </Typography>
                <Slider
                  value={teamSize}
                  min={1}
                  max={8}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  onChange={(_, v) => setTeamSize(v)}
                  sx={{ color: "#4F46E5" }}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={splitting ? <CircularProgress size={14} color="inherit" /> : <GroupsIcon />}
                onClick={handleTeamSplit}
                disabled={splitting || teamSize < 2 || roadmap.length === 0}
                sx={{ flexShrink: 0 }}
              >
                {splitting ? "Splitting…" : "Split Work"}
              </Button>
            </Box>

            {/* Team member cards */}
            {teamData && (
              <Grid container spacing={2}>
                {teamData.members?.map((member) => (
                  <Grid item xs={12} sm={6} md={4} key={member.id}>
                    <TeamMemberCard member={member} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>

          {/* ── Roadmap Steps ── */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
            <Typography variant="h4">Learning Roadmap</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => generateRoadmap(activeProjectId, teamSize)}
              disabled={generating}
            >
              Regenerate
            </Button>
          </Box>

          {roadmap.map((step) => {
            const status = getStepStatus(step.step, completedSteps);
            const assignedTo = getAssignment(step.step);
            return (
              <StepCard
                key={step.step}
                step={step}
                status={status}
                assignedTo={assignedTo ? { role: assignedTo.role, color: assignedTo.color } : null}
                onMarkComplete={handleMarkComplete}
                onUndo={handleUndo}
              />
            );
          })}
        </>
      )}
    </AppShell>
  );
}

// ── Time helpers ────────────────────────────────────────────────────────────
function parseWeeks(str = "1 week") {
  str = str.toLowerCase();
  const nums = str.match(/\d+/);
  const n = nums ? parseInt(nums[0]) : 1;
  if (str.includes("month")) return n * 4;
  return n;
}

function formatWeeks(weeks) {
  if (!weeks) return "Ready!";
  if (weeks <= 1) return "1 week";
  if (weeks <= 4) return `${weeks} weeks`;
  if (weeks <= 12) return `${Math.floor(weeks / 4)} month${Math.floor(weeks / 4) > 1 ? "s" : ""}`;
  return `${Math.floor(weeks / 4)} months`;
}
