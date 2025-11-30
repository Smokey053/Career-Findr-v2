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
  Fade,
  Zoom,
  Grow,
  Slide,
  Snackbar,
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
  PersonSearch,
  TuneRounded,
  Message,
  CheckCircle,
  Send,
} from "@mui/icons-material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { companyAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import { getCompanyJobApplications } from "../../services/applicationService";
import { startConversation } from "../../services/messageService";

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
  const { user } = useAuth();
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
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const itemsPerPage = 12;

  // Fetch job applications for this company - only show candidates who applied
  const {
    data: applicationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companyApplicants", user?.uid],
    queryFn: () => getCompanyJobApplications(user?.uid),
    enabled: !!user?.uid,
  });

  // Extract unique candidates from applications
  const getCandidatesFromApplications = () => {
    if (!applicationsData) return [];
    
    const candidateMap = new Map();
    applicationsData.forEach((app) => {
      if (!candidateMap.has(app.studentId)) {
        candidateMap.set(app.studentId, {
          id: app.studentId,
          name: app.studentName || app.applicantName || "Unknown",
          email: app.studentEmail || app.applicantEmail || "",
          phone: app.studentPhone || app.applicantPhone || "",
          location: app.studentLocation || app.location || "Not specified",
          education: app.studentEducation || app.education || "Not specified",
          experienceLevel: app.studentExperience || app.experienceLevel || "Entry Level",
          skills: app.studentSkills || app.skills || [],
          resume: app.resumeUrl || app.resume || null,
          currentPosition: app.currentPosition || "",
          bio: app.coverLetter || app.bio || "",
          profileScore: 80,
          appliedJobs: [{ jobId: app.jobId, jobTitle: app.jobTitle, appliedAt: app.createdAt }],
        });
      } else {
        // Add more applied jobs to existing candidate
        const candidate = candidateMap.get(app.studentId);
        candidate.appliedJobs.push({ jobId: app.jobId, jobTitle: app.jobTitle, appliedAt: app.createdAt });
      }
    });
    
    return Array.from(candidateMap.values());
  };

  const allCandidates = getCandidatesFromApplications();

  // Apply filters
  const filteredCandidates = allCandidates.filter((candidate) => {
    const matchesSearch = !searchQuery || 
      candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = !filters.location || candidate.location === filters.location;
    const matchesExperience = !filters.experience || candidate.experienceLevel === filters.experience;
    const matchesEducation = !filters.education || candidate.education === filters.education;
    const matchesSkills = !filters.skills || 
      candidate.skills?.some(skill => skill.toLowerCase().includes(filters.skills.toLowerCase()));

    return matchesSearch && matchesLocation && matchesExperience && matchesEducation && matchesSkills;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  // Paginate on client side
  const paginatedCandidates = filteredCandidates.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Message mutation
  const messageMutation = useMutation({
    mutationFn: async ({ candidate, message }) => {
      const currentUserData = {
        displayName: user.displayName || user.name || user.email,
        email: user.email,
        role: user.role,
      };
      const otherUserData = {
        displayName: candidate.name,
        email: candidate.email,
        role: "student",
      };
      return startConversation(user.uid, candidate.id, currentUserData, otherUserData, message);
    },
    onSuccess: () => {
      setSnackbar({ open: true, message: "Message sent successfully!", severity: "success" });
      setContactDialogOpen(false);
      setMessageText("");
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message || "Failed to send message", severity: "error" });
    },
  });

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
    setSelectedCandidate(candidate);
    setMessageText(`Hi ${candidate.name},\n\nI came across your application and would like to discuss a potential opportunity with you.\n\nBest regards,\n${user.displayName || user.name || "Hiring Manager"}`);
    setContactDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedCandidate) return;
    messageMutation.mutate({ candidate: selectedCandidate, message: messageText });
  };

  const handleGoToMessages = () => {
    navigate("/messages");
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
                  <PersonSearch sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    Job Applicants
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Review candidates who have applied to your job postings
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Zoom>

          {/* Search and Filter Section */}
          <Grow in timeout={800} style={{ transformOrigin: "top center" }}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
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
                          <Search color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                        },
                        "&.Mui-focused": {
                          boxShadow: "0 4px 20px rgba(37, 99, 235, 0.2)",
                        },
                      },
                    }}
                  />
                  <Button
                    variant={showFilters ? "contained" : "outlined"}
                    startIcon={<TuneRounded />}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{
                      minWidth: 130,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Filters
                  </Button>
                </Box>

                {/* Filters */}
                <Slide
                  direction="down"
                  in={showFilters}
                  mountOnEnter
                  unmountOnExit
                >
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
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      </div>
                    </div>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button
                        size="small"
                        onClick={clearFilters}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          "&:hover": { bgcolor: "error.50" },
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </Box>
                  </Box>
                </Slide>

                {/* Active Filters Display */}
                {(filters.location ||
                  filters.experience ||
                  filters.education ||
                  filters.skills) && (
                  <Fade in timeout={400}>
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
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                      {filters.experience && (
                        <Chip
                          label={`Experience: ${filters.experience}`}
                          size="small"
                          onDelete={() => handleFilterChange("experience", "")}
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                      {filters.education && (
                        <Chip
                          label={`Education: ${filters.education}`}
                          size="small"
                          onDelete={() => handleFilterChange("education", "")}
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                      {filters.skills && (
                        <Chip
                          label={`Skills: ${filters.skills}`}
                          size="small"
                          onDelete={() => handleFilterChange("skills", "")}
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                    </Box>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Grow>

          {/* Results Count */}
          <Fade in timeout={900}>
            <Box mb={3}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                {filteredCandidates.length} applicant
                {filteredCandidates.length !== 1 ? "s" : ""} found
              </Typography>
            </Box>
          </Fade>

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
                {error.response?.data?.message || "Failed to load applicants"}
              </Alert>
            </Zoom>
          )}

          {/* Empty State */}
          {!isLoading && filteredCandidates.length === 0 && (
            <Zoom in timeout={600}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
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
                    <Person sx={{ fontSize: 48, color: "text.secondary" }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    No applicants found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {allCandidates.length === 0 
                      ? "You don't have any job applicants yet. Post jobs to attract candidates!"
                      : "Try adjusting your search or filters to find more applicants"}
                  </Typography>
                  {allCandidates.length === 0 ? (
                    <Button
                      variant="contained"
                      onClick={() => navigate("/company/jobs/new")}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                      }}
                    >
                      Post a Job
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Zoom>
          )}

          {/* Candidate Cards Grid */}
          {paginatedCandidates.length > 0 && (
            <>
              <div className="row g-3 mb-4">
                {paginatedCandidates.map((candidate, index) => (
                  <div key={candidate.id} className="col-12 col-md-6 col-lg-4">
                    <Grow
                      in
                      timeout={600}
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 3,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 12px 40px rgba(37, 99, 235, 0.15)",
                            transform: "translateY(-8px)",
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          {/* Profile Header */}
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            mb={2}
                          >
                            <Avatar
                              sx={{
                                width: 60,
                                height: 60,
                                bgcolor: "primary.main",
                                fontSize: 24,
                                fontWeight: 700,
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              {candidate.name.charAt(0)}
                            </Avatar>
                            <Box flexGrow={1}>
                              <Typography variant="h6" fontWeight={700}>
                                {candidate.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {candidate.currentPosition ||
                                  "Available for opportunities"}
                              </Typography>
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          {/* Details */}
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1.5}
                          >
                            <LocationOn
                              fontSize="small"
                              sx={{ color: "primary.main" }}
                            />
                            <Typography variant="body2">
                              {candidate.location}
                            </Typography>
                          </Box>

                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1.5}
                          >
                            <Work
                              fontSize="small"
                              sx={{ color: "secondary.main" }}
                            />
                            <Typography variant="body2">
                              {candidate.experienceLevel}
                            </Typography>
                          </Box>

                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={2}
                          >
                            <School
                              fontSize="small"
                              sx={{ color: "success.main" }}
                            />
                            <Typography variant="body2">
                              {candidate.education}
                            </Typography>
                          </Box>

                          {/* Experience Badge */}
                          <Chip
                            label={candidate.experienceLevel}
                            size="small"
                            color={getExperienceColor(
                              candidate.experienceLevel
                            )}
                            sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}
                          />

                          {/* Skills */}
                          {candidate.skills && candidate.skills.length > 0 && (
                            <Box mb={2}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={600}
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
                                  .map((skill, skillIndex) => (
                                    <Chip
                                      key={skillIndex}
                                      label={skill}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        borderRadius: 2,
                                        fontSize: "0.7rem",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                          bgcolor: "primary.50",
                                          borderColor: "primary.main",
                                        },
                                      }}
                                    />
                                  ))}
                                {candidate.skills.length > 4 && (
                                  <Chip
                                    label={`+${
                                      candidate.skills.length - 4
                                    } more`}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{ borderRadius: 2, fontSize: "0.7rem" }}
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
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={500}
                              >
                                Profile Strength
                              </Typography>
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                color="primary.main"
                              >
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
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: "grey.200",
                              }}
                            />
                          </Box>

                          {/* Actions */}
                          <Box display="flex" gap={1} mt="auto" pt={2}>
                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<ContactMail />}
                              onClick={() => handleContactCandidate(candidate)}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                py: 1,
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow:
                                    "0 6px 20px rgba(37, 99, 235, 0.4)",
                                },
                              }}
                            >
                              Contact
                            </Button>
                            <Tooltip title="View Full Profile" arrow>
                              <IconButton
                                color="primary"
                                onClick={() => handleViewProfile(candidate)}
                                sx={{
                                  border: "1px solid",
                                  borderColor: "primary.main",
                                  borderRadius: 2,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    bgcolor: "primary.main",
                                    color: "white",
                                  },
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Fade in timeout={1000}>
                  <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(e, value) => setPage(value)}
                      color="primary"
                      size="large"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: 2,
                          fontWeight: 600,
                          transition: "all 0.3s ease",
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

          {/* View Profile Dialog */}
          <Dialog
            open={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            maxWidth="md"
            fullWidth
            TransitionComponent={Zoom}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              },
            }}
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                color: "white",
                py: 3,
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "rgba(255,255,255,0.2)",
                    fontSize: 24,
                    fontWeight: 700,
                    backdropFilter: "blur(10px)",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {selectedCandidate?.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {selectedCandidate?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {selectedCandidate?.currentPosition}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              {selectedCandidate && (
                <Box>
                  {/* Profile Score */}
                  <Card
                    sx={{
                      mb: 3,
                      background:
                        "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
                      borderRadius: 3,
                      border: "1px solid rgba(37, 99, 235, 0.2)",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        Profile Strength
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Rating
                          value={(selectedCandidate.profileScore || 85) / 20}
                          readOnly
                          precision={0.5}
                          sx={{ color: "primary.main" }}
                        />
                        <Typography
                          variant="h4"
                          fontWeight={800}
                          color="primary.main"
                        >
                          {selectedCandidate.profileScore || 85}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Email fontSize="small" color="primary" />
                    Contact Information
                  </Typography>
                  <List
                    dense
                    sx={{ bgcolor: "grey.50", borderRadius: 2, mb: 2 }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={selectedCandidate.email}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          variant: "body2",
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedCandidate.phone}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          variant: "body2",
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={selectedCandidate.location}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          variant: "body2",
                        }}
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  {/* Professional Background */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Work fontSize="small" color="secondary" />
                    Professional Background
                  </Typography>
                  <List
                    dense
                    sx={{ bgcolor: "grey.50", borderRadius: 2, mb: 2 }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <Work color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Experience Level"
                        secondary={selectedCandidate.experienceLevel}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          variant: "body2",
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <School color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Education"
                        secondary={selectedCandidate.education}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          variant: "body2",
                        }}
                      />
                    </ListItem>
                    {selectedCandidate.yearsOfExperience && (
                      <ListItem>
                        <ListItemText
                          primary="Years of Experience"
                          secondary={`${selectedCandidate.yearsOfExperience} years`}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            variant: "body2",
                          }}
                        />
                      </ListItem>
                    )}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  {/* Skills */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Star fontSize="small" color="warning" />
                    Skills
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {selectedCandidate.skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="primary"
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Bio/Summary */}
                  {selectedCandidate.bio && (
                    <>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        gutterBottom
                      >
                        Professional Summary
                      </Typography>
                      <Typography
                        variant="body2"
                        paragraph
                        sx={{
                          bgcolor: "grey.50",
                          p: 2,
                          borderRadius: 2,
                          lineHeight: 1.8,
                        }}
                      >
                        {selectedCandidate.bio}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                    </>
                  )}

                  {/* Documents */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <AttachFile fontSize="small" color="primary" />
                    Documents
                  </Typography>
                  <List dense sx={{ bgcolor: "grey.50", borderRadius: 2 }}>
                    {selectedCandidate.resume && (
                      <ListItem
                        sx={{
                          transition: "all 0.2s ease",
                          borderRadius: 2,
                          "&:hover": { bgcolor: "primary.50" },
                        }}
                      >
                        <ListItemIcon>
                          <AttachFile color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Resume/CV"
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDownloadDocument(
                              selectedCandidate.resume,
                              "resume"
                            )
                          }
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            "&:hover": { bgcolor: "primary.dark" },
                          }}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </ListItem>
                    )}
                    {selectedCandidate.portfolio && (
                      <ListItem
                        sx={{
                          transition: "all 0.2s ease",
                          borderRadius: 2,
                          "&:hover": { bgcolor: "primary.50" },
                        }}
                      >
                        <ListItemIcon>
                          <AttachFile color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Portfolio"
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDownloadDocument(
                              selectedCandidate.portfolio,
                              "portfolio"
                            )
                          }
                          sx={{
                            bgcolor: "secondary.main",
                            color: "white",
                            "&:hover": { bgcolor: "secondary.dark" },
                          }}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                onClick={() => setViewDialogOpen(false)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<ContactMail />}
                onClick={() => {
                  handleContactCandidate(selectedCandidate);
                  setViewDialogOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
                  },
                }}
              >
                Contact Candidate
              </Button>
            </DialogActions>
          </Dialog>

          {/* Contact/Message Dialog */}
          <Dialog
            open={contactDialogOpen}
            onClose={() => setContactDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Zoom}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              },
            }}
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "white",
                py: 3,
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Message sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Send Message
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    to {selectedCandidate?.name}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3, mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Your Message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write your message here..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                This message will be sent directly to the candidate's inbox on Career Findr.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                onClick={() => setContactDialogOpen(false)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={handleGoToMessages}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                View All Messages
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={messageMutation.isPending ? null : <Send />}
                onClick={handleSendMessage}
                disabled={!messageText.trim() || messageMutation.isPending}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  },
                }}
              >
                {messageMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success/Error Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
              icon={snackbar.severity === "success" ? <CheckCircle /> : undefined}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Fade>
  );
}
