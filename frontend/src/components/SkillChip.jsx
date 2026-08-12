import { Chip, Tooltip } from "@mui/material";

const SKILL_COLORS = {
  python: { bg: "#3B76EB", label: "Python" },
  javascript: { bg: "#F0B429", label: "JavaScript" },
  react: { bg: "#61DAFB", label: "React", text: "#000" },
  fastapi: { bg: "#059669", label: "FastAPI" },
  mongodb: { bg: "#4DB33D", label: "MongoDB" },
  tensorflow: { bg: "#FF8C00", label: "TensorFlow" },
  pytorch: { bg: "#EE4C2C", label: "PyTorch" },
  docker: { bg: "#2496ED", label: "Docker" },
  aws: { bg: "#FF9900", label: "AWS" },
  "machine learning": { bg: "#8B5CF6", label: "Machine Learning" },
  "deep learning": { bg: "#7C3AED", label: "Deep Learning" },
  nlp: { bg: "#06B6D4", label: "NLP" },
  blockchain: { bg: "#F59E0B", label: "Blockchain" },
  solidity: { bg: "#363636", label: "Solidity" },
  iot: { bg: "#10B981", label: "IoT" },
  "computer vision": { bg: "#EC4899", label: "Computer Vision" },
};

export default function SkillChip({ skill, matched = false, missing = false, size = "small", ...props }) {
  const key = skill.toLowerCase();
  const config = SKILL_COLORS[key];

  const chipColor = missing
    ? "#FF4D6D"
    : matched
    ? "#00D4AA"
    : config?.bg || "#6C63FF";

  const textColor = config?.text || "#ffffff";

  return (
    <Tooltip title={matched ? "You have this skill" : missing ? "Missing skill — learn this" : ""} arrow>
      <Chip
        label={config?.label || skill}
        size={size}
        sx={{
          backgroundColor: `${chipColor}22`,
          border: `1px solid ${chipColor}66`,
          color: textColor === "#000" ? "#000" : "#F1F5F9",
          fontWeight: 500,
          fontSize: "0.75rem",
          cursor: "default",
          transition: "all 0.2s",
          "&:hover": {
            backgroundColor: `${chipColor}44`,
            transform: "translateY(-1px)",
          },
          ...(missing && {
            borderStyle: "dashed",
          }),
        }}
        {...props}
      />
    </Tooltip>
  );
}
