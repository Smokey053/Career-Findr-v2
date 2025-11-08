import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Chip,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  InsertDriveFile,
  CheckCircle,
  Image,
  PictureAsPdf,
  Description,
} from "@mui/icons-material";
import {
  uploadFile,
  formatFileSize,
  getFileExtension,
} from "../../services/storageService";

export default function FileUploader({
  onUploadComplete,
  onUploadError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFormats = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  storagePath = "documents",
  multiple = false,
  label = "Upload Files",
  helperText = "",
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    const ext = getFileExtension(fileName).toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(ext)) {
      return <Image color="primary" />;
    } else if (ext === "pdf") {
      return <PictureAsPdf color="error" />;
    }
    return <Description color="action" />;
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setError("");

    // Validate file sizes
    const oversizedFiles = selectedFiles.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(
        `Some files exceed the maximum size of ${formatFileSize(maxSize)}`
      );
      return;
    }

    if (multiple) {
      setFiles([...files, ...selectedFiles]);
    } else {
      setFiles(selectedFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    const uploaded = [];

    try {
      for (const file of files) {
        // Use the storage service for uploading
        const result = await uploadFile(file, storagePath, (progressValue) => {
          setProgress(progressValue);
        });

        uploaded.push({
          name: file.name,
          url: result.url,
          path: result.path,
          size: file.size,
          type: file.type,
        });
      }

      setUploadedFiles([...uploadedFiles, ...uploaded]);
      setFiles([]);
      setProgress(0);

      if (onUploadComplete) {
        onUploadComplete(multiple ? uploaded : uploaded[0]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={acceptedFormats}
        multiple={multiple}
        style={{ display: "none" }}
      />

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          textAlign: "center",
          transition: "all 0.3s ease",
          border: `2px dashed`,
          borderColor: "divider",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
        }}
      >
        <CloudUpload
          sx={{
            fontSize: 56,
            color: "primary.main",
            mb: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        />

        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>

        {helperText && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {helperText}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={handleButtonClick}
          disabled={uploading}
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          Choose {multiple ? "Files" : "File"}
        </Button>

        <Typography
          variant="caption"
          display="block"
          mt={2}
          color="text.secondary"
        >
          Accepted formats: {acceptedFormats}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Max size: {formatFileSize(maxSize)}
        </Typography>
      </Paper>

      {files.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files ({files.length})
          </Typography>
          <List>
            {files.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                {getFileIcon(file.name)}
                <ListItemText
                  primary={file.name}
                  secondary={formatFileSize(file.size)}
                  sx={{ ml: 2 }}
                />
                <Chip
                  label={getFileExtension(file.name).toUpperCase()}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveFile(index)}
                    disabled={uploading}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {uploading && (
            <Box mt={2}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 1,
                }}
              />
              <Typography
                variant="body2"
                textAlign="center"
                color="text.secondary"
              >
                Uploading... {Math.round(progress)}%
              </Typography>
            </Box>
          )}

          {!uploading && (
            <Button
              variant="contained"
              fullWidth
              onClick={handleUpload}
              sx={{
                mt: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
              startIcon={<CloudUpload />}
            >
              Upload {files.length} {files.length === 1 ? "File" : "Files"}
            </Button>
          )}
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle2" gutterBottom color="success.main">
            <CheckCircle
              sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom" }}
            />
            Successfully Uploaded ({uploadedFiles.length})
          </Typography>
          <List dense>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  border: 1,
                  borderColor: "success.light",
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: "success.lighter",
                }}
              >
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <ListItemText
                  primary={file.name}
                  secondary={formatFileSize(file.size)}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
