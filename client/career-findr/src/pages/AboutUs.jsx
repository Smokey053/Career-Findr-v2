import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  alpha,
  useTheme,
  Fade,
  Zoom,
} from "@mui/material";
import {
  ArrowBackIosNew,
  SchoolRounded,
  WorkRounded,
  BusinessRounded,
  TrendingUpRounded,
  PeopleRounded,
  PublicRounded,
  RocketLaunchRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";

const stats = [
  {
    icon: PeopleRounded,
    value: "10,000+",
    label: "Active Users",
    color: "#3B82F6",
  },
  {
    icon: BusinessRounded,
    value: "500+",
    label: "Partner Institutions",
    color: "#8B5CF6",
  },
  {
    icon: WorkRounded,
    value: "5,000+",
    label: "Job Placements",
    color: "#10B981",
  },
  { icon: PublicRounded, value: "50+", label: "Countries", color: "#F59E0B" },
];

const team = [
  {
    name: "Development Team",
    role: "Technology & Innovation",
    description: "Building the future of career management platforms",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
  },
  {
    name: "Education Partners",
    role: "Institutional Relations",
    description: "Connecting top educational institutions",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
  },
  {
    name: "Corporate Partners",
    role: "Career Opportunities",
    description: "Creating pathways to meaningful careers",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  },
];

export default function AboutUs() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 30% 50%, ${alpha(
              "#fff",
              0.1
            )} 0%, transparent 50%)`,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: alpha("#fff", 0.05),
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Fade in timeout={600}>
            <Button
              startIcon={<ArrowBackIosNew sx={{ fontSize: 16 }} />}
              onClick={() => navigate("/")}
              sx={{
                color: "white",
                mb: 4,
                fontWeight: 600,
                borderRadius: "12px",
                px: 2,
                "&:hover": {
                  bgcolor: alpha("#fff", 0.1),
                },
              }}
            >
              Back to Home
            </Button>
          </Fade>
          <Fade in timeout={800}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              About Career Findr
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: 600,
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Connecting students with institutions and career opportunities
              through innovative technology
            </Typography>
          </Fade>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={600}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    letterSpacing: 2,
                    mb: 1,
                    display: "block",
                  }}
                >
                  OUR PURPOSE
                </Typography>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  Our Mission
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
                >
                  Career Findr was created to bridge the gap between educational
                  institutions, students, and employers. We believe that finding
                  the right educational path and career opportunity should be
                  simple, transparent, and accessible to everyone.
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
                >
                  Our platform streamlines the application process, making it
                  easier for students to discover opportunities, for
                  institutions to manage applications, and for companies to find
                  the perfect candidates.
                </Typography>
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Zoom in timeout={800}>
              <Box
                sx={{
                  height: { xs: 320, md: 420 },
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  borderRadius: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 25px 50px -12px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "20%",
                    left: "10%",
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: alpha("#fff", 0.1),
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "10%",
                    right: "15%",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: alpha("#fff", 0.08),
                  },
                }}
              >
                <RocketLaunchRounded
                  sx={{
                    fontSize: 100,
                    color: "white",
                    opacity: 0.9,
                    zIndex: 1,
                  }}
                />
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.grey[100], 0.5),
          py: { xs: 8, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Our Impact
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: "auto" }}
          >
            Making a difference in the lives of students and organizations
            worldwide
          </Typography>
          <Grid container spacing={3}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Grid item xs={6} md={3} key={index}>
                  <Zoom in timeout={600 + index * 150}>
                    <Card
                      sx={{
                        textAlign: "center",
                        p: { xs: 3, md: 4 },
                        height: "100%",
                        borderRadius: "20px",
                        border: "1px solid",
                        borderColor: alpha(theme.palette.divider, 0.1),
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: `0 20px 40px -12px ${alpha(
                            stat.color,
                            0.3
                          )}`,
                          borderColor: alpha(stat.color, 0.3),
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2,
                          background: alpha(stat.color, 0.1),
                        }}
                      >
                        <Icon sx={{ fontSize: 32, color: stat.color }} />
                      </Box>
                      <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          background: `linear-gradient(135deg, ${
                            stat.color
                          } 0%, ${alpha(stat.color, 0.7)} 100%)`,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {stat.label}
                      </Typography>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h3"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Our Values
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: "auto" }}
        >
          The principles that guide everything we do
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Fade in timeout={600}>
              <Paper
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    boxShadow: `0 20px 40px -12px ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    background: `linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)`,
                    boxShadow: `0 8px 20px -6px ${alpha("#3B82F6", 0.5)}`,
                  }}
                >
                  <SchoolRounded sx={{ fontSize: 30, color: "white" }} />
                </Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Education First
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.7}
                >
                  We prioritize accessible, quality education for all students
                  regardless of their background or location.
                </Typography>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={4}>
            <Fade in timeout={800}>
              <Paper
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: alpha("#8B5CF6", 0.3),
                    boxShadow: `0 20px 40px -12px ${alpha("#8B5CF6", 0.15)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    background: `linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)`,
                    boxShadow: `0 8px 20px -6px ${alpha("#8B5CF6", 0.5)}`,
                  }}
                >
                  <WorkRounded sx={{ fontSize: 30, color: "white" }} />
                </Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Career Growth
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.7}
                >
                  We're committed to helping students find meaningful careers
                  that align with their skills and passions.
                </Typography>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={4}>
            <Fade in timeout={1000}>
              <Paper
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: alpha("#10B981", 0.3),
                    boxShadow: `0 20px 40px -12px ${alpha("#10B981", 0.15)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    background: `linear-gradient(135deg, #10B981 0%, #059669 100%)`,
                    boxShadow: `0 8px 20px -6px ${alpha("#10B981", 0.5)}`,
                  }}
                >
                  <BusinessRounded sx={{ fontSize: 30, color: "white" }} />
                </Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Partnership
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.7}
                >
                  We believe in building strong partnerships between
                  institutions, students, and employers.
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Team Section */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.grey[100], 0.5),
          py: { xs: 8, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Our Team
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: "auto" }}
          >
            The dedicated people behind Career Findr
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Zoom in timeout={600 + index * 150}>
                  <Card
                    sx={{
                      textAlign: "center",
                      p: 4,
                      height: "100%",
                      borderRadius: "20px",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.1),
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 90,
                        height: 90,
                        mx: "auto",
                        mb: 3,
                        background: member.gradient,
                        fontSize: 36,
                        fontWeight: 700,
                        boxShadow: `0 10px 30px -8px rgba(0, 0, 0, 0.3)`,
                      }}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        background: member.gradient,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      lineHeight={1.6}
                    >
                      {member.description}
                    </Typography>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Fade in timeout={600}>
                <Box
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    borderRadius: "24px",
                    p: { xs: 4, md: 5 },
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    boxShadow: `0 20px 45px -18px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{ opacity: 0.9, letterSpacing: 2 }}
                  >
                    Quick Links
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    Navigate Career Findr
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Jump directly into the most popular sections of our
                    platform.
                  </Typography>
                  <Grid container spacing={2} mt={1}>
                    {[
                      { label: "Home", path: "/", color: "#3B82F6" },
                      { label: "About Us", path: "/about", color: "#8B5CF6" },
                      { label: "Contact", path: "/contact", color: "#10B981" },
                      {
                        label: "Privacy Policy",
                        path: "/privacy",
                        color: "#F97316",
                      },
                      {
                        label: "Terms of Service",
                        path: "/terms",
                        color: "#14B8A6",
                      },
                      { label: "Login", path: "/login", color: "#6366F1" },
                    ].map((item) => (
                      <Grid item xs={12} sm={6} key={item.path}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => navigate(item.path)}
                          endIcon={<ArrowForwardRounded />}
                          sx={{
                            justifyContent: "space-between",
                            borderRadius: "14px",
                            py: 1.5,
                            px: 3,
                            fontWeight: 600,
                            textTransform: "none",
                            bgcolor: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(10px)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.2)",
                            boxShadow: "none",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "rgba(255,255,255,0.25)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            },
                          }}
                        >
                          {item.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box
                  sx={{
                    height: "100%",
                    backgroundColor: "background.paper",
                    borderRadius: "24px",
                    p: { xs: 4, md: 5 },
                    boxShadow: "0 18px 45px -18px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="overline"
                    color="primary"
                    fontWeight={700}
                  >
                    Get Involved
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    Join Us Today
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    Be part of a platform that's transforming education and
                    career opportunities worldwide.
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={2}
                    mt={2}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/signup")}
                      sx={{
                        flex: 1,
                        borderRadius: "14px",
                        fontWeight: 600,
                      }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/contact")}
                      sx={{
                        flex: 1,
                        borderRadius: "14px",
                        fontWeight: 600,
                      }}
                    >
                      Contact Us
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
