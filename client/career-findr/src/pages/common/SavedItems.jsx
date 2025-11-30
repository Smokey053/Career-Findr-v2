import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Fade,
  Zoom,
  Grow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BookmarkBorder,
  Bookmark,
  Work,
  School,
  LocationOn,
  Business,
  AttachMoney,
  Delete,
  WorkOutline,
  SchoolOutlined,
  OpenInNew,
  VisibilityRounded,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getSavedItems,
  removeSavedItem,
} from "../../services/savedItemsService";
import { formatDate } from "../../utils/dateUtils";

export default function SavedItems() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState(0);
  const { user } = useAuth();

  // Fetch saved items
  const { data, isLoading, error } = useQuery({
    queryKey: ["savedItems", user?.uid],
    queryFn: () => getSavedItems(user.uid),
    enabled: !!user?.uid,
  });

  const savedJobs = data?.jobs || [];
  const savedCourses = data?.courses || [];
  const normalizedJobs = savedJobs.map((job) => ({
    ...job,
    ...(job.itemData || {}),
  }));
  const normalizedCourses = savedCourses.map((course) => ({
    ...course,
    ...(course.itemData || {}),
  }));

  // Remove saved item mutation
  const removeMutation = useMutation({
    mutationFn: ({ type, itemId }) => removeSavedItem(user.uid, type, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(["savedItems", user?.uid]);
    },
  });

  const handleRemove = (type, item) => {
    const itemId = item.itemId || item.id;
    removeMutation.mutate({ type, itemId });
  };

  const normalizeSalaryValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  };

  const formatSalary = (min, max, currency = "LSL") => {
    const minValue = normalizeSalaryValue(min);
    const maxValue = normalizeSalaryValue(max);

    const formatNumber = (value) =>
      value.toLocaleString(undefined, { maximumFractionDigits: 0 });

    if (minValue !== null && maxValue !== null) {
      return `${currency} ${formatNumber(
        minValue
      )} - ${currency} ${formatNumber(maxValue)}`;
    }
    if (minValue !== null) {
      return `${currency} ${formatNumber(minValue)}+`;
    }
    if (maxValue !== null) {
      return `Up to ${currency} ${formatNumber(maxValue)}`;
    }
    return "Competitive";
  };

  const formatCourseTuition = (course) => {
    if (!course || course.fees === undefined || course.fees === null) {
      return "Tuition TBD";
    }
    const numericValue = Number(course.fees);
    const formattedAmount = Number.isFinite(numericValue)
      ? numericValue.toLocaleString()
      : course.fees;
    return `${course.currency || "LSL"} ${formattedAmount}/year`;
  };

  if (!user?.uid || isLoading) {
    return <LoadingScreen message="Loading saved items..." />;
  }

  return (
    <Fade in timeout={800}>
      <Box className="min-vh-100" bgcolor="background.default">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Animated Header */}
          <Zoom in timeout={600}>
            <Box
              mb={4}
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                borderRadius: 4,
                p: 4,
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(37, 99, 235, 0.3)",
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
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Bookmark sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    Saved Items
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Your bookmarked jobs and courses
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Zoom>

          {/* Tabs */}
          <Grow in timeout={800} style={{ transformOrigin: "top center" }}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{
                  bgcolor: "grey.50",
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    minHeight: 56,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.50",
                    },
                  },
                  "& .Mui-selected": {
                    color: "primary.main",
                  },
                }}
              >
                <Tab
                  label={`Jobs (${savedJobs.length})`}
                  icon={<WorkOutline />}
                  iconPosition="start"
                />
                <Tab
                  label={`Courses (${savedCourses.length})`}
                  icon={<SchoolOutlined />}
                  iconPosition="start"
                />
              </Tabs>
            </Card>
          </Grow>

          {/* Error State */}
          {error && (
            <Zoom in timeout={400}>
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(211, 47, 47, 0.15)",
                }}
              >
                {error.message || "Failed to load saved items"}
              </Alert>
            </Zoom>
          )}

          {/* Jobs Tab */}
          {currentTab === 0 && (
            <Fade in timeout={500}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                {normalizedJobs.length === 0 ? (
                  <CardContent sx={{ py: 8, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        bgcolor: "grey.100",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      <BookmarkBorder sx={{ fontSize: 48, color: "text.secondary" }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      No saved jobs yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Start bookmarking jobs you're interested in
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/jobs")}
                      sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}
                    >
                      Browse Jobs
                    </Button>
                  </CardContent>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "grey.50" }}>
                          <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Salary</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Saved</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {normalizedJobs.map((job, index) => (
                            <TableRow
                              key={job.itemId || job.id}
                              hover
                              sx={{
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": { bgcolor: "primary.50" },
                              }}
                            >
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{
                                    color: "primary.main",
                                    "&:hover": { textDecoration: "underline" },
                                  }}
                                  onClick={() => navigate(`/jobs/${job.itemId || job.id}`)}
                                >
                                  {job.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {job.experienceLevel}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Business fontSize="small" sx={{ color: "text.secondary" }} />
                                  <Typography variant="body2">{job.companyName || job.company}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <LocationOn fontSize="small" sx={{ color: "text.secondary" }} />
                                  <Typography variant="body2">{job.location}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={job.type}
                                  size="small"
                                  color="primary"
                                  sx={{ borderRadius: 1.5, fontWeight: 500 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600} color="success.main">
                                  {formatSalary(job.salaryMin, job.salaryMax, job.currency || "LSL")}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(job.savedAt)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="View Job" arrow>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => navigate(`/jobs/${job.itemId || job.id}`)}
                                    sx={{ transition: "all 0.2s", "&:hover": { transform: "scale(1.1)" } }}
                                  >
                                    <VisibilityRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Apply Now" arrow>
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => navigate(`/jobs/${job.itemId || job.id}/apply`)}
                                    sx={{ transition: "all 0.2s", "&:hover": { transform: "scale(1.1)" } }}
                                  >
                                    <OpenInNew fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Remove" arrow>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemove("job", job)}
                                    disabled={removeMutation.isPending}
                                    sx={{ transition: "all 0.2s", "&:hover": { transform: "scale(1.1)" } }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Card>
            </Fade>
          )}

          {/* Courses Tab */}
          {currentTab === 1 && (
            <Fade in timeout={500}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                {normalizedCourses.length === 0 ? (
                  <CardContent sx={{ py: 8, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        bgcolor: "grey.100",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      <BookmarkBorder sx={{ fontSize: 48, color: "text.secondary" }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      No saved courses yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Start bookmarking courses you're interested in
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/courses")}
                      sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3 }}
                    >
                      Browse Courses
                    </Button>
                  </CardContent>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "grey.50" }}>
                          <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Institution</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Field</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Fees</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {normalizedCourses.map((course, index) => (
                            <TableRow
                              key={course.itemId || course.id}
                              hover
                              sx={{
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": { bgcolor: "primary.50" },
                              }}
                            >
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{
                                    color: "primary.main",
                                    "&:hover": { textDecoration: "underline" },
                                  }}
                                  onClick={() => navigate(`/courses/${course.itemId || course.id}`)}
                                >
                                  {course.name || course.title}
                                </Typography>
                                {course.code && (
                                  <Typography variant="caption" color="text.secondary">
                                    {course.code}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <School fontSize="small" sx={{ color: "text.secondary" }} />
                                  <Typography variant="body2">
                                    {course.institutionName || course.instituteName || course.institution || "Institution"}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={course.field}
                                  size="small"
                                  sx={{ borderRadius: 1.5, fontWeight: 500 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{course.level}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{course.duration}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600} color="success.main">
                                  {formatCourseTuition(course)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="View Course" arrow>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => navigate(`/courses/${course.itemId || course.id}`)}
                                    sx={{ transition: "all 0.2s", "&:hover": { transform: "scale(1.1)" } }}
                                  >
                                    <VisibilityRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Apply Now" arrow>
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => navigate(`/apply/${course.itemId || course.id}`)}
                                    sx={{ transition: "all 0.2s", "&:hover": { transform: "scale(1.1)" } }}
                                  >
                                    <OpenInNew fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Remove" arrow>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemove("course", course)}
                                    disabled={removeMutation.isPending}
                                    sx={{ transition: "all 0.2s", "&:hover": { transform: "scale(1.1)" } }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Card>
            </Fade>
          )}
        </Container>
      </Box>
    </Fade>
  );
}
