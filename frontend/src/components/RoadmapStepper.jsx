import { Box, Typography, Chip } from "@mui/material";
import CheckCircleIcon    from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

export default function RoadmapStepper({ roadmap = [] }) {
  if (!roadmap.length) return null;

  return (
    <Box>
      {roadmap.map((step, i) => {
        const isLast = i === roadmap.length - 1;
        return (
          <Box key={step.step} display="flex" gap={2} sx={{ position: "relative" }}>
            {/* Timeline indicator */}
            <Box display="flex" flexDirection="column" alignItems="center" flexShrink={0}>
              <Box
                sx={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  background: "#EEF2FF",
                  border: "2px solid #C7D2FE",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#4F46E5",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                {i + 1}
              </Box>
              {!isLast && (
                <Box sx={{ width: 1, flex: 1, background: "#E2E8F0", minHeight: 24, my: 0.5 }} />
              )}
            </Box>

            {/* Step content */}
            <Box pb={isLast ? 0 : 2.5} flex={1} minWidth={0} pt={0.25}>
              <Typography variant="subtitle2" fontWeight={600} mb={0.25}>{step.skill}</Typography>
              <Typography variant="body2" color="text.secondary" mb={0.75}>{step.description}</Typography>
              <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                {step.estimated_time && (
                  <Typography variant="caption" color="text.secondary">⏱ {step.estimated_time}</Typography>
                )}
                {step.resources?.slice(0, 2).map((url, ri) => (
                  <Chip
                    key={ri}
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    label={`Resource ${ri + 1}`}
                    size="small"
                    clickable
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", height: 22 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
