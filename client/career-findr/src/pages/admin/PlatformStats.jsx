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
  Fade,
  Zoom,
  Grow,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUpRounded,
  TrendingDownRounded,
  PeopleRounded,
  SchoolRounded,
  BusinessRounded,
  WorkRounded,
  DescriptionRounded,
  CheckCircleRounded,
  CancelRounded,
  ScheduleRounded,
  AnalyticsRounded,
  InsightsRounded,
  LeaderboardRounded,
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
  Area,
  AreaChart,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch platform statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ["platformStats", timeRange],
    queryFn: () => getPlatformStats(timeRange),
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

  // Build overview from stats data
  const computedOverview = {
    totalUsers: stats?.totalUsers || 0,
    totalStudents: stats?.usersByRole?.student || 0,
    totalInstitutes: stats?.totalInstitutions || 0,
    totalCompanies: stats?.totalCompanies || 0,
    totalAdmins: stats?.usersByRole?.admin || 0,
    activeCourses: stats?.totalCourses || 0,
    activeJobs: stats?.totalJobs || 0,
    totalApplications: stats?.totalApplications || 0,
  };

  const computedApplicationStats = stats?.applicationsByStatus || {
    pending: 0,
    approved: 0,
    rejected: 0,
    interviewing: 0,
    shortlisted: 0,
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? (
      <TrendingUpRounded color="success" fontSize="small" />
    ) : trend === "down" ? (
      <TrendingDownRounded color="error" fontSize="small" />
    ) : null;
  };

  const getTrendColor = (trend) => {
    return trend === "up"
      ? "success.main"
      : trend === "down"
      ? "error.main"
      : "text.secondary";
  };

  // Stats configuration for animated cards
  const overviewStats = [
    {
      label: "Total Users",
      value: computedOverview.totalUsers?.toLocaleString() || 0,
      icon: PeopleRounded,
      color: "#2563EB",
      trend: "up",
      change: 5,
      delay: 0,
    },
    {
      label: "Active Courses",
      value: computedOverview.activeCourses?.toLocaleString() || 0,
      icon: SchoolRounded,
      color: "#F59E0B",
      trend: "up",
      change: 3,
      delay: 100,
    },
    {
      label: "Active Jobs",
      value: computedOverview.activeJobs?.toLocaleString() || 0,
      icon: WorkRounded,
      color: "#10B981",
      trend: "up",
      change: 8,
      delay: 200,
    },
    {
      label: "Total Applications",
      value: computedOverview.totalApplications?.toLocaleString() || 0,
      icon: DescriptionRounded,
      color: "#0EA5E9",
      trend: "up",
      change: 12,
      delay: 300,
    },
  ];

  // Prepare data for charts
  const userDistributionData = [
    { name: "Students", value: computedOverview.totalStudents || 0 },
    { name: "Institutes", value: computedOverview.totalInstitutes || 0 },
    { name: "Companies", value: computedOverview.totalCompanies || 0 },
    { name: "Admins", value: computedOverview.totalAdmins || 0 },
  ];

  const applicationStatusData = [
    { name: "Pending", value: computedApplicationStats.pending || 0 },
    { name: "Approved", value: computedApplicationStats.approved || 0 },
    { name: "Rejected", value: computedApplicationStats.rejected || 0 },
    { name: "Interviewing", value: computedApplicationStats.interviewing || 0 },
  ];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header with Gradient */}
        <Fade in timeout={800}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            sx={{
              background: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
              borderRadius: 4,
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
            <Box position="relative" zIndex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <AnalyticsRounded sx={{ fontSize: 40 }} />
                <Typography variant="h4" fontWeight={700}>
                  Platform Statistics
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Comprehensive analytics and insights
              </Typography>
            </Box>
            <Zoom in timeout={600}>
              <FormControl
                sx={{
                  minWidth: 150,
                  position: "relative",
                  zIndex: 1,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                    borderRadius: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  },
                }}
              >
                <InputLabel sx={{ bgcolor: "white", px: 0.5 }}>
                  Time Range
                </InputLabel>
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
            </Zoom>
          </Box>
        </Fade>

        {/* Overview Cards */}
        <div className="row g-3 mb-4">
          {overviewStats.map((stat, index) => (
            <div className="col-12 col-sm-6 col-lg-3" key={stat.label}>
              <Grow
                in
                timeout={1000}
                style={{
                  transformOrigin: "0 0",
                  transitionDelay: `${stat.delay}ms`,
                }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    overflow: "visible",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5, position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: -12,
                        right: 16,
                        width: 52,
                        height: 52,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                        boxShadow: `0 4px 14px ${stat.color}40`,
                      }}
                    >
                      <stat.icon sx={{ color: "white", fontSize: 28 }} />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      fontWeight={500}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: stat.color }}
                    >
                      {stat.value}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                      {getTrendIcon(stat.trend)}
                      <Typography
                        variant="caption"
                        fontWeight={500}
                        color={getTrendColor(stat.trend)}
                      >
                        {stat.change || 0}% from last period
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="row g-3 mb-4">
          {/* User Growth Chart */}
          <div className="col-12 col-lg-8">
            <Fade in timeout={900}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={1}
                    mb={3}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <InsightsRounded sx={{ color: "#2563EB" }} />
                      <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
                        User Growth Over Time
                      </Typography>
                    </Box>
                    {userGrowth.length > 0 && (
                      <Chip 
                        label={`${userGrowth[userGrowth.length - 1]?.total || 0} total users`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                  
                  {userGrowth.length === 0 ? (
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center" 
                      height={isMobile ? 250 : 300}
                      sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                    >
                      <Typography color="text.secondary">
                        No growth data available yet
                      </Typography>
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                      <AreaChart 
                        data={userGrowth}
                        margin={{ 
                          top: 10, 
                          right: isMobile ? 10 : 30, 
                          left: isMobile ? -20 : 0, 
                          bottom: 0 
                        }}
                      >
                        <defs>
                          <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorInstitutes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          interval={isMobile ? 'preserveStartEnd' : 0}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? 'end' : 'middle'}
                          height={isMobile ? 60 : 30}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          width={isMobile ? 30 : 40}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                            border: "none",
                            fontSize: isMobile ? 12 : 14,
                          }}
                          formatter={(value, name) => [
                            value,
                            name.charAt(0).toUpperCase() + name.slice(1)
                          ]}
                        />
                        <Legend 
                          verticalAlign="top"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ 
                            fontSize: isMobile ? 11 : 13,
                            paddingBottom: '10px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="students"
                          stroke="#2563EB"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorStudents)"
                          dot={{ fill: "#2563EB", strokeWidth: 2, r: isMobile ? 2 : 4 }}
                          activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 0 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="institutes"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorInstitutes)"
                          dot={{ fill: "#F59E0B", strokeWidth: 2, r: isMobile ? 2 : 4 }}
                          activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 0 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="companies"
                          stroke="#10B981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorCompanies)"
                          dot={{ fill: "#10B981", strokeWidth: 2, r: isMobile ? 2 : 4 }}
                          activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </div>

          {/* User Distribution Pie Chart */}
          <div className="col-12 col-lg-4">
            <Fade in timeout={1000}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <PeopleRounded sx={{ color: "#8B5CF6" }} />
                    <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
                      User Distribution
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
                    <PieChart>
                      <Pie
                        data={userDistributionData}
                        cx="50%"
                        cy="45%"
                        labelLine={!isMobile}
                        label={isMobile ? false : ({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={isMobile ? 70 : 90}
                        innerRadius={isMobile ? 35 : 50}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {userDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          border: "none",
                          fontSize: isMobile ? 12 : 14,
                        }}
                        formatter={(value, name) => [value, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ 
                          paddingTop: "10px",
                          fontSize: isMobile ? 11 : 13,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Fade>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="row g-3 mb-4">
          {/* Application Status Chart */}
          <div className="col-12 col-lg-6">
            <Fade in timeout={1100}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                    <DescriptionRounded sx={{ color: "#0EA5E9" }} />
                    <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
                      Application Status
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                    <BarChart 
                      data={applicationStatusData}
                      margin={{ 
                        top: 10, 
                        right: isMobile ? 10 : 30, 
                        left: isMobile ? -20 : 0, 
                        bottom: 0 
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9CA3AF"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        width={isMobile ? 30 : 40}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          border: "none",
                          fontSize: isMobile ? 12 : 14,
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
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
            </Fade>
          </div>

          {/* Course & Job Stats */}
          <div className="col-12 col-lg-6">
            <Fade in timeout={1200}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                    <LeaderboardRounded sx={{ color: "#10B981" }} />
                    <Typography variant="h6" fontWeight={700}>
                      Course & Job Statistics
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Box mb={4}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={1.5}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Course Completion Rate
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="warning.main"
                        >
                          {courseStats.completionRate || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={courseStats.completionRate || 0}
                        color="warning"
                        sx={{
                          height: 10,
                          borderRadius: 2,
                          bgcolor: "rgba(245, 158, 11, 0.15)",
                        }}
                      />
                    </Box>
                    <Box mb={4}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={1.5}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Job Application Success Rate
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="success.main"
                        >
                          {jobStats.successRate || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={jobStats.successRate || 0}
                        color="success"
                        sx={{
                          height: 10,
                          borderRadius: 2,
                          bgcolor: "rgba(16, 185, 129, 0.15)",
                        }}
                      />
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "rgba(37, 99, 235, 0.05)",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            Avg. Applications/Job
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            color="primary.main"
                            mt={1}
                          >
                            {jobStats.avgApplications || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "rgba(245, 158, 11, 0.05)",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            Avg. Students/Course
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            color="warning.main"
                            mt={1}
                          >
                            {courseStats.avgStudents || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </div>
        </div>

        {/* Top Performers & Recent Activity */}
        <div className="row g-3">
          {/* Top Institutes */}
          <div className="col-12 col-lg-4">
            <Slide in direction="up" timeout={1000}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <SchoolRounded sx={{ color: "#F59E0B" }} />
                    <Typography variant="h6" fontWeight={700}>
                      Top Institutes
                    </Typography>
                  </Box>
                  <List>
                    {topInstitutes.map((institute, index) => (
                      <ListItem
                        key={institute.id}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            bgcolor: "action.hover",
                            transform: "translateX(8px)",
                          },
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          width="100%"
                        >
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor:
                                index === 0
                                  ? "warning.main"
                                  : index === 1
                                  ? "grey.400"
                                  : index === 2
                                  ? "#CD7F32"
                                  : "grey.200",
                              color: index < 3 ? "white" : "text.primary",
                            }}
                          />
                          <Box flexGrow={1}>
                            <Typography variant="body2" fontWeight={600}>
                              {institute.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
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
            </Slide>
          </div>

          {/* Top Companies */}
          <div className="col-12 col-lg-4">
            <Slide in direction="up" timeout={1100}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <BusinessRounded sx={{ color: "#2563EB" }} />
                    <Typography variant="h6" fontWeight={700}>
                      Top Companies
                    </Typography>
                  </Box>
                  <List>
                    {topCompanies.map((company, index) => (
                      <ListItem
                        key={company.id}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            bgcolor: "action.hover",
                            transform: "translateX(8px)",
                          },
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          width="100%"
                        >
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor:
                                index === 0
                                  ? "primary.main"
                                  : index === 1
                                  ? "grey.400"
                                  : index === 2
                                  ? "#CD7F32"
                                  : "grey.200",
                              color: index < 3 ? "white" : "text.primary",
                            }}
                          />
                          <Box flexGrow={1}>
                            <Typography variant="body2" fontWeight={600}>
                              {company.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
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
            </Slide>
          </div>

          {/* Recent Activity */}
          <div className="col-12 col-lg-4">
            <Slide in direction="up" timeout={1200}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <ScheduleRounded sx={{ color: "#8B5CF6" }} />
                    <Typography variant="h6" fontWeight={700}>
                      Recent Activity
                    </Typography>
                  </Box>
                  <List>
                    {recentActivity.map((activity, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="start"
                          gap={1.5}
                          width="100%"
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor:
                                activity.type === "application"
                                  ? "success.lighter"
                                  : activity.type === "job"
                                  ? "primary.lighter"
                                  : activity.type === "course"
                                  ? "warning.lighter"
                                  : "info.lighter",
                            }}
                          >
                            {activity.type === "application" && (
                              <CheckCircleRounded
                                fontSize="small"
                                color="success"
                              />
                            )}
                            {activity.type === "job" && (
                              <WorkRounded fontSize="small" color="primary" />
                            )}
                            {activity.type === "course" && (
                              <SchoolRounded fontSize="small" color="warning" />
                            )}
                            {activity.type === "user" && (
                              <PeopleRounded fontSize="small" color="info" />
                            )}
                          </Box>
                          <Box flexGrow={1}>
                            <Typography variant="body2" fontWeight={500}>
                              {activity.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Slide>
          </div>
        </div>
      </Container>
    </Box>
  );
}
