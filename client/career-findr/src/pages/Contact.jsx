import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack,
  Email,
  Phone,
  LocationOn,
  Send,
  CheckCircle,
} from "@mui/icons-material";

const contactInfo = [
  {
    icon: Email,
    title: "Email",
    value: "support@careerfindr.com",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+266 123 4567",
    description: "Mon-Fri from 8am to 5pm",
  },
  {
    icon: LocationOn,
    title: "Location",
    value: "Maseru, Lesotho",
    description: "Visit our office",
  },
];

export default function Contact() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Contact form data:", data);
      setSubmitted(true);
      reset();
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

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
            Contact Us
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              maxWidth: 600,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </Typography>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} mb={6}>
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Grid item xs={12} md={4} key={index}>
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
                  <CardContent>
                    <Box
                      sx={{
                        display: "inline-flex",
                        p: 2,
                        borderRadius: "50%",
                        bgcolor: "primary.light",
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 32, color: "primary.main" }} />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {info.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary"
                      fontWeight={600}
                      gutterBottom
                    >
                      {info.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {info.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Contact Form */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Send us a Message
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Fill out the form below and we'll get back to you within 24 hours.
            </Typography>
            <Paper sx={{ p: 4, mt: 3 }}>
              {submitted && (
                <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3 }}>
                  Thank you for contacting us! We'll get back to you soon.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  margin="normal"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <TextField
                  label="Phone Number (Optional)"
                  fullWidth
                  margin="normal"
                  {...register("phone")}
                />

                <TextField
                  label="Subject"
                  fullWidth
                  margin="normal"
                  {...register("subject", { required: "Subject is required" })}
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                />

                <TextField
                  label="Message"
                  fullWidth
                  multiline
                  rows={6}
                  margin="normal"
                  {...register("message", { required: "Message is required" })}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={<Send />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Quick answers to common questions
            </Typography>

            <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                What is Career Findr?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Career Findr is a comprehensive platform that connects students
                with educational institutions and career opportunities. We
                streamline the application process for courses and jobs.
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                How do I create an account?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on "Sign Up" at the top of the page, choose your role
                (Student, Institution, or Company), and fill out the
                registration form. It's completely free for students!
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Is Career Findr free to use?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes! Career Findr is completely free for students. Educational
                institutions and companies have access to basic features for
                free, with premium options available.
              </Typography>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                How long does it take to get a response?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We aim to respond to all inquiries within 24 hours during
                business days. For urgent matters, please call us directly.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
