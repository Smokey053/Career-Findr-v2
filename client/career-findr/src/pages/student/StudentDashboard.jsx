import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Fade,
  Zoom,
  Slide,
} from "@mui/material";
import {
  SchoolRounded,
  WorkRounded,
  CheckCircleRounded,
  PendingRounded,
  TrendingUpRounded,
  ArrowForwardRounded,
  WavingHandRounded,
  PersonRounded,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import {
  getStudentApplications,
  getStudentAdmissions,
} from "../../services/applicationService";
import LoadingScreen from "../../components/common/LoadingScreen";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["studentApplications", user?.uid],
    queryFn: () => getStudentApplications(user.uid),
    enabled: !!user?.uid,
  });

  const { data: admissions, isLoading: admissionsLoading } = useQuery({
    queryKey: ["studentAdmissions", user?.uid],
    queryFn: () => getStudentAdmissions(user.uid),
    enabled: !!user?.uid,
  });

  if (!user?.uid || appsLoading || admissionsLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  // Calculate stats
  const pendingApps =
    applications?.filter((app) => app.status === "pending").length || 0;
  const acceptedApps =
    applications?.filter((app) => app.status === "accepted").length || 0;
  const totalApps = applications?.length || 0;
  const activeAdmissions =
    admissions?.filter((adm) => adm.status === "pending").length || 0;

  const stats = [
    {
      title: "Total Applications",
      value: totalApps,
      icon: SchoolRounded,
      color: "primary",
      gradient: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
      action: () => navigate("/applications"),
    },
    {
      title: "Pending Review",
      value: pendingApps,
      icon: PendingRounded,
      color: "warning",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #d97706 100%)",
      action: () => navigate("/applications"),
    },
    {
      title: "Accepted",
      value: acceptedApps,
      icon: CheckCircleRounded,
      color: "success",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      action: () => navigate("/applications"),
    },
    {
      title: "Active Admissions",
      value: activeAdmissions,
      icon: TrendingUpRounded,
      color: "secondary",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #7c3aed 100%)",
      action: () => navigate("/applications"),
    },
  ];

  const quickActions = [
    {
      label: "Search Courses",
      description: "Browse available courses and institutions",
      icon: SchoolRounded,
      action: () => navigate("/courses"),
      color: "primary",
      gradient: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
    },
    {
      label: "View Applications",
      description: "Track your application status",
      icon: PendingRounded,
      action: () => navigate("/applications"),
      color: "info",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    },
    {
      label: "Find Jobs",
      description: "Explore career opportunities",
      icon: WorkRounded,
      action: () => navigate("/jobs"),
      color: "success",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
  ];

  const recentApplications = applications?.slice(0, 3) || [];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section with Animation */}
        <Fade in timeout={600}>
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <WavingHandRounded
                sx={{
                  color: "warning.main",
                  fontSize: 32,
                  animation: "wave 1.5s ease-in-out infinite",
                  "@keyframes wave": {
                    "0%, 100%": { transform: "rotate(0deg)" },
                    "25%": { transform: "rotate(20deg)" },
                    "75%": { transform: "rotate(-10deg)" },
                  },
                }}
              />
              <Typography variant="h4" fontWeight={700}>
                Welcome back, {user?.name || "Student"}!
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ pl: 5.5 }}>
              Track your applications, explore new opportunities, and manage
              your career journey
            </Typography>
          </Box>
        </Fade>

        {/* Profile Completion Alert with Animation */}
        {user && !user.phone && (
          <Slide in direction="down" timeout={500}>
            <Alert
              severity="warning"
              icon={<PersonRounded />}
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "warning.light",
                "& .MuiAlert-message": { width: "100%" },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Typography variant="body2">
                  Complete your profile to improve your chances with
                  institutions and employers.
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => navigate("/profile")}
                  sx={{
                    ml: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  Update Profile
                </Button>
              </Box>
            </Alert>
          </Slide>
        )}

        {/* Stats Cards with Staggered Animation */}
        <Grid container spacing={3} className="mb-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in timeout={600 + index * 100}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: stat.gradient,
                      },
                    }}
                    onClick={stat.action}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ fontWeight: 500 }}
                          >
                            {stat.title}
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight={700}
                            sx={{
                              background: stat.gradient,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            background: stat.gradient,
                            color: "white",
                            p: 1.5,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          <Icon sx={{ fontSize: 24 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            );
          })}
        </Grid>

        <div className="row g-3">
          {/* Quick Actions */}
          <div className="col-12 col-lg-8">
            <Fade in timeout={800}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Zoom in timeout={900 + index * 100}>
                            <Card
                              variant="outlined"
                              sx={{
                                cursor: "pointer",
                                height: "100%",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                borderRadius: 2,
                                "&:hover": {
                                  borderColor: "transparent",
                                  transform: "translateY(-4px)",
                                  boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                                  "& .action-icon": {
                                    transform: "scale(1.1)",
                                  },
                                },
                              }}
                              onClick={action.action}
                            >
                              <CardContent sx={{ p: 2.5 }}>
                                <Box
                                  className="action-icon"
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 2,
                                    background: action.gradient,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 2,
                                    transition:
                                      "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                  }}
                                >
                                  <Icon sx={{ fontSize: 28, color: "white" }} />
                                </Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                  gutterBottom
                                >
                                  {action.label}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {action.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Zoom>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </div>

          {/* Recent Activity */}
          <div className="col-12 col-lg-4">
            <Fade in timeout={900}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Recent Applications
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardRounded />}
                      onClick={() => navigate("/applications")}
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      View All
                    </Button>
                  </Box>

                  {appsLoading ? (
                    <Box py={3}>
                      <LinearProgress sx={{ borderRadius: 1 }} />
                    </Box>
                  ) : recentApplications.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                      {recentApplications.map((app, index) => (
                        <Slide
                          key={app.id}
                          in
                          direction="left"
                          timeout={1000 + index * 100}
                        >
                          <Box
                            p={2}
                            border={1}
                            borderColor="divider"
                            borderRadius={2}
                            sx={{
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                bgcolor: "action.hover",
                                borderColor: "primary.main",
                                transform: "translateX(4px)",
                              },
                              cursor: "pointer",
                            }}
                            onClick={() => navigate("/applications")}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              {app.courseName || "Course Application"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              gutterBottom
                            >
                              {app.instituteName || "Institution"}
                            </Typography>
                            <Chip
                              label={app.status}
                              size="small"
                              color={
                                app.status === "accepted"
                                  ? "success"
                                  : app.status === "rejected"
                                  ? "error"
                                  : "warning"
                              }
                              sx={{
                                mt: 1,
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            />
                          </Box>
                        </Slide>
                      ))}
                    </Box>
                  ) : (
                    <Box py={3} textAlign="center">
                      <SchoolRounded
                        sx={{
                          fontSize: 64,
                          color: "text.disabled",
                          mb: 2,
                          opacity: 0.5,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        No applications yet
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 2,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                        onClick={() => navigate("/courses")}
                      >
                        Browse Courses
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </div>
        </div>

        {/* Application Progress */}
        {totalApps > 0 && (
          <Fade in timeout={1000}>
            <Card
              sx={{
                mt: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Application Progress
                </Typography>
                <Box mt={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      {acceptedApps} accepted out of {totalApps} applications
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{
                        background:
                          "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {totalApps > 0
                        ? Math.round((acceptedApps / totalApps) * 100)
                        : 0}
                      %
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={totalApps > 0 ? (acceptedApps / totalApps) * 100 : 0}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "grey.100",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                        background:
                          "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Container>
    </Box>
  );
}
