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
  WorkOutlineOutlined,
  PeopleOutlined,
  CheckCircleOutlined,
  BlockOutlined,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";
import {
  getCompanyJobs,
  deleteJob,
  updateJob,
} from "../../services/jobService";
import { formatDate } from "../../utils/dateUtils";

// Animation timing constants
const FADE_DURATION = 800;
const ZOOM_DURATION = 500;
const STAGGER_DELAY = 100;

export default function JobManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    jobId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // Fetch jobs
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["companyJobs"],
    queryFn: () => getCompanyJobs(user.uid),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (jobId) => deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries(["companyJobs"]);
      setDeleteDialog({ open: false, jobId: null });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ jobId, status }) => updateJob(jobId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["companyJobs"]);
    },
  });

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleEdit = () => {
    navigate(`/company/jobs/edit/${selectedJob.id}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialog({ open: true, jobId: selectedJob.id });
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    const newStatus = selectedJob.status === "active" ? "closed" : "active";
    toggleStatusMutation.mutate({
      jobId: selectedJob.id,
      status: newStatus,
    });
    handleMenuClose();
  };

  const handleViewApplicants = () => {
    navigate(`/company/jobs/${selectedJob.id}/applicants`);
    handleMenuClose();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading jobs..." />;
  }

  const allJobs = jobs || [];
  const activeJobs = allJobs.filter((j) => j.status === "active");
  const closedJobs = allJobs.filter((j) => j.status === "closed");

  // Filter jobs based on search
  const getFilteredJobs = (jobList) => {
    if (!searchTerm) return jobList;
    return jobList.filter(
      (job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const displayJobs =
    tabValue === 0
      ? getFilteredJobs(activeJobs)
      : tabValue === 1
      ? getFilteredJobs(closedJobs)
      : getFilteredJobs(allJobs);

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
                      Job Management
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Post and manage job openings for your company
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={() => navigate("/company/jobs/new")}
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
                    Post New Job
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
                        <WorkOutlineOutlined />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Total Jobs
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color="primary.main"
                        >
                          {allJobs.length}
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
                          Active Postings
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color="success.main"
                        >
                          {activeJobs.length}
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
                          bgcolor: "info.main",
                          color: "white",
                          borderRadius: 2,
                          p: 1.5,
                          display: "flex",
                        }}
                      >
                        <PeopleOutlined />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Total Applicants
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color="info.main"
                        >
                          {allJobs.reduce(
                            (sum, job) => sum + (job.applicantsCount || 0),
                            0
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
          </div>

          {/* Search */}
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
                  placeholder="Search jobs by title, location, or type..."
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

          {/* Jobs Table */}
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
                <Tab label={`Active (${activeJobs.length})`} />
                <Tab label={`Closed (${closedJobs.length})`} />
                <Tab label={`All (${allJobs.length})`} />
              </Tabs>

              <CardContent sx={{ p: 0 }}>
                {displayJobs.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "grey.50" }}>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Job Title
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Location
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Experience
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Applicants
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Posted</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displayJobs.map((job, index) => (
                          <TableRow
                            key={job.id}
                            hover
                            sx={{
                              transition: "all 0.2s ease",
                              "&:hover": { bgcolor: "primary.50" },
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
                                  <WorkOutlineOutlined fontSize="small" />
                                </Box>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {job.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {job.department || "General"}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{job.location || "N/A"}</TableCell>
                            <TableCell>
                              <Chip
                                label={job.type || "Full-time"}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                              />
                            </TableCell>
                            <TableCell>{job.experience || "N/A"}</TableCell>
                            <TableCell>
                              <Chip
                                icon={<PeopleOutlined sx={{ fontSize: 16 }} />}
                                label={job.applicantsCount || 0}
                                size="small"
                                color="info"
                                onClick={() =>
                                  navigate(`/company/jobs/${job.id}/applicants`)
                                }
                                sx={{
                                  cursor: "pointer",
                                  borderRadius: 2,
                                  fontWeight: 600,
                                  transition: "all 0.2s ease",
                                  "&:hover": { transform: "scale(1.05)" },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {formatDate(job.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={job.status}
                                size="small"
                                color={
                                  job.status === "active"
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
                                onClick={(e) => handleMenuOpen(e, job)}
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
                    <Box
                      sx={{
                        bgcolor: "primary.50",
                        borderRadius: "50%",
                        width: 100,
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <WorkOutlineOutlined
                        sx={{ fontSize: 50, color: "primary.main" }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No jobs found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {searchTerm
                        ? "Try adjusting your search"
                        : "Start by posting your first job opening"}
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="contained"
                        startIcon={<AddOutlined />}
                        onClick={() => navigate("/company/jobs/new")}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          transition: "all 0.3s ease",
                          "&:hover": { transform: "translateY(-2px)" },
                        }}
                      >
                        Post Job
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
              minWidth: 200,
            },
          }}
        >
          <MenuItem
            onClick={() => navigate(`/company/jobs/${selectedJob?.id}`)}
            sx={{ gap: 1.5, py: 1.5 }}
          >
            <VisibilityOutlined fontSize="small" color="primary" />
            View Details
          </MenuItem>
          <MenuItem onClick={handleViewApplicants} sx={{ gap: 1.5, py: 1.5 }}>
            <PeopleOutlined fontSize="small" color="info" />
            View Applicants ({selectedJob?.applicantsCount || 0})
          </MenuItem>
          <MenuItem onClick={handleEdit} sx={{ gap: 1.5, py: 1.5 }}>
            <EditOutlined fontSize="small" color="primary" />
            Edit Job
          </MenuItem>
          <MenuItem onClick={handleToggleStatus} sx={{ gap: 1.5, py: 1.5 }}>
            {selectedJob?.status === "active" ? (
              <>
                <VisibilityOffOutlined fontSize="small" color="warning" />
                Close Posting
              </>
            ) : (
              <>
                <VisibilityOutlined fontSize="small" color="success" />
                Reopen Posting
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
          title="Delete Job Posting"
          message="Are you sure you want to delete this job posting? This action cannot be undone and will remove all associated applications."
          confirmText="Delete"
          confirmColor="error"
          onConfirm={() => deleteMutation.mutate(deleteDialog.jobId)}
          onCancel={() => setDeleteDialog({ open: false, jobId: null })}
          loading={deleteMutation.isPending}
        />
      </Box>
    </Fade>
  );
}
