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
} from "@mui/material";
import {
  Search,
  MoreVert,
  Visibility,
  Block,
  CheckCircle,
  Delete,
  Email,
  Person,
  Phone,
  CalendarToday,
  Business,
  Work,
  AdminPanelSettings,
  Edit,
  Visibility as ViewAsIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
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
      student: <Person fontSize="small" />,
      institute: <School fontSize="small" />,
      company: <Business fontSize="small" />,
      admin: <AdminPanelSettings fontSize="small" />,
    };
    return icons[role] || <Person fontSize="small" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <LoadingScreen message="Loading users..." />;
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all platform users and their access
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-2">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "info.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Students
                </Typography>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {stats.students}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "warning.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Institutes
                </Typography>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {stats.institutes}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "primary.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Companies
                </Typography>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {stats.companies}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "success.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Active
                </Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {stats.active}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "error.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Suspended
                </Typography>
                <Typography variant="h4" fontWeight={700} color="error.main">
                  {stats.suspended}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Tabs */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {/* Search */}
            <TextField
              fullWidth
              placeholder="Search by name, email, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Tabs */}
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
            >
              {roleFilters.map((role) => (
                <Tab key={role} label={role} />
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.response?.data?.message || "Failed to load users"}
          </Alert>
        )}

        {/* Users Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined Date</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Person
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "primary.main",
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {user.name}
                            </Typography>
                            {user.organization && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {user.organization}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={
                            user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          }
                          size="small"
                          color={getRoleColor(user.role)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={getStatusColor(user.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(user.createdAt)}
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
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleViewDetails(selectedUser)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
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
          >
            <ListItemIcon>
              <ViewAsIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>View as User</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleEditRole(selectedUser)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Role</ListItemText>
          </MenuItem>
          <Divider />
          {selectedUser?.status !== "active" && (
            <MenuItem onClick={() => handleStatusChange("active")}>
              <ListItemIcon>
                <CheckCircle fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Activate User</ListItemText>
            </MenuItem>
          )}
          {selectedUser?.status !== "suspended" && (
            <MenuItem onClick={() => handleStatusChange("suspended")}>
              <ListItemIcon>
                <Block fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Suspend User</ListItemText>
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleDeleteUser} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
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
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
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
                      width: 64,
                      height: 64,
                      bgcolor: "primary.main",
                      fontSize: 28,
                    }}
                  >
                    {selectedUser.name.charAt(0)}
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedUser.name}
                    </Typography>
                    <Box display="flex" gap={1} mt={1}>
                      <Chip
                        icon={getRoleIcon(selectedUser.role)}
                        label={
                          selectedUser.role.charAt(0).toUpperCase() +
                          selectedUser.role.slice(1)
                        }
                        size="small"
                        color={getRoleColor(selectedUser.role)}
                      />
                      <Chip
                        label={selectedUser.status}
                        size="small"
                        color={getStatusColor(selectedUser.status)}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* User Information */}
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={selectedUser.email}
                    />
                  </ListItem>
                  {selectedUser.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedUser.phone}
                      />
                    </ListItem>
                  )}
                  {selectedUser.organization && (
                    <ListItem>
                      <ListItemIcon>
                        {selectedUser.role === "institute" ? (
                          <School />
                        ) : (
                          <Business />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Organization"
                        secondary={selectedUser.organization}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Joined"
                      secondary={formatDate(selectedUser.createdAt)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Work />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Active"
                      secondary={
                        selectedUser.lastActive
                          ? formatDate(selectedUser.lastActive)
                          : "Never"
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
                      fontWeight={600}
                      gutterBottom
                    >
                      Activity Statistics
                    </Typography>
                    <Box display="flex" gap={2} mt={1}>
                      {selectedUser.role === "student" && (
                        <>
                          <Chip
                            label={`${
                              selectedUser.activityStats.applications || 0
                            } Applications`}
                          />
                          <Chip
                            label={`${
                              selectedUser.activityStats.courses || 0
                            } Courses`}
                          />
                        </>
                      )}
                      {selectedUser.role === "institute" && (
                        <>
                          <Chip
                            label={`${
                              selectedUser.activityStats.courses || 0
                            } Courses`}
                          />
                          <Chip
                            label={`${
                              selectedUser.activityStats.students || 0
                            } Students`}
                          />
                        </>
                      )}
                      {selectedUser.role === "company" && (
                        <>
                          <Chip
                            label={`${
                              selectedUser.activityStats.jobs || 0
                            } Jobs Posted`}
                          />
                          <Chip
                            label={`${
                              selectedUser.activityStats.applicants || 0
                            } Applicants`}
                          />
                        </>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Role Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Edit User Role</DialogTitle>
          <DialogContent>
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  label="Role"
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="institute">Institute</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveRole}
              disabled={updateRoleMutation.isPending}
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
                  confirmDialog.type.charAt(0).toUpperCase() +
                  confirmDialog.type.slice(1)
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
