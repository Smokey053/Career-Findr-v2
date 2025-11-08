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
} from "@mui/material";
import {
  Search,
  Work,
  LocationOn,
  Business,
  AttachMoney,
  Schedule,
  Bookmark,
  BookmarkBorder,
  FilterList,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { studentAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { searchJobs } from "../../services/jobService";

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

  const jobs = jobsData || [];
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

  const formatSalary = (min, max) => {
    if (min && max) {
      return `M${min} - M${max}`;
    } else if (min) {
      return `M${min}+`;
    } else if (max) {
      return `Up to M${max}`;
    }
    return "Competitive";
  };

  const isJobActive = (deadline) => {
    return new Date(deadline) > new Date();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading job listings..." />;
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Job Board
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore career opportunities and find your perfect job
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
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
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant={showFilters ? "contained" : "outlined"}
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ minWidth: 120 }}
              >
                Filters
              </Button>
            </Box>

            {/* Filters */}
            {showFilters && (
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
                      />
                    </Box>
                  </div>
                </div>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button size="small" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </Box>
              </Box>
            )}

            {/* Active Filters Display */}
            {(filters.location ||
              filters.type ||
              filters.experience ||
              filters.minSalary ||
              filters.maxSalary) && (
              <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ alignSelf: "center" }}
                >
                  Active Filters:
                </Typography>
                {filters.location && (
                  <Chip
                    label={`Location: ${filters.location}`}
                    size="small"
                    onDelete={() => handleFilterChange("location", "")}
                  />
                )}
                {filters.type && (
                  <Chip
                    label={`Type: ${filters.type}`}
                    size="small"
                    onDelete={() => handleFilterChange("type", "")}
                  />
                )}
                {filters.experience && (
                  <Chip
                    label={`Experience: ${filters.experience}`}
                    size="small"
                    onDelete={() => handleFilterChange("experience", "")}
                  />
                )}
                {(filters.minSalary || filters.maxSalary) && (
                  <Chip
                    label={`Salary: ${formatSalary(
                      filters.minSalary,
                      filters.maxSalary
                    )}`}
                    size="small"
                    onDelete={() => {
                      handleFilterChange("minSalary", "");
                      handleFilterChange("maxSalary", "");
                    }}
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <Box mb={3}>
          <Typography variant="body2" color="text.secondary">
            {data?.total || 0} job{data?.total !== 1 ? "s" : ""} found
          </Typography>
        </Box>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.response?.data?.message || "Failed to load jobs"}
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && jobs.length === 0 && (
          <Card>
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Work sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No jobs found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Try adjusting your search or filters to find more opportunities
              </Typography>
              <Button variant="outlined" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Job Cards Grid */}
        {paginatedJobs.length > 0 && (
          <>
            <div className="row g-3 mb-4">
              {paginatedJobs.map((job) => (
                <div key={job.id} className="col-12 col-md-6 col-lg-4">
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-4px)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Save Button */}
                      <Box position="absolute" top={8} right={8}>
                        <Tooltip
                          title={savedJobs.has(job.id) ? "Unsave" : "Save Job"}
                        >
                          <IconButton
                            size="small"
                            onClick={() => toggleSaveJob(job.id)}
                            color={
                              savedJobs.has(job.id) ? "primary" : "default"
                            }
                          >
                            {savedJobs.has(job.id) ? (
                              <Bookmark />
                            ) : (
                              <BookmarkBorder />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {/* Job Title */}
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                        sx={{
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" },
                          pr: 4,
                        }}
                        onClick={() => handleViewDetails(job.id)}
                      >
                        {job.title}
                      </Typography>

                      {/* Company */}
                      <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                        <Business fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {job.companyName}
                        </Typography>
                      </Box>

                      {/* Location */}
                      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">{job.location}</Typography>
                      </Box>

                      {/* Salary */}
                      <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                        <AttachMoney fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </Typography>
                      </Box>

                      {/* Tags */}
                      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                        <Chip
                          label={job.type}
                          size="small"
                          color={getTypeColor(job.type)}
                        />
                        <Chip
                          label={job.experienceLevel}
                          size="small"
                          color={getExperienceColor(job.experienceLevel)}
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
                        }}
                      >
                        {job.description}
                      </Typography>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {job.skills.length > 3 && (
                            <Chip
                              label={`+${job.skills.length - 3} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}

                      {/* Deadline */}
                      <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Deadline:{" "}
                          {new Date(
                            job.applicationDeadline
                          ).toLocaleDateString()}
                        </Typography>
                        {!isJobActive(job.applicationDeadline) && (
                          <Chip label="Closed" size="small" color="error" />
                        )}
                      </Box>

                      {/* Actions */}
                      <Box display="flex" gap={1} mt={2}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleApply(job.id)}
                          disabled={!isJobActive(job.applicationDeadline)}
                        >
                          {isJobActive(job.applicationDeadline)
                            ? "Apply Now"
                            : "Expired"}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleViewDetails(job.id)}
                        >
                          Details
                        </Button>
                      </Box>
                    </CardContent>
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
        )}
      </Container>
    </Box>
  );
}
