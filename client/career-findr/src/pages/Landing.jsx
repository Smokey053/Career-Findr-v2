import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  Paper,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Slide,
} from "@mui/material";
import {
  School,
  Work,
  Business,
  TrendingUp,
  CheckCircle,
  ArrowForward,
  RocketLaunch,
} from "@mui/icons-material";

const features = [
  {
    icon: School,
    title: "Find Institutions",
    description:
      "Browse and apply to top educational institutions with ease. Access detailed course information and requirements.",
  },
  {
    icon: Work,
    title: "Career Opportunities",
    description:
      "Explore job opportunities matched to your qualifications. Connect with leading companies in your field.",
  },
  {
    icon: Business,
    title: "For Institutions & Companies",
    description:
      "Post courses and jobs, manage applications, and find the best talent efficiently.",
  },
];

const stats = [
  { value: "500+", label: "Institutions" },
  { value: "10,000+", label: "Students" },
  { value: "5,000+", label: "Job Placements" },
  { value: "200+", label: "Companies" },
];

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Navigation */}
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          width: "100%",
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(10px)",
          backgroundColor: alpha(theme.palette.background.default, 0.8),
        }}
      >
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <RocketLaunch sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Career Findr
            </Typography>
          </Box>
          <Button
            onClick={() => navigate("/login")}
            sx={{
              mr: 1,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/signup")}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          py: { xs: 6, sm: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 50%, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, transparent 50%)`,
            animation: "pulse 8s ease-in-out infinite",
          },
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.5 },
            "50%": { opacity: 1 },
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box
                  sx={{
                    textAlign: { xs: "center", md: "left" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Typography
                    variant="h1"
                    gutterBottom
                    sx={{
                      fontSize: {
                        xs: "2rem",
                        sm: "2.5rem",
                        md: "3rem",
                        lg: "3.5rem",
                      },
                    }}
                  >
                    Your Gateway to
                    <br />
                    <Box
                      component="span"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Education & Career
                    </Box>
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    paragraph
                    sx={{
                      mb: 4,
                      maxWidth: 540,
                      fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
                    }}
                  >
                    Connect students with institutions and employers. Streamline
                    applications, admissions, and job placements all in one
                    platform.
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ width: "100%", maxWidth: 520 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate("/signup")}
                      sx={{
                        transition: "all 0.3s ease",
                        py: { xs: 1.5, sm: 1.75 },
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: theme.shadows[12],
                        },
                      }}
                    >
                      Get Started Free
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/login")}
                      sx={{
                        py: { xs: 1.5, sm: 1.75 },
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.05
                          ),
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  </Stack>

                  {/* Trust indicators */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2.5}
                    mt={4}
                    alignItems={{ xs: "center", sm: "flex-start" }}
                  >
                    <Zoom in timeout={1000}>
                      <Box display="flex" alignItems="center">
                        <CheckCircle
                          color="success"
                          sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                        >
                          No credit card required
                        </Typography>
                      </Box>
                    </Zoom>
                    <Zoom in timeout={1200}>
                      <Box display="flex" alignItems="center">
                        <CheckCircle
                          color="success"
                          sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                        >
                          Free for students
                        </Typography>
                      </Box>
                    </Zoom>
                  </Stack>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Slide direction="left" in timeout={1000}>
                <Box sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 4, sm: 5 },
                      borderRadius: 5,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      textAlign: "center",
                      boxShadow: `0 30px 60px ${alpha(
                        theme.palette.primary.main,
                        0.35
                      )}`,
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(180deg, ${alpha(
                          "#fff",
                          0.15
                        )} 0%, transparent 60%)`,
                        opacity: 0.7,
                      },
                    }}
                  >
                    <Box position="relative" zIndex={1}>
                      <Typography
                        variant="overline"
                        sx={{
                          letterSpacing: 2,
                          fontWeight: 700,
                          opacity: 0.9,
                        }}
                      >
                        2025 Admissions
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight={800}
                        sx={{
                          mt: 1,
                          mb: 2,
                          fontSize: { xs: "2rem", md: "2.75rem" },
                        }}
                      >
                        Launch Your Future
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          opacity: 0.9,
                          mb: 3,
                          fontSize: { xs: "1rem", md: "1.1rem" },
                        }}
                      >
                        Tailored journeys for students, institutions, and
                        companies ready to grow.
                      </Typography>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="center"
                        sx={{ mb: 3 }}
                      >
                        {[
                          { label: "Active Institutions", value: "500+" },
                          { label: "Career Matches", value: "5K" },
                        ].map((item) => (
                          <Box
                            key={item.label}
                            sx={{
                              px: 3,
                              py: 2,
                              borderRadius: 3,
                              backgroundColor: alpha("#fff", 0.12),
                            }}
                          >
                            <Typography variant="h5" fontWeight={700}>
                              {item.value}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {item.label}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      <Button
                        variant="contained"
                        color="inherit"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate("/signup")}
                        sx={{
                          bgcolor: alpha("#fff", 0.2),
                          color: "white",
                          borderRadius: 999,
                          px: 4,
                          py: 1.25,
                          fontWeight: 600,
                          backdropFilter: "blur(6px)",
                          "&:hover": {
                            bgcolor: alpha("#fff", 0.3),
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        Explore Programs
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        bgcolor="background.paper"
        py={{ xs: 4, sm: 5, md: 6 }}
        sx={{ boxShadow: `inset 0 1px 0 ${alpha("#000", 0.05)}` }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <Zoom in timeout={600 + index * 200}>
                  <Box
                    textAlign="center"
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                      },
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
                      }}
                      fontWeight={700}
                      gutterBottom
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
        <Fade in timeout={1000}>
          <Box textAlign="center" mb={{ xs: 4, sm: 6, md: 8 }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } }}
            >
              Everything You Need
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" } }}
            >
              A comprehensive platform for students, institutions, and employers
            </Typography>
          </Box>
        </Fade>

        <Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Zoom in timeout={800 + index * 200} key={feature.title}>
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 920,
                    borderRadius: 4,
                    boxShadow: theme.shadows[10],
                    p: { xs: 3, md: 4 },
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    gap: { xs: 3, md: 4 },
                    minHeight: 220,
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                    backgroundColor: alpha(
                      theme.palette.background.paper,
                      0.95
                    ),
                  }}
                >
                  <Box
                    sx={{
                      width: 88,
                      height: 88,
                      borderRadius: 3,
                      background: alpha(theme.palette.primary.main, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 42, color: "primary.main" }} />
                  </Box>
                  <Box textAlign={{ xs: "center", md: "left" }}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ mb: 1, fontSize: { xs: "1.35rem", md: "1.5rem" } }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.05rem" },
                        maxWidth: 720,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Card>
              </Zoom>
            );
          })}
        </Stack>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
          py: 10,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle, ${alpha(
              "#fff",
              0.1
            )} 0%, transparent 70%)`,
            animation: "rotate 30s linear infinite",
          },
          "@keyframes rotate": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Fade in timeout={1200}>
            <Box textAlign="center">
              <Typography variant="h2" gutterBottom>
                Ready to Get Started?
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Join thousands of students, institutions, and companies using
                Career Findr
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                  color: "white",
                  fontWeight: 700,
                  px: 5,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 24px ${alpha("#000", 0.2)}`,
                  },
                }}
                endIcon={<ArrowForward />}
                onClick={() => navigate("/signup")}
              >
                Create Free Account
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        bgcolor="background.paper"
        py={{ xs: 3, sm: 4 }}
        borderTop={1}
        borderColor="divider"
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <RocketLaunch sx={{ color: "primary.main", mr: 1 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight={700}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 0,
                  }}
                >
                  Career Findr
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                Connecting students with institutions and career opportunities.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Quick Links
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  onClick={() => navigate("/about")}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.main",
                      transform: "translateX(4px)",
                    },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  About Us
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  onClick={() => navigate("/contact")}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.main",
                      transform: "translateX(4px)",
                    },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Contact
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  onClick={() => navigate("/privacy")}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.main",
                      transform: "translateX(4px)",
                    },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Privacy Policy
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  onClick={() => navigate("/terms")}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.main",
                      transform: "translateX(4px)",
                    },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Terms of Service
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Contact
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                Email: support@careerfindr.com
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                Phone: +266 59462735
              </Typography>
            </Grid>
          </Grid>
          <Box mt={4} pt={3} borderTop={1} borderColor="divider">
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              © {new Date().getFullYear()} Career Findr. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
