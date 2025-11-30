import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Alert,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Fade,
  Zoom,
  Grow,
} from "@mui/material";
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreVert,
  VisibilityOutlined,
  VisibilityOffOutlined,
  SearchOutlined,
  SchoolOutlined,
  MenuBookOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instituteAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";
import {
  getInstitutionCourses,
  deleteCourse,
  updateCourse,
} from "../../services/courseService";

// Animation timing constants
const FADE_DURATION = 800;
const ZOOM_DURATION = 500;
const STAGGER_DELAY = 100;

export default function CourseManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    courseId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // Fetch courses
  const { data: courses, isLoading } = useQuery({
    queryKey: ["instituteCourses", user?.uid],
    queryFn: () => getInstitutionCourses(user.uid),
    enabled: !!user?.uid,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (courseId) => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries(["instituteCourses"]);
      setDeleteDialog({ open: false, courseId: null });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ courseId, status }) => updateCourse(courseId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["instituteCourses"]);
    },
  });

  const handleMenuOpen = (event, course) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourse(null);
  };

  const handleEdit = () => {
    navigate(`/institute/courses/edit/${selectedCourse.id}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialog({ open: true, courseId: selectedCourse.id });
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    const newStatus =
      selectedCourse.status === "active" ? "inactive" : "active";
    toggleStatusMutation.mutate({
      courseId: selectedCourse.id,
      status: newStatus,
    });
    handleMenuClose();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading courses..." />;
  }

  const allCourses = courses || [];
  const activeCourses = allCourses.filter((c) => c.status === "active");
  const inactiveCourses = allCourses.filter((c) => c.status === "inactive");

  // Filter courses based on search
  const getFilteredCourses = (courseList) => {
    if (!searchTerm) return courseList;
    return courseList.filter(
      (course) =>
        course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.field?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const displayCourses =
    tabValue === 0
      ? getFilteredCourses(activeCourses)
      : tabValue === 1
      ? getFilteredCourses(inactiveCourses)
      : getFilteredCourses(allCourses);

  return (
    <Fade in timeout={FADE_DURATION}>
      <Box className="min-vh-100" bgcolor="background.default">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header with Gradient */}
          <Zoom in timeout={ZOOM_DURATION}>
            <Card
              sx={{
                mb: 4,
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                color: "white",
                borderRadius: 3,
                boxShadow: "0 10px 40px rgba(37, 99, 235, 0.3)",
              }}
            >
              <CardContent sx={{ py: 3, px: 4 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box>
                    <Typography variant="h4" gutterBottom fontWeight={700}>
                      Course Management
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Create and manage your institution's courses
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={() => navigate("/institute/courses/new")}
                    size="large"
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 3,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.9)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    Add New Course
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Zoom>

          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-4">
              <Grow in timeout={600} style={{ transformOrigin: "0 0 0" }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          borderRadius: 2,
                          p: 1.5,
                          display: "flex",
                        }}
                      >
                        <MenuBookOutlined />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Total Courses
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color="primary.main"
                        >
                          {allCourses.length}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
            <div className="col-12 col-sm-4">
              <Grow in timeout={700} style={{ transformOrigin: "0 0 0" }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          bgcolor: "success.main",
                          color: "white",
                          borderRadius: 2,
                          p: 1.5,
                          display: "flex",
                        }}
                      >
                        <CheckCircleOutlined />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Active Courses
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color="success.main"
                        >
                          {activeCourses.length}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
            <div className="col-12 col-sm-4">
              <Grow in timeout={800} style={{ transformOrigin: "0 0 0" }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          bgcolor: "warning.main",
                          color: "white",
                          borderRadius: 2,
                          p: 1.5,
                          display: "flex",
                        }}
                      >
                        <PauseCircleOutlined />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Inactive Courses
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color="warning.main"
                        >
                          {inactiveCourses.length}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
          </div>

          {/* Search and Filters */}
          <Grow in timeout={900} style={{ transformOrigin: "0 0 0" }}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search courses by name or field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grow>

          {/* Courses Table */}
          <Grow in timeout={1000} style={{ transformOrigin: "0 0 0" }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  px: 2,
                  bgcolor: "background.default",
                  "& .MuiTab-root": {
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <Tab label={`Active (${activeCourses.length})`} />
                <Tab label={`Inactive (${inactiveCourses.length})`} />
                <Tab label={`All (${allCourses.length})`} />
              </Tabs>

              <CardContent sx={{ p: 0 }}>
                {displayCourses.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "grey.50" }}>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Course Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Duration
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Applications
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displayCourses.map((course, index) => (
                          <TableRow
                            key={course.id}
                            hover
                            sx={{
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "primary.50",
                              },
                            }}
                          >
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1.5}>
                                <Box
                                  sx={{
                                    bgcolor: "primary.100",
                                    color: "primary.main",
                                    borderRadius: 2,
                                    p: 1,
                                    display: "flex",
                                  }}
                                >
                                  <SchoolOutlined fontSize="small" />
                                </Box>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {course.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {course.code || "N/A"}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={course.field || "N/A"}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                              />
                            </TableCell>
                            <TableCell>{course.level || "N/A"}</TableCell>
                            <TableCell>{course.duration || "N/A"}</TableCell>
                            <TableCell>
                              <Chip
                                label={course.applicationsCount || 0}
                                size="small"
                                color="info"
                                sx={{ borderRadius: 2, fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={course.status}
                                size="small"
                                color={
                                  course.status === "active"
                                    ? "success"
                                    : "default"
                                }
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 600,
                                  textTransform: "capitalize",
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, course)}
                                sx={{
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    bgcolor: "primary.100",
                                    color: "primary.main",
                                  },
                                }}
                              >
                                <MoreVert />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box py={8} textAlign="center">
                    <SchoolOutlined
                      sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No courses found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {searchTerm
                        ? "Try adjusting your search"
                        : "Start by creating your first course"}
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="contained"
                        startIcon={<AddOutlined />}
                        onClick={() => navigate("/institute/courses/new")}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          transition: "all 0.3s ease",
                          "&:hover": { transform: "translateY(-2px)" },
                        }}
                      >
                        Add Course
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grow>
        </Container>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              minWidth: 180,
            },
          }}
        >
          <MenuItem
            onClick={() => navigate(`/institute/courses/${selectedCourse?.id}`)}
            sx={{ gap: 1.5, py: 1.5 }}
          >
            <VisibilityOutlined fontSize="small" color="primary" />
            View Details
          </MenuItem>
          <MenuItem onClick={handleEdit} sx={{ gap: 1.5, py: 1.5 }}>
            <EditOutlined fontSize="small" color="primary" />
            Edit Course
          </MenuItem>
          <MenuItem onClick={handleToggleStatus} sx={{ gap: 1.5, py: 1.5 }}>
            {selectedCourse?.status === "active" ? (
              <>
                <VisibilityOffOutlined fontSize="small" color="warning" />
                Deactivate
              </>
            ) : (
              <>
                <VisibilityOutlined fontSize="small" color="success" />
                Activate
              </>
            )}
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{ color: "error.main", gap: 1.5, py: 1.5 }}
          >
            <DeleteOutlined fontSize="small" />
            Delete
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          title="Delete Course"
          message="Are you sure you want to delete this course? This action cannot be undone and will affect all associated applications."
          confirmText="Delete"
          confirmColor="error"
          onConfirm={() => deleteMutation.mutate(deleteDialog.courseId)}
          onCancel={() => setDeleteDialog({ open: false, courseId: null })}
          loading={deleteMutation.isPending}
        />
      </Box>
    </Fade>
  );
}
