import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  alpha,
  useTheme,
  Fade,
  Zoom,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LoginRounded,
  RocketLaunch,
  Google as GoogleIcon,
  MailOutline,
  LockOutlined,
  ArrowForwardRounded,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setError("");
    try {
      const response = await login(data);

      // Redirect based on role
      if (response.user.role === "student") {
        navigate("/dashboard/student");
      } else if (response.user.role === "institute") {
        navigate("/dashboard/institute");
      } else if (response.user.role === "company") {
        navigate("/dashboard/company");
      } else if (response.user.role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const response = await signInWithGoogle();

      // Redirect based on role
      if (response.user.role === "student") {
        navigate("/dashboard/student");
      } else if (response.user.role === "institute") {
        navigate("/dashboard/institute");
      } else if (response.user.role === "company") {
        navigate("/dashboard/company");
      } else if (response.user.role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
        p: { xs: 2, sm: 3, md: 4 },
        // Animated gradient background
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 10% 20%, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, ${alpha(
            theme.palette.secondary.main,
            0.1
          )} 0%, transparent 50%)`,
          animation: "float 20s ease-in-out infinite",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: "120%",
          height: "80%",
          background: `radial-gradient(ellipse, ${alpha(
            theme.palette.primary.light,
            0.05
          )} 0%, transparent 70%)`,
          animation: "float 15s ease-in-out infinite reverse",
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{ width: "100%", position: "relative", zIndex: 1 }}
      >
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
              mx: "auto",
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Zoom in timeout={800}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 72,
                    height: 72,
                    borderRadius: "18px",
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: `0 10px 30px -8px ${alpha(
                      theme.palette.primary.main,
                      0.5
                    )}`,
                  }}
                >
                  <RocketLaunch sx={{ fontSize: 36, color: "white" }} />
                </Box>
              </Zoom>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your Career Findr account
              </Typography>
            </Box>

            {/* Error Alert */}
            <Fade in={!!error} timeout={300}>
              <Box>
                {error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: "14px" }}
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                )}
              </Box>
            </Fade>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                autoFocus
                sx={{
                  mb: 2.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
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
                      <MailOutline sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
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
                      <LockOutlined sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            color: "primary.main",
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.08
                            ),
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box textAlign="right" mb={3}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.dark",
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <ArrowForwardRounded />
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
                }}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>

              {/* Divider */}
              <Box sx={{ my: 3, position: "relative" }}>
                <Divider>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      px: 2,
                      backgroundColor: "background.paper",
                      fontWeight: 500,
                    }}
                  >
                    OR
                  </Typography>
                </Divider>
              </Box>

              {/* Google Sign In */}
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleSignIn}
                startIcon={
                  <Box
                    component="img"
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    sx={{ width: 20, height: 20 }}
                  />
                }
                sx={{
                  py: 1.5,
                  borderRadius: "14px",
                  borderWidth: "2px",
                  borderColor: alpha(theme.palette.grey[300], 0.8),
                  color: "text.primary",
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderWidth: "2px",
                    borderColor: theme.palette.grey[400],
                    backgroundColor: alpha(theme.palette.grey[100], 0.8),
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Continue with Google
              </Button>
            </form>

            {/* Footer Links */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 2 }}
              >
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      color: "primary.dark",
                    },
                  }}
                >
                  Sign up for free
                </Link>
              </Typography>
              <Typography variant="body2" textAlign="center">
                <Link
                  component={RouterLink}
                  to="/"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  ← Back to Home
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
