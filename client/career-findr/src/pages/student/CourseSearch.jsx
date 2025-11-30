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
  Fade,
  Zoom,
  Collapse,
} from "@mui/material";
import {
  SearchRounded,
  LocationOnRounded,
  SchoolRounded,
  FilterListRounded,
  ArrowForwardRounded,
  VerifiedRounded,
  AccessTimeRounded,
  ClearRounded,
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
        {/* Header with Animation */}
        <Fade in timeout={600}>
          <Box mb={4}>
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
                Search Courses
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ pl: 7.5 }}>
              Find the perfect course to advance your career
            </Typography>
          </Box>
        </Fade>

        {/* Search and Filters */}
        <Fade in timeout={700}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
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
                          <SearchRounded color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        },
                        "&.Mui-focused": {
                          boxShadow: "0 4px 16px rgba(37, 99, 235, 0.15)",
                        },
                      },
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
                      sx={{ borderRadius: 2 }}
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
                      sx={{ borderRadius: 2 }}
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
              <Collapse in={!!(field || location)} timeout={300}>
                <Box
                  mt={2}
                  display="flex"
                  gap={1}
                  flexWrap="wrap"
                  alignItems="center"
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Active Filters:
                  </Typography>
                  {field && (
                    <Chip
                      label={`Field: ${field}`}
                      onDelete={() => setField("")}
                      color="primary"
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        transition: "all 0.2s",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    />
                  )}
                  {location && (
                    <Chip
                      label={`Location: ${location}`}
                      onDelete={() => setLocation("")}
                      color="primary"
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        transition: "all 0.2s",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    />
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Fade>

        {/* Results Count */}
        <Fade in timeout={800}>
          <Box mb={3}>
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              {filteredCourses.length} courses found
            </Typography>
          </Box>
        </Fade>

        {/* Course Grid */}
        {displayedCourses.length > 0 ? (
          <>
            <div className="row g-3 mb-4">
              {displayedCourses.map((course, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={course.id}>
                  <Zoom in timeout={500 + (index % 6) * 100}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
                          "& .course-icon": {
                            transform: "scale(1.1) rotate(5deg)",
                          },
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="start"
                          mb={2}
                        >
                          <Box
                            className="course-icon"
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 2,
                              background:
                                "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition:
                                "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                            }}
                          >
                            <SchoolRounded
                              sx={{ color: "white", fontSize: 28 }}
                            />
                          </Box>
                          {course.verified && (
                            <Chip
                              icon={<VerifiedRounded sx={{ fontSize: 16 }} />}
                              label="Verified"
                              size="small"
                              color="success"
                              sx={{ borderRadius: 2, fontWeight: 500 }}
                            />
                          )}
                        </Box>

                        <Typography
                          variant="h6"
                          gutterBottom
                          fontWeight={600}
                          sx={{
                            cursor: "pointer",
                            transition: "color 0.3s",
                            "&:hover": { color: "primary.main" },
                          }}
                          onClick={() => handleViewCourse(course.id)}
                        >
                          {course.name || "Course Name"}
                        </Typography>

                        <Typography
                          variant="body2"
                          gutterBottom
                          fontWeight={600}
                          color="primary.main"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <SchoolRounded sx={{ fontSize: 16 }} />
                          {course.institutionName ||
                            course.instituteName ||
                            course.institution ||
                            "Institution"}
                        </Typography>

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={1}
                        >
                          <LocationOnRounded fontSize="small" color="action" />
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
                            lineHeight: 1.6,
                          }}
                        >
                          {course.description || "Course description..."}
                        </Typography>

                        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                          <Chip
                            label={course.field || "Field"}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              transition: "all 0.2s",
                              "&:hover": {
                                bgcolor: "primary.50",
                                borderColor: "primary.main",
                              },
                            }}
                          />
                          <Chip
                            icon={<AccessTimeRounded sx={{ fontSize: 14 }} />}
                            label={course.duration || "3 years"}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                          />
                          <Chip
                            label={course.level || "Undergraduate"}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                          />
                        </Box>
                      </CardContent>

                      <Box p={3} pt={0}>
                        <Button
                          fullWidth
                          variant="contained"
                          endIcon={<ArrowForwardRounded />}
                          onClick={() => handleViewCourse(course.id)}
                          sx={{
                            borderRadius: 2,
                            py: 1.25,
                            fontWeight: 600,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  </Zoom>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Fade in timeout={900}>
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      },
                    }}
                  />
                </Box>
              </Fade>
            )}
          </>
        ) : (
          <Fade in timeout={600}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box py={8} textAlign="center">
                  <SchoolRounded
                    sx={{
                      fontSize: 80,
                      color: "text.disabled",
                      mb: 2,
                      opacity: 0.5,
                    }}
                  />
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    No courses found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Try adjusting your search filters
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<ClearRounded />}
                    onClick={() => {
                      setSearchTerm("");
                      setField("");
                      setLocation("");
                    }}
                    sx={{
                      borderRadius: 2,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Container>
    </Box>
  );
}
