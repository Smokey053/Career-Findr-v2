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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  LinearProgress,
} from "@mui/material";
import {
  Search,
  Person,
  LocationOn,
  School,
  Work,
  Email,
  Phone,
  FilterList,
  Visibility,
  ContactMail,
  Star,
  AttachFile,
  Download,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { companyAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { searchCandidates } from "../../services/userService";

const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Executive",
];
const educationLevels = [
  "High School",
  "Certificate",
  "Diploma",
  "Bachelor",
  "Master",
  "PhD",
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

export default function CandidateSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const itemsPerPage = 12;

  // Fetch candidates
  const {
    data: candidatesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["candidates", searchQuery, filters, page],
    queryFn: () =>
      searchCandidates({
        search: searchQuery,
        ...filters,
        page,
        limit: itemsPerPage,
      }),
  });

  const candidates = candidatesData || [];
  const totalPages = Math.ceil(candidates.length / itemsPerPage);

  // Paginate on client side
  const paginatedCandidates = candidates.slice(
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
      experience: "",
      education: "",
      skills: "",
    });
    setPage(1);
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setViewDialogOpen(true);
  };

  const handleContactCandidate = (candidate) => {
    // Open email client or messaging system
    window.location.href = `mailto:${candidate.email}?subject=Career Opportunity`;
  };

  const handleDownloadDocument = (documentUrl, documentName) => {
    window.open(documentUrl, "_blank");
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

  if (isLoading) {
    return <LoadingScreen message="Searching candidates..." />;
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Candidate Search
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover and connect with talented professionals
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {/* Search Bar */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                placeholder="Search by name, skills, education, or experience..."
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
                    <TextField
                      select
                      fullWidth
                      label="Education"
                      value={filters.education}
                      onChange={(e) =>
                        handleFilterChange("education", e.target.value)
                      }
                      size="small"
                    >
                      <MenuItem value="">All Education</MenuItem>
                      {educationLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <TextField
                      fullWidth
                      label="Skills"
                      value={filters.skills}
                      onChange={(e) =>
                        handleFilterChange("skills", e.target.value)
                      }
                      size="small"
                      placeholder="e.g., JavaScript, Python"
                    />
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
              filters.experience ||
              filters.education ||
              filters.skills) && (
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
                {filters.experience && (
                  <Chip
                    label={`Experience: ${filters.experience}`}
                    size="small"
                    onDelete={() => handleFilterChange("experience", "")}
                  />
                )}
                {filters.education && (
                  <Chip
                    label={`Education: ${filters.education}`}
                    size="small"
                    onDelete={() => handleFilterChange("education", "")}
                  />
                )}
                {filters.skills && (
                  <Chip
                    label={`Skills: ${filters.skills}`}
                    size="small"
                    onDelete={() => handleFilterChange("skills", "")}
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <Box mb={3}>
          <Typography variant="body2" color="text.secondary">
            {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}{" "}
            found
          </Typography>
        </Box>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.response?.data?.message || "Failed to load candidates"}
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && candidates.length === 0 && (
          <Card>
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No candidates found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Try adjusting your search or filters to find more candidates
              </Typography>
              <Button variant="outlined" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Candidate Cards Grid */}
        {paginatedCandidates.length > 0 && (
          <>
            <div className="row g-3 mb-4">
              {paginatedCandidates.map((candidate) => (
                <div key={candidate.id} className="col-12 col-md-6 col-lg-4">
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-4px)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Profile Header */}
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "primary.main",
                            fontSize: 24,
                            fontWeight: 600,
                          }}
                        >
                          {candidate.name.charAt(0)}
                        </Avatar>
                        <Box flexGrow={1}>
                          <Typography variant="h6" fontWeight={600}>
                            {candidate.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {candidate.currentPosition ||
                              "Available for opportunities"}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Details */}
                      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">
                          {candidate.location}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                        <Work fontSize="small" color="action" />
                        <Typography variant="body2">
                          {candidate.experienceLevel}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                        <School fontSize="small" color="action" />
                        <Typography variant="body2">
                          {candidate.education}
                        </Typography>
                      </Box>

                      {/* Experience Badge */}
                      <Chip
                        label={candidate.experienceLevel}
                        size="small"
                        color={getExperienceColor(candidate.experienceLevel)}
                        sx={{ mb: 2 }}
                      />

                      {/* Skills */}
                      {candidate.skills && candidate.skills.length > 0 && (
                        <Box mb={2}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            gutterBottom
                          >
                            Key Skills:
                          </Typography>
                          <Box
                            display="flex"
                            gap={0.5}
                            flexWrap="wrap"
                            mt={0.5}
                          >
                            {candidate.skills
                              .slice(0, 4)
                              .map((skill, index) => (
                                <Chip
                                  key={index}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            {candidate.skills.length > 4 && (
                              <Chip
                                label={`+${candidate.skills.length - 4} more`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* Profile Completeness */}
                      <Box mb={2}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={0.5}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Profile Strength
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {candidate.profileScore || 85}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={candidate.profileScore || 85}
                          color={
                            (candidate.profileScore || 85) >= 80
                              ? "success"
                              : (candidate.profileScore || 85) >= 50
                              ? "warning"
                              : "error"
                          }
                        />
                      </Box>

                      {/* Actions */}
                      <Box display="flex" gap={1} mt={2}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<ContactMail />}
                          onClick={() => handleContactCandidate(candidate)}
                        >
                          Contact
                        </Button>
                        <Tooltip title="View Full Profile">
                          <IconButton
                            color="primary"
                            onClick={() => handleViewProfile(candidate)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
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

        {/* View Profile Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "primary.main",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {selectedCandidate?.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {selectedCandidate?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCandidate?.currentPosition}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {selectedCandidate && (
              <Box>
                {/* Profile Score */}
                <Card sx={{ mb: 3, bgcolor: "primary.50" }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Profile Strength
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Rating
                        value={(selectedCandidate.profileScore || 85) / 20}
                        readOnly
                        precision={0.5}
                      />
                      <Typography variant="h5" fontWeight={700}>
                        {selectedCandidate.profileScore || 85}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Contact Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={selectedCandidate.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={selectedCandidate.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={selectedCandidate.location}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Professional Background */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Professional Background
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Work />
                    </ListItemIcon>
                    <ListItemText
                      primary="Experience Level"
                      secondary={selectedCandidate.experienceLevel}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <School />
                    </ListItemIcon>
                    <ListItemText
                      primary="Education"
                      secondary={selectedCandidate.education}
                    />
                  </ListItem>
                  {selectedCandidate.yearsOfExperience && (
                    <ListItem>
                      <ListItemText
                        primary="Years of Experience"
                        secondary={`${selectedCandidate.yearsOfExperience} years`}
                      />
                    </ListItem>
                  )}
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Skills */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Skills
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  {selectedCandidate.skills?.map((skill, index) => (
                    <Chip key={index} label={skill} />
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Bio/Summary */}
                {selectedCandidate.bio && (
                  <>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                    >
                      Professional Summary
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedCandidate.bio}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Documents */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Documents
                </Typography>
                <List dense>
                  {selectedCandidate.resume && (
                    <ListItem>
                      <ListItemIcon>
                        <AttachFile />
                      </ListItemIcon>
                      <ListItemText primary="Resume/CV" />
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDownloadDocument(
                            selectedCandidate.resume,
                            "resume"
                          )
                        }
                      >
                        <Download />
                      </IconButton>
                    </ListItem>
                  )}
                  {selectedCandidate.portfolio && (
                    <ListItem>
                      <ListItemIcon>
                        <AttachFile />
                      </ListItemIcon>
                      <ListItemText primary="Portfolio" />
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDownloadDocument(
                            selectedCandidate.portfolio,
                            "portfolio"
                          )
                        }
                      >
                        <Download />
                      </IconButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<ContactMail />}
              onClick={() => {
                handleContactCandidate(selectedCandidate);
                setViewDialogOpen(false);
              }}
            >
              Contact Candidate
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
