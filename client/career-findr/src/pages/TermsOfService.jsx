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

export default function TermsOfService() {
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
            Terms of Service
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
            Agreement to Terms
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            By accessing or using Career Findr, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you do
            not agree with any of these terms, you are prohibited from using
            this platform.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Use License
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Permission is granted to temporarily access Career Findr for
            personal, non-commercial transitory viewing only. This is the grant
            of a license, not a transfer of title, and under this license you
            may not:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Modify or copy the materials
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Use the materials for any commercial purpose or public display
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Attempt to decompile or reverse engineer any software
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Remove any copyright or proprietary notations
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Transfer the materials to another person or "mirror" on any server
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            User Accounts
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Account Registration
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            To use certain features of Career Findr, you must register for an
            account. You agree to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Provide accurate, current, and complete information
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Maintain and update your information to keep it accurate
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Maintain the security of your password and account
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Accept responsibility for all activities under your account
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Notify us immediately of any unauthorized use
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Account Termination
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            We reserve the right to terminate or suspend your account at any
            time, without prior notice, for conduct that we believe violates
            these Terms or is harmful to other users, us, or third parties, or
            for any other reason.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            User Content
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            By posting content on Career Findr, you grant us a non-exclusive,
            worldwide, royalty-free license to use, reproduce, modify, and
            display your content in connection with operating the platform. You
            represent and warrant that:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              You own or have the necessary rights to the content
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Your content does not infringe on any third-party rights
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Your content complies with these Terms and applicable laws
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Prohibited Activities
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            You may not access or use the platform for any purpose other than
            that for which we make it available. Prohibited activities include:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Violating any applicable laws or regulations
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Impersonating another person or entity
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Uploading viruses, malware, or other malicious code
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Engaging in unauthorized framing or linking
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Harassing, intimidating, or threatening other users
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Interfering with the security or integrity of the platform
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Using automated systems to access the platform
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Applications and Job Postings
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            For Students
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            When applying to courses or jobs through Career Findr, you agree to
            provide accurate and truthful information. Misrepresentation of
            qualifications may result in account termination.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            For Institutions and Companies
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            When posting courses or jobs, you agree to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Provide accurate and complete information
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Comply with all applicable employment and education laws
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Not discriminate based on protected characteristics
            </Typography>
            <Typography
              component="li"
              variant="body1"
              paragraph
              color="text.secondary"
            >
              Honor commitments made in your postings
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            The platform and its original content, features, and functionality
            are owned by Career Findr and are protected by international
            copyright, trademark, patent, trade secret, and other intellectual
            property laws.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Third-Party Links
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Career Findr may contain links to third-party websites or services
            that are not owned or controlled by us. We have no control over and
            assume no responsibility for the content, privacy policies, or
            practices of any third-party websites or services.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Disclaimer of Warranties
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Career Findr is provided on an "AS IS" and "AS AVAILABLE" basis. We
            make no warranties, expressed or implied, and hereby disclaim all
            warranties including, without limitation, implied warranties of
            merchantability, fitness for a particular purpose, or
            non-infringement.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            In no event shall Career Findr, its directors, employees, or agents
            be liable for any indirect, incidental, special, consequential, or
            punitive damages, including loss of profits, data, or other
            intangible losses.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Indemnification
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            You agree to defend, indemnify, and hold harmless Career Findr from
            any claims, damages, obligations, losses, liabilities, costs, or
            debt arising from your use of the platform or violation of these
            Terms.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Governing Law
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            These Terms shall be governed by and construed in accordance with
            the laws of Lesotho, without regard to its conflict of law
            provisions.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            We reserve the right to modify or replace these Terms at any time.
            If a revision is material, we will provide at least 30 days' notice
            prior to any new terms taking effect.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            If you have questions about these Terms of Service, please contact
            us at:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1" paragraph color="text.secondary">
              <strong>Email:</strong> legal@careerfindr.com
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
