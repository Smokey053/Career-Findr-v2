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
  Fade,
  Zoom,
  Grow,
  Slide,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Language,
  Lock,
  Notifications,
  VpnKey,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Palette,
  Save,
  RestartAlt,
} from "@mui/icons-material";

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
    setPasswordDialogOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    alert("Password changed successfully!");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement actual account deletion
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
    <Fade in timeout={800}>
      <Box className="min-vh-100" bgcolor="background.default" sx={{ py: 4 }}>
        <Container maxWidth="md">
          {/* Animated Header */}
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
                  width: "40%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                  borderRadius: "0 0 0 100%",
                },
              }}
            >
              <CardContent sx={{ py: 4 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <SettingsIcon sx={{ fontSize: 36 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      Settings
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Manage your account preferences and security
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Zoom>

          {/* Settings Tabs */}
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
                    minHeight: 64,
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
                  label="General"
                  icon={<SettingsIcon />}
                  iconPosition="start"
                />
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
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={700}
                    mb={3}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <SettingsIcon color="primary" fontSize="small" />
                    General Preferences
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {/* Language */}
                    <Grow in timeout={600} style={{ transitionDelay: "100ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            fontWeight={700}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Language color="primary" />
                            Language
                          </Typography>
                          <Select
                            fullWidth
                            value={settings.language}
                            onChange={(e) =>
                              handleSettingChange("language", e.target.value)
                            }
                            sx={{
                              maxWidth: 300,
                              borderRadius: 2,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: 2,
                              },
                            }}
                          >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Español (Spanish)</MenuItem>
                            <MenuItem value="fr">Français (French)</MenuItem>
                            <MenuItem value="de">Deutsch (German)</MenuItem>
                            <MenuItem value="pt">
                              Português (Portuguese)
                            </MenuItem>
                            <MenuItem value="zu">isiZulu</MenuItem>
                          </Select>
                        </CardContent>
                      </Card>
                    </Grow>

                    {/* Theme */}
                    <Grow in timeout={600} style={{ transitionDelay: "200ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            fontWeight={700}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Palette color="secondary" />
                            Theme
                          </Typography>
                          <Select
                            fullWidth
                            value={settings.theme}
                            onChange={(e) =>
                              handleSettingChange("theme", e.target.value)
                            }
                            sx={{
                              maxWidth: 300,
                              borderRadius: 2,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: 2,
                              },
                            }}
                          >
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="dark">Dark</MenuItem>
                            <MenuItem value="auto">Auto (System)</MenuItem>
                          </Select>
                        </CardContent>
                      </Card>
                    </Grow>

                    {/* Auto-save Preferences */}
                    <Grow in timeout={600} style={{ transitionDelay: "300ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                fontWeight={700}
                              >
                                Auto-save Preferences
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Automatically save your search filters and
                                preferences
                              </Typography>
                            </Box>
                            <Switch
                              defaultChecked
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "primary.main",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                  {
                                    bgcolor: "primary.main",
                                  },
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>

                    {/* Save Button */}
                    <Box display="flex" gap={2} pt={2}>
                      <Button
                        variant="contained"
                        onClick={handleSaveSettings}
                        startIcon={<Save />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          py: 1.2,
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
                          },
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        Reset to Default
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </TabPanel>

              {/* Notification Settings */}
              <TabPanel value={tabValue} index={1}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={700}
                    mb={3}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Notifications color="primary" fontSize="small" />
                    Notification Preferences
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {/* Email Notifications */}
                    <Grow in timeout={600} style={{ transitionDelay: "100ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
                                Email Notifications
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Receive email updates about your applications
                                and activities
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
                    </Grow>

                    {/* Push Notifications */}
                    <Grow in timeout={600} style={{ transitionDelay: "150ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
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
                    </Grow>

                    {/* Application Updates */}
                    <Grow in timeout={600} style={{ transitionDelay: "200ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
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
                    </Grow>

                    {/* Weekly Digest */}
                    <Grow in timeout={600} style={{ transitionDelay: "250ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
                                Weekly Digest
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Receive a weekly summary of opportunities
                              </Typography>
                            </Box>
                            <Switch
                              checked={settings.weeklyDigest}
                              onChange={(e) =>
                                handleSettingChange(
                                  "weeklyDigest",
                                  e.target.checked
                                )
                              }
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>

                    {/* Newsletter */}
                    <Grow in timeout={600} style={{ transitionDelay: "300ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
                                Newsletter
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Subscribe to our monthly newsletter
                              </Typography>
                            </Box>
                            <Switch
                              checked={settings.newsletter}
                              onChange={(e) =>
                                handleSettingChange(
                                  "newsletter",
                                  e.target.checked
                                )
                              }
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>

                    {/* Save Button */}
                    <Box pt={2}>
                      <Button
                        variant="contained"
                        onClick={handleSaveSettings}
                        startIcon={<Save />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          py: 1.2,
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
                          },
                        }}
                      >
                        Save Notification Preferences
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </TabPanel>

              {/* Security Settings */}
              <TabPanel value={tabValue} index={2}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={700}
                    mb={3}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <VpnKey color="primary" fontSize="small" />
                    Security Settings
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {/* Password */}
                    <Grow in timeout={600} style={{ transitionDelay: "100ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
                                Password
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Change your account password
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              onClick={() => setPasswordDialogOpen(true)}
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
                              Change Password
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>

                    {/* Two-Factor Authentication */}
                    <Grow in timeout={600} style={{ transitionDelay: "200ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
                                Two-Factor Authentication
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Add an extra layer of security to your account
                              </Typography>
                            </Box>
                            <Switch
                              checked={settings.twoFactorAuth}
                              onChange={(e) =>
                                handleSettingChange(
                                  "twoFactorAuth",
                                  e.target.checked
                                )
                              }
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>

                    {/* Active Sessions */}
                    <Grow in timeout={600} style={{ transitionDelay: "300ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
                                Active Sessions
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Manage your active login sessions
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              View Sessions
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>

                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: 2,
                        "& .MuiAlert-icon": { alignItems: "center" },
                      }}
                    >
                      We recommend using a strong, unique password and enabling
                      two-factor authentication for better security.
                    </Alert>
                  </Box>
                </CardContent>
              </TabPanel>

              {/* Privacy & Account */}
              <TabPanel value={tabValue} index={3}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={700}
                    mb={3}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Lock color="primary" fontSize="small" />
                    Privacy & Account
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {/* Profile Visibility */}
                    <Grow in timeout={600} style={{ transitionDelay: "100ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            fontWeight={700}
                          >
                            Profile Visibility
                          </Typography>
                          <Select
                            fullWidth
                            defaultValue="public"
                            sx={{
                              maxWidth: 300,
                              borderRadius: 2,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: 2,
                              },
                            }}
                          >
                            <MenuItem value="public">Public</MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                            <MenuItem value="registered">
                              Registered Users Only
                            </MenuItem>
                          </Select>
                        </CardContent>
                      </Card>
                    </Grow>

                    {/* Data & Privacy */}
                    <Grow in timeout={600} style={{ transitionDelay: "200ms" }}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            fontWeight={700}
                          >
                            Data & Privacy
                          </Typography>

                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            mt={2}
                          >
                            <Button
                              variant="outlined"
                              fullWidth
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                justifyContent: "flex-start",
                                py: 1.5,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateX(4px)",
                                  bgcolor: "primary.50",
                                },
                              }}
                            >
                              Download Your Data
                            </Button>
                            <Button
                              variant="outlined"
                              fullWidth
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                justifyContent: "flex-start",
                                py: 1.5,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateX(4px)",
                                  bgcolor: "primary.50",
                                },
                              }}
                            >
                              Privacy Policy
                            </Button>
                            <Button
                              variant="outlined"
                              fullWidth
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                justifyContent: "flex-start",
                                py: 1.5,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateX(4px)",
                                  bgcolor: "primary.50",
                                },
                              }}
                            >
                              Terms of Service
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grow>

                    {/* Danger Zone */}
                    <Grow in timeout={600} style={{ transitionDelay: "300ms" }}>
                      <Card
                        sx={{
                          p: 3,
                          bgcolor: "rgba(211, 47, 47, 0.05)",
                          border: "1px solid rgba(211, 47, 47, 0.3)",
                          borderRadius: 3,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          fontWeight={700}
                          color="error.main"
                        >
                          ⚠️ Danger Zone
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          mb={2}
                        >
                          These actions are permanent and cannot be undone.
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={2}>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            fullWidth
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              py: 1.2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                bgcolor: "error.main",
                                color: "white",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            Logout
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteDialogOpen(true)}
                            fullWidth
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              py: 1.2,
                              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 20px rgba(211, 47, 47, 0.4)",
                              },
                            }}
                          >
                            Delete Account
                          </Button>
                        </Box>
                      </Card>
                    </Grow>
                  </Box>
                </CardContent>
              </TabPanel>
            </Card>
          </Grow>
        </Container>

        {/* Change Password Dialog */}
        <Dialog
          open={passwordDialogOpen}
          onClose={() => setPasswordDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          TransitionComponent={Zoom}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
              color: "white",
              fontWeight: 700,
            }}
          >
            Change Password
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              helperText="At least 8 characters"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setPasswordDialogOpen(false)}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              }}
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          TransitionComponent={Zoom}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)",
              color: "white",
              fontWeight: 700,
            }}
          >
            Delete Account
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              This action is permanent and cannot be undone!
            </Alert>
            <Typography>
              Are you sure you want to delete your account? All your data will
              be permanently removed.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
              }}
            >
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}
