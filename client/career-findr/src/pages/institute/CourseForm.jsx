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
  Grid,
  MenuItem,
  Alert,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import { ArrowBack, Save, Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instituteAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import {
  createCourse,
  updateCourse,
  getCourse,
} from "../../services/courseService";

// Validation schema
const courseSchema = yup
  .object({
    name: yup
      .string()
      .required("Course name is required")
      .min(3, "Minimum 3 characters"),
    code: yup.string().required("Course code is required"),
    field: yup.string().required("Field of study is required"),
    level: yup.string().required("Level is required"),
    duration: yup.string().required("Duration is required"),
    description: yup
      .string()
      .required("Description is required")
      .min(50, "Minimum 50 characters"),
    requirements: yup.string().required("Requirements are required"),
    fees: yup
      .number()
      .required("Fees are required")
      .positive("Must be a positive number"),
    seats: yup
      .number()
      .required("Available seats are required")
      .positive()
      .integer(),
    startDate: yup.date().required("Start date is required"),
    applicationDeadline: yup
      .date()
      .required("Application deadline is required"),
  })
  .required();

const fields = [
  "Computer Science",
  "Engineering",
  "Business Administration",
  "Medicine",
  "Education",
  "Arts & Humanities",
  "Law",
  "Natural Sciences",
  "Social Sciences",
  "Architecture",
];

const levels = [
  "Certificate",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
  "Masters",
  "PhD",
];

const durations = [
  "6 months",
  "1 year",
  "2 years",
  "3 years",
  "4 years",
  "5 years",
  "6 years",
];

export default function CourseForm() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditMode = Boolean(courseId);
  const [submitError, setSubmitError] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [newQualification, setNewQualification] = useState("");

  // Fetch course data if editing
  const { data: courseData, isLoading: loadingCourse } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: isEditMode,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      name: "",
      code: "",
      field: "",
      level: "",
      duration: "",
      description: "",
      requirements: "",
      fees: "",
      seats: "",
      startDate: "",
      applicationDeadline: "",
    },
  });

  // Set form values when course data is loaded
  React.useEffect(() => {
    if (courseData) {
      reset({
        name: courseData.name || "",
        code: courseData.code || "",
        field: courseData.field || "",
        level: courseData.level || "",
        duration: courseData.duration || "",
        description: courseData.description || "",
        requirements: courseData.requirements || "",
        fees: courseData.fees || "",
        seats: courseData.seats || "",
        startDate: courseData.startDate || "",
        applicationDeadline: courseData.applicationDeadline || "",
      });
      if (courseData.qualifications) {
        setQualifications(courseData.qualifications);
      }
    }
  }, [courseData, reset]);

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (data) => {
      const coursePayload = {
        ...data,
        qualifications,
        status: "active",
      };
      return isEditMode
        ? updateCourse(courseId, coursePayload)
        : createCourse(coursePayload, user.uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["instituteCourses"]);
      navigate("/institute/courses");
    },
    onError: (error) => {
      setSubmitError(error.message || "Failed to save course");
    },
  });

  const onSubmit = (data) => {
    setSubmitError("");
    saveMutation.mutate(data);
  };

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setQualifications([...qualifications, newQualification.trim()]);
      setNewQualification("");
    }
  };

  const handleRemoveQualification = (index) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  if (loadingCourse) {
    return <LoadingScreen message="Loading course..." />;
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <IconButton onClick={() => navigate("/institute/courses")}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {isEditMode ? "Edit Course" : "Create New Course"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditMode
                ? "Update course information"
                : "Add a new course to your institution"}
            </Typography>
          </Box>
        </Box>

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
          <Card>
            <CardContent>
              {/* Basic Information */}
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <div className="row g-3 mb-4">
                <div className="col-12 col-md-8">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Course Name"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        placeholder="e.g., Bachelor of Computer Science"
                      />
                    )}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Course Code"
                        fullWidth
                        error={!!errors.code}
                        helperText={errors.code?.message}
                        placeholder="e.g., CS101"
                      />
                    )}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <Controller
                    name="field"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Field of Study"
                        fullWidth
                        error={!!errors.field}
                        helperText={errors.field?.message}
                      >
                        {fields.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Level"
                        fullWidth
                        error={!!errors.level}
                        helperText={errors.level?.message}
                      >
                        {levels.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Duration"
                        fullWidth
                        error={!!errors.duration}
                        helperText={errors.duration?.message}
                      >
                        {durations.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </div>

                <div className="col-12">
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Course Description"
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        placeholder="Describe the course objectives, curriculum highlights, and career outcomes..."
                      />
                    )}
                  />
                </div>
              </div>

              {/* Requirements & Qualifications */}
              <Typography variant="h6" gutterBottom fontWeight={600} mt={3}>
                Requirements & Qualifications
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <div className="row g-3 mb-4">
                <div className="col-12">
                  <Controller
                    name="requirements"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Admission Requirements"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.requirements}
                        helperText={errors.requirements?.message}
                        placeholder="List all admission requirements, prerequisites, and documents needed..."
                      />
                    )}
                  />
                </div>

                <div className="col-12">
                  <Typography variant="subtitle2" gutterBottom>
                    Required Qualifications
                  </Typography>
                  <Box display="flex" gap={1} mb={2}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g., High School Diploma, IGCSE, A-Level"
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddQualification();
                        }
                      }}
                    />
                    <Button variant="outlined" onClick={handleAddQualification}>
                      Add
                    </Button>
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {qualifications.map((qual, index) => (
                      <Chip
                        key={index}
                        label={qual}
                        onDelete={() => handleRemoveQualification(index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </div>
              </div>

              {/* Fees & Enrollment */}
              <Typography variant="h6" gutterBottom fontWeight={600} mt={3}>
                Fees & Enrollment
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <Controller
                    name="fees"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Annual Fees (LSL)"
                        fullWidth
                        type="number"
                        error={!!errors.fees}
                        helperText={errors.fees?.message}
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1 }}>M</Typography>
                          ),
                        }}
                      />
                    )}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <Controller
                    name="seats"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Available Seats"
                        fullWidth
                        type="number"
                        error={!!errors.seats}
                        helperText={errors.seats?.message}
                      />
                    )}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Start Date"
                        fullWidth
                        type="date"
                        error={!!errors.startDate}
                        helperText={errors.startDate?.message}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <Controller
                    name="applicationDeadline"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Application Deadline"
                        fullWidth
                        type="date"
                        error={!!errors.applicationDeadline}
                        helperText={errors.applicationDeadline?.message}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<Close />}
              onClick={() => navigate("/institute/courses")}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending
                ? "Saving..."
                : isEditMode
                ? "Update Course"
                : "Create Course"}
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
}
