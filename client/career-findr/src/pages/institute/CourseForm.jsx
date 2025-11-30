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
  Fade,
  Zoom,
  Grow,
} from "@mui/material";
import {
  ArrowBack,
  SaveOutlined,
  CloseOutlined,
  SchoolOutlined,
  CodeOutlined,
  CategoryOutlined,
  SignalCellularAltOutlined,
  AccessTimeOutlined,
  DescriptionOutlined,
  ChecklistOutlined,
  AttachMoneyOutlined,
  EventSeatOutlined,
  CalendarTodayOutlined,
  EventOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";

// Animation timing constants
const FADE_DURATION = 800;
const ZOOM_DURATION = 500;
const STAGGER_DELAY = 100;
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
    currency: yup
      .string()
      .oneOf(["LSL", "ZAR", "USD"], "Invalid currency")
      .required("Currency is required"),
    location: yup.string().required("Institution location is required"),
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

const currencies = [
  { value: "LSL", label: "Lesotho Loti (LSL)" },
  { value: "ZAR", label: "South African Rand (ZAR)" },
  { value: "USD", label: "US Dollar (USD)" },
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
    watch,
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
      currency: "LSL",
      location: "",
    },
  });

  const selectedCurrency = watch("currency", "LSL");

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
        currency: courseData.currency || "LSL",
        location: courseData.location || user?.location || "",
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
        : createCourse(coursePayload, user.uid, user.displayName || user.institutionName || user.name);
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
    <Fade in timeout={FADE_DURATION}>
      <Box className="min-vh-100" bgcolor="background.default">
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Header with Gradient */}
          <Zoom in timeout={ZOOM_DURATION}>
            <Card
              sx={{
                mb: 4,
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                color: "white",
                borderRadius: 3,
                boxShadow: "0 10px 40px rgba(37, 99, 235, 0.3)",
              }}
            >
              <CardContent sx={{ py: 3, px: 4 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton
                    onClick={() => navigate("/institute/courses")}
                    sx={{
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {isEditMode ? "Edit Course" : "Create New Course"}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {isEditMode
                        ? "Update course information"
                        : "Add a new course to your institution"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Zoom>

          {submitError && (
            <Grow in timeout={300}>
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setSubmitError("")}
              >
                {submitError}
              </Alert>
            </Grow>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Information Section */}
            <Grow in timeout={600} style={{ transformOrigin: "0 0 0" }}>
              <Card
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                      }}
                    >
                      <SchoolOutlined />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      Basic Information
                    </Typography>
                  </Box>
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
                            InputProps={{
                              startAdornment: (
                                <SchoolOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                },
                                "&.Mui-focused": {
                                  boxShadow:
                                    "0 4px 12px rgba(37, 99, 235, 0.15)",
                                },
                              },
                            }}
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
                            InputProps={{
                              startAdornment: (
                                <CodeOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                },
                              },
                            }}
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
                            InputProps={{
                              startAdornment: (
                                <CategoryOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
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
                            InputProps={{
                              startAdornment: (
                                <SignalCellularAltOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
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
                            InputProps={{
                              startAdornment: (
                                <AccessTimeOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
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
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Campus Location"
                            fullWidth
                            error={!!errors.location}
                            helperText={errors.location?.message}
                            placeholder="City, country or campus name"
                            InputProps={{
                              startAdornment: (
                                <LocationOnOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                },
                                "&.Mui-focused": {
                                  boxShadow:
                                    "0 4px 12px rgba(37, 99, 235, 0.15)",
                                },
                              },
                            }}
                          />
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
                            InputProps={{
                              startAdornment: (
                                <DescriptionOutlined
                                  sx={{
                                    mr: 1,
                                    color: "text.secondary",
                                    alignSelf: "flex-start",
                                    mt: 1.5,
                                  }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grow>

            {/* Requirements & Qualifications Section */}
            <Grow in timeout={700} style={{ transformOrigin: "0 0 0" }}>
              <Card
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box
                      sx={{
                        bgcolor: "secondary.main",
                        color: "white",
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                      }}
                    >
                      <ChecklistOutlined />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      Requirements & Qualifications
                    </Typography>
                  </Box>
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
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="col-12">
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        fontWeight={600}
                      >
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
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                        <Button
                          variant="outlined"
                          onClick={handleAddQualification}
                          sx={{
                            borderRadius: 2,
                            px: 3,
                            transition: "all 0.3s ease",
                            "&:hover": { transform: "translateY(-2px)" },
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {qualifications.map((qual, index) => (
                          <Zoom in key={index} timeout={300}>
                            <Chip
                              label={qual}
                              onDelete={() => handleRemoveQualification(index)}
                              color="primary"
                              variant="outlined"
                              sx={{
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
                                },
                              }}
                            />
                          </Zoom>
                        ))}
                      </Box>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grow>

            {/* Fees & Enrollment Section */}
            <Grow in timeout={800} style={{ transformOrigin: "0 0 0" }}>
              <Card
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                      }}
                    >
                      <AttachMoneyOutlined />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      Fees & Enrollment
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Currency"
                            fullWidth
                            error={!!errors.currency}
                            helperText={errors.currency?.message}
                            InputProps={{
                              startAdornment: (
                                <AttachMoneyOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          >
                            {currencies.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <Controller
                        name="fees"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Annual Fees"
                            fullWidth
                            type="number"
                            error={!!errors.fees}
                            helperText={errors.fees?.message}
                            InputProps={{
                              startAdornment: (
                                <Typography sx={{ mr: 1, fontWeight: 600 }}>
                                  {selectedCurrency}
                                </Typography>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
                            InputProps={{
                              startAdornment: (
                                <EventSeatOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
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
                            InputProps={{
                              startAdornment: (
                                <CalendarTodayOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
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
                            InputProps={{
                              startAdornment: (
                                <EventOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grow>

            {/* Action Buttons */}
            <Grow in timeout={900} style={{ transformOrigin: "0 0 0" }}>
              <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<CloseOutlined />}
                  onClick={() => navigate("/institute/courses")}
                  disabled={saveMutation.isPending}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveOutlined />}
                  disabled={saveMutation.isPending}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.2,
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
                    },
                  }}
                >
                  {saveMutation.isPending
                    ? "Saving..."
                    : isEditMode
                    ? "Update Course"
                    : "Create Course"}
                </Button>
              </Box>
            </Grow>
          </form>
        </Container>
      </Box>
    </Fade>
  );
}
