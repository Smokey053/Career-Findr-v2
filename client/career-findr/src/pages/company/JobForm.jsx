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
  WorkOutlineOutlined,
  BusinessOutlined,
  LocationOnOutlined,
  AccessTimeOutlined,
  TrendingUpOutlined,
  AttachMoneyOutlined,
  CalendarTodayOutlined,
  DescriptionOutlined,
  AssignmentOutlined,
  ChecklistOutlined,
  CardGiftcardOutlined,
  PsychologyOutlined,
} from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import { getJob, createJob, updateJob } from "../../services/jobService";

// Animation timing constants
const FADE_DURATION = 800;
const ZOOM_DURATION = 500;
const STAGGER_DELAY = 100;

// Validation schema
const jobSchema = yup
  .object({
    title: yup
      .string()
      .required("Job title is required")
      .min(3, "Minimum 3 characters"),
    department: yup.string().required("Department is required"),
    location: yup.string().required("Location is required"),
    type: yup.string().required("Job type is required"),
    experience: yup.string().required("Experience level is required"),
    salaryMin: yup
      .number()
      .typeError("Minimum salary is required")
      .required("Minimum salary is required")
      .positive("Must be positive"),
    salaryMax: yup
      .number()
      .typeError("Maximum salary must be a number")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? null : value
      )
      .when("salaryMin", (salaryMin, schema) =>
        salaryMin
          ? schema.min(
              salaryMin,
              "Maximum salary must be greater than minimum salary"
            )
          : schema
      ),
    currency: yup
      .string()
      .oneOf(["LSL", "ZAR", "USD"], "Invalid currency")
      .required("Currency is required"),
    description: yup
      .string()
      .required("Job description is required")
      .min(100, "Minimum 100 characters"),
    responsibilities: yup.string().required("Responsibilities are required"),
    requirements: yup.string().required("Requirements are required"),
    benefits: yup.string(),
    deadline: yup.date().required("Application deadline is required"),
  })
  .required();

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const experienceLevels = [
  "Entry Level (0-2 years)",
  "Mid Level (2-5 years)",
  "Senior Level (5-10 years)",
  "Expert Level (10+ years)",
];

const departments = [
  "Engineering",
  "Sales & Marketing",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Service",
  "IT",
  "Administration",
  "Other",
];

const locations = [
  "Maseru",
  "Leribe",
  "Mafeteng",
  "Mohale's Hoek",
  "Quthing",
  "Mokhotlong",
  "Butha-Buthe",
  "Thaba-Tseka",
  "Remote",
];

const currencies = [
  { value: "LSL", label: "Lesotho Loti (LSL)" },
  { value: "ZAR", label: "South African Rand (ZAR)" },
  { value: "USD", label: "US Dollar (USD)" },
];

const buildSalaryLabel = (min, max, currency) => {
  if (!min && !max) return "";
  const format = (value) =>
    Number(value).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  if (min && max) {
    return `${currency} ${format(min)} - ${currency} ${format(max)}`;
  }
  if (min) {
    return `${currency} ${format(min)}+`;
  }
  return `Up to ${currency} ${format(max)}`;
};

export default function JobForm() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditMode = Boolean(jobId);
  const [submitError, setSubmitError] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  // Fetch job data if editing
  const { data: jobData, isLoading: loadingJob } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    enabled: isEditMode,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "",
      experience: "",
      salaryMin: "",
      salaryMax: "",
      currency: "LSL",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      deadline: "",
    },
  });

  const currencyValue = watch("currency", "LSL");

  // Set form values when job data is loaded
  React.useEffect(() => {
    if (jobData) {
      reset({
        title: jobData.title || "",
        department: jobData.department || "",
        location: jobData.location || "",
        type: jobData.type || "",
        experience: jobData.experience || "",
        salaryMin:
          jobData.salaryMin !== undefined && jobData.salaryMin !== null
            ? jobData.salaryMin
            : "",
        salaryMax:
          jobData.salaryMax !== undefined && jobData.salaryMax !== null
            ? jobData.salaryMax
            : "",
        currency: jobData.currency || "LSL",
        description: jobData.description || "",
        responsibilities: jobData.responsibilities || "",
        requirements: jobData.requirements || "",
        benefits: jobData.benefits || "",
        deadline: jobData.deadline || "",
      });
      if (jobData.skills) {
        setSkills(jobData.skills);
      }
    }
  }, [jobData, reset]);

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (data) => {
      const jobPayload = {
        ...data,
        skills,
        status: "active",
      };
      return isEditMode
        ? updateJob(jobId, jobPayload)
        : createJob(jobPayload, user.uid, user.displayName || user.companyName || user.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companyJobs"]);
      navigate("/company/jobs");
    },
    onError: (error) => {
      setSubmitError(error.message || "Failed to save job");
    },
  });

  const onSubmit = (data) => {
    setSubmitError("");
    const normalizedData = {
      ...data,
      salaryMin: Number(data.salaryMin),
      salaryMax:
        data.salaryMax === "" || data.salaryMax === null
          ? null
          : Number(data.salaryMax),
      salary: buildSalaryLabel(data.salaryMin, data.salaryMax, data.currency),
    };
    saveMutation.mutate(normalizedData);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  if (loadingJob) {
    return <LoadingScreen message="Loading job..." />;
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
                    onClick={() => navigate("/company/jobs")}
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
                      {isEditMode ? "Edit Job Posting" : "Post New Job"}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {isEditMode
                        ? "Update job posting details"
                        : "Create a new job opportunity"}
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
            {/* Job Details Section */}
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
                      <WorkOutlineOutlined />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      Job Details
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Job Title"
                            fullWidth
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            placeholder="e.g., Senior Software Engineer"
                            InputProps={{
                              startAdornment: (
                                <WorkOutlineOutlined
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

                    <div className="col-12 col-md-6">
                      <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Department"
                            fullWidth
                            error={!!errors.department}
                            helperText={errors.department?.message}
                            InputProps={{
                              startAdornment: (
                                <BusinessOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          >
                            {departments.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Location"
                            fullWidth
                            error={!!errors.location}
                            helperText={errors.location?.message}
                            InputProps={{
                              startAdornment: (
                                <LocationOnOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          >
                            {locations.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Job Type"
                            fullWidth
                            error={!!errors.type}
                            helperText={errors.type?.message}
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
                            {jobTypes.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <Controller
                        name="experience"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Experience Level"
                            fullWidth
                            error={!!errors.experience}
                            helperText={errors.experience?.message}
                            InputProps={{
                              startAdornment: (
                                <TrendingUpOutlined
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          >
                            {experienceLevels.map((option) => (
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

                    <div className="col-12 col-md-4">
                      <Controller
                        name="salaryMin"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Minimum Salary"
                            fullWidth
                            type="number"
                            error={!!errors.salaryMin}
                            helperText={errors.salaryMin?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {currencyValue}
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <Controller
                        name="salaryMax"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Maximum Salary"
                            fullWidth
                            type="number"
                            error={!!errors.salaryMax}
                            helperText={errors.salaryMax?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {currencyValue}
                                </InputAdornment>
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
                        name="deadline"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Application Deadline"
                            fullWidth
                            type="date"
                            error={!!errors.deadline}
                            helperText={errors.deadline?.message}
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
                  </div>
                </CardContent>
              </Card>
            </Grow>

            {/* Job Description Section */}
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
                      <DescriptionOutlined />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      Job Description
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Job Overview"
                            fullWidth
                            multiline
                            rows={4}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            placeholder="Provide a detailed overview of the role, team, and work environment..."
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="col-12">
                      <Controller
                        name="responsibilities"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Key Responsibilities"
                            fullWidth
                            multiline
                            rows={4}
                            error={!!errors.responsibilities}
                            helperText={errors.responsibilities?.message}
                            placeholder="List main responsibilities and duties (one per line or separated by bullets)..."
                            InputProps={{
                              startAdornment: (
                                <AssignmentOutlined
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

                    <div className="col-12">
                      <Controller
                        name="requirements"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Requirements & Qualifications"
                            fullWidth
                            multiline
                            rows={4}
                            error={!!errors.requirements}
                            helperText={errors.requirements?.message}
                            placeholder="List required education, experience, certifications, and skills..."
                            InputProps={{
                              startAdornment: (
                                <ChecklistOutlined
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

                    <div className="col-12">
                      <Controller
                        name="benefits"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Benefits (Optional)"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!errors.benefits}
                            helperText={errors.benefits?.message}
                            placeholder="Health insurance, pension, training opportunities, etc..."
                            InputProps={{
                              startAdornment: (
                                <CardGiftcardOutlined
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

                    {/* Skills */}
                    <div className="col-12">
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <PsychologyOutlined sx={{ color: "text.secondary" }} />
                        <Typography variant="subtitle2" fontWeight={600}>
                          Required Skills
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1} mb={2}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="e.g., JavaScript, Project Management, Sales"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                        <Button
                          variant="outlined"
                          onClick={handleAddSkill}
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
                        {skills.map((skill, index) => (
                          <Zoom in key={index} timeout={300}>
                            <Chip
                              label={skill}
                              onDelete={() => handleRemoveSkill(index)}
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

            {/* Action Buttons */}
            <Grow in timeout={800} style={{ transformOrigin: "0 0 0" }}>
              <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<CloseOutlined />}
                  onClick={() => navigate("/company/jobs")}
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
                    ? "Update Job"
                    : "Post Job"}
                </Button>
              </Box>
            </Grow>
          </form>
        </Container>
      </Box>
    </Fade>
  );
}
