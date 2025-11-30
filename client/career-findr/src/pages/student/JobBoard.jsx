import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  Chip,
  Alert,
  Pagination,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Collapse,
} from "@mui/material";
import {
  SearchRounded,
  WorkRounded,
  LocationOnRounded,
  BusinessRounded,
  AttachMoneyRounded,
  ScheduleRounded,
  BookmarkRounded,
  BookmarkBorderRounded,
  FilterListRounded,
  ClearRounded,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { studentAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { searchJobs } from "../../services/jobService";
import { formatDate, toDate } from "../../utils/dateUtils";

const jobTypes = ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"];
const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Executive",
];
const locations = [
  "Maseru",
  "Mafeteng",
  "Leribe",
  "Berea",
  "Mohale's Hoek",
  "Qacha's Nek",
  "Quthing",
  "Butha-Buthe",
  "Thaba-Tseka",
];

export default function JobBoard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    experience: "",
    minSalary: "",
    maxSalary: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const itemsPerPage = 12;

  // Fetch jobs
  const {
    data: jobsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs", searchQuery, filters],
    queryFn: () =>
      searchJobs({
        search: searchQuery,
        ...filters,
      }),
  });

  // Handle both array and object response formats
  const jobs = Array.isArray(jobsData) ? jobsData : (jobsData?.jobs || []);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  // Paginate on client side
  const paginatedJobs = jobs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      type: "",
      experience: "",
      minSalary: "",
      maxSalary: "",
    });
    setPage(1);
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleApply = (jobId) => {
    navigate(`/jobs/${jobId}/apply`);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const getExperienceColor = (level) => {
    const colors = {
      "Entry Level": "success",
      "Mid Level": "info",
      "Senior Level": "warning",
      Executive: "error",
    };
    return colors[level] || "default";
  };

  const getTypeColor = (type) => {
    const colors = {
      "Full-Time": "primary",
      "Part-Time": "secondary",
      Contract: "warning",
      Internship: "success",
      Remote: "info",
    };
    return colors[type] || "default";
  };

  const normalizeSalaryValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  };

  const formatSalaryRange = (min, max, currency = "LSL") => {
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
    return null;
  };

  const isJobActive = (deadline) => {
    const deadlineDate = toDate(deadline);
    if (!deadlineDate) return true; // If no deadline, assume active
    return deadlineDate > new Date();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading job listings..." />;
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
                <WorkRounded sx={{ color: "white", fontSize: 28 }} />
              </Box>
              <Typography variant="h4" fontWeight={700}>
                Job Board
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ pl: 7.5 }}>
              Explore career opportunities and find your perfect job
            </Typography>
          </Box>
        </Fade>

        {/* Search and Filter Section */}
        <Fade in timeout={700}>
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Search Bar */}
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  placeholder="Search by job title, company, or keywords..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
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
                <Button
                  variant={showFilters ? "contained" : "outlined"}
                  startIcon={<FilterListRounded />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    minWidth: 120,
                    borderRadius: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Filters
                </Button>
              </Box>

              {/* Filters with Smooth Collapse */}
              <Collapse in={showFilters} timeout={400}>
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <div className="row g-3">
                    <div className="col-12 col-md-6 col-lg-3">
                      <TextField
                        select
                        fullWidth
                        label="Location"
                        value={filters.location}
                        onChange={(e) =>
                          handleFilterChange("location", e.target.value)
                        }
                        size="small"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      >
                        <MenuItem value="">All Locations</MenuItem>
                        {locations.map((location) => (
                          <MenuItem key={location} value={location}>
                            {location}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <TextField
                        select
                        fullWidth
                        label="Job Type"
                        value={filters.type}
                        onChange={(e) =>
                          handleFilterChange("type", e.target.value)
                        }
                        size="small"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      >
                        <MenuItem value="">All Types</MenuItem>
                        {jobTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <TextField
                        select
                        fullWidth
                        label="Experience Level"
                        value={filters.experience}
                        onChange={(e) =>
                          handleFilterChange("experience", e.target.value)
                        }
                        size="small"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      >
                        <MenuItem value="">All Levels</MenuItem>
                        {experienceLevels.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <Box display="flex" gap={1}>
                        <TextField
                          fullWidth
                          label="Min Salary"
                          value={filters.minSalary}
                          onChange={(e) =>
                            handleFilterChange("minSalary", e.target.value)
                          }
                          size="small"
                          type="number"
                          placeholder="Min"
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Max Salary"
                          value={filters.maxSalary}
                          onChange={(e) =>
                            handleFilterChange("maxSalary", e.target.value)
                          }
                          size="small"
                          type="number"
                          placeholder="Max"
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      </Box>
                    </div>
                  </div>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                      size="small"
                      startIcon={<ClearRounded />}
                      onClick={clearFilters}
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </Box>
                </Box>
              </Collapse>

              {/* Active Filters Display */}
              {(filters.location ||
                filters.type ||
                filters.experience ||
                filters.minSalary ||
                filters.maxSalary) && (
                <Fade in timeout={300}>
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
                      sx={{ alignSelf: "center", fontWeight: 500 }}
                    >
                      Active Filters:
                    </Typography>
                    {filters.location && (
                      <Chip
                        label={`Location: ${filters.location}`}
                        size="small"
                        onDelete={() => handleFilterChange("location", "")}
                        sx={{
                          borderRadius: 2,
                          transition: "all 0.2s",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      />
                    )}
                    {filters.type && (
                      <Chip
                        label={`Type: ${filters.type}`}
                        size="small"
                        onDelete={() => handleFilterChange("type", "")}
                        sx={{
                          borderRadius: 2,
                          transition: "all 0.2s",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      />
                    )}
                    {filters.experience && (
                      <Chip
                        label={`Experience: ${filters.experience}`}
                        size="small"
                        onDelete={() => handleFilterChange("experience", "")}
                        sx={{
                          borderRadius: 2,
                          transition: "all 0.2s",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      />
                    )}
                    {(filters.minSalary || filters.maxSalary) && (
                      <Chip
                        label={`Salary: ${
                          formatSalaryRange(
                            filters.minSalary,
                            filters.maxSalary
                          ) || "Custom range"
                        }`}
                        size="small"
                        onDelete={() => {
                          handleFilterChange("minSalary", "");
                          handleFilterChange("maxSalary", "");
                        }}
                        sx={{
                          borderRadius: 2,
                          transition: "all 0.2s",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      />
                    )}
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Fade>

        {/* Results Count */}
        <Fade in timeout={800}>
          <Box mb={3}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
            </Typography>
          </Box>
        </Fade>

        {/* Error State */}
        {error && (
          <Fade in timeout={400}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "error.light",
              }}
            >
              {error.response?.data?.message || "Failed to load jobs"}
            </Alert>
          </Fade>
        )}

        {/* Empty State */}
        {!isLoading && jobs.length === 0 && (
          <Fade in timeout={600}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ py: 8, textAlign: "center" }}>
                <WorkRounded
                  sx={{
                    fontSize: 80,
                    color: "text.disabled",
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  No jobs found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Try adjusting your search or filters to find more
                  opportunities
                </Typography>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Job Cards Grid */}
        {paginatedJobs.length > 0 && (
          <>
            <div className="row g-3 mb-4">
              {paginatedJobs.map((job, index) => (
                <div key={job.id} className="col-12 col-md-6 col-lg-4">
                  <Zoom in timeout={500 + (index % 6) * 100}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        borderRadius: 3,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
                          transform: "translateY(-8px)",
                          "& .job-title": {
                            color: "primary.main",
                          },
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Save Button */}
                        <Box position="absolute" top={12} right={12}>
                          <Tooltip
                            title={
                              savedJobs.has(job.id) ? "Unsave" : "Save Job"
                            }
                            arrow
                          >
                            <IconButton
                              size="small"
                              onClick={() => toggleSaveJob(job.id)}
                              sx={{
                                color: savedJobs.has(job.id)
                                  ? "primary.main"
                                  : "action.active",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  transform: "scale(1.2)",
                                  bgcolor: savedJobs.has(job.id)
                                    ? "primary.50"
                                    : "action.hover",
                                },
                              }}
                            >
                              {savedJobs.has(job.id) ? (
                                <BookmarkRounded />
                              ) : (
                                <BookmarkBorderRounded />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>

                        {/* Job Title */}
                        <Typography
                          className="job-title"
                          variant="h6"
                          fontWeight={600}
                          gutterBottom
                          sx={{
                            cursor: "pointer",
                            pr: 4,
                            transition:
                              "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                          onClick={() => handleViewDetails(job.id)}
                        >
                          {job.title}
                        </Typography>

                        {/* Company */}
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={2}
                        >
                          <BusinessRounded fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {job.companyName}
                          </Typography>
                        </Box>

                        {/* Location */}
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={1}
                        >
                          <LocationOnRounded fontSize="small" color="action" />
                          <Typography variant="body2">
                            {job.location}
                          </Typography>
                        </Box>

                        {/* Salary */}
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={2}
                        >
                          <AttachMoneyRounded fontSize="small" color="action" />
                          <Typography variant="body2" fontWeight={500}>
                            {formatSalaryRange(
                              job.salaryMin,
                              job.salaryMax,
                              job.currency || "LSL"
                            ) ||
                              job.salary ||
                              "Competitive"}
                          </Typography>
                        </Box>

                        {/* Tags */}
                        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                          <Chip
                            label={job.type}
                            size="small"
                            color={getTypeColor(job.type)}
                            sx={{ borderRadius: 2, fontWeight: 500 }}
                          />
                          <Chip
                            label={job.experienceLevel}
                            size="small"
                            color={getExperienceColor(job.experienceLevel)}
                            sx={{ borderRadius: 2, fontWeight: 500 }}
                          />
                        </Box>

                        {/* Description Preview */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 2,
                            lineHeight: 1.6,
                          }}
                        >
                          {job.description}
                        </Typography>

                        {/* Skills */}
                        {job.skills && job.skills.length > 0 && (
                          <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
                            {job.skills.slice(0, 3).map((skill, idx) => (
                              <Chip
                                key={idx}
                                label={skill}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderRadius: 2,
                                  fontSize: "0.75rem",
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    bgcolor: "primary.50",
                                    borderColor: "primary.main",
                                  },
                                }}
                              />
                            ))}
                            {job.skills.length > 3 && (
                              <Chip
                                label={`+${job.skills.length - 3} more`}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 2, fontSize: "0.75rem" }}
                              />
                            )}
                          </Box>
                        )}

                        {/* Deadline */}
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={2}
                        >
                          <ScheduleRounded fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Deadline:{" "}
                            {formatDate(job.deadline || job.applicationDeadline)}
                          </Typography>
                          {!isJobActive(job.deadline || job.applicationDeadline) && (
                            <Chip
                              label="Closed"
                              size="small"
                              color="error"
                              sx={{ borderRadius: 2, ml: 1 }}
                            />
                          )}
                        </Box>

                        {/* Actions */}
                        <Box display="flex" gap={1} mt="auto">
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleApply(job.id)}
                            disabled={!isJobActive(job.deadline || job.applicationDeadline)}
                            sx={{
                              borderRadius: 2,
                              py: 1,
                              fontWeight: 600,
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover:not(:disabled)": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                              },
                            }}
                          >
                            {isJobActive(job.deadline || job.applicationDeadline)
                              ? "Apply Now"
                              : "Expired"}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => handleViewDetails(job.id)}
                            sx={{
                              borderRadius: 2,
                              minWidth: 90,
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            Details
                          </Button>
                        </Box>
                      </CardContent>
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
        )}
      </Container>
    </Box>
  );
}
