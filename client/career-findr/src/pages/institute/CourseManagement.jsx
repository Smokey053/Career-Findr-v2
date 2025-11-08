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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  Search,
  School,
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
    queryKey: ["instituteCourses"],
    queryFn: () => getInstitutionCourses(user.uid),
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
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Course Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage your institution's courses
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/institute/courses/new")}
            size="large"
          >
            Add New Course
          </Button>
        </Box>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Courses
                </Typography>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {allCourses.length}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-4">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Active Courses
                </Typography>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {activeCourses.length}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-4">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Inactive Courses
                </Typography>
                <Typography variant="h3" fontWeight={700} color="warning.main">
                  {inactiveCourses.length}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search courses by name or field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
          >
            <Tab label={`Active (${activeCourses.length})`} />
            <Tab label={`Inactive (${inactiveCourses.length})`} />
            <Tab label={`All (${allCourses.length})`} />
          </Tabs>

          <CardContent>
            {displayCourses.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Name</TableCell>
                      <TableCell>Field</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Applications</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayCourses.map((course) => (
                      <TableRow key={course.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <School color="primary" />
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
                          />
                        </TableCell>
                        <TableCell>{course.level || "N/A"}</TableCell>
                        <TableCell>{course.duration || "N/A"}</TableCell>
                        <TableCell>
                          <Chip
                            label={course.applicationsCount || 0}
                            size="small"
                            color="info"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={course.status}
                            size="small"
                            color={
                              course.status === "active" ? "success" : "default"
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, course)}
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
                <School sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No courses found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Start by creating your first course"}
                </Typography>
                {!searchTerm && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/institute/courses/new")}
                  >
                    Add Course
                  </Button>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => navigate(`/institute/courses/${selectedCourse?.id}`)}
        >
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit Course
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedCourse?.status === "active" ? (
            <>
              <VisibilityOff sx={{ mr: 1 }} fontSize="small" />
              Deactivate
            </>
          ) : (
            <>
              <Visibility sx={{ mr: 1 }} fontSize="small" />
              Activate
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
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
  );
}
