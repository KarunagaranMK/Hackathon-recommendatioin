import {
  Box, Typography, Paper, Chip, Button, LinearProgress,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon       from "@mui/icons-material/Bookmark";
import EastIcon           from "@mui/icons-material/East";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useNavigate }    from "react-router-dom";

const DIFF_COLORS = {
  Beginner:     { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  Intermediate: { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  Advanced:     { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" },
};

export default function ProjectCard({ project, rank, isFavorited, onFavorite }) {
  const navigate = useNavigate();
  const {
    project_id, title, description, domain, difficulty,
    technologies = [], estimated_duration,
    similarity_score, skill_gap,
  } = project;

  const diffStyle  = DIFF_COLORS[difficulty] || DIFF_COLORS.Intermediate;
  const matchScore = similarity_score != null ? Math.round(similarity_score) : null;
  const skillMatch = skill_gap?.match_percentage != null ? Math.round(skill_gap.match_percentage) : null;

  return (
    <Paper
      sx={{
        p: 2.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Tags row */}
      <Box display="flex" gap={0.75} mb={1.5} flexWrap="wrap" alignItems="center">
        <Chip
          label={domain}
          size="small"
          sx={{ background: "#EEF2FF", color: "#4F46E5", fontWeight: 600 }}
        />
        <Chip
          label={difficulty}
          size="small"
          sx={{
            background: diffStyle.bg,
            color: diffStyle.color,
            border: `1px solid ${diffStyle.border}`,
            fontWeight: 600,
          }}
        />
        {matchScore != null && (
          <Chip
            label={`${matchScore}% match`}
            size="small"
            sx={{ background: "#F0FDF4", color: "#166534", fontWeight: 600, ml: "auto" }}
          />
        )}
      </Box>

      {/* Title */}
      <Typography
        variant="subtitle2"
        fontWeight={700}
        mb={0.75}
        sx={{
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          lineHeight: 1.4,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          mb={1.5}
          sx={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      )}

      {/* Skill match bar */}
      {skillMatch != null && (
        <Box mb={1.5}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" color="text.secondary">Skill Match</Typography>
            <Typography variant="caption" fontWeight={600} color="#4F46E5">{skillMatch}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={skillMatch} sx={{ height: 5 }} />
        </Box>
      )}

      {/* Technologies */}
      {technologies.length > 0 && (
        <Box display="flex" gap={0.5} flexWrap="wrap" mb={1.5}>
          {technologies.slice(0, 4).map((t) => (
            <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 22 }} />
          ))}
          {technologies.length > 4 && (
            <Chip
              label={`+${technologies.length - 4}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.7rem", height: 22, color: "text.secondary" }}
            />
          )}
        </Box>
      )}

      {/* Duration */}
      {estimated_duration && (
        <Box display="flex" alignItems="center" gap={0.5} mb={2} mt="auto">
          <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">{estimated_duration}</Typography>
        </Box>
      )}

      {/* Actions */}
      <Box display="flex" gap={1} mt={!estimated_duration ? "auto" : 0}>
        <Button
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
          onClick={() => navigate(`/project/${project_id}`)}
          endIcon={<EastIcon sx={{ fontSize: "14px !important" }} />}
        >
          View
        </Button>
        <Button
          variant={isFavorited ? "contained" : "outlined"}
          size="small"
          sx={{ minWidth: 40, px: 1 }}
          onClick={() => onFavorite?.(project_id)}
          aria-label={isFavorited ? "Remove from saved" : "Save project"}
        >
          {isFavorited ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
        </Button>
      </Box>
    </Paper>
  );
}
