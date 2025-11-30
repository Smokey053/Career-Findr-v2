import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Alert,
  Fade,
  Zoom,
  Grow,
  Tooltip,
} from "@mui/material";
import {
  SchoolRounded,
  LocationOnRounded,
  CalendarTodayRounded,
  AttachMoneyRounded,
  ScheduleRounded,
  CheckCircleRounded,
  ArrowBack,
  ArrowBackRounded,
  BookmarkBorderRounded,
  BookmarkRounded,
  MenuBookRounded,
  StarRounded,
  InfoRounded,
} from "@mui/icons-material";
import { getCourse } from "../../services/courseService";
import {
  saveItem,
  unsaveItem,
  checkIfSaved,
} from "../../services/savedItemsService";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "../../components/common/LoadingScreen";
import { formatDate, formatFullDate } from "../../utils/dateUtils";

const getCourseTitle = (course) => course?.name || course?.title || "Course";

const getInstitutionName = (course) =>
  course?.institutionName ||
  course?.institution ||
  course?.instituteName ||
  "Institution";

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

const getCourseLocation = (course) =>
  course?.location || course?.campusLocation || "Location provided";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Fetch course details
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
  });

  // Check if course is saved
  const { data: isSaved, refetch: refetchSavedStatus } = useQuery({
    queryKey: ["savedCourse", courseId],
    queryFn: () => checkIfSaved(user?.uid, courseId, "course"),
    enabled: !!user?.uid && !!courseId,
  });

  const handleSave = async () => {
    if (isSaving) return;
    if (!course) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveItem(user.uid, courseId, "course");
      } else {
        const title = getCourseTitle(course);
        await saveItem(user.uid, {
          itemId: courseId,
          itemType: "course",
          itemData: {
            title,
            name: title,
            institutionName: getInstitutionName(course),
            duration: course.duration,
            field: course.field,
            level: course.level,
            description: course.description,
            fees: course.fees,
            currency: course.currency || "LSL",
            location: getCourseLocation(course),
          },
        });
      }
      await refetchSavedStatus();
    } catch (error) {
      console.error("Error saving/unsaving course:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = () => {
    navigate(`/apply/${courseId}`);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading course details..." />;
  }

  if (!course) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Course not found</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/courses")}
          sx={{ mt: 2 }}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Button
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate("/courses")}
            sx={{
              mb: 3,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateX(-4px)",
              },
            }}
          >
            Back to Courses
          </Button>
        </Fade>

        <Zoom in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header Section with Gradient */}
            <Box
              sx={{
                mb: 4,
                background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                borderRadius: 3,
                p: 4,
                color: "white",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "40%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                  borderRadius: "0 0 0 100%",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 2,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 280 }}>
                  <Typography variant="h4" gutterBottom fontWeight={700}>
                    {getCourseTitle(course)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={
                        <SchoolRounded sx={{ color: "white !important" }} />
                      }
                      label={getInstitutionName(course)}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 500,
                        "& .MuiChip-icon": { color: "white" },
                      }}
                    />
                    <Chip
                      label={course.level || "Undergraduate"}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={course.status === "active" ? "Open" : "Closed"}
                      sx={{
                        bgcolor:
                          course.status === "active"
                            ? "rgba(16, 185, 129, 0.8)"
                            : "rgba(239, 68, 68, 0.8)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Tooltip
                    title={isSaved ? "Unsave course" : "Save course"}
                    arrow
                  >
                    <Button
                      variant="outlined"
                      startIcon={
                        isSaved ? (
                          <BookmarkRounded />
                        ) : (
                          <BookmarkBorderRounded />
                        )
                      }
                      onClick={handleSave}
                      disabled={isSaving}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        borderRadius: 2,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          borderColor: "white",
                          bgcolor: "rgba(255,255,255,0.1)",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                  </Tooltip>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleApply}
                    disabled={course.status !== "active"}
                    sx={{
                      bgcolor: "white",
                      color: "#F59E0B",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 4,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.95)",
                        transform: "scale(1.05)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Key Information Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  icon: ScheduleRounded,
                  label: "Duration",
                  value: course.duration || "N/A",
                  color: "#2563EB",
                  delay: 0,
                },
                {
                  icon: AttachMoneyRounded,
                  label: "Tuition Fee",
                  value:
                    formatCurrencyValue(
                      course.fees,
                      course.currency || "LSL"
                    ) || "Contact institution",
                  color: "#10B981",
                  delay: 100,
                },
                {
                  icon: CalendarTodayRounded,
                  label: "Start Date",
                  value: formatDate(course.startDate) || "TBD",
                  color: "#8B5CF6",
                  delay: 200,
                },
                {
                  icon: LocationOnRounded,
                  label: "Location",
                  value: getCourseLocation(course),
                  color: "#EF4444",
                  delay: 300,
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={item.label}>
                  <Grow
                    in
                    timeout={800}
                    style={{
                      transformOrigin: "0 0",
                      transitionDelay: `${item.delay}ms`,
                    }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        border: "none",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: `${item.color}15`,
                              mr: 1.5,
                            }}
                          >
                            <item.icon sx={{ color: item.color }} />
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            {item.label}
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700}>
                          {item.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>

            {/* Description */}
            <Fade in timeout={900}>
              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <MenuBookRounded sx={{ color: "#F59E0B" }} />
                  <Typography variant="h5" fontWeight={700}>
                    About This Course
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, color: "text.secondary" }}
                >
                  {course.description || "No description available."}
                </Typography>
              </Box>
            </Fade>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Fade in timeout={1000}>
                <Box sx={{ mb: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <CheckCircleRounded sx={{ color: "#10B981" }} />
                    <Typography variant="h5" fontWeight={700}>
                      Prerequisites
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {course.prerequisites.map((prereq, index) => (
                      <Chip
                        key={index}
                        icon={<CheckCircleRounded />}
                        label={prereq}
                        variant="outlined"
                        color="success"
                        sx={{ fontWeight: 500, borderRadius: 2 }}
                      />
                    ))}
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Skills */}
            {course.skills && course.skills.length > 0 && (
              <Fade in timeout={1100}>
                <Box sx={{ mb: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <StarRounded sx={{ color: "#8B5CF6" }} />
                    <Typography variant="h5" fontWeight={700}>
                      Skills You'll Gain
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {course.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          bgcolor: "rgba(139, 92, 246, 0.1)",
                          color: "#8B5CF6",
                          fontWeight: 500,
                          borderRadius: 2,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Curriculum */}
            {course.curriculum && (
              <Fade in timeout={1200}>
                <Box sx={{ mb: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <MenuBookRounded sx={{ color: "#2563EB" }} />
                    <Typography variant="h5" fontWeight={700}>
                      Curriculum
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.8,
                      color: "text.secondary",
                    }}
                  >
                    {course.curriculum}
                  </Typography>
                </Box>
              </Fade>
            )}

            {/* Additional Information */}
            <Fade in timeout={1300}>
              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <InfoRounded sx={{ color: "#0EA5E9" }} />
                  <Typography variant="h5" fontWeight={700}>
                    Additional Information
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  {course.degree && (
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Degree Type
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {course.degree}
                      </Typography>
                    </Grid>
                  )}
                  {course.credits && (
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Credits
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {course.credits}
                      </Typography>
                    </Grid>
                  )}
                  {course.language && (
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Language
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {course.language}
                      </Typography>
                    </Grid>
                  )}
                  {course.mode && (
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Mode of Study
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {course.mode}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Fade>

            {/* Application Deadline */}
            {(course.applicationDeadline || course.deadline) && (
              <Zoom in timeout={800}>
                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    "& .MuiAlert-icon": {
                      alignItems: "center",
                    },
                  }}
                >
                  <Typography variant="body2">
                    <strong>Application Deadline:</strong>{" "}
                    {formatFullDate(course.applicationDeadline || course.deadline)}
                  </Typography>
                  {course.startDate && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Course Starts:</strong>{" "}
                      {formatFullDate(course.startDate)}
                    </Typography>
                  )}
                </Alert>
              </Zoom>
            )}

            {/* Footer Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button
                startIcon={<ArrowBackRounded />}
                onClick={() => navigate("/courses")}
                sx={{
                  borderRadius: 2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": { transform: "translateX(-4px)" },
                }}
              >
                Back to Courses
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleApply}
                disabled={course.status !== "active"}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
                  },
                }}
              >
                Apply Now
              </Button>
            </Box>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}
