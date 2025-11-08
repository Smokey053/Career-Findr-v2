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
} from "@mui/material";
import { ArrowBack, Save, Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import { getJob, createJob, updateJob } from "../../services/jobService";

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
    salary: yup.string().required("Salary range is required"),
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
  } = useForm({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "",
      experience: "",
      salary: "",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      deadline: "",
    },
  });

  // Set form values when job data is loaded
  React.useEffect(() => {
    if (jobData) {
      reset({
        title: jobData.title || "",
        department: jobData.department || "",
        location: jobData.location || "",
        type: jobData.type || "",
        experience: jobData.experience || "",
        salary: jobData.salary || "",
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
        : createJob(jobPayload, user.uid);
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
    saveMutation.mutate(data);
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
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <IconButton onClick={() => navigate("/company/jobs")}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {isEditMode ? "Edit Job Posting" : "Post New Job"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditMode
                ? "Update job posting details"
                : "Create a new job opportunity"}
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
                Job Details
              </Typography>
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

                <div className="col-12 col-md-6">
                  <Controller
                    name="salary"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Salary Range"
                        fullWidth
                        error={!!errors.salary}
                        helperText={errors.salary?.message}
                        placeholder="e.g., M15,000 - M25,000 per month"
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
                      />
                    )}
                  />
                </div>
              </div>

              {/* Description & Details */}
              <Typography variant="h6" gutterBottom fontWeight={600} mt={3}>
                Job Description
              </Typography>
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
                      />
                    )}
                  />
                </div>

                {/* Skills */}
                <div className="col-12">
                  <Typography variant="subtitle2" gutterBottom>
                    Required Skills
                  </Typography>
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
                    />
                    <Button variant="outlined" onClick={handleAddSkill}>
                      Add
                    </Button>
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<Close />}
              onClick={() => navigate("/company/jobs")}
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
                ? "Update Job"
                : "Post Job"}
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
}
