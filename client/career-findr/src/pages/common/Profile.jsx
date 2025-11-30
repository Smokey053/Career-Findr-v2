import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUser, updateUserProfile } from "../../services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  Divider,
  Chip,
  Tab,
  Tabs,
  Alert,
  Fade,
  Zoom,
  Grow,
  LinearProgress,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  School,
  Work,
  Mail,
  Phone,
  LocationOn,
  AccountCircle,
  Person,
  Badge,
  CalendarMonth,
  VerifiedUser,
} from "@mui/icons-material";
import LoadingScreen from "../../components/common/LoadingScreen";
import { formatDate } from "../../utils/dateUtils";

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <Fade in={value === index} timeout={500}>
      <div hidden={value !== index} style={{ width: "100%" }}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
      </div>
    </Fade>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({});
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const queryClient = useQueryClient();

  // Fetch user profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: () => getUser(user?.uid),
    enabled: !!user?.uid,
  });

  // Move useMutation BEFORE any conditional returns to maintain hook order
  const updateProfileMutation = useMutation({
    mutationFn: (updates) => updateUserProfile(user?.uid, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", user?.uid]);
      setSaveSuccess("Profile updated successfully.");
      setSaveError("");
      setFormData({});
      setIsEditing(false);
    },
    onError: (error) => {
      setSaveError(error.message || "Failed to update profile.");
      setSaveSuccess("");
    },
  });

  // Now we can have early returns after all hooks are called
  if (isLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  const profile = profileData || user || {};
  const isStudent = profile.role === "student";
  const isInstitution = profile.role === "institute";
  const isCompany = profile.role === "company";

  const initializeFormData = () => ({
    displayName: profile.displayName || "",
    phone: profile.phone || "",
    location: profile.location || "",
    bio: profile.bio || "",
  });

  const handleEditToggle = () => {
    setSaveError("");
    setSaveSuccess("");
    if (isEditing) {
      setFormData({});
    } else {
      setFormData(initializeFormData());
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const normalizeFieldValue = (value) =>
    typeof value === "string" ? value.trim() : value;

  const handleSave = () => {
    if (!user?.uid) {
      setSaveError("You must be signed in to update your profile.");
      setSaveSuccess("");
      return;
    }

    const requiredFields = ["displayName", "phone", "location"];
    const missingFields = requiredFields.filter((field) => {
      const candidate =
        formData[field] !== undefined ? formData[field] : profile[field];
      const normalized = normalizeFieldValue(candidate ?? "");
      return !normalized;
    });

    if (missingFields.length > 0) {
      setSaveError(
        `Please provide: ${missingFields
          .map((field) => field.replace(/([A-Z])/g, " $1").trim())
          .join(", ")}`
      );
      setSaveSuccess("");
      return;
    }

    const updates = {};
    ["displayName", "phone", "location", "bio"].forEach((field) => {
      const candidate =
        formData[field] !== undefined ? formData[field] : profile[field];
      const normalized = normalizeFieldValue(candidate ?? "");
      const currentStored = normalizeFieldValue(profile[field] ?? "");

      if (normalized !== currentStored) {
        updates[field] = normalized;
      }
    });

    if (Object.keys(updates).length === 0) {
      setSaveError("No changes to save.");
      setSaveSuccess("");
      return;
    }

    setSaveError("");
    setSaveSuccess("");
    updateProfileMutation.mutate(updates);
  };

  return (
    <Fade in timeout={800}>
      <Box className="min-vh-100" bgcolor="background.default" sx={{ py: 4 }}>
        <Container maxWidth="lg">
          {/* Animated Header Section */}
          <Zoom in timeout={600}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 4,
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(37, 99, 235, 0.3)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "50%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                  borderRadius: "0 0 0 100%",
                },
              }}
            >
              <CardContent sx={{ py: 4, position: "relative", zIndex: 1 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={3}
                  mb={3}
                  flexWrap="wrap"
                >
                  <Avatar
                    sx={{
                      width: 110,
                      height: 110,
                      bgcolor: "rgba(255,255,255,0.2)",
                      fontSize: 44,
                      fontWeight: 700,
                      border: "4px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {profile.displayName?.charAt(0) || "U"}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      {profile.displayName || "User Profile"}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        label={profile.role?.toUpperCase() || "UNKNOWN"}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 600,
                          backdropFilter: "blur(10px)",
                          "& .MuiChip-icon": { color: "white" },
                        }}
                        icon={
                          isStudent ? (
                            <School />
                          ) : isInstitution ? (
                            <AccountCircle />
                          ) : (
                            <Work />
                          )
                        }
                      />
                      <Chip
                        label={
                          profile.status === "active" ? "Active" : "Inactive"
                        }
                        sx={{
                          bgcolor:
                            profile.status === "active"
                              ? "rgba(46, 125, 50, 0.8)"
                              : "rgba(211, 47, 47, 0.8)",
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                  <Button
                    variant={isEditing ? "outlined" : "contained"}
                    startIcon={isEditing ? <Cancel /> : <Edit />}
                    onClick={handleEditToggle}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      bgcolor: isEditing
                        ? "transparent"
                        : "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "2px solid rgba(255,255,255,0.5)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Zoom>

          {/* Tabs for different sections */}
          <Grow in timeout={800} style={{ transformOrigin: "top center" }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, value) => setTabValue(value)}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  bgcolor: "grey.50",
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    minHeight: 56,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.50",
                    },
                  },
                  "& .Mui-selected": {
                    color: "primary.main",
                  },
                }}
              >
                <Tab
                  label="Personal Information"
                  icon={<Person />}
                  iconPosition="start"
                />
                {isStudent && (
                  <Tab
                    label="Analytics"
                    icon={<Badge />}
                    iconPosition="start"
                  />
                )}
                {isStudent && (
                  <Tab
                    label="Skills & CV"
                    icon={<School />}
                    iconPosition="start"
                  />
                )}
                {(isInstitution || isCompany) && (
                  <Tab
                    label="Organization"
                    icon={<Work />}
                    iconPosition="start"
                  />
                )}
              </Tabs>

              {/* Personal Information Tab */}
              <TabPanel value={tabValue} index={0}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={700}
                    mb={3}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Person color="primary" fontSize="small" />
                    Personal Information
                  </Typography>

                  {isEditing && (
                    <Fade in timeout={400}>
                      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                        Edit your profile information below and click Save to
                        update.
                      </Alert>
                    </Fade>
                  )}

                  {saveError && (
                    <Fade in timeout={400}>
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {saveError}
                      </Alert>
                    </Fade>
                  )}

                  {saveSuccess && (
                    <Fade in timeout={400}>
                      <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                        {saveSuccess}
                      </Alert>
                    </Fade>
                  )}

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Grow
                        in
                        timeout={600}
                        style={{ transitionDelay: "100ms" }}
                      >
                        <TextField
                          fullWidth
                          label="Display Name"
                          value={
                            isEditing
                              ? formData.displayName || profile.displayName
                              : profile.displayName
                          }
                          onChange={(e) =>
                            handleInputChange("displayName", e.target.value)
                          }
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <AccountCircle
                                sx={{ mr: 1, color: "primary.main" }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover:not(.Mui-disabled)": {
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                              },
                            },
                          }}
                        />
                      </Grow>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Grow
                        in
                        timeout={600}
                        style={{ transitionDelay: "150ms" }}
                      >
                        <TextField
                          fullWidth
                          label="Email"
                          value={profile.email}
                          disabled
                          InputProps={{
                            startAdornment: (
                              <Mail sx={{ mr: 1, color: "error.main" }} />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      </Grow>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Grow
                        in
                        timeout={600}
                        style={{ transitionDelay: "200ms" }}
                      >
                        <TextField
                          fullWidth
                          label="Phone"
                          value={
                            isEditing
                              ? formData.phone || profile.phone
                              : profile.phone
                          }
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <Phone sx={{ mr: 1, color: "success.main" }} />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover:not(.Mui-disabled)": {
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                              },
                            },
                          }}
                        />
                      </Grow>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Grow
                        in
                        timeout={600}
                        style={{ transitionDelay: "250ms" }}
                      >
                        <TextField
                          fullWidth
                          label="Location"
                          value={
                            isEditing
                              ? formData.location || profile.location
                              : profile.location
                          }
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <LocationOn
                                sx={{ mr: 1, color: "secondary.main" }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover:not(.Mui-disabled)": {
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                              },
                            },
                          }}
                        />
                      </Grow>
                    </Grid>

                    <Grid item xs={12}>
                      <Grow
                        in
                        timeout={600}
                        style={{ transitionDelay: "300ms" }}
                      >
                        <TextField
                          fullWidth
                          label="Bio/Description"
                          multiline
                          rows={4}
                          value={
                            isEditing
                              ? formData.bio || profile.bio
                              : profile.bio
                          }
                          onChange={(e) =>
                            handleInputChange("bio", e.target.value)
                          }
                          disabled={!isEditing}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover:not(.Mui-disabled)": {
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                              },
                            },
                          }}
                        />
                      </Grow>
                    </Grid>

                    {isEditing && (
                      <Grid item xs={12}>
                        <Fade in timeout={400}>
                          <Box display="flex" gap={2}>
                            <Button
                              variant="contained"
                              startIcon={<Save />}
                              onClick={handleSave}
                              disabled={updateProfileMutation.isPending}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 3,
                                py: 1.2,
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
                              {updateProfileMutation.isPending
                                ? "Saving..."
                                : "Save Changes"}
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={handleEditToggle}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              Discard
                            </Button>
                          </Box>
                        </Fade>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </TabPanel>

              {/* Analytics Tab (Student Only) */}
              {isStudent && (
                <TabPanel value={tabValue} index={1}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight={700}
                      mb={3}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Badge color="primary" fontSize="small" />
                      Your Analytics
                    </Typography>

                    <Grid container spacing={3}>
                      {[
                        {
                          label: "Applications",
                          value: profile.applicationsCount || 0,
                          color: "primary.main",
                          delay: "100ms",
                        },
                        {
                          label: "Pending",
                          value: profile.pendingCount || 0,
                          color: "warning.main",
                          delay: "200ms",
                        },
                        {
                          label: "Accepted",
                          value: profile.acceptedCount || 0,
                          color: "success.main",
                          delay: "300ms",
                        },
                        {
                          label: "Member Since",
                          value: formatDate(profile.createdAt),
                          isDate: true,
                          delay: "400ms",
                        },
                      ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Grow
                            in
                            timeout={600}
                            style={{ transitionDelay: stat.delay }}
                          >
                            <Card
                              sx={{
                                textAlign: "center",
                                p: 3,
                                borderRadius: 3,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  transform: "translateY(-8px)",
                                  boxShadow:
                                    "0 12px 40px rgba(37, 99, 235, 0.15)",
                                },
                              }}
                            >
                              <Typography
                                color="textSecondary"
                                fontWeight={500}
                                gutterBottom
                              >
                                {stat.label}
                              </Typography>
                              {stat.isDate ? (
                                <Typography
                                  variant="body1"
                                  fontWeight={600}
                                  color="text.secondary"
                                >
                                  {stat.value}
                                </Typography>
                              ) : (
                                <Typography
                                  variant="h3"
                                  fontWeight={800}
                                  sx={{ color: stat.color }}
                                >
                                  {stat.value}
                                </Typography>
                              )}
                            </Card>
                          </Grow>
                        </Grid>
                      ))}
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Grow in timeout={600} style={{ transitionDelay: "500ms" }}>
                      <Box>
                        <Typography
                          variant="h6"
                          gutterBottom
                          fontWeight={700}
                          mb={2}
                        >
                          Profile Completion
                        </Typography>

                        <Card
                          variant="outlined"
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            },
                          }}
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={2}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              Profile Progress
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="primary.main"
                            >
                              65%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={65}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              bgcolor: "grey.200",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 5,
                                background:
                                  "linear-gradient(90deg, #2563EB 0%, #1E40AF 100%)",
                              },
                            }}
                          />
                        </Card>

                        <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                          Complete your profile by adding skills, CV, and a
                          profile picture to improve your visibility to
                          employers.
                        </Alert>
                      </Box>
                    </Grow>
                  </CardContent>
                </TabPanel>
              )}

              {/* Skills & CV Tab (Student Only) */}
              {isStudent && (
                <TabPanel value={tabValue} index={2}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight={700}
                      mb={3}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <School color="primary" fontSize="small" />
                      Skills & Qualifications
                    </Typography>

                    <Grow in timeout={600} style={{ transitionDelay: "100ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          mb: 3,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          fontWeight={700}
                        >
                          Your Skills
                        </Typography>

                        <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                          {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
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
                                    transform: "scale(1.05)",
                                  },
                                }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No skills added yet. Add skills to improve your
                              profile visibility.
                            </Typography>
                          )}
                        </Box>

                        {!isEditing && (
                          <Button
                            variant="outlined"
                            onClick={handleEditToggle}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            Add/Edit Skills
                          </Button>
                        )}
                      </Card>
                    </Grow>

                    <Grow in timeout={600} style={{ transitionDelay: "200ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          fontWeight={700}
                        >
                          Curriculum Vitae (CV)
                        </Typography>

                        {profile.cv ? (
                          <Box>
                            <Typography
                              variant="body2"
                              color="success.main"
                              mb={2}
                              fontWeight={500}
                            >
                              ✓ CV uploaded successfully
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              Download CV
                            </Button>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No CV uploaded yet. Upload a CV to apply for
                            opportunities.
                          </Typography>
                        )}
                      </Card>
                    </Grow>
                  </CardContent>
                </TabPanel>
              )}

              {/* Organization Tab */}
              {(isInstitution || isCompany) && (
                <TabPanel value={tabValue} index={isStudent ? 3 : 1}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight={700}
                      mb={3}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Work color="primary" fontSize="small" />
                      {isInstitution ? "Institution" : "Company"} Information
                    </Typography>

                    <Grid container spacing={3}>
                      {[
                        {
                          label: isInstitution
                            ? "Institution Name"
                            : "Company Name",
                          value:
                            profile.institutionName ||
                            profile.companyName ||
                            "",
                          delay: "100ms",
                        },
                        {
                          label: "Registration Number",
                          value: profile.registrationNumber || "",
                          delay: "150ms",
                        },
                        {
                          label: "Website",
                          value: profile.website || "",
                          delay: "200ms",
                        },
                        {
                          label: "Industry",
                          value: profile.industry || profile.field || "",
                          delay: "250ms",
                        },
                      ].map((field, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Grow
                            in
                            timeout={600}
                            style={{ transitionDelay: field.delay }}
                          >
                            <TextField
                              fullWidth
                              label={field.label}
                              value={field.value}
                              disabled
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          </Grow>
                        </Grid>
                      ))}

                      <Grid item xs={12}>
                        <Grow
                          in
                          timeout={600}
                          style={{ transitionDelay: "300ms" }}
                        >
                          <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={4}
                            value={profile.description || ""}
                            disabled
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          />
                        </Grow>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Grow
                          in
                          timeout={600}
                          style={{ transitionDelay: "350ms" }}
                        >
                          <TextField
                            fullWidth
                            label="Verification Status"
                            value={profile.verificationStatus || "Pending"}
                            disabled
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          />
                        </Grow>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Grow
                          in
                          timeout={600}
                          style={{ transitionDelay: "400ms" }}
                        >
                          <TextField
                            fullWidth
                            label="Account Status"
                            value={profile.status || ""}
                            disabled
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          />
                        </Grow>
                      </Grid>
                    </Grid>
                  </CardContent>
                </TabPanel>
              )}
            </Card>
          </Grow>

          {/* Account Info Section */}
          <Grow in timeout={1000} style={{ transitionDelay: "200ms" }}>
            <Card
              sx={{
                mt: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight={700}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <VerifiedUser color="primary" fontSize="small" />
                  Account Information
                </Typography>

                <Grid container spacing={3} mt={1}>
                  <Grid item xs={12} sm={6}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CalendarMonth fontSize="small" color="primary" />
                        <Typography variant="body2" color="textSecondary">
                          Account Created
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDate(profile.createdAt)}
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CalendarMonth fontSize="small" color="secondary" />
                        <Typography variant="body2" color="textSecondary">
                          Last Updated
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDate(profile.updatedAt)}
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      <Typography variant="body2" color="textSecondary" mb={1}>
                        Account ID
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        sx={{
                          bgcolor: "grey.100",
                          p: 1,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                        }}
                      >
                        {user?.uid || "N/A"}
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      <Typography variant="body2" color="textSecondary" mb={1}>
                        Email Status
                      </Typography>
                      <Chip
                        size="small"
                        label={
                          profile.emailVerified ? "Verified" : "Not Verified"
                        }
                        color={profile.emailVerified ? "success" : "error"}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      />
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        </Container>
      </Box>
    </Fade>
  );
}
