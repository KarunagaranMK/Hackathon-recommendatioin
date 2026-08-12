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
  if (s <= 2) return { label: "Fair",   color: "#F5A623", pct: 50 };
  if (s <= 3) return { label: "Good",   color: "#0891B2", pct: 75 };
  return        { label: "Strong", color: "#1AA99A", pct: 100 };
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
      {/* Decorative blobs */}
      <Box sx={{ position: "fixed", top: -100, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,169,154,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <Box sx={{ position: "fixed", bottom: -80, right: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, sm: 4.5 },
          borderRadius: "20px",
          border: "1.5px solid rgba(26,169,154,0.2)",
          boxShadow: "0 8px 40px rgba(26,169,154,0.12)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.25} mb={3}>
          <Box
            sx={{
              width: 38, height: 38, borderRadius: "10px",
              background: "linear-gradient(135deg, #1AA99A 0%, #25C4B3 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(26,169,154,0.3)",
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography
            fontWeight={700}
            fontSize="1rem"
            sx={{
              background: "linear-gradient(135deg, #12857A 0%, #1AA99A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            HackMatch AI
          </Typography>
        </Box>

        {/* Heading */}
        <Typography variant="h2" mb={0.5} color="#12342F">Create an account 🚀</Typography>
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
                <Typography variant="caption" fontWeight={700} sx={{ color: strength.color }}>
                  {strength.label}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={strength.pct}
                sx={{
                  height: 5,
                  borderRadius: 4,
                  "& .MuiLinearProgress-bar": { background: strength.color, borderRadius: 4 },
                }}
              />
            </Box>
          )}

          <TextField
            label="Confirm password"
            type="password"
            fullWidth
            autoComplete="new-password"
            sx={{ mb: 3 }}
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
            sx={{
              mb: 2.5,
              py: 1.5,
              borderRadius: "50px",
              background: "linear-gradient(135deg, #F5A623 0%, #D4891A 100%)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "#fff",
              "&:hover": { opacity: 0.9, transform: "translateY(-1px)", boxShadow: "0 6px 20px rgba(245,166,35,0.4)" },
            }}
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
            sx={{ color: "#1AA99A", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
