import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Fade,
  Zoom,
  Grow,
} from "@mui/material";
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  SchoolOutlined,
  PeopleOutlined,
  DescriptionOutlined,
  EmailOutlined,
  AccountBalanceOutlined,
  CategoryOutlined,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
  getFaculties,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} from "../../services/facultyService";

// Animation timing constants
const FADE_DURATION = 800;
const ZOOM_DURATION = 500;
const STAGGER_DELAY = 100;

export default function FacultyManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dean: "",
    contactEmail: "",
    departments: "",
  });
  const [error, setError] = useState("");

  // Fetch faculties
  const { data: faculties = [], isLoading } = useQuery({
    queryKey: ["faculties", user?.uid],
    queryFn: () => getFaculties(user?.uid),
    enabled: !!user?.uid,
  });

  // Add faculty mutation
  const addMutation = useMutation({
    mutationFn: (facultyData) => addFaculty(user.uid, facultyData),
    onSuccess: () => {
      queryClient.invalidateQueries(["faculties"]);
      handleCloseDialog();
    },
    onError: (error) => {
      setError(error.message || "Failed to add faculty");
    },
  });

  // Update faculty mutation
  const updateMutation = useMutation({
    mutationFn: ({ facultyId, facultyData }) =>
      updateFaculty(facultyId, facultyData),
    onSuccess: () => {
      queryClient.invalidateQueries(["faculties"]);
      handleCloseDialog();
    },
    onError: (error) => {
      setError(error.message || "Failed to update faculty");
    },
  });

  // Delete faculty mutation
  const deleteMutation = useMutation({
    mutationFn: (facultyId) => deleteFaculty(facultyId),
    onSuccess: () => {
      queryClient.invalidateQueries(["faculties"]);
      setDeleteDialogOpen(false);
      setSelectedFaculty(null);
    },
    onError: (error) => {
      setError(error.message || "Failed to delete faculty");
    },
  });

  const handleOpenDialog = (faculty = null) => {
    if (faculty) {
      setSelectedFaculty(faculty);
      setFormData({
        name: faculty.name || "",
        description: faculty.description || "",
        dean: faculty.dean || "",
        contactEmail: faculty.contactEmail || "",
        departments: Array.isArray(faculty.departments)
          ? faculty.departments.join(", ")
          : "",
      });
    } else {
      setSelectedFaculty(null);
      setFormData({
        name: "",
        description: "",
        dean: "",
        contactEmail: "",
        departments: "",
      });
    }
    setError("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFaculty(null);
    setFormData({
      name: "",
      description: "",
      dean: "",
      contactEmail: "",
      departments: "",
    });
    setError("");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError("Faculty name is required");
      return;
    }

    const facultyData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      dean: formData.dean.trim(),
      contactEmail: formData.contactEmail.trim(),
      departments: formData.departments
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d),
    };

    if (selectedFaculty) {
      updateMutation.mutate({
        facultyId: selectedFaculty.id,
        facultyData,
      });
    } else {
      addMutation.mutate(facultyData);
    }
  };

  const handleDeleteClick = (faculty) => {
    setSelectedFaculty(faculty);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedFaculty) {
      deleteMutation.mutate(selectedFaculty.id);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading faculties..." />;
  }

  return (
    <Fade in timeout={FADE_DURATION}>
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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    Faculty Management
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Manage your institution's faculties and departments
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddOutlined />}
                  onClick={() => handleOpenDialog()}
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
                  Add Faculty
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Zoom>

        {faculties.length === 0 ? (
          <Grow in timeout={600}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 8 }}>
                <Box
                  sx={{
                    bgcolor: "primary.100",
                    borderRadius: "50%",
                    width: 100,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <SchoolOutlined
                    sx={{ fontSize: 50, color: "primary.main" }}
                  />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Faculties Yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Create your first faculty to organize courses and departments
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddOutlined />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-2px)" },
                  }}
                >
                  Add Faculty
                </Button>
              </CardContent>
            </Card>
          </Grow>
        ) : (
          <Grid container spacing={3}>
            {faculties.map((faculty, index) => (
              <Grid item xs={12} md={6} key={faculty.id}>
                <Grow in timeout={600 + index * STAGGER_DELAY}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              bgcolor: "primary.main",
                              color: "white",
                              borderRadius: 3,
                              p: 1.5,
                              display: "flex",
                            }}
                          >
                            <AccountBalanceOutlined sx={{ fontSize: 32 }} />
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {faculty.name}
                            </Typography>
                            {faculty.dean && (
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <PeopleOutlined
                                  sx={{ fontSize: 14, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Dean: {faculty.dean}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(faculty)}
                            sx={{
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "primary.100",
                                color: "primary.main",
                              },
                            }}
                          >
                            <EditOutlined />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(faculty)}
                            sx={{
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "error.100",
                              },
                            }}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Box>
                      </Box>

                      {faculty.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, lineHeight: 1.6 }}
                        >
                          {faculty.description}
                        </Typography>
                      )}

                      {faculty.contactEmail && (
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <EmailOutlined
                            sx={{ fontSize: 18, color: "primary.main" }}
                          />
                          <Typography variant="body2">
                            {faculty.contactEmail}
                          </Typography>
                        </Box>
                      )}

                      {faculty.departments &&
                        faculty.departments.length > 0 && (
                          <Box>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={1}
                            >
                              <CategoryOutlined
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={600}
                              >
                                Departments
                              </Typography>
                            </Box>
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {faculty.departments.map((dept, index) => (
                                <Chip
                                  key={index}
                                  label={dept}
                                  size="small"
                                  sx={{
                                    borderRadius: 2,
                                    bgcolor: "primary.50",
                                    color: "primary.main",
                                    fontWeight: 500,
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            {selectedFaculty ? "Edit Faculty" : "Add New Faculty"}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}
            >
              <TextField
                fullWidth
                label="Faculty Name *"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SchoolOutlined sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Dean/Head of Faculty"
                value={formData.dean}
                onChange={(e) => handleInputChange("dean", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <PeopleOutlined sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  handleInputChange("contactEmail", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <EmailOutlined sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Departments (comma-separated)"
                placeholder="e.g., Computer Science, Mathematics, Physics"
                value={formData.departments}
                onChange={(e) =>
                  handleInputChange("departments", e.target.value)
                }
                helperText="Enter department names separated by commas"
                InputProps={{
                  startAdornment: (
                    <CategoryOutlined sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={addMutation.isPending || updateMutation.isPending}
              sx={{
                borderRadius: 2,
                px: 3,
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
                },
              }}
            >
              {addMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : selectedFaculty
                ? "Update"
                : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Faculty"
          message={`Are you sure you want to delete "${selectedFaculty?.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setSelectedFaculty(null);
          }}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </Container>
    </Fade>
  );
}
