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
} from "@mui/material";
import {
  School,
  Work,
  CheckCircle,
  Pending,
  TrendingUp,
  ArrowForward,
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
      icon: School,
      color: "primary",
      action: () => navigate("/applications"),
    },
    {
      title: "Pending Review",
      value: pendingApps,
      icon: Pending,
      color: "warning",
      action: () => navigate("/applications"),
    },
    {
      title: "Accepted",
      value: acceptedApps,
      icon: CheckCircle,
      color: "success",
      action: () => navigate("/applications"),
    },
    {
      title: "Active Admissions",
      value: activeAdmissions,
      icon: TrendingUp,
      color: "secondary",
      action: () => navigate("/applications"),
    },
  ];

  const quickActions = [
    {
      label: "Search Courses",
      description: "Browse available courses and institutions",
      icon: School,
      action: () => navigate("/courses"),
      color: "primary",
    },
    {
      label: "View Applications",
      description: "Track your application status",
      icon: Pending,
      action: () => navigate("/applications"),
      color: "info",
    },
    {
      label: "Find Jobs",
      description: "Explore career opportunities",
      icon: Work,
      action: () => navigate("/jobs"),
      color: "success",
    },
  ];

  const recentApplications = applications?.slice(0, 3) || [];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Welcome back, {user?.name || "Student"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your applications, explore new opportunities, and manage your
            career journey
          </Typography>
        </Box>

        {/* Profile Completion Alert */}
        {user && !user.phone && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Complete your profile to improve your chances with institutions
              and employers.{" "}
              <Button size="small" onClick={() => navigate("/profile")}>
                Update Profile
              </Button>
            </Typography>
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                  onClick={stat.action}
                >
                  <CardContent>
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
                        >
                          {stat.title}
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color={`${stat.color}.main`}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: `${stat.color}.main`,
                          color: "white",
                          p: 1,
                          borderRadius: 2,
                        }}
                      >
                        <Icon />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <div className="row g-3">
          {/* Quick Actions */}
          <div className="col-12 col-lg-8">
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            height: "100%",
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: `${action.color}.main`,
                              bgcolor: `${action.color}.50`,
                            },
                          }}
                          onClick={action.action}
                        >
                          <CardContent>
                            <Icon
                              color={action.color}
                              sx={{ fontSize: 40, mb: 1 }}
                            />
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              gutterBottom
                            >
                              {action.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {action.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="col-12 col-lg-4">
            <Card sx={{ height: "100%" }}>
              <CardContent>
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
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/applications")}
                  >
                    View All
                  </Button>
                </Box>

                {appsLoading ? (
                  <Box py={3}>
                    <LinearProgress />
                  </Box>
                ) : recentApplications.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={2}>
                    {recentApplications.map((app) => (
                      <Box
                        key={app.id}
                        p={2}
                        border={1}
                        borderColor="divider"
                        borderRadius={2}
                        sx={{
                          "&:hover": { bgcolor: "action.hover" },
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
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box py={3} textAlign="center">
                    <School
                      sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No applications yet
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => navigate("/courses")}
                    >
                      Browse Courses
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Application Progress */}
        {totalApps > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Application Progress
              </Typography>
              <Box mt={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {acceptedApps} accepted out of {totalApps} applications
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {totalApps > 0
                      ? Math.round((acceptedApps / totalApps) * 100)
                      : 0}
                    %
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalApps > 0 ? (acceptedApps / totalApps) * 100 : 0}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
