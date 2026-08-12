import { Box, Typography, Chip, Grid, LinearProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function SkillGapChart({ skillGap }) {
  if (!skillGap) return null;

  const {
    matched_skills = [],
    missing_skills = [],
    match_percentage = 0,
    estimated_learning_time,
  } = skillGap;

  const pct = Math.round(match_percentage);

  return (
    <Box>
      {/* Match percentage */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2">Skill Match</Typography>
        <Typography variant="subtitle2" color="#4F46E5" fontWeight={700}>{pct}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={pct} sx={{ mb: 2 }} />

      <Grid container spacing={2.5}>
        {/* Your skills */}
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              p: 2,
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: "8px",
            }}
          >
            <Box display="flex" alignItems="center" gap={0.75} mb={1.5}>
              <CheckIcon sx={{ fontSize: 16, color: "#059669" }} />
              <Typography variant="subtitle2" fontWeight={600} color="#166534">
                Your Skills ({matched_skills.length})
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={0.75}>
              {matched_skills.length === 0 ? (
                <Typography variant="caption" color="text.secondary">None matched</Typography>
              ) : (
                matched_skills.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    size="small"
                    sx={{ background: "#DCFCE7", color: "#166534", fontWeight: 500, border: "1px solid #BBF7D0" }}
                  />
                ))
              )}
            </Box>
          </Box>
        </Grid>

        {/* Missing skills */}
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              p: 2,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
            }}
          >
            <Box display="flex" alignItems="center" gap={0.75} mb={1.5}>
              <CloseIcon sx={{ fontSize: 16, color: "#DC2626" }} />
              <Typography variant="subtitle2" fontWeight={600} color="#991B1B">
                Skills to Learn ({missing_skills.length})
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={0.75}>
              {missing_skills.length === 0 ? (
                <Typography variant="caption" color="#166534" fontWeight={600}>
                  ✓ You have all required skills!
                </Typography>
              ) : (
                missing_skills.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    size="small"
                    sx={{ background: "#FEE2E2", color: "#991B1B", fontWeight: 500, border: "1px solid #FECACA" }}
                  />
                ))
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {estimated_learning_time && missing_skills.length > 0 && (
        <Box mt={2} sx={{ p: 1.5, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px" }}>
          <Typography variant="caption" color="#92400E" fontWeight={600}>
            ⏱ Estimated learning time for missing skills: {estimated_learning_time}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
