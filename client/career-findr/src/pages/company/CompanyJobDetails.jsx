import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Card,
  CardContent,
  Alert,
  Fade,
  Zoom,
  Grow,
} from "@mui/material";
import {
  WorkRounded,
  LocationOnRounded,
  AttachMoneyRounded,
  ScheduleRounded,
  CheckCircleRounded,
  ArrowBackRounded,
  BusinessRounded,
  CalendarTodayRounded,
  StarRounded,
  CardGiftcardRounded,
  AssignmentRounded,
  InfoRounded,
  EditRounded,
  PeopleRounded,
} from "@mui/icons-material";
import { getJob } from "../../services/jobService";
import { formatDate } from "../../utils/dateUtils";
import LoadingScreen from "../../components/common/LoadingScreen";

const normalizeSalaryValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const formatSalaryRange = (min, max, currency = "LSL") => {
  const minValue = normalizeSalaryValue(min);
  const maxValue = normalizeSalaryValue(max);

  const formatNumber = (value) =>
    value.toLocaleString(undefined, { maximumFractionDigits: 0 });

  if (minValue !== null && maxValue !== null) {
    return `${currency} ${formatNumber(minValue)} - ${currency} ${formatNumber(
      maxValue
    )}`;
  }
  if (minValue !== null) {
    return `${currency} ${formatNumber(minValue)}+`;
  }
  if (maxValue !== null) {
    return `Up to ${currency} ${formatNumber(maxValue)}`;
  }
  return null;
};

const getSalaryDisplay = (job) =>
  formatSalaryRange(job?.salaryMin, job?.salaryMax, job?.currency || "LSL") ||
  job?.salary ||
  "Competitive";

export default function CompanyJobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Fetch job details
  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });

  if (isLoading) {
    return <LoadingScreen message="Loading job details..." />;
  }

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Job not found</Alert>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate("/company/jobs")}
          sx={{ mt: 2 }}
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Button
              startIcon={<ArrowBackRounded />}
              onClick={() => navigate("/company/jobs")}
              sx={{
                borderRadius: 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateX(-4px)",
                },
              }}
            >
              Back to Jobs
            </Button>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<PeopleRounded />}
                onClick={() => navigate(`/company/jobs/${jobId}/applicants`)}
                sx={{ borderRadius: 2 }}
              >
                View Applicants
              </Button>
              <Button
                variant="contained"
                startIcon={<EditRounded />}
                onClick={() => navigate(`/company/jobs/edit/${jobId}`)}
                sx={{ borderRadius: 2 }}
              >
                Edit Job
              </Button>
            </Box>
          </Box>
        </Fade>

        <Zoom in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header Section with Gradient */}
            <Box
              sx={{
                mb: 4,
                background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                borderRadius: 3,
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
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  {job.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    icon={<BusinessRounded sx={{ color: "white !important" }} />}
                    label={job.companyName || "Your Company"}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 500,
                      "& .MuiChip-icon": { color: "white" },
                    }}
                  />
                  <Chip
                    label={job.type || "Full-time"}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    label={job.status === "active" ? "Active" : "Closed"}
                    sx={{
                      bgcolor:
                        job.status === "active"
                          ? "rgba(16, 185, 129, 0.8)"
                          : "rgba(239, 68, 68, 0.8)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Key Information Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  icon: LocationOnRounded,
                  label: "Location",
                  value: job.location || "Remote",
                  color: "#EF4444",
                  delay: 0,
                },
                {
                  icon: AttachMoneyRounded,
                  label: "Salary",
                  value: getSalaryDisplay(job),
                  color: "#10B981",
                  delay: 100,
                },
                {
                  icon: ScheduleRounded,
                  label: "Experience",
                  value: job.experience || "Entry Level",
                  color: "#8B5CF6",
                  delay: 200,
                },
                {
                  icon: CalendarTodayRounded,
                  label: "Posted",
                  value: formatDate(job.createdAt),
                  color: "#F59E0B",
                  delay: 300,
                },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.label}>
                  <Grow
                    in
                    timeout={800}
                    style={{
                      transformOrigin: "0 0",
                      transitionDelay: `${item.delay}ms`,
                    }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        border: "none",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: `${item.color}15`,
                              mr: 1.5,
                            }}
                          >
                            <item.icon sx={{ color: item.color }} />
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            {item.label}
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700}>
                          {item.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>

            {/* Description */}
            <Fade in timeout={900}>
              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <WorkRounded sx={{ color: "#2563EB" }} />
                  <Typography variant="h5" fontWeight={700}>
                    Job Description
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    whiteSpace: "pre-line",
                    lineHeight: 1.8,
                    color: "text.secondary",
                  }}
                >
                  {job.description || "No description available."}
                </Typography>
              </Box>
            </Fade>

            {/* Requirements */}
            {job.requirements && (
              <Fade in timeout={1000}>
                <Box sx={{ mb: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <CheckCircleRounded sx={{ color: "#10B981" }} />
                    <Typography variant="h5" fontWeight={700}>
                      Requirements
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.8,
                      color: "text.secondary",
                    }}
                  >
                    {job.requirements}
                  </Typography>
                </Box>
              </Fade>
            )}

            {/* Skills */}
            {Array.isArray(job.skills) && job.skills.length > 0 && (
              <Fade in timeout={1100}>
                <Box sx={{ mb: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <StarRounded sx={{ color: "#8B5CF6" }} />
                    <Typography variant="h5" fontWeight={700}>
                      Required Skills
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {job.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          bgcolor: "rgba(139, 92, 246, 0.1)",
                          color: "#8B5CF6",
                          fontWeight: 500,
                          borderRadius: 2,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <Fade in timeout={1200}>
                <Box sx={{ mb: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <AssignmentRounded sx={{ color: "#F59E0B" }} />
                    <Typography variant="h5" fontWeight={700}>
                      Responsibilities
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.8,
                      color: "text.secondary",
                    }}
                  >
                    {job.responsibilities}
                  </Typography>
                </Box>
              </Fade>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Fade in timeout={1300}>
                <Box sx={{ mb: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <CardGiftcardRounded sx={{ color: "#10B981" }} />
                    <Typography variant="h5" fontWeight={700}>
                      Benefits
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.8,
                      color: "text.secondary",
                    }}
                  >
                    {job.benefits}
                  </Typography>
                </Box>
              </Fade>
            )}

            {/* Additional Information */}
            <Fade in timeout={1400}>
              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <InfoRounded sx={{ color: "#0EA5E9" }} />
                  <Typography variant="h5" fontWeight={700}>
                    Additional Information
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  {job.department && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Department
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {job.department}
                      </Typography>
                    </Grid>
                  )}
                  {job.deadline && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Application Deadline
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDate(job.deadline)}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Applicants
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {job.applicantsCount || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Fade>

            {/* Footer Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button
                startIcon={<ArrowBackRounded />}
                onClick={() => navigate("/company/jobs")}
                sx={{
                  borderRadius: 2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": { transform: "translateX(-4px)" },
                }}
              >
                Back to Jobs
              </Button>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<PeopleRounded />}
                  onClick={() => navigate(`/company/jobs/${jobId}/applicants`)}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": { transform: "translateY(-2px)" },
                  }}
                >
                  View Applicants ({job.applicantsCount || 0})
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EditRounded />}
                  onClick={() => navigate(`/company/jobs/edit/${jobId}`)}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
                    },
                  }}
                >
                  Edit Job
                </Button>
              </Box>
            </Box>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}
