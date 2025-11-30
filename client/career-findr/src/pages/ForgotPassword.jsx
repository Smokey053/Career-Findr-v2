import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  alpha,
  useTheme,
  Fade,
  Zoom,
  CircularProgress,
} from "@mui/material";
import {
  MailOutline,
  ArrowBackIosNew,
  LockResetOutlined,
  CheckCircleOutline,
  SendRounded,
  RefreshRounded,
  RocketLaunch,
} from "@mui/icons-material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";

export default function ForgotPassword() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Password reset error:", error);

      // Handle specific Firebase errors
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email address");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later");
          break;
        default:
          setError("Failed to send reset email. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
        py: 4,
        px: 2,
        // Animated gradient background
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 20%, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, ${alpha(
            theme.palette.secondary.main,
            0.08
          )} 0%, transparent 40%)`,
          animation: "gradientShift 15s ease-in-out infinite alternate",
        },
        "@keyframes gradientShift": {
          "0%": { opacity: 0.7 },
          "100%": { opacity: 1 },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: "24px",
              border: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.1),
              boxShadow: `0 25px 50px -12px ${alpha(
                theme.palette.common.black,
                0.15
              )}`,
              background: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header with icon */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Zoom in timeout={800}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "20px",
                    mb: 3,
                    background: success
                      ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                      : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: success
                      ? `0 10px 30px -8px ${alpha(
                          theme.palette.success.main,
                          0.5
                        )}`
                      : `0 10px 30px -8px ${alpha(
                          theme.palette.primary.main,
                          0.5
                        )}`,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: loading
                      ? "pulse 1.5s ease-in-out infinite"
                      : "none",
                    "@keyframes pulse": {
                      "0%, 100%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.05)" },
                    },
                  }}
                >
                  {success ? (
                    <CheckCircleOutline sx={{ fontSize: 40, color: "white" }} />
                  ) : (
                    <LockResetOutlined sx={{ fontSize: 40, color: "white" }} />
                  )}
                </Box>
              </Zoom>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{
                  background: success
                    ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  transition: "all 0.3s ease",
                }}
              >
                {success ? "Check Your Email" : "Reset Password"}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 320, mx: "auto", lineHeight: 1.7 }}
              >
                {success
                  ? "We've sent password reset instructions to your email address."
                  : "No worries! Enter your email and we'll send you reset instructions."}
              </Typography>
            </Box>

            {/* Alerts */}
            <Fade in={!!error} timeout={300}>
              <Box>
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: "14px",
                      alignItems: "center",
                    }}
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                )}
              </Box>
            </Fade>

            <Fade in={success} timeout={300}>
              <Box>
                {success && (
                  <Alert
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: "14px",
                      alignItems: "center",
                    }}
                    icon={<CheckCircleOutline />}
                  >
                    Password reset email sent! Check your inbox and follow the
                    instructions to reset your password.
                  </Alert>
                )}
              </Box>
            </Fade>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                placeholder="Enter your email address"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.grey[100], 0.8),
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutline
                        sx={{
                          color: loading ? "text.disabled" : "primary.main",
                          transition: "color 0.3s ease",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || success}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendRounded />
                  )
                }
                sx={{
                  py: 1.75,
                  borderRadius: "14px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 8px 25px -8px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 12px 30px -8px ${alpha(
                      theme.palette.primary.main,
                      0.5
                    )}`,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  },
                  "&.Mui-disabled": {
                    background: alpha(theme.palette.grey[400], 0.5),
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            {/* Action buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 3,
                pt: 3,
                borderTop: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
              }}
            >
              <Button
                startIcon={<ArrowBackIosNew sx={{ fontSize: 16 }} />}
                component={Link}
                to="/login"
                disabled={loading}
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Back to Login
              </Button>

              {success && (
                <Fade in timeout={400}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshRounded />}
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    sx={{
                      borderRadius: "12px",
                      borderWidth: "2px",
                      "&:hover": {
                        borderWidth: "2px",
                      },
                    }}
                  >
                    Send Another
                  </Button>
                </Fade>
              )}
            </Box>

            {/* Sign up link */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                textAlign: "center",
                borderTop: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Box
                  component={Link}
                  to="/signup"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.dark",
                    },
                  }}
                >
                  Sign up for free
                </Box>
              </Typography>
            </Box>

            {/* Brand footer */}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                opacity: 0.7,
              }}
            >
              <RocketLaunch sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography
                variant="body2"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600,
                }}
              >
                Career Findr
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
