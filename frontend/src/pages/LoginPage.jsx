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
        <Typography variant="h2" mb={0.5}>Welcome back</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to your account to continue.
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
            sx={{ mb: 2.5 }}
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
            sx={{ mb: 2.5, py: 1.25 }}
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
            sx={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Create one
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
