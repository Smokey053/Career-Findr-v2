import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  School,
  Work,
  Business,
  TrendingUp,
  People,
  Public,
} from "@mui/icons-material";

const stats = [
  { icon: People, value: "10,000+", label: "Active Users" },
  { icon: Business, value: "500+", label: "Partner Institutions" },
  { icon: Work, value: "5,000+", label: "Job Placements" },
  { icon: Public, value: "50+", label: "Countries" },
];

const team = [
  {
    name: "Development Team",
    role: "Technology & Innovation",
    description: "Building the future of career management platforms",
  },
  {
    name: "Education Partners",
    role: "Institutional Relations",
    description: "Connecting top educational institutions",
  },
  {
    name: "Corporate Partners",
    role: "Career Opportunities",
    description: "Creating pathways to meaningful careers",
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 6, md: 8 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{
              color: "white",
              mb: 3,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Back to Home
          </Button>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
          >
            About Career Findr
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              maxWidth: 600,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Connecting students with institutions and career opportunities
            through innovative technology
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Career Findr was created to bridge the gap between educational
              institutions, students, and employers. We believe that finding the
              right educational path and career opportunity should be simple,
              transparent, and accessible to everyone.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Our platform streamlines the application process, making it easier
              for students to discover opportunities, for institutions to manage
              applications, and for companies to find the perfect candidates.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: { xs: 300, md: 400 },
                bgcolor: "primary.light",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp
                sx={{ fontSize: 120, color: "white", opacity: 0.5 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box bgcolor="background.paper" py={{ xs: 6, md: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom mb={6}>
            Our Impact
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Grid item xs={6} md={3} key={index}>
                  <Card
                    sx={{
                      textAlign: "center",
                      p: 3,
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 8,
                      },
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 48,
                        color: "primary.main",
                        mb: 2,
                      }}
                    />
                    <Typography variant="h4" color="primary" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h3" textAlign="center" gutterBottom mb={6}>
          Our Values
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, height: "100%" }}>
              <School sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Education First
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We prioritize accessible, quality education for all students
                regardless of their background or location.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, height: "100%" }}>
              <Work sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Career Growth
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We're committed to helping students find meaningful careers that
                align with their skills and passions.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, height: "100%" }}>
              <Business sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Partnership
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We believe in building strong partnerships between institutions,
                students, and employers.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Team Section */}
      <Box bgcolor="background.paper" py={{ xs: 6, md: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom mb={6}>
            Our Team
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "primary.main",
                      fontSize: 32,
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container
        maxWidth="md"
        sx={{ py: { xs: 6, md: 8 }, textAlign: "center" }}
      >
        <Typography variant="h3" gutterBottom>
          Join Us Today
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph mb={4}>
          Be part of a platform that's transforming education and career
          opportunities worldwide.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/signup")}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 8,
              },
            }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/contact")}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Contact Us
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
