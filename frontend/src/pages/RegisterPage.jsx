import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box, Paper, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, Link, LinearProgress,
} from "@mui/material";
import Visibility    from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  name:            z.string().min(2, "Name must be at least 2 characters"),
  email:           z.string().email("Enter a valid email address"),
  password:        z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function passwordStrength(pw = "") {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 6)  s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  if (s <= 1) return { label: "Weak",   color: "#DC2626", pct: 25 };
  if (s <= 2) return { label: "Fair",   color: "#D97706", pct: 50 };
  if (s <= 3) return { label: "Good",   color: "#0891B2", pct: 75 };
  return        { label: "Strong", color: "#059669", pct: 100 };
}

function friendlyError(raw = "") {
  const msg = (raw || "").toLowerCase();
  if (msg.includes("already") || msg.includes("exists") || msg.includes("duplicate"))
    return "An account with this email already exists.";
  if (msg.includes("network") || msg.includes("connect"))
    return "Cannot reach the server. Check your connection.";
  return "Registration failed. Please try again.";
}

export default function RegisterPage() {
  const { register: authRegister, loading } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [error,  setError]  = useState("");

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
  });

  const pwValue  = watch("password", "");
  const strength = passwordStrength(pwValue);

  const onSubmit = async (data) => {
    setError("");
    const result = await authRegister(data.name, data.email, data.password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(friendlyError(result.message));
    }
  };

  return (
    <Box className="auth-page">
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: "8px",
              background: "#4F46E5",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Typography fontWeight={700} fontSize="0.9375rem" color="text.primary">
            HackMatch AI
          </Typography>
        </Box>

        {/* Heading */}
        <Typography variant="h2" mb={0.5}>Create an account</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Start discovering hackathon projects tailored to your skills.
        </Typography>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Full name"
            fullWidth
            autoComplete="name"
            autoFocus
            sx={{ mb: 2 }}
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Email address"
            type="email"
            fullWidth
            autoComplete="email"
            sx={{ mb: 2 }}
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type={showPw ? "text" : "password"}
            fullWidth
            autoComplete="new-password"
            sx={{ mb: pwValue ? 1 : 2 }}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPw(!showPw)}
                    edge="end"
                    size="small"
                    aria-label="Toggle password visibility"
                    tabIndex={-1}
                  >
                    {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password strength bar */}
          {pwValue && strength && (
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={0.75}>
                <Typography variant="caption" color="text.secondary">Password strength</Typography>
                <Typography variant="caption" fontWeight={600} sx={{ color: strength.color }}>
                  {strength.label}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={strength.pct}
                sx={{
                  height: 5,
                  "& .MuiLinearProgress-bar": { background: strength.color },
                }}
              />
            </Box>
          )}

          <TextField
            label="Confirm password"
            type="password"
            fullWidth
            autoComplete="new-password"
            sx={{ mb: 2.5 }}
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mb: 2.5, py: 1.25 }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Already have an account?{" "}
          <Link
            component="button"
            type="button"
            onClick={() => navigate("/login")}
            sx={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
