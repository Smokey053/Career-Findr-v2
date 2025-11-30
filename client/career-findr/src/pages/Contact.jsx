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
  alpha,
  useTheme,
  Fade,
  Zoom,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ArrowBackIosNew,
  MailOutline,
  PhoneOutlined,
  LocationOnOutlined,
  SendRounded,
  CheckCircleOutline,
  ExpandMore,
  PersonOutline,
  SubjectOutlined,
  MessageOutlined,
  HelpOutlineRounded,
} from "@mui/icons-material";

const contactInfo = [
  {
    icon: MailOutline,
    title: "Email",
    value: "support@careerfindr.com",
    description: "Send us an email anytime",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
  },
  {
    icon: PhoneOutlined,
    title: "Phone",
    value: "+266 59462735",
    description: "Mon-Fri from 8am to 5pm",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
  },
  {
    icon: LocationOnOutlined,
    title: "Location",
    value: "Maseru, Lesotho",
    description: "Visit our office",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  },
];

const faqs = [
  {
    question: "What is Career Findr?",
    answer:
      "Career Findr is a comprehensive platform that connects students with educational institutions and career opportunities. We streamline the application process for courses and jobs.",
  },
  {
    question: "How do I create an account?",
    answer:
      'Click on "Sign Up" at the top of the page, choose your role (Student, Institution, or Company), and fill out the registration form. It\'s completely free for students!',
  },
  {
    question: "Is Career Findr free to use?",
    answer:
      "Yes! Career Findr is completely free for students. Educational institutions and companies have access to basic features for free, with premium options available.",
  },
  {
    question: "How long does it take to get a response?",
    answer:
      "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.",
  },
];

export default function Contact() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

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
      setSubmitted(true);
      reset();
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 70% 30%, ${alpha(
              "#fff",
              0.1
            )} 0%, transparent 50%)`,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Fade in timeout={600}>
            <Button
              startIcon={<ArrowBackIosNew sx={{ fontSize: 16 }} />}
              onClick={() => navigate("/")}
              sx={{
                color: "white",
                mb: 4,
                fontWeight: 600,
                borderRadius: "12px",
                px: 2,
                "&:hover": {
                  bgcolor: alpha("#fff", 0.1),
                },
              }}
            >
              Back to Home
            </Button>
          </Fade>
          <Fade in timeout={800}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Contact Us
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: 600,
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </Typography>
          </Fade>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Grid container spacing={3} mb={8}>
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Grid item xs={12} md={4} key={index}>
                <Zoom in timeout={600 + index * 150}>
                  <Card
                    sx={{
                      textAlign: "center",
                      p: 4,
                      height: "100%",
                      borderRadius: "20px",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.1),
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: `0 20px 40px -12px ${alpha(
                          info.color,
                          0.3
                        )}`,
                        borderColor: alpha(info.color, 0.3),
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 3,
                          background: info.gradient,
                          boxShadow: `0 10px 25px -8px ${alpha(
                            info.color,
                            0.5
                          )}`,
                        }}
                      >
                        <Icon sx={{ fontSize: 32, color: "white" }} />
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        {info.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        gutterBottom
                        sx={{
                          background: info.gradient,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {info.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {info.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            );
          })}
        </Grid>

        {/* Contact Form */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Fade in timeout={600}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    letterSpacing: 2,
                    mb: 1,
                    display: "block",
                  }}
                >
                  GET IN TOUCH
                </Typography>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  Send us a Message
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </Typography>
              </Box>
            </Fade>
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                mt: 3,
                borderRadius: "20px",
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
              }}
            >
              {submitted && (
                <Fade in timeout={300}>
                  <Alert
                    severity="success"
                    icon={<CheckCircleOutline />}
                    sx={{ mb: 3, borderRadius: "14px" }}
                  >
                    Thank you for contacting us! We'll get back to you soon.
                  </Alert>
                </Fade>
              )}

              {error && (
                <Fade in timeout={300}>
                  <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: "14px" }}
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Full Name"
                  fullWidth
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{
                    mb: 2.5,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      backgroundColor: alpha(theme.palette.grey[100], 0.5),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.grey[100], 0.8),
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    mb: 2.5,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      backgroundColor: alpha(theme.palette.grey[100], 0.5),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.grey[100], 0.8),
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutline sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Phone Number (Optional)"
                  fullWidth
                  {...register("phone")}
                  sx={{
                    mb: 2.5,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      backgroundColor: alpha(theme.palette.grey[100], 0.5),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.grey[100], 0.8),
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlined sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Subject"
                  fullWidth
                  {...register("subject", { required: "Subject is required" })}
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  sx={{
                    mb: 2.5,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      backgroundColor: alpha(theme.palette.grey[100], 0.5),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.grey[100], 0.8),
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SubjectOutlined sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Message"
                  fullWidth
                  multiline
                  rows={5}
                  {...register("message", { required: "Message is required" })}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      backgroundColor: alpha(theme.palette.grey[100], 0.5),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.grey[100], 0.8),
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  endIcon={<SendRounded />}
                  sx={{
                    py: 1.75,
                    borderRadius: "14px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 8px 25px -8px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: `0 12px 30px -8px ${alpha(
                        theme.palette.primary.main,
                        0.5
                      )}`,
                    },
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in timeout={800}>
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <HelpOutlineRounded sx={{ color: "primary.main" }} />
                  <Typography
                    variant="overline"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      letterSpacing: 2,
                    }}
                  >
                    FAQ
                  </Typography>
                </Box>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  Frequently Asked Questions
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Quick answers to common questions
                </Typography>
              </Box>
            </Fade>

            <Box sx={{ mt: 3 }}>
              {faqs.map((faq, index) => (
                <Fade in timeout={600 + index * 100} key={index}>
                  <Accordion
                    expanded={expanded === `panel${index}`}
                    onChange={handleAccordionChange(`panel${index}`)}
                    sx={{
                      mb: 2,
                      borderRadius: "16px !important",
                      border: "1px solid",
                      borderColor:
                        expanded === `panel${index}`
                          ? alpha(theme.palette.primary.main, 0.3)
                          : alpha(theme.palette.divider, 0.1),
                      boxShadow:
                        expanded === `panel${index}`
                          ? `0 10px 30px -10px ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`
                          : "none",
                      transition: "all 0.3s ease",
                      "&::before": { display: "none" },
                      "&:hover": {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMore
                          sx={{
                            color:
                              expanded === `panel${index}`
                                ? "primary.main"
                                : "text.secondary",
                            transition: "color 0.3s ease",
                          }}
                        />
                      }
                      sx={{
                        px: 3,
                        py: 1,
                        "& .MuiAccordionSummary-content": {
                          my: 2,
                        },
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        lineHeight={1.7}
                      >
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Fade>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
