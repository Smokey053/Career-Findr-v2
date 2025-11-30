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
  Fade,
  Zoom,
  Slide,
} from "@mui/material";
import {
  DashboardRounded,
  PeopleRounded,
  SchoolRounded,
  BusinessRounded,
  CheckCircleRounded,
  CancelRounded,
  VisibilityRounded,
  TrendingUpRounded,
  AssignmentRounded,
  WorkRounded,
  ArticleRounded,
  EmojiEventsRounded,
  WarningAmberRounded,
  AdminPanelSettingsRounded,
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
import { formatDate } from "../../utils/dateUtils";

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
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getPlatformStats,
  });

  /**
   * Fetches users with a 'pending' status for approval.
   * @queryKey ['pendingUsers']
   */
  const {
    data: pendingUsers,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
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
    mutationFn: ({ id }) => approveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setApproveDialog({ open: false, id: null, type: null });
    },
    onError: (error) => {
      console.error("Error approving user:", error);
    },
  });

  /**
   * Mutation for rejecting a user. Invalidates relevant queries on success.
   */
  const rejectMutation = useMutation({
    mutationFn: ({ id }) => rejectUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setRejectDialog({ open: false, id: null, type: null });
    },
    onError: (error) => {
      console.error("Error rejecting user:", error);
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
      icon: PeopleRounded,
      gradient: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
      subtitle: `${stats?.activeUsers || 0} active`,
    },
    {
      title: "Pending Approvals",
      value: pendingUsers?.length || 0,
      icon: AssignmentRounded,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #d97706 100%)",
      subtitle: `${pendingInstitutes.length} institutes, ${pendingCompanies.length} companies`,
    },
    {
      title: "Total Institutions",
      value: stats?.totalInstitutions || 0,
      icon: SchoolRounded,
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
      subtitle: `${stats?.activeInstitutions || 0} active`,
    },
    {
      title: "Total Companies",
      value: stats?.totalCompanies || 0,
      icon: BusinessRounded,
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
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
                <AdminPanelSettingsRounded
                  sx={{ color: "white", fontSize: 28 }}
                />
              </Box>
              <Typography variant="h4" fontWeight={700}>
                Welcome back, {user?.name || "Admin"}!
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ pl: 7.5 }}>
              Manage users, approve institutions and companies, monitor platform
              activity
            </Typography>
          </Box>
        </Fade>

        {/* Pending Approvals Alert with Animation */}
        {pendingUsers && pendingUsers.length > 0 && (
          <Slide in direction="down" timeout={500}>
            <Alert
              severity="warning"
              icon={<WarningAmberRounded />}
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "warning.light",
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                You have {pendingUsers.length} pending approval
                {pendingUsers.length > 1 ? "s" : ""} waiting for review.
              </Typography>
            </Alert>
          </Slide>
        )}

        {/* Stats Cards with Staggered Animation */}
        <div className="row g-3 mb-4">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <Zoom in timeout={600 + index * 100}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: stat.gradient,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={1}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ fontWeight: 500 }}
                          >
                            {stat.title}
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight={700}
                            sx={{
                              background: stat.gradient,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {stat.subtitle}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            background: stat.gradient,
                            color: "white",
                            p: 1.5,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          <Icon sx={{ fontSize: 24 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </div>
            );
          })}
        </div>

        {/* Platform Metrics */}
        {stats && (
          <Fade in timeout={800}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                  <TrendingUpRounded color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Platform Metrics
                  </Typography>
                </Box>
                <div className="row g-3">
                  <div className="col-12 col-sm-3">
                    <Zoom in timeout={900}>
                      <Box
                        textAlign="center"
                        p={3}
                        borderRadius={2}
                        bgcolor="primary.50"
                        sx={{
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <SchoolRounded
                          sx={{ fontSize: 36, color: "primary.main", mb: 1 }}
                        />
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{
                            background:
                              "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {stats.totalCourses || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Total Courses
                        </Typography>
                      </Box>
                    </Zoom>
                  </div>
                  <div className="col-12 col-sm-3">
                    <Zoom in timeout={1000}>
                      <Box
                        textAlign="center"
                        p={3}
                        borderRadius={2}
                        bgcolor="success.50"
                        sx={{
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <ArticleRounded
                          sx={{ fontSize: 36, color: "success.main", mb: 1 }}
                        />
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{
                            background:
                              "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {stats.totalApplications || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Applications Submitted
                        </Typography>
                      </Box>
                    </Zoom>
                  </div>
                  <div className="col-12 col-sm-3">
                    <Zoom in timeout={1100}>
                      <Box
                        textAlign="center"
                        p={3}
                        borderRadius={2}
                        bgcolor="secondary.50"
                        sx={{
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <WorkRounded
                          sx={{ fontSize: 36, color: "secondary.main", mb: 1 }}
                        />
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{
                            background:
                              "linear-gradient(135deg, #8B5CF6 0%, #7c3aed 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {stats.totalJobs || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Job Postings
                        </Typography>
                      </Box>
                    </Zoom>
                  </div>
                  <div className="col-12 col-sm-3">
                    <Zoom in timeout={1200}>
                      <Box
                        textAlign="center"
                        p={3}
                        borderRadius={2}
                        bgcolor="info.50"
                        sx={{
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <EmojiEventsRounded
                          sx={{ fontSize: 36, color: "info.main", mb: 1 }}
                        />
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{
                            background:
                              "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {stats.totalAdmissions || 0}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Admissions Offered
                        </Typography>
                      </Box>
                    </Zoom>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Pending Approvals Section */}
        <Fade in timeout={900}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: 2,
                "& .MuiTab-root": {
                  fontWeight: 600,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    Pending Institutions
                    {pendingInstitutes.length > 0 && (
                      <Chip
                        label={pendingInstitutes.length}
                        size="small"
                        color="warning"
                        sx={{ height: 20, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>
                }
              />
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    Pending Companies
                    {pendingCompanies.length > 0 && (
                      <Chip
                        label={pendingCompanies.length}
                        size="small"
                        color="warning"
                        sx={{ height: 20, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>
                }
              />
              <Tab label="All Users" />
            </Tabs>

            {/* Pending Institutions Tab */}
            {tabValue === 0 && (
              <CardContent sx={{ p: 3 }}>
                {usersLoading ? (
                  <Box py={3} textAlign="center">
                    <Typography>Loading...</Typography>
                  </Box>
                ) : pendingInstitutes.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Institution Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Location
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Registered
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingInstitutes.map((institute, index) => (
                          <Slide
                            key={institute.id}
                            in
                            direction="left"
                            timeout={1000 + index * 50}
                          >
                            <TableRow
                              hover
                              sx={{
                                transition:
                                  "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                },
                              }}
                            >
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  {institute.name || "N/A"}
                                </Typography>
                              </TableCell>
                              <TableCell>{institute.email}</TableCell>
                              <TableCell>
                                {institute.location || "N/A"}
                              </TableCell>
                              <TableCell>
                                {formatDate(institute.createdAt)}
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="View Details" arrow>
                                  <IconButton
                                    size="small"
                                    color="info"
                                    onClick={() => navigate(`/admin/users?user=${institute.id}`)}
                                    sx={{
                                      transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      "&:hover": { transform: "scale(1.15)" },
                                    }}
                                  >
                                    <VisibilityRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Approve" arrow>
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() =>
                                      handleApprove(institute.id, "institute")
                                    }
                                    sx={{
                                      transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      "&:hover": { transform: "scale(1.15)" },
                                    }}
                                  >
                                    <CheckCircleRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject" arrow>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleReject(institute.id, "institute")
                                    }
                                    sx={{
                                      transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      "&:hover": { transform: "scale(1.15)" },
                                    }}
                                  >
                                    <CancelRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          </Slide>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box py={6} textAlign="center">
                    <SchoolRounded
                      sx={{
                        fontSize: 80,
                        color: "text.disabled",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      No pending institution approvals
                    </Typography>
                  </Box>
                )}
              </CardContent>
            )}

            {/* Pending Companies Tab */}
            {tabValue === 1 && (
              <CardContent sx={{ p: 3 }}>
                {usersLoading ? (
                  <Box py={3} textAlign="center">
                    <Typography>Loading...</Typography>
                  </Box>
                ) : pendingCompanies.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Company Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Industry
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Registered
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingCompanies.map((company, index) => (
                          <Slide
                            key={company.id}
                            in
                            direction="left"
                            timeout={1000 + index * 50}
                          >
                            <TableRow
                              hover
                              sx={{
                                transition:
                                  "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                },
                              }}
                            >
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  {company.companyName || "N/A"}
                                </Typography>
                              </TableCell>
                              <TableCell>{company.email}</TableCell>
                              <TableCell>{company.industry || "N/A"}</TableCell>
                              <TableCell>
                                {formatDate(company.createdAt)}
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="View Details" arrow>
                                  <IconButton
                                    size="small"
                                    color="info"
                                    onClick={() => navigate(`/admin/users?user=${company.id}`)}
                                    sx={{
                                      transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      "&:hover": { transform: "scale(1.15)" },
                                    }}
                                  >
                                    <VisibilityRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Approve" arrow>
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() =>
                                      handleApprove(company.id, "company")
                                    }
                                    sx={{
                                      transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      "&:hover": { transform: "scale(1.15)" },
                                    }}
                                  >
                                    <CheckCircleRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject" arrow>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleReject(company.id, "company")
                                    }
                                    sx={{
                                      transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      "&:hover": { transform: "scale(1.15)" },
                                    }}
                                  >
                                    <CancelRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          </Slide>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box py={6} textAlign="center">
                    <BusinessRounded
                      sx={{
                        fontSize: 80,
                        color: "text.disabled",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      No pending company approvals
                    </Typography>
                  </Box>
                )}
              </CardContent>
            )}

            {/* All Users Tab */}
            {tabValue === 2 && (
              <CardContent sx={{ p: 3 }}>
                {usersLoading ? (
                  <Box py={3} textAlign="center">
                    <Typography>Loading...</Typography>
                  </Box>
                ) : allUsers && allUsers.length > 0 ? (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Registered</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {allUsers.slice(0, 10).map((user, index) => (
                              <TableRow
                                key={user.id}
                                hover
                                sx={{
                                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": { bgcolor: "action.hover" },
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" fontWeight={600}>
                                    {user.displayName || user.name || "N/A"}
                                  </Typography>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={user.role}
                                    size="small"
                                    color={
                                      user.role === "admin" ? "error" :
                                      user.role === "institute" ? "info" :
                                      user.role === "company" ? "success" : "default"
                                    }
                                    sx={{ fontWeight: 500, textTransform: "capitalize" }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={user.status || "active"}
                                    size="small"
                                    color={user.status === "active" ? "success" : user.status === "pending" ? "warning" : "default"}
                                    sx={{ fontWeight: 500, textTransform: "capitalize" }}
                                  />
                                </TableCell>
                                <TableCell>
                                  {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell align="right">
                                  <Tooltip title="View Details" arrow>
                                    <IconButton
                                      size="small"
                                      color="info"
                                      onClick={() => navigate(`/admin/users?user=${user.id}`)}
                                      sx={{
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": { transform: "scale(1.15)" },
                                      }}
                                    >
                                      <VisibilityRounded fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {allUsers.length > 10 && (
                      <Box textAlign="center" mt={3}>
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/admin/users")}
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": { transform: "scale(1.05)" },
                          }}
                        >
                          View All {allUsers.length} Users
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box py={6} textAlign="center">
                    <PeopleRounded
                      sx={{
                        fontSize: 80,
                        color: "text.disabled",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                      fontWeight={600}
                    >
                      No Users Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      No users have registered yet.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            )}
          </Card>
        </Fade>
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
