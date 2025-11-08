import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
            Last updated: December 2024
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h5" gutterBottom>
            Introduction
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Career Findr ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our platform.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Information We Collect
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Personal Information
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            We collect personal information that you voluntarily provide to us
            when you register on the platform, including:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Name and contact information (email address, phone number)
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Educational background and qualifications
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Professional experience and resume
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Account credentials (username and password)
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Usage Data
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            We automatically collect certain information when you visit, use, or
            navigate the platform, including:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Log and usage data (IP address, browser type, pages visited)
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Device information (device type, operating system)
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Location data (if you enable location services)
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            We use the information we collect to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Provide, operate, and maintain our platform
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Process your applications to courses and jobs
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Match students with suitable opportunities
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Communicate with you about your account and our services
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Improve and personalize your experience
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Prevent fraud and ensure platform security
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Information Sharing
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            We may share your information with:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              <strong>Educational Institutions:</strong> When you apply to
              courses
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              <strong>Employers:</strong> When you apply to job postings
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              <strong>Service Providers:</strong> Third-party vendors who help
              us operate our platform
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              <strong>Legal Compliance:</strong> When required by law or to
              protect our rights
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Data Security
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            We implement appropriate technical and organizational security
            measures to protect your personal information. However, no
            electronic transmission or storage method is 100% secure. While we
            strive to protect your data, we cannot guarantee absolute security.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Your Rights
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Depending on your location, you may have the following rights:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Access and receive a copy of your personal data
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Rectify inaccurate or incomplete data
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Request deletion of your data
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Object to or restrict processing of your data
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Data portability
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Withdraw consent at any time
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Cookies and Tracking
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            We use cookies and similar tracking technologies to track activity
            on our platform and hold certain information. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Our platform is not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If you are a parent or guardian and believe your child has
            provided us with personal information, please contact us.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            If you have questions about this Privacy Policy, please contact us
            at:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1" paragraph color="text.secondary">
              <strong>Email:</strong> privacy@careerfindr.com
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              <strong>Phone:</strong> +266 123 4567
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              <strong>Address:</strong> Maseru, Lesotho
            </Typography>
          </Box>
        </Paper>

        <Box textAlign="center" mt={4}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/")}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
