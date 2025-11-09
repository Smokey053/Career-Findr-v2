import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Language,
  Lock,
  Notifications,
  VpnKey,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Settings state
  const [settings, setSettings] = useState({
    language: "en",
    theme: "light",
    emailNotifications: true,
    pushNotifications: true,
    applicationUpdates: true,
    weeklyDigest: true,
    newsletter: false,
    twoFactorAuth: false,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement actual save functionality
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    // TODO: Implement actual password change
    console.log("Password change requested");
    setPasswordDialogOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    alert("Password changed successfully!");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement actual account deletion
    console.log("Account deletion requested");
    setDeleteDialogOpen(false);
    alert("Account deletion request submitted. You will be logged out.");
    logout();
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box className="min-vh-100" bgcolor="background.default" sx={{ py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <SettingsIcon sx={{ fontSize: 40, color: "primary.main" }} />
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Settings
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage your account preferences and security
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Card>
          <Tabs
            value={tabValue}
            onChange={(e, value) => setTabValue(value)}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="General" icon={<SettingsIcon />} iconPosition="start" />
            <Tab
              label="Notifications"
              icon={<Notifications />}
              iconPosition="start"
            />
            <Tab label="Security" icon={<VpnKey />} iconPosition="start" />
            <Tab label="Privacy" icon={<Lock />} iconPosition="start" />
          </Tabs>

          {/* General Settings */}
          <TabPanel value={tabValue} index={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} mb={3}>
                General Preferences
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Language */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    <Language sx={{ mr: 1, verticalAlign: "middle" }} />
                    Language
                  </Typography>
                  <Select
                    fullWidth
                    value={settings.language}
                    onChange={(e) =>
                      handleSettingChange("language", e.target.value)
                    }
                    sx={{ maxWidth: 300 }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español (Spanish)</MenuItem>
                    <MenuItem value="fr">Français (French)</MenuItem>
                    <MenuItem value="de">Deutsch (German)</MenuItem>
                    <MenuItem value="pt">Português (Portuguese)</MenuItem>
                    <MenuItem value="zu">isiZulu</MenuItem>
                  </Select>
                </Box>

                <Divider />

                {/* Theme */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Theme
                  </Typography>
                  <Select
                    fullWidth
                    value={settings.theme}
                    onChange={(e) =>
                      handleSettingChange("theme", e.target.value)
                    }
                    sx={{ maxWidth: 300 }}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </Select>
                </Box>

                <Divider />

                {/* Auto-save Preferences */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Auto-save Preferences
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Automatically save your search filters and preferences
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable auto-save"
                  />
                </Box>

                <Divider />

                {/* Save Button */}
                <Box display="flex" gap={2}>
                  <Button variant="contained" onClick={handleSaveSettings}>
                    Save Changes
                  </Button>
                  <Button variant="outlined">Reset to Default</Button>
                </Box>
              </Box>
            </CardContent>
          </TabPanel>

          {/* Notification Settings */}
          <TabPanel value={tabValue} index={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} mb={3}>
                Notification Preferences
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Email Notifications */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Email Notifications
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Receive email updates about your applications and
                          activities
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "emailNotifications",
                            e.target.checked
                          )
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Push Notifications */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Push Notifications
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Get instant notifications on your device
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "pushNotifications",
                            e.target.checked
                          )
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Application Updates */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Application Updates
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Get notified about changes to your applications
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.applicationUpdates}
                        onChange={(e) =>
                          handleSettingChange(
                            "applicationUpdates",
                            e.target.checked
                          )
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Weekly Digest */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Weekly Digest
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Receive a weekly summary of opportunities
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.weeklyDigest}
                        onChange={(e) =>
                          handleSettingChange("weeklyDigest", e.target.checked)
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Newsletter
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Subscribe to our monthly newsletter
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.newsletter}
                        onChange={(e) =>
                          handleSettingChange("newsletter", e.target.checked)
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>

                <Divider sx={{ my: 2 }} />

                {/* Save Button */}
                <Button variant="contained" onClick={handleSaveSettings}>
                  Save Notification Preferences
                </Button>
              </Box>
            </CardContent>
          </TabPanel>

          {/* Security Settings */}
          <TabPanel value={tabValue} index={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} mb={3}>
                Security Settings
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Password */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Password
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Change your account password
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => setPasswordDialogOpen(true)}
                      >
                        Change Password
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                {/* Two-Factor Authentication */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Two-Factor Authentication
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Add an extra layer of security to your account
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) =>
                          handleSettingChange("twoFactorAuth", e.target.checked)
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Active Sessions */}
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Active Sessions
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Manage your active login sessions
                        </Typography>
                      </Box>
                      <Button variant="outlined" size="small">
                        View Sessions
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                <Alert severity="info">
                  We recommend using a strong, unique password and enabling
                  two-factor authentication for better security.
                </Alert>
              </Box>
            </CardContent>
          </TabPanel>

          {/* Privacy & Account */}
          <TabPanel value={tabValue} index={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} mb={3}>
                Privacy & Account
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Profile Visibility */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Profile Visibility
                  </Typography>
                  <Select
                    fullWidth
                    defaultValue="public"
                    sx={{ maxWidth: 300 }}
                  >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                    <MenuItem value="registered">
                      Registered Users Only
                    </MenuItem>
                  </Select>
                </Box>

                <Divider />

                {/* Data & Privacy */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Data & Privacy
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    <Button variant="outlined" fullWidth>
                      Download Your Data
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Privacy Policy
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Terms of Service
                    </Button>
                  </Box>
                </Box>

                <Divider />

                {/* Danger Zone */}
                <Box sx={{ p: 2, bgcolor: "error.light", borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Danger Zone
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    These actions are permanent and cannot be undone.
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      fullWidth
                    >
                      Logout
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      fullWidth
                    >
                      Delete Account
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </TabPanel>
        </Card>
      </Container>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            helperText="At least 8 characters"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action is permanent and cannot be undone!
          </Alert>
          <Typography>
            Are you sure you want to delete your account? All your data will be
            permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
