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
} from "@mui/material";
import {
  BookmarkBorder,
  Work,
  School,
  LocationOn,
  Business,
  AttachMoney,
  Delete,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getSavedItems,
  removeSavedItem,
} from "../../services/savedItemsService";

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

  const formatSalary = (min, max) => {
    if (min && max) return `M${min} - M${max}`;
    if (min) return `M${min}+`;
    if (max) return `Up to M${max}`;
    return "Competitive";
  };

  if (!user?.uid || isLoading) {
    return <LoadingScreen message="Loading saved items..." />;
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Saved Items
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your bookmarked jobs and courses
          </Typography>
        </Box>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
          >
            <Tab label={`Jobs (${savedJobs.length})`} />
            <Tab label={`Courses (${savedCourses.length})`} />
          </Tabs>
        </Card>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message || "Failed to load saved items"}
          </Alert>
        )}

        {/* Jobs Tab */}
        {currentTab === 0 && (
          <>
            {savedJobs.length === 0 ? (
              <Card>
                <CardContent sx={{ py: 8, textAlign: "center" }}>
                  <BookmarkBorder
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    No saved jobs yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start bookmarking jobs you're interested in
                  </Typography>
                  <Button variant="outlined" onClick={() => navigate("/jobs")}>
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="row g-3">
                {savedJobs.map((job) => (
                  <div key={job.id} className="col-12 col-md-6">
                    <Card
                      sx={{
                        height: "100%",
                        "&:hover": { boxShadow: 6 },
                        position: "relative",
                      }}
                    >
                      <CardContent>
                        <Box position="absolute" top={8} right={8}>
                          <Tooltip title="Remove from saved">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemove("job", job)}
                              disabled={removeMutation.isPending}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight={600}
                          gutterBottom
                          sx={{
                            pr: 5,
                            cursor: "pointer",
                            "&:hover": { color: "primary.main" },
                          }}
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          {job.title}
                        </Typography>

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={1}
                        >
                          <Business fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {job.companyName}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={1}
                        >
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2">
                            {job.location}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={2}
                        >
                          <AttachMoney fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </Typography>
                        </Box>

                        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                          <Chip label={job.type} size="small" color="primary" />
                          <Chip label={job.experienceLevel} size="small" />
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => navigate(`/jobs/${job.id}/apply`)}
                        >
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Courses Tab */}
        {currentTab === 1 && (
          <>
            {savedCourses.length === 0 ? (
              <Card>
                <CardContent sx={{ py: 8, textAlign: "center" }}>
                  <BookmarkBorder
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    No saved courses yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start bookmarking courses you're interested in
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/courses")}
                  >
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="row g-3">
                {savedCourses.map((course) => (
                  <div key={course.id} className="col-12 col-md-6">
                    <Card
                      sx={{
                        height: "100%",
                        "&:hover": { boxShadow: 6 },
                        position: "relative",
                      }}
                    >
                      <CardContent>
                        <Box position="absolute" top={8} right={8}>
                          <Tooltip title="Remove from saved">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemove("course", course)}
                              disabled={removeMutation.isPending}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight={600}
                          gutterBottom
                          sx={{
                            pr: 5,
                            cursor: "pointer",
                            "&:hover": { color: "primary.main" },
                          }}
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          {course.name}
                        </Typography>

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={2}
                        >
                          <School fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {course.instituteName}
                          </Typography>
                        </Box>

                        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                          <Chip label={course.field} size="small" />
                          <Chip label={course.level} size="small" />
                          <Chip label={course.duration} size="small" />
                          <Chip
                            label={`M${course.fees}/year`}
                            size="small"
                            color="primary"
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 2,
                          }}
                        >
                          {course.description}
                        </Typography>

                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => navigate(`/apply/${course.id}`)}
                        >
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
