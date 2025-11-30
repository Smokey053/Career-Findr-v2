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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Fade,
  Zoom,
  Slide,
} from "@mui/material";
import {
  SchoolRounded,
  PeopleRounded,
  CheckCircleRounded,
  PendingRounded,
  AddRounded,
  ArrowForwardRounded,
  TrendingUpRounded,
  SpeedRounded,
  GroupsRounded,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { instituteAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import { getInstitutionCourses } from "../../services/courseService";
import { getInstitutionApplications } from "../../services/applicationService";
import { formatDate } from "../../utils/dateUtils";

// Helper to get student name from application
const getStudentName = (app) => {
  if (app.studentName) return app.studentName;
  if (app.firstName && app.lastName) return `${app.firstName} ${app.lastName}`;
  if (app.firstName) return app.firstName;
  return "Unknown Student";
};

export default function InstituteDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["instituteProfile"],
    queryFn: instituteAPI.getProfile,
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["instituteCourses"],
    queryFn: () => getInstitutionCourses(user.uid),
  });

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["instituteApplications"],
    queryFn: () => getInstitutionApplications(user.uid),
  });

  // Calculate statistics
  const admissionsCount =
    applications?.filter((app) => app.status === "approved").length || 0;
  const stats = {
    totalAdmissions: admissionsCount,
    acceptanceRate:
      applications?.length > 0
        ? Math.round((admissionsCount / applications.length) * 100)
        : 0,
    averageResponseTime: 2, // Placeholder
    totalStudentsEnrolled:
      courses?.reduce((sum, course) => sum + (course.enrolled || 0), 0) || 0,
  };

  if (coursesLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  const pendingApplications =
    applications?.filter((app) => app.status === "pending") || [];
  const recentApplications = applications?.slice(0, 5) || [];
  const activeCourses =
    courses?.filter((course) => course.status === "active") || [];

  const statsData = [
    {
      title: "Total Courses",
      value: courses?.length || 0,
      icon: SchoolRounded,
      gradient: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
      action: () => navigate("/institute/courses"),
    },
    {
      title: "Pending Applications",
      value: pendingApplications.length,
      icon: PendingRounded,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #d97706 100%)",
      action: () => navigate("/institute/applications"),
    },
    {
      title: "Total Applications",
      value: applications?.length || 0,
      icon: PeopleRounded,
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
      action: () => navigate("/institute/applications"),
    },
    {
      title: "Admissions Offered",
      value: stats?.totalAdmissions || 0,
      icon: CheckCircleRounded,
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      action: () => navigate("/institute/admissions"),
    },
  ];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section with Animation */}
        <Fade in timeout={600}>
          <Box
            mb={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  <SchoolRounded sx={{ color: "white", fontSize: 28 }} />
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  Welcome back, {user?.name || profile?.name || "Institution"}!
                </Typography>
              </Box>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ pl: 7.5 }}
              >
                Manage your courses, review applications, and track admissions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => navigate("/institute/courses/new")}
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
                },
              }}
            >
              Add New Course
            </Button>
          </Box>
        </Fade>

        {/* Stats Cards with Staggered Animation */}
        <div className="row g-3 mb-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <Zoom in timeout={600 + index * 100}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      borderRadius: 3,
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
              </div>
            );
          })}
        </div>

        <div className="row g-3">
          {/* Recent Applications */}
          <div className="col-12 col-lg-7">
            <Fade in timeout={800}>
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
                      onClick={() => navigate("/institute/applications")}
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "translateX(4px)" },
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
                    <List sx={{ p: 0 }}>
                      {recentApplications.map((app, index) => (
                        <Slide
                          key={app.id}
                          in
                          direction="left"
                          timeout={900 + index * 50}
                        >
                          <ListItem
                            sx={{
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 2,
                              mb: 1.5,
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                bgcolor: "action.hover",
                                borderColor: "primary.main",
                                transform: "translateX(4px)",
                              },
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate("/institute/applications")
                            }
                          >
                            <ListItemText
                              primary={
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                  >
                                    {getStudentName(app)}
                                  </Typography>
                                  <Chip
                                    label={app.status}
                                    size="small"
                                    color={
                                      app.status === "accepted" || app.status === "approved"
                                        ? "success"
                                        : app.status === "rejected"
                                        ? "error"
                                        : "warning"
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      fontWeight: 500,
                                      textTransform: "capitalize",
                                    }}
                                  />
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography variant="body2" component="span">
                                    {app.courseName || "Course"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    display="block"
                                    color="text.secondary"
                                  >
                                    Applied: {formatDate(app.createdAt)}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        </Slide>
                      ))}
                    </List>
                  ) : (
                    <Box py={6} textAlign="center">
                      <PeopleRounded
                        sx={{
                          fontSize: 80,
                          color: "text.disabled",
                          mb: 2,
                          opacity: 0.5,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        No applications yet
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </div>

          {/* Active Courses */}
          <div className="col-12 col-lg-5">
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
                      Active Courses
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardRounded />}
                      onClick={() => navigate("/institute/courses")}
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "translateX(4px)" },
                      }}
                    >
                      Manage
                    </Button>
                  </Box>

                  {coursesLoading ? (
                    <Box py={3}>
                      <LinearProgress sx={{ borderRadius: 1 }} />
                    </Box>
                  ) : activeCourses.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {activeCourses.slice(0, 5).map((course, index) => (
                        <Slide
                          key={course.id}
                          in
                          direction="right"
                          timeout={1000 + index * 50}
                        >
                          <ListItem
                            sx={{
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 2,
                              mb: 1.5,
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                bgcolor: "action.hover",
                                borderColor: "primary.main",
                                transform: "translateX(-4px)",
                              },
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate(`/institute/courses/${course.id}`)
                            }
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                background:
                                  "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 2,
                                flexShrink: 0,
                              }}
                            >
                              <SchoolRounded
                                sx={{ color: "white", fontSize: 20 }}
                              />
                            </Box>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {course.name}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography variant="caption" display="block">
                                    {course.field} • {course.level}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "success.main",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {course.applicationsCount || 0} applications
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        </Slide>
                      ))}
                    </List>
                  ) : (
                    <Box py={6} textAlign="center">
                      <SchoolRounded
                        sx={{
                          fontSize: 80,
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
                        No active courses
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                        onClick={() => navigate("/institute/courses/new")}
                      >
                        Create Course
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </div>
        </div>

        {/* Performance Metrics */}
        {stats && (
          <Fade in timeout={1000}>
            <Card
              sx={{
                mt: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                  <TrendingUpRounded color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Performance Metrics
                  </Typography>
                </Box>
                <div className="row g-3">
                  <div className="col-12 col-sm-4">
                    <Zoom in timeout={1100}>
                      <Box
                        textAlign="center"
                        p={3}
                        borderRadius={2}
                        bgcolor="primary.50"
                        sx={{
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <SpeedRounded
                          sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                        />
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          sx={{
                            background:
                              "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {stats.acceptanceRate || 0}%
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Acceptance Rate
                        </Typography>
                      </Box>
                    </Zoom>
                  </div>
                  <div className="col-12 col-sm-4">
                    <Zoom in timeout={1200}>
                      <Box
                        textAlign="center"
                        p={3}
                        borderRadius={2}
                        bgcolor="success.50"
                        sx={{
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <PendingRounded
                          sx={{ fontSize: 40, color: "success.main", mb: 1 }}
                        />
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          sx={{
                            background:
                              "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {stats.averageResponseTime || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Avg. Response Time (days)
                        </Typography>
                      </Box>
                    </Zoom>
                  </div>
                  <div className="col-12 col-sm-4">
                    <Zoom in timeout={1300}>
                      <Box
                        textAlign="center"
                        p={3}
                        borderRadius={2}
                        bgcolor="secondary.50"
                        sx={{
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <GroupsRounded
                          sx={{ fontSize: 40, color: "secondary.main", mb: 1 }}
                        />
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          sx={{
                            background:
                              "linear-gradient(135deg, #8B5CF6 0%, #7c3aed 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {stats.totalStudentsEnrolled || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Students Enrolled
                        </Typography>
                    </Box>
                  </Zoom>
                </div>
              </div>
            </CardContent>
          </Card>
        </Fade>
      )}
    </Container>
  </Box>
);
}