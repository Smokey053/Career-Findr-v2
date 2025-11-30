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
  Divider,
  alpha,
  useTheme,
  Fade,
  Zoom,
  CircularProgress,
  Card,
  CardActionArea,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAddRounded,
  SchoolRounded,
  BusinessRounded,
  WorkRounded,
  RocketLaunch,
  Google as GoogleIcon,
  MailOutline,
  LockOutlined,
  PersonOutline,
  PhoneOutlined,
  ArrowForwardRounded,
  ArrowBackRounded,
  CheckCircleOutline,
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
  organizationName: yup.string().when('$role', {
    is: (role) => role === 'company' || role === 'institute',
    then: (schema) => schema.required('Organization name is required'),
    otherwise: (schema) => schema,
  }),
});

const roleOptions = [
  {
    value: "student",
    label: "Student",
    icon: SchoolRounded,
    description: "Apply to institutions and search for jobs",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
  },
  {
    value: "institute",
    label: "Institution",
    icon: BusinessRounded,
    description: "Post courses and manage applications",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
  },
  {
    value: "company",
    label: "Company",
    icon: WorkRounded,
    description: "Post jobs and find candidates",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const theme = useTheme();
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
    context: { role },
  });

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
  };

  const handleNext = () => {
    setActiveStep(1);
  };

  const onSubmit = async (data) => {
    setError("");
    try {
      const profileData = {
        name: data.name,
        phone: data.phone || "",
      };
      
      // Add organization name for company/institute
      if (role === 'company' || role === 'institute') {
        profileData.organizationName = data.organizationName;
        if (role === 'company') {
          profileData.companyName = data.organizationName;
        } else {
          profileData.institutionName = data.organizationName;
          profileData.instituteName = data.organizationName;
        }
      }
      
      const userData = {
        email: data.email,
        password: data.password,
        role,
        profileData,
      };

      const response = await registerUser(userData);

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
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      const response = await signInWithGoogle(role);

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
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Google sign-up failed. Please try again.");
    }
  };

  const steps = ["Select Role", "Create Account"];
  const selectedRole = roleOptions.find((r) => r.value === role);

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
          background: `radial-gradient(circle at 0% 50%, ${alpha(
            selectedRole?.color || theme.palette.primary.main,
            0.1
          )} 0%, transparent 50%),
          radial-gradient(circle at 100% 50%, ${alpha(
            theme.palette.secondary.main,
            0.1
          )} 0%, transparent 50%)`,
          transition: "all 0.5s ease",
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      }}
    >
      <Container
        maxWidth="md"
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
                    background:
                      selectedRole?.gradient ||
                      `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: `0 10px 30px -8px ${alpha(
                      selectedRole?.color || theme.palette.primary.main,
                      0.5
                    )}`,
                    transition: "all 0.4s ease",
                  }}
                >
                  <RocketLaunch sx={{ fontSize: 36, color: "white" }} />
                </Box>
              </Zoom>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" } }}
              >
                Create Your Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join Career Findr to start your journey
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: 4,
                "& .MuiStepConnector-line": {
                  borderColor: alpha(theme.palette.divider, 0.2),
                  borderTopWidth: 2,
                  borderRadius: 1,
                },
                "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                  borderColor:
                    selectedRole?.color || theme.palette.primary.main,
                },
                "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
                  {
                    borderColor: theme.palette.success.main,
                  },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": {
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        fontWeight: 500,
                        mt: 1,
                      },
                      "& .MuiStepIcon-root": {
                        color: alpha(theme.palette.grey[400], 0.5),
                        "&.Mui-active": {
                          color:
                            selectedRole?.color || theme.palette.primary.main,
                        },
                        "&.Mui-completed": {
                          color: theme.palette.success.main,
                        },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

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

            {/* Step 1: Role Selection */}
            {activeStep === 0 ? (
              <Fade in timeout={400}>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    I am a...
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Select your role to get started with the right experience
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = role === option.value;
                      return (
                        <Card
                          key={option.value}
                          elevation={0}
                          sx={{
                            borderRadius: "16px",
                            border: "2px solid",
                            borderColor: isSelected
                              ? option.color
                              : alpha(theme.palette.grey[300], 0.6),
                            backgroundColor: isSelected
                              ? alpha(option.color, 0.05)
                              : "transparent",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: isSelected ? "scale(1.02)" : "scale(1)",
                            "&:hover": {
                              borderColor: option.color,
                              backgroundColor: alpha(option.color, 0.05),
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          <CardActionArea
                            onClick={() => handleRoleSelect(option.value)}
                            sx={{
                              p: 3,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 2,
                                background: isSelected
                                  ? option.gradient
                                  : alpha(option.color, 0.1),
                                transition: "all 0.3s ease",
                              }}
                            >
                              <Icon
                                sx={{
                                  fontSize: 28,
                                  color: isSelected ? "white" : option.color,
                                  transition: "all 0.3s ease",
                                }}
                              />
                            </Box>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              sx={{ mb: 0.5 }}
                            >
                              {option.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ lineHeight: 1.4 }}
                            >
                              {option.description}
                            </Typography>
                            {isSelected && (
                              <CheckCircleOutline
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  fontSize: 22,
                                  color: option.color,
                                }}
                              />
                            )}
                          </CardActionArea>
                        </Card>
                      );
                    })}
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    endIcon={<ArrowForwardRounded />}
                    sx={{
                      py: 1.75,
                      borderRadius: "14px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      background: selectedRole?.gradient,
                      boxShadow: `0 8px 25px -8px ${alpha(
                        selectedRole?.color || theme.palette.primary.main,
                        0.4
                      )}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: `0 12px 30px -8px ${alpha(
                          selectedRole?.color || theme.palette.primary.main,
                          0.5
                        )}`,
                      },
                    }}
                  >
                    Continue as {selectedRole?.label}
                  </Button>
                </Box>
              </Fade>
            ) : (
              /* Step 2: Account Details */
              <Fade in timeout={400}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
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
                          <PersonOutline
                            sx={{
                              color: selectedRole?.color || "primary.main",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Organization Name field for Company/Institute */}
                  {(role === "company" || role === "institute") && (
                    <TextField
                      label={role === "company" ? "Company Name *" : "Institution Name *"}
                      fullWidth
                      {...register("organizationName")}
                      error={!!errors.organizationName}
                      helperText={errors.organizationName?.message}
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
                            {role === "company" ? (
                              <WorkRounded sx={{ color: selectedRole?.color || "primary.main" }} />
                            ) : (
                              <BusinessRounded sx={{ color: selectedRole?.color || "primary.main" }} />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}

                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
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
                          <MailOutline
                            sx={{
                              color: selectedRole?.color || "primary.main",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Phone Number (Optional)"
                    fullWidth
                    {...register("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
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
                          <PhoneOutlined
                            sx={{
                              color: selectedRole?.color || "primary.main",
                            }}
                          />
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
                          <LockOutlined
                            sx={{
                              color: selectedRole?.color || "primary.main",
                            }}
                          />
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
                                color: selectedRole?.color || "primary.main",
                                backgroundColor: alpha(
                                  selectedRole?.color ||
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

                  <TextField
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{
                      mb: 3,
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
                          <LockOutlined
                            sx={{
                              color: selectedRole?.color || "primary.main",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box display="flex" gap={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      onClick={() => setActiveStep(0)}
                      startIcon={<ArrowBackRounded />}
                      sx={{
                        py: 1.5,
                        borderRadius: "14px",
                        borderWidth: "2px",
                        borderColor: alpha(theme.palette.grey[300], 0.8),
                        fontWeight: 600,
                        "&:hover": {
                          borderWidth: "2px",
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
                      endIcon={
                        isSubmitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <PersonAddRounded />
                        )
                      }
                      sx={{
                        py: 1.5,
                        borderRadius: "14px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        background: selectedRole?.gradient,
                        boxShadow: `0 8px 25px -8px ${alpha(
                          selectedRole?.color || theme.palette.primary.main,
                          0.4
                        )}`,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: `0 12px 30px -8px ${alpha(
                            selectedRole?.color || theme.palette.primary.main,
                            0.5
                          )}`,
                        },
                      }}
                    >
                      {isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                  </Box>

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

                  {/* Google Sign Up */}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleGoogleSignUp}
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
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.8
                      ),
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
              </Fade>
            )}

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
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: selectedRole?.color || "primary.main",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                >
                  Sign in
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
                      color: selectedRole?.color || "primary.main",
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
