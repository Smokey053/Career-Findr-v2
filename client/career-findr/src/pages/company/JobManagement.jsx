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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  Search,
  Work,
  People,
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
              Job Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Post and manage job openings for your company
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/company/jobs/new")}
            size="large"
          >
            Post New Job
          </Button>
        </Box>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Jobs
                </Typography>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {allJobs.length}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-4">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Active Postings
                </Typography>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {activeJobs.length}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-4">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Applicants
                </Typography>
                <Typography variant="h3" fontWeight={700} color="info.main">
                  {allJobs.reduce(
                    (sum, job) => sum + (job.applicantsCount || 0),
                    0
                  )}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search jobs by title, location, or type..."
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

        {/* Jobs Table */}
        <Card>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
          >
            <Tab label={`Active (${activeJobs.length})`} />
            <Tab label={`Closed (${closedJobs.length})`} />
            <Tab label={`All (${allJobs.length})`} />
          </Tabs>

          <CardContent>
            {displayJobs.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell>Applicants</TableCell>
                      <TableCell>Posted</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayJobs.map((job) => (
                      <TableRow key={job.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Work color="primary" />
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
                          />
                        </TableCell>
                        <TableCell>{job.experience || "N/A"}</TableCell>
                        <TableCell>
                          <Chip
                            icon={<People />}
                            label={job.applicantsCount || 0}
                            size="small"
                            color="info"
                            onClick={() =>
                              navigate(`/company/jobs/${job.id}/applicants`)
                            }
                            sx={{ cursor: "pointer" }}
                          />
                        </TableCell>
                        <TableCell>
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={job.status}
                            size="small"
                            color={
                              job.status === "active" ? "success" : "default"
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, job)}
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
                <Work sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No jobs found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Start by posting your first job opening"}
                </Typography>
                {!searchTerm && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/company/jobs/new")}
                  >
                    Post Job
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
        <MenuItem onClick={() => navigate(`/company/jobs/${selectedJob?.id}`)}>
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleViewApplicants}>
          <People sx={{ mr: 1 }} fontSize="small" />
          View Applicants ({selectedJob?.applicantsCount || 0})
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit Job
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedJob?.status === "active" ? (
            <>
              <VisibilityOff sx={{ mr: 1 }} fontSize="small" />
              Close Posting
            </>
          ) : (
            <>
              <Visibility sx={{ mr: 1 }} fontSize="small" />
              Reopen Posting
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
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone and will remove all associated applications."
        confirmText="Delete"
        confirmColor="error"
        onConfirm={() => deleteMutation.mutate(deleteDialog.jobId)}
        onCancel={() => setDeleteDialog({ open: false, jobId: null })}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
