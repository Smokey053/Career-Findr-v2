import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
  Pagination,
} from "@mui/material";
import {
  Search,
  LocationOn,
  School,
  FilterList,
  ArrowForward,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { studentAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { getAllCourses } from "../../services/courseService";

export default function CourseSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [field, setField] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const coursesPerPage = 9;

  // Fetch courses
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["courses", field],
    queryFn: () => getAllCourses({ field }),
  });

  const courses = coursesData || [];

  // Client-side search filtering
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchTerm ||
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !location || course.location?.toLowerCase() === location.toLowerCase();
    return matchesSearch && matchesLocation;
  });

  const fields = [
    "Computer Science",
    "Engineering",
    "Business",
    "Medicine",
    "Education",
    "Arts",
    "Law",
    "Sciences",
  ];

  const locations = [
    "Maseru",
    "Leribe",
    "Mafeteng",
    "Mohale's Hoek",
    "Quthing",
    "Mokhotlong",
  ];

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const displayedCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading courses..." />;
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Search Courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find the perfect course to advance your career
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <TextField
                  fullWidth
                  placeholder="Search courses, institutions..."
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
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <FormControl fullWidth>
                  <InputLabel>Field of Study</InputLabel>
                  <Select
                    value={field}
                    label="Field of Study"
                    onChange={(e) => setField(e.target.value)}
                  >
                    <MenuItem value="">All Fields</MenuItem>
                    {fields.map((f) => (
                      <MenuItem key={f} value={f}>
                        {f}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={location}
                    label="Location"
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    {locations.map((loc) => (
                      <MenuItem key={loc} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Active Filters */}
            {(field || location) && (
              <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                {field && (
                  <Chip
                    label={`Field: ${field}`}
                    onDelete={() => setField("")}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {location && (
                  <Chip
                    label={`Location: ${location}`}
                    onDelete={() => setLocation("")}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <Box mb={3}>
          <Typography variant="h6" color="text.secondary">
            {filteredCourses.length} courses found
          </Typography>
        </Box>

        {/* Course Grid */}
        {displayedCourses.length > 0 ? (
          <>
            <div className="row g-3 mb-4">
              {displayedCourses.map((course) => (
                <div className="col-12 col-md-6 col-lg-4" key={course.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="start"
                        mb={2}
                      >
                        <School color="primary" sx={{ fontSize: 40 }} />
                        {course.verified && (
                          <Chip label="Verified" size="small" color="success" />
                        )}
                      </Box>

                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        {course.name || "Course Name"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="primary"
                        gutterBottom
                        fontWeight={500}
                      >
                        {course.instituteName || "Institution Name"}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {course.location || "Location"}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {course.description || "Course description..."}
                      </Typography>

                      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        <Chip
                          label={course.field || "Field"}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={course.duration || "3 years"}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={course.level || "Undergraduate"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>

                    <Box p={2} pt={0}>
                      <Button
                        fullWidth
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={() => handleViewCourse(course.id)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        ) : (
          <Card>
            <CardContent>
              <Box py={8} textAlign="center">
                <School sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No courses found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Try adjusting your search filters
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm("");
                    setField("");
                    setLocation("");
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
