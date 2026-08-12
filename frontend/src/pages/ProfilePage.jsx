import { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, MenuItem, Chip, Grid,
  Paper, Alert, LinearProgress, Select, FormControl, InputLabel,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AppShell  from "../components/AppShell";
import { profileService } from "../services/profile.service";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ─── Static option lists ───────────────────────────────────────────
const LANGUAGES  = ["Python","JavaScript","TypeScript","Java","C++","Go","Rust","Kotlin","Swift","R","Scala","PHP","Ruby","Dart"];
const FRAMEWORKS = ["React","Next.js","Vue","Angular","FastAPI","Django","Flask","Express","Spring","Laravel","Flutter","React Native"];
const DATABASES  = ["MongoDB","PostgreSQL","MySQL","Redis","Elasticsearch","Firebase","Supabase","Cassandra","SQLite","DynamoDB"];
const CLOUD      = ["AWS","GCP","Azure","Docker","Kubernetes","Terraform","CI/CD","Vercel","Render","DigitalOcean"];
const AI_SKILLS  = ["Machine Learning","Deep Learning","NLP","Computer Vision","TensorFlow","PyTorch","scikit-learn","Hugging Face","LangChain"];
const DOMAINS    = ["Healthcare","FinTech","EdTech","AgriTech","Environment","Smart City","Cybersecurity","Social Impact","IoT","Blockchain","E-Commerce","Gaming"];
const TECHS      = ["React","Python","FastAPI","MongoDB","TensorFlow","Docker","Blockchain","IoT","WebRTC","WebSockets","GraphQL","Microservices"];
const THEMES     = ["AI/ML","Healthcare Innovation","Climate Change","FinTech Revolution","Smart Cities","Cybersecurity","EdTech","Social Good","Blockchain/Web3","IoT & Robotics"];
const YEARS      = ["1st Year","2nd Year","3rd Year","4th Year","Post Graduate","PhD"];
const EXP_LEVELS = ["Beginner","Intermediate","Advanced"];
const DEPARTMENTS= ["Computer Science","Information Technology","Electronics","Mechanical","Civil","Electrical","Chemical","Biotechnology","Mathematics","Physics","Business","Other"];

function calcCompletion(form) {
  const checks = [
    !!form.department, !!form.college, !!form.year, !!form.experience_level,
    form.programming_languages.length > 0, form.frameworks.length > 0,
    form.interested_domains.length > 0, form.preferred_technologies.length > 0,
    !!form.hackathon_theme, (form.databases.length > 0 || form.ai_skills.length > 0),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ─── Chip multi-select ─────────────────────────────────────────────
function ChipGroup({ label, hint, options, selected, onChange }) {
  const toggle = (opt) =>
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>{label}</Typography>
      {hint && <Typography variant="caption" color="text.secondary" display="block" mb={1}>{hint}</Typography>}
      <Box display="flex" flexWrap="wrap" gap={0.75}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <Chip
              key={opt}
              label={opt}
              onClick={() => toggle(opt)}
              icon={active ? <CheckIcon sx={{ fontSize: "13px !important", color: "#4F46E5 !important" }} /> : undefined}
              sx={{
                cursor: "pointer",
                background: active ? "#EEF2FF" : "#fff",
                border: `1px solid ${active ? "#C7D2FE" : "#E2E8F0"}`,
                color: active ? "#4F46E5" : "text.secondary",
                fontWeight: active ? 600 : 400,
                "&:hover": { background: active ? "#E0E7FF" : "#F8FAFC" },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}

// ─── Section wrapper ────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <Paper sx={{ p: { xs: 2.5, sm: 3 }, mb: 2.5 }}>
      <Box mb={2.5}>
        <Typography variant="h4" mb={0.25}>{title}</Typography>
        {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
      </Box>
      {children}
    </Paper>
  );
}

// ─── Default form state ─────────────────────────────────────────────
const DEFAULT = {
  name: "", department: "", college: "", year: "", experience_level: "Beginner",
  programming_languages: [], frameworks: [], databases: [], cloud_skills: [], ai_skills: [],
  interested_domains: [], preferred_technologies: [], hackathon_theme: "",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ ...DEFAULT, name: user?.name || "" });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [alert,   setAlert]   = useState(null);

  // Load existing profile
  useEffect(() => {
    let cancelled = false;
    profileService.getProfile()
      .then((res) => {
        if (cancelled) return;
        const p = res.data?.profile;
        if (p) {
          setForm({
            name:                  user?.name || "",
            department:            p.department            || "",
            college:               p.college               || "",
            year:                  p.year                  || "",
            experience_level:      p.experience_level      || "Beginner",
            programming_languages: p.programming_languages || [],
            frameworks:            p.frameworks            || [],
            databases:             p.databases             || [],
            cloud_skills:          p.cloud_skills          || [],
            ai_skills:             p.ai_skills             || [],
            interested_domains:    p.interested_domains    || [],
            preferred_technologies:p.preferred_technologies|| [],
            hackathon_theme:       p.hackathon_theme       || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));
  const setField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setAlert(null);
    try {
      await profileService.saveProfile({ ...form, name: user?.name || form.name });
      toast.success("Profile saved successfully");
      setAlert({ type: "success", msg: "Profile saved! Go to Recommendations to find matching projects." });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to save profile. Please try again.";
      toast.error(msg);
      setAlert({ type: "error", msg });
    } finally {
      setSaving(false);
    }
  };

  const completion = calcCompletion(form);

  if (loading) {
    return (
      <AppShell>
        <Box mb={3}><Typography variant="h1">My Profile</Typography></Box>
        {[1,2,3].map((i) => (
          <Paper key={i} sx={{ p: 3, mb: 2.5 }}>
            <Box sx={{ height: 120, background: "#F1F5F9", borderRadius: 1 }} />
          </Paper>
        ))}
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h1" mb={0.5}>My Profile</Typography>
        <Typography variant="body2" color="text.secondary">
          A complete profile helps our AI find better project matches for you.
        </Typography>
      </Box>

      {/* Completion bar */}
      <Paper sx={{ p: 2.5, mb: 2.5, background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" color="#4F46E5">Profile Completion</Typography>
          <Typography variant="subtitle2" color="#4F46E5" fontWeight={700}>{completion}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={completion}
          sx={{
            height: 6,
            background: "#C7D2FE",
            "& .MuiLinearProgress-bar": { background: "#4F46E5" },
          }}
        />
      </Paper>

      {alert && (
        <Alert
          severity={alert.type}
          sx={{ mb: 2.5 }}
          action={alert.type === "success" ? (
            <Button size="small" onClick={() => navigate("/recommendations")}>Get Recommendations</Button>
          ) : null}
        >
          {alert.msg}
        </Alert>
      )}

      {/* ── Section 1: Personal Information ── */}
      <Section title="Personal Information" description="Tell us a bit about yourself.">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full name"
              name="name"
              value={form.name}
              onChange={setField}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="College / University"
              name="college"
              value={form.college}
              onChange={setField}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select name="department" value={form.department} label="Department" onChange={setField}>
                {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Year of Study</InputLabel>
              <Select name="year" value={form.year} label="Year of Study" onChange={setField}>
                {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Experience Level</InputLabel>
              <Select name="experience_level" value={form.experience_level} label="Experience Level" onChange={setField}>
                {EXP_LEVELS.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Section>

      {/* ── Section 2: Programming Languages ── */}
      <Section title="Programming Languages" description="Select all languages you are comfortable with.">
        <ChipGroup
          options={LANGUAGES}
          selected={form.programming_languages}
          onChange={set("programming_languages")}
        />
      </Section>

      {/* ── Section 3: Frameworks & Tools ── */}
      <Section title="Frameworks & Libraries" description="Select frameworks and libraries you have worked with.">
        <ChipGroup options={FRAMEWORKS} selected={form.frameworks} onChange={set("frameworks")} />
        <Box mt={2.5}>
          <ChipGroup label="Databases" options={DATABASES} selected={form.databases} onChange={set("databases")} />
        </Box>
        <Box mt={2.5}>
          <ChipGroup label="Cloud & DevOps" options={CLOUD} selected={form.cloud_skills} onChange={set("cloud_skills")} />
        </Box>
        <Box mt={2.5}>
          <ChipGroup label="AI & ML Skills" options={AI_SKILLS} selected={form.ai_skills} onChange={set("ai_skills")} />
        </Box>
      </Section>

      {/* ── Section 4: Interests & Preferences ── */}
      <Section title="Interests & Preferences" description="Help us understand your interests for better recommendations.">
        <ChipGroup
          label="Domains I'm interested in"
          hint="Select the areas you want to build projects in"
          options={DOMAINS}
          selected={form.interested_domains}
          onChange={set("interested_domains")}
        />
        <Box mt={2.5}>
          <ChipGroup
            label="Preferred Technologies"
            options={TECHS}
            selected={form.preferred_technologies}
            onChange={set("preferred_technologies")}
          />
        </Box>
        <Box mt={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel>Hackathon Theme Focus</InputLabel>
            <Select
              name="hackathon_theme"
              value={form.hackathon_theme}
              label="Hackathon Theme Focus"
              onChange={setField}
            >
              <MenuItem value=""><em>None selected</em></MenuItem>
              {THEMES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Section>

      {/* Save button */}
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving} size="large">
          {saving ? "Saving…" : "Save Profile"}
        </Button>
      </Box>
    </AppShell>
  );
}
