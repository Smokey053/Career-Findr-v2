import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  RefreshOutlined,
  SchoolOutlined,
  CheckCircleOutline,
  HighlightOff,
  PendingOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { formatDate } from "../../utils/dateUtils";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../../components/common/LoadingScreen";
import { getInstitutionAdmissions } from "../../services/applicationService";

const statusOptions = [
  {
    label: "All Admissions",
    value: "all",
    color: "default",
    icon: <SchoolOutlined fontSize="small" />,
  },
  {
    label: "Pending",
    value: "pending",
    color: "warning",
    icon: <PendingOutlined fontSize="small" />,
  },
  {
    label: "Accepted",
    value: "accepted",
    color: "success",
    icon: <CheckCircleOutline fontSize="small" />,
  },
  {
    label: "Declined",
    value: "declined",
    color: "error",
    icon: <HighlightOff fontSize="small" />,
  },
];

export default function AdmissionsManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: admissions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["institutionAdmissions", user?.uid],
    queryFn: () => getInstitutionAdmissions(user.uid),
    enabled: !!user?.uid,
  });

  const filteredAdmissions = useMemo(() => {
    if (!admissions) return [];
    if (statusFilter === "all") return admissions;
    return admissions.filter(
      (adm) => (adm.status || "pending").toLowerCase() === statusFilter
    );
  }, [admissions, statusFilter]);

  if (isLoading) {
    return <LoadingScreen message="Loading admissions" />;
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card
          sx={{
            borderRadius: 4,
            mb: 4,
            p: 3,
            background: "linear-gradient(135deg, #0F172A 0%, #1D4ED8 100%)",
            color: "white",
          }}
        >
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <IconButton
              onClick={() => navigate("/dashboard/institute")}
              sx={{ color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <ArrowBack />
            </IconButton>
            <Box flex={1} minWidth={200}>
              <Typography variant="overline" sx={{ opacity: 0.7 }}>
                Admissions Management
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                Offer Tracking
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Monitor offers and student responses across all courses.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RefreshOutlined />}
              onClick={() => refetch()}
              sx={{ borderColor: "rgba(255,255,255,0.6)", color: "white" }}
            >
              Refresh
            </Button>
          </Box>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={statusFilter}
              onChange={(e, value) => setStatusFilter(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
            >
              {statusOptions.map((option) => (
                <Tab
                  key={option.value}
                  value={option.value}
                  icon={option.icon}
                  iconPosition="start"
                  label={option.label}
                  sx={{ fontWeight: 600, textTransform: "none" }}
                />
              ))}
            </Tabs>

            {filteredAdmissions.length === 0 ? (
              <Box py={8} textAlign="center">
                <Typography variant="h6" gutterBottom fontWeight={700}>
                  No admissions in this state
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Adjust the filter or create new admission offers.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 3 }}>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
                  gap={2}
                >
                  {filteredAdmissions.map((admission) => (
                    <Card
                      key={admission.id}
                      variant="outlined"
                      sx={{ borderRadius: 3, borderColor: "divider" }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1.5}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            {admission.courseName || "Course"}
                          </Typography>
                          <Chip
                            size="small"
                            label={(
                              admission.status || "pending"
                            ).toUpperCase()}
                            color={
                              admission.status === "accepted"
                                ? "success"
                                : admission.status === "declined"
                                ? "error"
                                : "warning"
                            }
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                          />
                        </Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {admission.studentName || "Student"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {admission.studentEmail || "email unavailable"}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="text.secondary">
                          Offer created
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatDate(admission.createdAt)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
