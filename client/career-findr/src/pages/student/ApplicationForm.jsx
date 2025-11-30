import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Fade,
  Zoom,
  Grow,
} from "@mui/material";
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  SendRounded,
  SchoolRounded,
  PersonRounded,
  DescriptionRounded,
  CheckCircleRounded,
  AttachFileRounded,
  MenuBookRounded,
  EditNoteRounded,
  FolderRounded,
  LocationOnRounded,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import FileUploader from "../../components/common/FileUploader";
import { useAuth } from "../../contexts/AuthContext";
import { getCourse } from "../../services/courseService";
import { submitCourseApplication } from "../../services/applicationService";

// Validation schemas for each step
const personalInfoSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  dateOfBirth: yup.date().required("Date of birth is required"),
  nationality: yup.string().required("Nationality is required"),
  idNumber: yup.string().required("ID number is required"),
});

const educationSchema = yup.object({
  highSchool: yup.string().required("High school name is required"),
  graduationYear: yup
    .number()
    .required("Graduation year is required")
    .min(1950)
    .max(2030),
  previousQualification: yup
    .string()
    .required("Previous qualification is required"),
  grades: yup.string().required("Grades/Results are required"),
});

const statementSchema = yup.object({
  motivation: yup
    .string()
    .required("Personal statement is required")
    .min(100, "Minimum 100 characters required"),
  careerGoals: yup
    .string()
    .required("Career goals are required")
    .min(50, "Minimum 50 characters"),
});

const steps = [
  "Personal Information",
  "Educational Background",
  "Personal Statement",
  "Documents",
];

const formatCourseFeesLabel = (fees, currency = "LSL") => {
  if (fees === undefined || fees === null || fees === "") {
    return "Fees unavailable";
  }
  const numericValue = Number(fees);
  const formattedAmount = Number.isFinite(numericValue)
    ? numericValue.toLocaleString()
    : fees;
  return `${currency} ${formattedAmount} per year`;
};

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [documents, setDocuments] = useState({
    transcript: null,
    idCopy: null,
    certificate: null,
    other: null,
  });

  // Fetch course details
  const { data: course, isLoading: loadingCourse } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
  });

  // Get validation schema for current step
  const getValidationSchema = () => {
    switch (activeStep) {
      case 0:
        return personalInfoSchema;
      case 1:
        return educationSchema;
      case 2:
        return statementSchema;
      default:
        return yup.object({});
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(getValidationSchema()),
    mode: "onChange",
  });

  // Submit application mutation
  const submitMutation = useMutation({
    mutationFn: (data) => {
      const applicationData = {
        courseId,
        institutionId: course.institutionId,
        courseName: course.name,
        courseField: course.field,
        institutionName: course.institutionName || course.instituteName || "Institution",
        ...data,
        documents,
      };
      return submitCourseApplication(applicationData, user.uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["studentApplications"]);
      navigate("/applications");
    },
    onError: (error) => {
      setSubmitError(error.message || "Failed to submit application");
    },
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = (data) => {
    if (activeStep === steps.length - 1) {
      // Check if required documents are uploaded
      if (!documents.transcript || !documents.idCopy) {
        setSubmitError(
          "Please upload required documents (Transcript and ID Copy)"
        );
        return;
      }
      setSubmitError("");
      submitMutation.mutate(data);
    }
  };

  const handleDocumentUpload = (type) => (uploadedFile) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: uploadedFile,
    }));
  };

  if (loadingCourse) {
    return <LoadingScreen message="Loading course details..." />;
  }

  if (!course) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header with Gradient */}
        <Fade in timeout={600}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Button
              startIcon={<ArrowBackRounded />}
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { transform: "translateX(-4px)" },
              }}
            >
              Back
            </Button>
            <Box flexGrow={1}>
              <Typography variant="h4" fontWeight={700}>
                Course Application
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {course.name} -{" "}
                {course.institutionName ||
                  course.instituteName ||
                  "Institution"}
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Course Info Card */}
        <Zoom in timeout={700}>
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
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
            <CardContent sx={{ position: "relative", zIndex: 1 }}>
              <Box display="flex" alignItems="start" gap={2}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SchoolRounded sx={{ fontSize: 32 }} />
                </Box>
                <Box flexGrow={1}>
                  <Typography variant="h6" fontWeight={700}>
                    {course.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }} paragraph>
                    {course.institutionName ||
                      course.instituteName ||
                      "Institution"}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={course.field}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={course.level}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={course.duration}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 500,
                      }}
                    />
                    {course.location && (
                      <Chip
                        icon={<LocationOnRounded />}
                        label={course.location}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 500,
                          "& .MuiChip-icon": {
                            color: "white",
                          },
                        }}
                      />
                    )}
                    <Chip
                      label={formatCourseFeesLabel(
                        course.fees,
                        course.currency || "LSL"
                      )}
                      size="small"
                      sx={{
                        bgcolor: "white",
                        color: "#F59E0B",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Zoom>

        {/* Stepper */}
        <Fade in timeout={800}>
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stepper
                activeStep={activeStep}
                sx={{
                  mb: 4,
                  "& .MuiStepIcon-root": {
                    fontSize: 28,
                  },
                  "& .MuiStepLabel-label": {
                    fontWeight: 500,
                  },
                  "& .Mui-active .MuiStepIcon-root": {
                    color: "#F59E0B",
                  },
                  "& .Mui-completed .MuiStepIcon-root": {
                    color: "#10B981",
                  },
                }}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      icon={
                        index === 0 ? (
                          <PersonRounded />
                        ) : index === 1 ? (
                          <MenuBookRounded />
                        ) : index === 2 ? (
                          <EditNoteRounded />
                        ) : (
                          <FolderRounded />
                        )
                      }
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {submitError && (
                <Zoom in>
                  <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setSubmitError("")}
                  >
                    {submitError}
                  </Alert>
                </Zoom>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 0: Personal Information */}
                {activeStep === 0 && (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <PersonRounded sx={{ color: "#2563EB" }} />
                      <Typography variant="h6" fontWeight={700}>
                        Personal Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <Controller
                          name="firstName"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="First Name"
                              fullWidth
                              error={!!errors.firstName}
                              helperText={errors.firstName?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <Controller
                          name="lastName"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Last Name"
                              fullWidth
                              error={!!errors.lastName}
                              helperText={errors.lastName?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <Controller
                          name="email"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Email Address"
                              fullWidth
                              type="email"
                              error={!!errors.email}
                              helperText={errors.email?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <Controller
                          name="phone"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Phone Number"
                              fullWidth
                              error={!!errors.phone}
                              helperText={errors.phone?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <Controller
                          name="dateOfBirth"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Date of Birth"
                              fullWidth
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.dateOfBirth}
                              helperText={errors.dateOfBirth?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <Controller
                          name="nationality"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Nationality"
                              fullWidth
                              error={!!errors.nationality}
                              helperText={errors.nationality?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12">
                        <Controller
                          name="idNumber"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="ID Number"
                              fullWidth
                              error={!!errors.idNumber}
                              helperText={errors.idNumber?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </Box>
                )}

                {/* Step 1: Educational Background */}
                {activeStep === 1 && (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <MenuBookRounded sx={{ color: "#F59E0B" }} />
                      <Typography variant="h6" fontWeight={700}>
                        Educational Background
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <div className="row g-3">
                      <div className="col-12">
                        <Controller
                          name="highSchool"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="High School Name"
                              fullWidth
                              error={!!errors.highSchool}
                              helperText={errors.highSchool?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <Controller
                          name="graduationYear"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Graduation Year"
                              fullWidth
                              type="number"
                              error={!!errors.graduationYear}
                              helperText={errors.graduationYear?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <Controller
                          name="previousQualification"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Previous Qualification"
                              fullWidth
                              placeholder="e.g., LGCSE, IGCSE, A-Level"
                              error={!!errors.previousQualification}
                              helperText={errors.previousQualification?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12">
                        <Controller
                          name="grades"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Grades/Results"
                              fullWidth
                              multiline
                              rows={3}
                              placeholder="List your grades and subjects"
                              error={!!errors.grades}
                              helperText={errors.grades?.message}
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </Box>
                )}

                {/* Step 2: Personal Statement */}
                {activeStep === 2 && (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <EditNoteRounded sx={{ color: "#8B5CF6" }} />
                      <Typography variant="h6" fontWeight={700}>
                        Personal Statement
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <div className="row g-3">
                      <div className="col-12">
                        <Controller
                          name="motivation"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Why do you want to study this course?"
                              fullWidth
                              multiline
                              rows={5}
                              placeholder="Explain your motivation, interests, and what you hope to achieve..."
                              error={!!errors.motivation}
                              helperText={
                                errors.motivation?.message ||
                                `${
                                  field.value?.length || 0
                                }/100 characters minimum`
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12">
                        <Controller
                          name="careerGoals"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Career Goals"
                              fullWidth
                              multiline
                              rows={4}
                              placeholder="Describe your career aspirations and how this course will help you achieve them..."
                              error={!!errors.careerGoals}
                              helperText={
                                errors.careerGoals?.message ||
                                `${
                                  field.value?.length || 0
                                }/50 characters minimum`
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </Box>
                )}

                {/* Step 3: Documents */}
                {activeStep === 3 && (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <FolderRounded sx={{ color: "#10B981" }} />
                      <Typography variant="h6" fontWeight={700}>
                        Required Documents
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                      Please upload clear, legible copies of your documents.
                      Accepted formats: PDF, JPG, PNG (Max 5MB each)
                    </Alert>

                    <div className="row g-3">
                      <div className="col-12">
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            },
                          }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={2}
                            >
                              <AttachFileRounded color="primary" />
                              <Typography variant="subtitle1" fontWeight={600}>
                                Academic Transcript *
                              </Typography>
                              <Chip
                                label="Required"
                                size="small"
                                color="error"
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                            {documents.transcript ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <CheckCircleRounded color="success" />
                                <Typography variant="body2" fontWeight={500}>
                                  {documents.transcript.name}
                                </Typography>
                              </Box>
                            ) : (
                              <FileUploader
                                onUploadComplete={handleDocumentUpload(
                                  "transcript"
                                )}
                                acceptedFormats=".pdf,.jpg,.jpeg,.png"
                                label="Upload Transcript"
                                helperText="Upload your latest academic transcript"
                              />
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      <div className="col-12">
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            },
                          }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={2}
                            >
                              <AttachFileRounded color="primary" />
                              <Typography variant="subtitle1" fontWeight={600}>
                                ID Copy *
                              </Typography>
                              <Chip
                                label="Required"
                                size="small"
                                color="error"
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                            {documents.idCopy ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <CheckCircleRounded color="success" />
                                <Typography variant="body2" fontWeight={500}>
                                  {documents.idCopy.name}
                                </Typography>
                              </Box>
                            ) : (
                              <FileUploader
                                onUploadComplete={handleDocumentUpload(
                                  "idCopy"
                                )}
                                acceptedFormats=".pdf,.jpg,.jpeg,.png"
                                label="Upload ID Copy"
                                helperText="Upload a copy of your national ID or passport"
                              />
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      <div className="col-12">
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            },
                          }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={2}
                            >
                              <AttachFileRounded color="action" />
                              <Typography variant="subtitle1" fontWeight={600}>
                                Certificates (Optional)
                              </Typography>
                            </Box>
                            {documents.certificate ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <CheckCircleRounded color="success" />
                                <Typography variant="body2" fontWeight={500}>
                                  {documents.certificate.name}
                                </Typography>
                              </Box>
                            ) : (
                              <FileUploader
                                onUploadComplete={handleDocumentUpload(
                                  "certificate"
                                )}
                                acceptedFormats=".pdf,.jpg,.jpeg,.png"
                                label="Upload Certificates"
                                helperText="Upload any relevant certificates or awards"
                              />
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box display="flex" justifyContent="space-between" mt={4}>
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0 || submitMutation.isPending}
                    startIcon={<ArrowBackRounded />}
                    sx={{
                      borderRadius: 2,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": { transform: "translateX(-4px)" },
                    }}
                  >
                    Back
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitMutation.isPending}
                      startIcon={<SendRounded />}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)",
                        },
                      }}
                    >
                      {submitMutation.isPending
                        ? "Submitting..."
                        : "Submit Application"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      endIcon={<ArrowForwardRounded />}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "translateX(4px)" },
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>
        </Fade>

        {/* Progress Indicator */}
        {submitMutation.isPending && (
          <Zoom in>
            <Card
              sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            >
              <CardContent>
                <Typography variant="body2" gutterBottom fontWeight={500}>
                  Submitting your application...
                </Typography>
                <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
              </CardContent>
            </Card>
          </Zoom>
        )}
      </Container>
    </Box>
  );
}
