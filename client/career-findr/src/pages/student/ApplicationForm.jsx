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
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Send,
  School,
  Person,
  Description,
  CheckCircle,
  AttachFile,
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
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <Box flexGrow={1}>
            <Typography variant="h4" fontWeight={700}>
              Course Application
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course.name} - {course.instituteName}
            </Typography>
          </Box>
        </Box>

        {/* Course Info Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="start" gap={2}>
              <School color="primary" sx={{ fontSize: 40 }} />
              <Box flexGrow={1}>
                <Typography variant="h6" fontWeight={600}>
                  {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.instituteName}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip label={course.field} size="small" />
                  <Chip label={course.level} size="small" />
                  <Chip label={course.duration} size="small" />
                  <Chip
                    label={`M${course.fees} per year`}
                    size="small"
                    color="primary"
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stepper */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {submitError && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setSubmitError("")}
              >
                {submitError}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 0: Personal Information */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Personal Information
                  </Typography>
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
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Educational Background
                  </Typography>
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
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Personal Statement
                  </Typography>
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
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Required Documents
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Alert severity="info" sx={{ mb: 3 }}>
                    Please upload clear, legible copies of your documents.
                    Accepted formats: PDF, JPG, PNG (Max 5MB each)
                  </Alert>

                  <div className="row g-3">
                    <div className="col-12">
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={2}
                          >
                            <AttachFile />
                            <Typography variant="subtitle1" fontWeight={600}>
                              Academic Transcript *
                            </Typography>
                            <Chip label="Required" size="small" color="error" />
                          </Box>
                          {documents.transcript ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <CheckCircle color="success" />
                              <Typography variant="body2">
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
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={2}
                          >
                            <AttachFile />
                            <Typography variant="subtitle1" fontWeight={600}>
                              ID Copy *
                            </Typography>
                            <Chip label="Required" size="small" color="error" />
                          </Box>
                          {documents.idCopy ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <CheckCircle color="success" />
                              <Typography variant="body2">
                                {documents.idCopy.name}
                              </Typography>
                            </Box>
                          ) : (
                            <FileUploader
                              onUploadComplete={handleDocumentUpload("idCopy")}
                              acceptedFormats=".pdf,.jpg,.jpeg,.png"
                              label="Upload ID Copy"
                              helperText="Upload a copy of your national ID or passport"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="col-12">
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={2}
                          >
                            <AttachFile />
                            <Typography variant="subtitle1" fontWeight={600}>
                              Certificates (Optional)
                            </Typography>
                          </Box>
                          {documents.certificate ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <CheckCircle color="success" />
                              <Typography variant="body2">
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
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitMutation.isPending}
                    startIcon={<Send />}
                  >
                    {submitMutation.isPending
                      ? "Submitting..."
                      : "Submit Application"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    endIcon={<ArrowForward />}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        {submitMutation.isPending && (
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Submitting your application...
              </Typography>
              <LinearProgress />
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
