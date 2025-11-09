import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUser } from "../../services/userService";
import { useQuery } from "@tanstack/react-query";
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
} from "@mui/icons-material";
import LoadingScreen from "../../components/common/LoadingScreen";

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({});

  // Fetch user profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: () => getUser(user?.uid),
    enabled: !!user?.uid,
  });

  if (isLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  const profile = profileData || user || {};
  const isStudent = profile.role === "student";
  const isInstitution = profile.role === "institute";
  const isCompany = profile.role === "company";

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Implement actual save functionality with backend
    setIsEditing(false);
    console.log("Saving profile:", formData);
  };

  return (
    <Box className="min-vh-100" bgcolor="background.default" sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "primary.main",
                  fontSize: 40,
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
                    color={
                      isStudent
                        ? "success"
                        : isInstitution
                        ? "info"
                        : isCompany
                        ? "warning"
                        : "default"
                    }
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
                    label={profile.status === "active" ? "Active" : "Inactive"}
                    color={profile.status === "active" ? "success" : "error"}
                  />
                </Box>
              </Box>
              <Button
                variant={isEditing ? "outlined" : "contained"}
                startIcon={isEditing ? <Cancel /> : <Edit />}
                onClick={handleEditToggle}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Card>
          <Tabs value={tabValue} onChange={(e, value) => setTabValue(value)}>
            <Tab label="Personal Information" />
            {isStudent && <Tab label="Analytics" />}
            {isStudent && <Tab label="Skills & CV" />}
            {(isInstitution || isCompany) && <Tab label="Organization" />}
          </Tabs>

          {/* Personal Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} mb={3}>
                Personal Information
              </Typography>

              {isEditing && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Edit your profile information below and click Save to update.
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
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
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    disabled
                    InputProps={{
                      startAdornment: <Mail sx={{ mr: 1, color: "gray" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={
                      isEditing
                        ? formData.phone || profile.phone
                        : profile.phone
                    }
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: "gray" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
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
                        <LocationOn sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio/Description"
                    multiline
                    rows={4}
                    value={
                      isEditing ? formData.bio || profile.bio : profile.bio
                    }
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>

                {isEditing && (
                  <Grid item xs={12} display="flex" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                    <Button variant="outlined" onClick={handleEditToggle}>
                      Discard
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </TabPanel>

          {/* Analytics Tab (Student Only) */}
          {isStudent && (
            <TabPanel value={tabValue} index={1}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600} mb={3}>
                  Your Analytics
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: "center", p: 2 }}>
                      <Typography color="textSecondary" gutterBottom>
                        Applications
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {profile.applicationsCount || 0}
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: "center", p: 2 }}>
                      <Typography color="textSecondary" gutterBottom>
                        Pending
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="warning.main"
                      >
                        {profile.pendingCount || 0}
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: "center", p: 2 }}>
                      <Typography color="textSecondary" gutterBottom>
                        Accepted
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="success.main"
                      >
                        {profile.acceptedCount || 0}
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: "center", p: 2 }}>
                      <Typography color="textSecondary" gutterBottom>
                        Member Since
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom fontWeight={600} mb={2}>
                  Profile Completion
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Profile Progress</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      65%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: 8,
                      bgcolor: "grey.200",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: "65%",
                        height: "100%",
                        bgcolor: "success.main",
                      }}
                    />
                  </Box>
                </Box>

                <Alert severity="info">
                  Complete your profile by adding skills, CV, and a profile
                  picture to improve your visibility to employers.
                </Alert>
              </CardContent>
            </TabPanel>
          )}

          {/* Skills & CV Tab (Student Only) */}
          {isStudent && (
            <TabPanel value={tabValue} index={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600} mb={3}>
                  Skills & Qualifications
                </Typography>

                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Your Skills
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <Chip key={index} label={skill} />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No skills added yet. Add skills to improve your profile
                      visibility.
                    </Typography>
                  )}
                </Box>

                {!isEditing && (
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                    sx={{ mb: 3 }}
                  >
                    Add/Edit Skills
                  </Button>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Curriculum Vitae (CV)
                </Typography>

                {profile.cv ? (
                  <Box>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      CV uploaded successfully
                    </Typography>
                    <Button variant="outlined" size="small">
                      Download CV
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No CV uploaded yet. Upload a CV to apply for opportunities.
                  </Typography>
                )}
              </CardContent>
            </TabPanel>
          )}

          {/* Organization Tab */}
          {(isInstitution || isCompany) && (
            <TabPanel value={tabValue} index={isStudent ? 3 : 1}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600} mb={3}>
                  {isInstitution ? "Institution" : "Company"} Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={
                        isInstitution ? "Institution Name" : "Company Name"
                      }
                      value={
                        profile.institutionName || profile.companyName || ""
                      }
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Registration Number"
                      value={profile.registrationNumber || ""}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={profile.website || ""}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Industry"
                      value={profile.industry || profile.field || ""}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      value={profile.description || ""}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Verification Status"
                      value={profile.verificationStatus || "Pending"}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Status"
                      value={profile.status || ""}
                      disabled
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </TabPanel>
          )}
        </Card>

        {/* Account Info Section */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Account Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Account Created
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {profile.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Account ID
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {user?.uid || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Email Status
                </Typography>
                <Chip
                  size="small"
                  label={profile.emailVerified ? "Verified" : "Not Verified"}
                  color={profile.emailVerified ? "success" : "error"}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
