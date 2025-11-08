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
  Stepper,
  Step,
  StepLabel,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  School,
  Business,
  Work,
  RocketLaunch,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  name: yup.string().required("Name is required"),
  phone: yup.string(),
});

const roleOptions = [
  {
    value: "student",
    label: "Student",
    icon: School,
    description: "Apply to institutions and search for jobs",
  },
  {
    value: "institute",
    label: "Institution",
    icon: Business,
    description: "Post courses and manage applications",
  },
  {
    value: "company",
    label: "Company",
    icon: Work,
    description: "Post jobs and find candidates",
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const { register: registerUser, signInWithGoogle } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRoleChange = (event, newRole) => {
    if (newRole) {
      setRole(newRole);
    }
  };

  const handleNext = () => {
    setActiveStep(1);
  };

  const onSubmit = async (data) => {
    setError("");
    try {
      const userData = {
        email: data.email,
        password: data.password,
        role,
        profileData: {
          name: data.name,
          phone: data.phone || "",
        },
      };

      await registerUser(userData);

      // Show success message and redirect to verification page
      navigate("/verify-email", {
        state: {
          email: data.email,
          message: "Please check your email to verify your account",
        },
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      const response = await signInWithGoogle(role);

      // Redirect based on role
      if (response.isNewUser) {
        navigate("/verify-email", {
          state: {
            email: response.user.email,
            message: "Account created successfully!",
          },
        });
      } else {
        // Existing user, go to dashboard
        if (response.user.role === "student") {
          navigate("/dashboard/student");
        } else if (response.user.role === "institute") {
          navigate("/dashboard/institute");
        } else if (response.user.role === "company") {
          navigate("/dashboard/company");
        } else if (response.user.role === "admin") {
          navigate("/dashboard/admin");
        }
      }
    } catch (err) {
      setError(err.message || "Google sign-up failed. Please try again.");
    }
  };

  const steps = ["Select Role", "Create Account"];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: { xs: 2, sm: 3, md: 4 },
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="md" sx={{ width: "100%" }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
            mx: "auto",
          }}
        >
          <Box textAlign="center" mb={3}>
            <RocketLaunch
              sx={{
                fontSize: 48,
                color: "primary.main",
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" } }}
            >
              Create Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join Career Findr to start your journey
            </Typography>
          </Box>

          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              "& .MuiStepLabel-label": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                I am a...
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Select your role to get started
              </Typography>

              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={handleRoleChange}
                orientation="vertical"
                fullWidth
                sx={{ mb: 4 }}
              >
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <ToggleButton
                      key={option.value}
                      value={option.value}
                      sx={{
                        py: 2,
                        textAlign: "left",
                        justifyContent: "flex-start",
                        textTransform: "none",
                      }}
                    >
                      <Icon sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {option.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleNext}
              >
                Continue
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                autoFocus
              />

              <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Phone Number (Optional)"
                fullWidth
                margin="normal"
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />

              <Box display="flex" gap={2} mt={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => setActiveStep(0)}
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={<PersonAdd />}
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleSignUp}
                startIcon={<GoogleIcon />}
                sx={{
                  mb: 2,
                  py: 1.5,
                  borderColor: "divider",
                  color: "text.primary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                Continue with Google
              </Button>

              <Divider sx={{ my: 3 }} />

              <Box textAlign="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.875rem", sm: "0.9rem" } }}
                >
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    color="primary"
                    fontWeight={500}
                  >
                    Sign in
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, fontSize: { xs: "0.875rem", sm: "0.9rem" } }}
                >
                  <Link
                    component={RouterLink}
                    to="/"
                    color="primary"
                    fontWeight={500}
                  >
                    ← Back to Home
                  </Link>
                </Typography>
              </Box>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
