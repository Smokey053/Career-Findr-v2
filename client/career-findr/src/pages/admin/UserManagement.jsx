import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Select,
  FormControl,
  InputLabel,
  Fade,
  Zoom,
  Grow,
  Slide,
  Tooltip,
} from "@mui/material";
import {
  SearchRounded,
  MoreVertRounded,
  VisibilityRounded,
  BlockRounded,
  CheckCircleRounded,
  DeleteRounded,
  EmailRounded,
  PersonRounded,
  PhoneRounded,
  CalendarTodayRounded,
  BusinessRounded,
  WorkRounded,
  AdminPanelSettingsRounded,
  EditRounded,
  VisibilityRounded as ViewAsIcon,
  SchoolRounded,
  PeopleRounded,
  VerifiedUserRounded,
  DoNotDisturbRounded,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { formatDate } from "../../utils/dateUtils";
import { useImpersonation } from "../../contexts/ImpersonationContext";
import {
  getUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} from "../../services/userService";

export default function UserManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { startImpersonation } = useImpersonation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    data: null,
  });
  const [editRole, setEditRole] = useState("");

  const roleFilters = ["All", "Student", "Institute", "Company", "Admin"];
  const currentRole = roleFilters[currentTab];

  // Fetch users
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminUsers", currentRole],
    queryFn: () =>
      getUsers({
        role: currentRole === "All" ? "" : currentRole.toLowerCase(),
      }),
  });

  const users = usersData || [];

  // Filter by search query on client side
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.companyName?.toLowerCase().includes(search)
    );
  });

  // Statistics
  const stats = {
    total: filteredUsers.length,
    students: filteredUsers.filter((u) => u.role === "student").length,
    institutes: filteredUsers.filter((u) => u.role === "institute").length,
    companies: filteredUsers.filter((u) => u.role === "company").length,
    admins: filteredUsers.filter((u) => u.role === "admin").length,
    active: filteredUsers.filter((u) => u.status === "active").length,
    suspended: filteredUsers.filter((u) => u.status === "suspended").length,
  };

  // Update user status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }) => updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      setConfirmDialog({ open: false, type: "", data: null });
      setAnchorEl(null);
    },
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      setEditDialogOpen(false);
      setAnchorEl(null);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      setConfirmDialog({ open: false, type: "", data: null });
      setAnchorEl(null);
    },
  });

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusChange = (status) => {
    setConfirmDialog({
      open: true,
      type: status,
      data: selectedUser,
    });
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    setConfirmDialog({
      open: true,
      type: "delete",
      data: selectedUser,
    });
    handleMenuClose();
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.data) return;

    if (confirmDialog.type === "delete") {
      deleteUserMutation.mutate(confirmDialog.data.id);
    } else {
      updateStatusMutation.mutate({
        userId: confirmDialog.data.id,
        status: confirmDialog.type,
      });
    }
  };

  const handleSaveRole = () => {
    if (selectedUser && editRole) {
      updateRoleMutation.mutate({
        userId: selectedUser.id,
        role: editRole,
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      suspended: "error",
      pending: "warning",
    };
    return colors[status] || "default";
  };

  const getRoleColor = (role) => {
    const colors = {
      student: "info",
      institute: "warning",
      company: "primary",
      admin: "error",
    };
    return colors[role] || "default";
  };

  const getRoleIcon = (role) => {
    const icons = {
      student: <PersonRounded fontSize="small" />,
      institute: <SchoolRounded fontSize="small" />,
      company: <BusinessRounded fontSize="small" />,
      admin: <AdminPanelSettingsRounded fontSize="small" />,
    };
    return icons[role] || <PersonRounded fontSize="small" />;
  };

  // Stats configuration for animated cards
  const statsConfig = [
    {
      label: "Total Users",
      value: stats.total,
      color: "#6366F1",
      icon: PeopleRounded,
      delay: 0,
    },
    {
      label: "Students",
      value: stats.students,
      color: "#0EA5E9",
      icon: PersonRounded,
      delay: 100,
    },
    {
      label: "Institutes",
      value: stats.institutes,
      color: "#F59E0B",
      icon: SchoolRounded,
      delay: 200,
    },
    {
      label: "Companies",
      value: stats.companies,
      color: "#2563EB",
      icon: BusinessRounded,
      delay: 300,
    },
    {
      label: "Active",
      value: stats.active,
      color: "#10B981",
      icon: VerifiedUserRounded,
      delay: 400,
    },
    {
      label: "Suspended",
      value: stats.suspended,
      color: "#EF4444",
      icon: DoNotDisturbRounded,
      delay: 500,
    },
  ];

  if (isLoading) {
    return <LoadingScreen message="Loading users..." />;
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header with Gradient */}
        <Fade in timeout={800}>
          <Box
            mb={4}
            sx={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              borderRadius: 4,
              p: 4,
              color: "white",
              position: "relative",
              overflow: "hidden",
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
            <Box position="relative" zIndex={1}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                User Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage all platform users and their access
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          {statsConfig.map((stat, index) => (
            <div className="col-12 col-sm-6 col-lg-2" key={stat.label}>
              <Grow
                in
                timeout={1000}
                style={{
                  transformOrigin: "0 0",
                  transitionDelay: `${stat.delay}ms`,
                }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    overflow: "visible",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5, position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: -12,
                        right: 16,
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                        boxShadow: `0 4px 14px ${stat.color}40`,
                      }}
                    >
                      <stat.icon sx={{ color: "white", fontSize: 24 }} />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      fontWeight={500}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: stat.color }}
                    >
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </div>
          ))}
        </div>

        {/* Search and Tabs */}
        <Fade in timeout={900}>
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Search */}
              <TextField
                fullWidth
                placeholder="Search by name, email, or organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
                    },
                  },
                }}
              />

              {/* Tabs */}
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: 600,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                  },
                }}
              >
                {roleFilters.map((role) => (
                  <Tab key={role} label={role} />
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </Fade>

        {/* Error State */}
        {error && (
          <Zoom in>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error.response?.data?.message || "Failed to load users"}
            </Alert>
          </Zoom>
        )}

        {/* Users Table */}
        <Fade in timeout={1000}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Joined Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Active</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <PersonRounded
                          sx={{
                            fontSize: 64,
                            color: "text.disabled",
                            mb: 2,
                            opacity: 0.5,
                          }}
                        />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          No users found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <Slide
                        key={user.id}
                        in
                        direction="left"
                        timeout={800 + index * 30}
                      >
                        <TableRow
                          hover
                          sx={{
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: "primary.main",
                                  fontWeight: 600,
                                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                                }}
                              >
                                {(user.name || user.email || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {user.name ||
                                    user.companyName ||
                                    user.email ||
                                    "Unknown User"}
                                </Typography>
                                {(user.organization || user.companyName) && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {user.organization || user.companyName}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getRoleIcon(user.role)}
                              label={
                                (user.role || "user").charAt(0).toUpperCase() +
                                (user.role || "user").slice(1)
                              }
                              size="small"
                              color={getRoleColor(user.role)}
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.status}
                              size="small"
                              color={getStatusColor(user.status)}
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.createdAt
                                ? formatDate(user.createdAt)
                                : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.lastActive
                                ? formatDate(user.lastActive)
                                : "Never"}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Actions" arrow>
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, user)}
                                sx={{
                                  transition:
                                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    transform: "scale(1.15)",
                                    bgcolor: "action.hover",
                                  },
                                }}
                              >
                                <MoreVertRounded />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      </Slide>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Fade>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              minWidth: 180,
            },
          }}
        >
          <MenuItem
            onClick={() => handleViewDetails(selectedUser)}
            sx={{
              transition: "all 0.2s",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon>
              <VisibilityRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              startImpersonation(selectedUser);
              handleMenuClose();
              // Navigate to the user's dashboard based on their role
              const dashboardMap = {
                student: "/dashboard/student",
                institute: "/dashboard/institute",
                company: "/dashboard/company",
                admin: "/dashboard/admin",
              };
              navigate(dashboardMap[selectedUser.role] || "/");
            }}
            sx={{
              transition: "all 0.2s",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon>
              <ViewAsIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>View as User</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => handleEditRole(selectedUser)}
            sx={{
              transition: "all 0.2s",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon>
              <EditRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Role</ListItemText>
          </MenuItem>
          <Divider />
          {selectedUser?.status !== "active" && (
            <MenuItem
              onClick={() => handleStatusChange("active")}
              sx={{
                transition: "all 0.2s",
                "&:hover": { bgcolor: "success.lighter" },
              }}
            >
              <ListItemIcon>
                <CheckCircleRounded fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Activate User</ListItemText>
            </MenuItem>
          )}
          {selectedUser?.status !== "suspended" && (
            <MenuItem
              onClick={() => handleStatusChange("suspended")}
              sx={{
                transition: "all 0.2s",
                "&:hover": { bgcolor: "error.lighter" },
              }}
            >
              <ListItemIcon>
                <BlockRounded fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Suspend User</ListItemText>
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            onClick={handleDeleteUser}
            sx={{
              color: "error.main",
              transition: "all 0.2s",
              "&:hover": { bgcolor: "error.lighter" },
            }}
          >
            <ListItemIcon>
              <DeleteRounded fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete User</ListItemText>
          </MenuItem>
        </Menu>

        {/* View Details Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Zoom}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              User Details
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {selectedUser && (
              <Box>
                {/* User Header */}
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: "primary.main",
                      fontSize: 32,
                      fontWeight: 700,
                      boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                    }}
                  >
                    {(selectedUser.name || selectedUser.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="h6" fontWeight={700}>
                      {selectedUser.name ||
                        selectedUser.companyName ||
                        selectedUser.email ||
                        "Unknown User"}
                    </Typography>
                    <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                      <Chip
                        icon={getRoleIcon(selectedUser.role)}
                        label={
                          (selectedUser.role || "user")
                            .charAt(0)
                            .toUpperCase() +
                          (selectedUser.role || "user").slice(1)
                        }
                        size="small"
                        color={getRoleColor(selectedUser.role)}
                        sx={{ fontWeight: 500 }}
                      />
                      <Chip
                        label={selectedUser.status}
                        size="small"
                        color={getStatusColor(selectedUser.status)}
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* User Information */}
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <EmailRounded color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight={500}>
                          {selectedUser.email}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {selectedUser.phone && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <PhoneRounded color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            Phone
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" fontWeight={500}>
                            {selectedUser.phone}
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                  {selectedUser.organization && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {selectedUser.role === "institute" ? (
                          <SchoolRounded color="action" />
                        ) : (
                          <BusinessRounded color="action" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            Organization
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" fontWeight={500}>
                            {selectedUser.organization}
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CalendarTodayRounded color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          Joined
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(selectedUser.createdAt)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <WorkRounded color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          Last Active
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight={500}>
                          {selectedUser.lastActive
                            ? formatDate(selectedUser.lastActive)
                            : "Never"}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>

                {/* Activity Stats */}
                {selectedUser.activityStats && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      gutterBottom
                      color="text.secondary"
                    >
                      Activity Statistics
                    </Typography>
                    <Box display="flex" gap={1.5} mt={1.5} flexWrap="wrap">
                      {selectedUser.role === "student" && (
                        <>
                          <Chip
                            label={`${
                              selectedUser.activityStats.applications || 0
                            } Applications`}
                            sx={{
                              fontWeight: 500,
                              bgcolor: "info.lighter",
                              color: "info.dark",
                            }}
                          />
                          <Chip
                            label={`${
                              selectedUser.activityStats.courses || 0
                            } Courses`}
                            sx={{
                              fontWeight: 500,
                              bgcolor: "warning.lighter",
                              color: "warning.dark",
                            }}
                          />
                        </>
                      )}
                      {selectedUser.role === "institute" && (
                        <>
                          <Chip
                            label={`${
                              selectedUser.activityStats.courses || 0
                            } Courses`}
                            sx={{
                              fontWeight: 500,
                              bgcolor: "warning.lighter",
                              color: "warning.dark",
                            }}
                          />
                          <Chip
                            label={`${
                              selectedUser.activityStats.students || 0
                            } Students`}
                            sx={{
                              fontWeight: 500,
                              bgcolor: "info.lighter",
                              color: "info.dark",
                            }}
                          />
                        </>
                      )}
                      {selectedUser.role === "company" && (
                        <>
                          <Chip
                            label={`${
                              selectedUser.activityStats.jobs || 0
                            } Jobs Posted`}
                            sx={{
                              fontWeight: 500,
                              bgcolor: "primary.lighter",
                              color: "primary.dark",
                            }}
                          />
                          <Chip
                            label={`${
                              selectedUser.activityStats.applicants || 0
                            } Applicants`}
                            sx={{
                              fontWeight: 500,
                              bgcolor: "success.lighter",
                              color: "success.dark",
                            }}
                          />
                        </>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => setViewDialogOpen(false)}
              sx={{
                borderRadius: 2,
                px: 3,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Role Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          TransitionComponent={Zoom}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            },
          }}
        >
          <DialogTitle>
            <Typography fontWeight={700}>Edit User Role</Typography>
          </DialogTitle>
          <DialogContent>
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  label="Role"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="institute">Institute</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveRole}
              disabled={updateRoleMutation.isPending}
              sx={{
                borderRadius: 2,
                px: 3,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              {updateRoleMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirm Action Dialog */}
        <ConfirmDialog
          open={confirmDialog.open}
          title={
            confirmDialog.type === "delete"
              ? "Delete User"
              : `${
                  (confirmDialog.type || "").charAt(0).toUpperCase() +
                  (confirmDialog.type || "").slice(1)
                } User`
          }
          message={
            confirmDialog.type === "delete"
              ? `Are you sure you want to permanently delete ${confirmDialog.data?.name}? This action cannot be undone.`
              : `Are you sure you want to ${confirmDialog.type} ${confirmDialog.data?.name}?`
          }
          onConfirm={handleConfirmAction}
          onCancel={() =>
            setConfirmDialog({ open: false, type: "", data: null })
          }
          loading={
            updateStatusMutation.isPending || deleteUserMutation.isPending
          }
          confirmColor={confirmDialog.type === "delete" ? "error" : "primary"}
        />
      </Container>
    </Box>
  );
}
