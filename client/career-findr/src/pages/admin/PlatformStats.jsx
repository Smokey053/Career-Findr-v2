import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  People,
  School,
  Business,
  Work,
  Description,
  CheckCircle,
  Cancel,
  Schedule,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { getPlatformStats } from "../../services/userService";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563EB",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export default function PlatformStats() {
  const [timeRange, setTimeRange] = useState("30days");

  // Fetch platform statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ["platformStats", timeRange],
    queryFn: () => getPlatformStats(),
  });

  if (isLoading) {
    return <LoadingScreen message="Loading platform statistics..." />;
  }

  const {
    overview = {},
    userGrowth = [],
    applicationStats = {},
    jobStats = {},
    courseStats = {},
    topInstitutes = [],
    topCompanies = [],
    recentActivity = [],
  } = stats || {};

  const getTrendIcon = (trend) => {
    return trend === "up" ? (
      <TrendingUp color="success" fontSize="small" />
    ) : trend === "down" ? (
      <TrendingDown color="error" fontSize="small" />
    ) : null;
  };

  const getTrendColor = (trend) => {
    return trend === "up"
      ? "success.main"
      : trend === "down"
      ? "error.main"
      : "text.secondary";
  };

  // Prepare data for charts
  const userDistributionData = [
    { name: "Students", value: overview.totalStudents || 0 },
    { name: "Institutes", value: overview.totalInstitutes || 0 },
    { name: "Companies", value: overview.totalCompanies || 0 },
    { name: "Admins", value: overview.totalAdmins || 0 },
  ];

  const applicationStatusData = [
    { name: "Pending", value: applicationStats.pending || 0 },
    { name: "Under Review", value: applicationStats.underReview || 0 },
    { name: "Accepted", value: applicationStats.accepted || 0 },
    { name: "Rejected", value: applicationStats.rejected || 0 },
  ];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Platform Statistics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive analytics and insights
            </Typography>
          </Box>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
              <MenuItem value="1year">Last Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Overview Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <People color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {overview.totalUsers?.toLocaleString() || 0}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                  {getTrendIcon(overview.usersTrend)}
                  <Typography
                    variant="caption"
                    color={getTrendColor(overview.usersTrend)}
                  >
                    {overview.usersChange || 0}% from last period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <School color="warning" />
                  <Typography variant="body2" color="text.secondary">
                    Active Courses
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {overview.activeCourses?.toLocaleString() || 0}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                  {getTrendIcon(overview.coursesTrend)}
                  <Typography
                    variant="caption"
                    color={getTrendColor(overview.coursesTrend)}
                  >
                    {overview.coursesChange || 0}% from last period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Work color="success" />
                  <Typography variant="body2" color="text.secondary">
                    Active Jobs
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {overview.activeJobs?.toLocaleString() || 0}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                  {getTrendIcon(overview.jobsTrend)}
                  <Typography
                    variant="caption"
                    color={getTrendColor(overview.jobsTrend)}
                  >
                    {overview.jobsChange || 0}% from last period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Description color="info" />
                  <Typography variant="body2" color="text.secondary">
                    Total Applications
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {overview.totalApplications?.toLocaleString() || 0}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                  {getTrendIcon(overview.applicationsTrend)}
                  <Typography
                    variant="caption"
                    color={getTrendColor(overview.applicationsTrend)}
                  >
                    {overview.applicationsChange || 0}% from last period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="row g-3 mb-4">
          {/* User Growth Chart */}
          <div className="col-12 col-lg-8">
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  User Growth Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#2563EB"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="institutes"
                      stroke="#F59E0B"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="companies"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* User Distribution Pie Chart */}
          <div className="col-12 col-lg-4">
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  User Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="row g-3 mb-4">
          {/* Application Status Chart */}
          <div className="col-12 col-lg-6">
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Application Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563EB">
                      {applicationStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Course & Job Stats */}
          <div className="col-12 col-lg-6">
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Course & Job Statistics
                </Typography>
                <Box mt={3}>
                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Course Completion Rate
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {courseStats.completionRate || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={courseStats.completionRate || 0}
                      color="warning"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Job Application Success Rate
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {jobStats.successRate || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={jobStats.successRate || 0}
                      color="success"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Applications/Job
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {jobStats.avgApplications || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Students/Course
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {courseStats.avgStudents || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Performers & Recent Activity */}
        <div className="row g-3">
          {/* Top Institutes */}
          <div className="col-12 col-lg-4">
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Top Institutes
                </Typography>
                <List>
                  {topInstitutes.map((institute, index) => (
                    <ListItem key={institute.id}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        width="100%"
                      >
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          color={index === 0 ? "warning" : "default"}
                        />
                        <Box flexGrow={1}>
                          <Typography variant="body2" fontWeight={600}>
                            {institute.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {institute.courses} courses • {institute.students}{" "}
                            students
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </div>

          {/* Top Companies */}
          <div className="col-12 col-lg-4">
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Top Companies
                </Typography>
                <List>
                  {topCompanies.map((company, index) => (
                    <ListItem key={company.id}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        width="100%"
                      >
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          color={index === 0 ? "primary" : "default"}
                        />
                        <Box flexGrow={1}>
                          <Typography variant="body2" fontWeight={600}>
                            {company.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {company.jobs} jobs • {company.applicants}{" "}
                            applicants
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="col-12 col-lg-4">
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={index}>
                      <Box
                        display="flex"
                        alignItems="start"
                        gap={1}
                        width="100%"
                      >
                        {activity.type === "application" && (
                          <CheckCircle fontSize="small" color="success" />
                        )}
                        {activity.type === "job" && (
                          <Work fontSize="small" color="primary" />
                        )}
                        {activity.type === "course" && (
                          <School fontSize="small" color="warning" />
                        )}
                        {activity.type === "user" && (
                          <People fontSize="small" color="info" />
                        )}
                        <Box flexGrow={1}>
                          <Typography variant="body2">
                            {activity.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Box>
  );
}
