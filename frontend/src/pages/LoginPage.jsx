import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box, Paper, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, Link,
} from "@mui/material";
import Visibility    from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function friendlyError(raw = "") {
  const msg = (raw || "").toLowerCase();
  if (msg.includes("invalid") || msg.includes("incorrect") || msg.includes("not found") || msg.includes("wrong"))
    return "Incorrect email or password.";
  if (msg.includes("network") || msg.includes("connect") || msg.includes("timeout"))
    return "Cannot reach the server. Check your connection.";
  return "Sign in failed. Please try again.";
}

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw]   = useState(false);
  const [error,  setError]    = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError("");
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(friendlyError(result.message));
    }
  };

  return (
    <Box className="auth-page">
      {/* Decorative blob */}
      <Box sx={{ position: "fixed", top: -120, right: -80, width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <Box sx={{ position: "fixed", bottom: -100, left: -80, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,169,154,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 4.5 },
          borderRadius: "20px",
          border: "1.5px solid rgba(26,169,154,0.2)",
          boxShadow: "0 8px 40px rgba(26,169,154,0.12)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.25} mb={3.5}>
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
        <Typography variant="h2" mb={0.5} color="#12342F">Welcome back 👋</Typography>
        <Typography variant="body2" color="text.secondary" mb={3.5}>
          Sign in to your account to continue exploring projects.
        </Typography>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            autoComplete="email"
            autoFocus
            sx={{ mb: 2 }}
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type={showPw ? "text" : "password"}
            fullWidth
            autoComplete="current-password"
            sx={{ mb: 3 }}
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
              background: "linear-gradient(135deg, #1AA99A 0%, #12857A 100%)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              "&:hover": { opacity: 0.9, transform: "translateY(-1px)", boxShadow: "0 6px 20px rgba(26,169,154,0.4)" },
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Don&apos;t have an account?{" "}
          <Link
            component="button"
            type="button"
            onClick={() => navigate("/register")}
            sx={{ color: "#1AA99A", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Create one free
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
