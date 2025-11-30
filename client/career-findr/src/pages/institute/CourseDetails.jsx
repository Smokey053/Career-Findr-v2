import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  EditOutlined,
  MenuBookOutlined,
  SchoolOutlined,
  EventSeatOutlined,
  TimelineOutlined,
  MonetizationOnOutlined,
  DescriptionOutlined,
  ChecklistOutlined,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../../components/common/LoadingScreen";
import { getCourse } from "../../services/courseService";
import { useAuth } from "../../contexts/AuthContext";
import { formatDate } from "../../utils/dateUtils";

export default function CourseDetails() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useAuth();

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
  });

  if (isLoading) {
    return <LoadingScreen message="Loading course" />;
  }

  if (isError || !course) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom fontWeight={700}>
            Unable to load course details
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {error?.message || "Please refresh and try again."}
          </Typography>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Card>
      </Container>
    );
  }

  const formatCurrencyValue = (value, currency = "LSL") => {
    if (value === undefined || value === null || value === "") {
      return null;
    }
    const numericValue = Number(value);
    const formattedAmount = Number.isFinite(numericValue)
      ? numericValue.toLocaleString()
      : value;
    return `${currency} ${formattedAmount}`;
  };

  const metrics = [
    {
      label: "Duration",
      value: course.duration || "N/A",
      icon: <TimelineOutlined color="primary" />,
    },
    {
      label: "Seats",
      value: course.seats ? `${course.seats} slots` : "Not specified",
      icon: <EventSeatOutlined color="success" />,
    },
    {
      label: "Fees",
      value:
        formatCurrencyValue(course.fees, course.currency || "LSL") ||
        "Contact finance",
      icon: <MonetizationOnOutlined color="warning" />,
    },
  ];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Card
          sx={{
            borderRadius: 4,
            mb: 4,
            p: 3,
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            color: "white",
            boxShadow: "0 20px 60px rgba(37,99,235,0.25)",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <IconButton
              onClick={() => navigate("/institute/courses")}
              sx={{
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                alignSelf: "flex-start",
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box flex={1}>
              <Typography variant="overline" sx={{ opacity: 0.8 }}>
                Course Overview
              </Typography>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {course.name}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Chip
                  icon={<SchoolOutlined />}
                  label={course.level || "Level"}
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                />
                <Chip
                  icon={<MenuBookOutlined />}
                  label={course.field || "Discipline"}
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                />
                <Chip
                  label={course.status === "active" ? "Active" : "Inactive"}
                  color={course.status === "active" ? "success" : "default"}
                  sx={{
                    color: course.status === "active" ? "white" : "inherit",
                  }}
                />
              </Stack>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<MenuBookOutlined />}
                onClick={() =>
                  navigate(`/institute/applications?course=${courseId}`)
                }
                sx={{ borderColor: "rgba(255,255,255,0.6)", color: "white" }}
              >
                View Applications
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<EditOutlined />}
                onClick={() => navigate(`/institute/courses/edit/${courseId}`)}
              >
                Edit Course
              </Button>
            </Stack>
          </Stack>
        </Card>

        {/* Metrics */}
        <Grid container spacing={3} mb={4}>
          {metrics.map((metric) => (
            <Grid item xs={12} md={4} key={metric.label}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {metric.icon}
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {metric.label}
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {metric.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <DescriptionOutlined color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Course Description
                  </Typography>
                </Stack>
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {course.description || "No description provided."}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <ChecklistOutlined color="secondary" />
                  <Typography variant="h6" fontWeight={700}>
                    Requirements & Qualifications
                  </Typography>
                </Stack>
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-line", mb: 3 }}
                >
                  {course.requirements || "No requirements listed."}
                </Typography>
                {course.qualifications && course.qualifications.length > 0 && (
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {course.qualifications.map((qual) => (
                      <Chip key={qual} label={qual} variant="outlined" />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Key Dates
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography fontWeight={600}>
                    {course.startDate
                      ? formatDate(course.startDate)
                      : "TBD"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    Application Deadline
                  </Typography>
                  <Typography fontWeight={600}>
                    {course.applicationDeadline
                      ? formatDate(course.applicationDeadline)
                      : "Not set"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Institution Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Institution
                </Typography>
                <Typography fontWeight={600} gutterBottom>
                  {course.institutionName || user?.name || "Your Institution"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography fontWeight={600}>
                  {course.location || user?.location || "Add location"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
