/**
 * @file AdminDashboard component.
 * This component serves as the main dashboard for administrators, providing an overview of platform statistics,
 * pending approvals for institutions and companies, and quick access to user management functionalities.
 * It uses React Query for data fetching and mutations to handle user approvals and rejections.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  Dashboard,
  People,
  School,
  Business,
  CheckCircle,
  Cancel,
  Visibility,
  TrendingUp,
  Assignment,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPlatformStats,
  getUsers,
  approveUser,
  rejectUser,
} from "../../services/userService";

/**
 * Renders the main administrative dashboard.
 * Features include statistical cards, platform metrics, and tabs for managing pending user approvals.
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [approveDialog, setApproveDialog] = useState({
    open: false,
    id: null,
    type: null,
  });
  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    id: null,
    type: null,
  });

  /**
   * Fetches platform-wide statistics using React Query.
   * @queryKey ['adminStats']
   */
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getPlatformStats,
  });

  /**
   * Fetches users with a 'pending' status for approval.
   * @queryKey ['pendingUsers']
   */
  const { data: pendingUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["pendingUsers"],
    queryFn: () => getUsers({ status: "pending" }),
  });

  /**
   * Fetches all users for display in the total users stat.
   * @queryKey ['allUsers']
   */
  const { data: allUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => getUsers(),
  });

  /**
   * Mutation for approving a user. Invalidates relevant queries on success.
   */
  const approveMutation = useMutation({
    mutationFn: ({ userId }) => approveUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingUsers"]);
      queryClient.invalidateQueries(["allUsers"]);
      queryClient.invalidateQueries(["adminStats"]);
      setApproveDialog({ open: false, id: null, type: null });
    },
  });

  /**
   * Mutation for rejecting a user. Invalidates relevant queries on success.
   */
  const rejectMutation = useMutation({
    mutationFn: ({ userId }) => rejectUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingUsers"]);
      queryClient.invalidateQueries(["allUsers"]);
      setRejectDialog({ open: false, id: null, type: null });
    },
  });

  if (statsLoading) {
    return <LoadingScreen message="Loading admin dashboard..." />;
  }

  const pendingInstitutes =
    pendingUsers?.filter((u) => u.role === "institute") || [];
  const pendingCompanies =
    pendingUsers?.filter((u) => u.role === "company") || [];

  // Data for the main statistics cards at the top of the dashboard.
  const dashboardStats = [
    {
      title: "Total Users",
      value: allUsers?.length || 0,
      icon: People,
      color: "primary",
      subtitle: `${stats?.activeUsers || 0} active`,
    },
    {
      title: "Pending Approvals",
      value: pendingUsers?.length || 0,
      icon: Assignment,
      color: "warning",
      subtitle: `${pendingInstitutes.length} institutes, ${pendingCompanies.length} companies`,
    },
    {
      title: "Total Institutions",
      value: stats?.totalInstitutions || 0,
      icon: School,
      color: "info",
      subtitle: `${stats?.activeInstitutions || 0} active`,
    },
    {
      title: "Total Companies",
      value: stats?.totalCompanies || 0,
      icon: Business,
      color: "success",
      subtitle: `${stats?.activeCompanies || 0} active`,
    },
  ];

  /**
   * Opens the confirmation dialog for approving a user.
   * @param {string} userId - The ID of the user to approve.
   * @param {string} type - The role of the user (e.g., 'institute', 'company').
   */
  const handleApprove = (userId, type) => {
    setApproveDialog({ open: true, id: userId, type });
  };

  /**
   * Opens the confirmation dialog for rejecting a user.
   * @param {string} userId - The ID of the user to reject.
   * @param {string} type - The role of the user.
   */
  const handleReject = (userId, type) => {
    setRejectDialog({ open: true, id: userId, type });
  };

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Welcome back, {user?.name || "Admin"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage users, approve institutions and companies, monitor platform
            activity
          </Typography>
        </Box>

        {/* Pending Approvals Alert */}
        {pendingUsers && pendingUsers.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              You have {pendingUsers.length} pending approval
              {pendingUsers.length > 1 ? "s" : ""} waiting for review.
            </Typography>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {stat.title}
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color={`${stat.color}.main`}
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.subtitle}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: `${stat.color}.main`,
                          color: "white",
                          p: 1,
                          borderRadius: 2,
                        }}
                      >
                        <Icon />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Platform Metrics */}
        {stats && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Platform Metrics
              </Typography>
              <div className="row g-3 mt-2">
                <div className="col-12 col-sm-3">
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="primary.main"
                      fontWeight={700}
                    >
                      {stats.totalCourses || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Courses
                    </Typography>
                  </Box>
                </div>
                <div className="col-12 col-sm-3">
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="success.main"
                      fontWeight={700}
                    >
                      {stats.totalApplications || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Applications Submitted
                    </Typography>
                  </Box>
                </div>
                <div className="col-12 col-sm-3">
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      color="secondary.main"
                      fontWeight={700}
                    >
                      {stats.totalJobs || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Job Postings
                    </Typography>
                  </Box>
                </div>
                <div className="col-12 col-sm-3">
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main" fontWeight={700}>
                      {stats.totalAdmissions || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Admissions Offered
                    </Typography>
                  </Box>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Approvals Section */}
        <Card>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
          >
            <Tab label={`Pending Institutions (${pendingInstitutes.length})`} />
            <Tab label={`Pending Companies (${pendingCompanies.length})`} />
            <Tab label="All Users" />
          </Tabs>

          {/* Pending Institutions Tab */}
          {tabValue === 0 && (
            <CardContent>
              {usersLoading ? (
                <Box py={3} textAlign="center">
                  <Typography>Loading...</Typography>
                </Box>
              ) : pendingInstitutes.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Institution Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Registered</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingInstitutes.map((institute) => (
                        <TableRow key={institute.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {institute.name || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>{institute.email}</TableCell>
                          <TableCell>{institute.location || "N/A"}</TableCell>
                          <TableCell>
                            {institute.createdAt
                              ? new Date(
                                  institute.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton size="small" color="info">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() =>
                                  handleApprove(institute.id, "institute")
                                }
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleReject(institute.id, "institute")
                                }
                              >
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box py={6} textAlign="center">
                  <School
                    sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No pending institution approvals
                  </Typography>
                </Box>
              )}
            </CardContent>
          )}

          {/* Pending Companies Tab */}
          {tabValue === 1 && (
            <CardContent>
              {usersLoading ? (
                <Box py={3} textAlign="center">
                  <Typography>Loading...</Typography>
                </Box>
              ) : pendingCompanies.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Company Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Industry</TableCell>
                        <TableCell>Registered</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingCompanies.map((company) => (
                        <TableRow key={company.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {company.companyName || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>{company.email}</TableCell>
                          <TableCell>{company.industry || "N/A"}</TableCell>
                          <TableCell>
                            {company.createdAt
                              ? new Date(company.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton size="small" color="info">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() =>
                                  handleApprove(company.id, "company")
                                }
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleReject(company.id, "company")
                                }
                              >
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box py={6} textAlign="center">
                  <Business
                    sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No pending company approvals
                  </Typography>
                </Box>
              )}
            </CardContent>
          )}

          {/* All Users Tab */}
          {tabValue === 2 && (
            <CardContent>
              <Box py={3} textAlign="center">
                <People sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Full user management interface coming soon
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/users")}
                >
                  Go to User Management
                </Button>
              </Box>
            </CardContent>
          )}
        </Card>
      </Container>

      {/* Approve Dialog */}
      <ConfirmDialog
        open={approveDialog.open}
        title="Approve User"
        message={`Are you sure you want to approve this ${approveDialog.type}? They will gain full access to the platform.`}
        confirmText="Approve"
        confirmColor="success"
        onConfirm={() => approveMutation.mutate(approveDialog)}
        onCancel={() => setApproveDialog({ open: false, id: null, type: null })}
        loading={approveMutation.isPending}
      />

      {/* Reject Dialog */}
      <ConfirmDialog
        open={rejectDialog.open}
        title="Reject User"
        message={`Are you sure you want to reject this ${rejectDialog.type}? This action cannot be undone.`}
        confirmText="Reject"
        confirmColor="error"
        onConfirm={() => rejectMutation.mutate(rejectDialog)}
        onCancel={() => setRejectDialog({ open: false, id: null, type: null })}
        loading={rejectMutation.isPending}
      />
    </Box>
  );
}
