import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  Delete,
  CheckCircle,
  Cancel,
  Pending,
  Download,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";
import {
  getStudentApplications,
  getStudentAdmissions,
  acceptAdmission,
  declineAdmission,
} from "../../services/applicationService";

export default function MyApplications() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Fetch applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ["studentApplications"],
    queryFn: () => getStudentApplications(user.uid),
  });

  // Fetch admissions
  const { data: admissions } = useQuery({
    queryKey: ["studentAdmissions"],
    queryFn: () => getStudentAdmissions(user.uid),
  });

  // Accept admission mutation
  const acceptAdmissionMutation = useMutation({
    mutationFn: (admissionId) => acceptAdmission(admissionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["studentAdmissions"]);
    },
  });

  // Decline admission mutation
  const declineAdmissionMutation = useMutation({
    mutationFn: (admissionId) => declineAdmission(admissionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["studentAdmissions"]);
    },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle />;
      case "rejected":
        return <Cancel />;
      case "pending":
        return <Pending />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading applications..." />;
  }

  const courseApplications = applications || [];
  const pendingAdmissions =
    admissions?.filter((adm) => adm.status === "pending") || [];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          My Applications
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Track your course applications and manage admission offers
        </Typography>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Applications
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {courseApplications.length}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {
                    courseApplications.filter((app) => app.status === "pending")
                      .length
                  }
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Accepted
                </Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {
                    courseApplications.filter(
                      (app) => app.status === "accepted"
                    ).length
                  }
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Admission Offers
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="secondary.main"
                >
                  {pendingAdmissions.length}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
          >
            <Tab label="Course Applications" />
            <Tab label={`Admission Offers (${pendingAdmissions.length})`} />
          </Tabs>

          {/* Course Applications Tab */}
          {tabValue === 0 && (
            <CardContent>
              {courseApplications.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Institution</TableCell>
                        <TableCell>Applied Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {courseApplications.map((app) => (
                        <TableRow key={app.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {app.courseName || "Course Name"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {app.courseField || "Field"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {app.instituteName || "Institution"}
                          </TableCell>
                          <TableCell>
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(app.status)}
                              label={app.status}
                              size="small"
                              color={getStatusColor(app.status)}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton size="small" color="primary">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            {app.documents && (
                              <Tooltip title="Download Documents">
                                <IconButton size="small" color="info">
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box py={6} textAlign="center">
                  <Pending
                    sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No applications yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start browsing courses to submit your first application
                  </Typography>
                  <Button variant="contained" href="/courses">
                    Browse Courses
                  </Button>
                </Box>
              )}
            </CardContent>
          )}

          {/* Admission Offers Tab */}
          {tabValue === 1 && (
            <CardContent>
              {pendingAdmissions.length > 0 ? (
                <div className="row g-3">
                  {pendingAdmissions.map((admission) => (
                    <div className="col-12 col-md-6" key={admission.id}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="between"
                            alignItems="start"
                            mb={2}
                          >
                            <CheckCircle
                              color="success"
                              sx={{ fontSize: 40 }}
                            />
                            <Chip
                              label="Admission Offer"
                              color="success"
                              size="small"
                            />
                          </Box>

                          <Typography
                            variant="h6"
                            fontWeight={600}
                            gutterBottom
                          >
                            {admission.courseName || "Course Name"}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="primary"
                            gutterBottom
                          >
                            {admission.instituteName || "Institution"}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {admission.message ||
                              "Congratulations! You have been accepted."}
                          </Typography>

                          {admission.deadline && (
                            <Typography
                              variant="caption"
                              color="error"
                              display="block"
                              gutterBottom
                            >
                              Respond by:{" "}
                              {new Date(
                                admission.deadline
                              ).toLocaleDateString()}
                            </Typography>
                          )}

                          <Box display="flex" gap={1} mt={2}>
                            <Button
                              variant="contained"
                              color="success"
                              fullWidth
                              onClick={() =>
                                acceptAdmissionMutation.mutate(admission.id)
                              }
                              disabled={acceptAdmissionMutation.isPending}
                            >
                              Accept Offer
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              fullWidth
                              onClick={() =>
                                declineAdmissionMutation.mutate(admission.id)
                              }
                              disabled={declineAdmissionMutation.isPending}
                            >
                              Decline
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <Box py={6} textAlign="center">
                  <CheckCircle
                    sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No admission offers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admission offers will appear here when institutions accept
                    your applications
                  </Typography>
                </Box>
              )}
            </CardContent>
          )}
        </Card>
      </Container>
    </Box>
  );
}
