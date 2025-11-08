import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function FilePreview({
  open,
  onClose,
  fileUrl,
  fileName,
  fileType,
}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
    setError("Failed to load document");
    setLoading(false);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "document";
    link.click();
  };

  const renderPreview = () => {
    if (!fileUrl) {
      return <Alert severity="error">No file URL provided</Alert>;
    }

    const extension = fileName?.split(".").pop()?.toLowerCase();

    // PDF Preview
    if (extension === "pdf" || fileType?.includes("pdf")) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1,
              bgcolor: "grey.100",
              borderRadius: 1,
            }}
          >
            <IconButton onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOut />
            </IconButton>
            <Typography variant="body2">{Math.round(scale * 100)}%</Typography>
            <IconButton onClick={handleZoomIn} disabled={scale >= 2.0}>
              <ZoomIn />
            </IconButton>
            <Box
              sx={{ borderLeft: 1, borderColor: "divider", height: 24, mx: 1 }}
            />
            <IconButton onClick={handlePreviousPage} disabled={pageNumber <= 1}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="body2">
              {pageNumber} / {numPages || "..."}
            </Typography>
            <IconButton
              onClick={handleNextPage}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight />
            </IconButton>
          </Box>

          <Box
            sx={{
              maxHeight: "70vh",
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<CircularProgress />}
            >
              <Page pageNumber={pageNumber} scale={scale} />
            </Document>
          </Box>
        </Box>
      );
    }

    // Image Preview
    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension) ||
      fileType?.includes("image")
    ) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxHeight: "70vh",
            overflow: "auto",
          }}
        >
          <img
            src={fileUrl}
            alt={fileName}
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError("Failed to load image");
              setLoading(false);
            }}
          />
        </Box>
      );
    }

    // Text Files Preview
    if (
      ["txt", "md", "json", "csv"].includes(extension) ||
      fileType?.includes("text")
    ) {
      return (
        <Box
          sx={{
            maxHeight: "70vh",
            overflow: "auto",
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 1,
          }}
        >
          <iframe
            src={fileUrl}
            title={fileName}
            style={{
              width: "100%",
              height: "60vh",
              border: "none",
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError("Failed to load file");
              setLoading(false);
            }}
          />
        </Box>
      );
    }

    // Video Preview
    if (
      ["mp4", "webm", "ogg"].includes(extension) ||
      fileType?.includes("video")
    ) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            maxHeight: "70vh",
          }}
        >
          <video
            controls
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
            onLoadedData={() => setLoading(false)}
            onError={() => {
              setError("Failed to load video");
              setLoading(false);
            }}
          >
            <source src={fileUrl} type={fileType || `video/${extension}`} />
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    }

    // Default: Download prompt
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" gutterBottom>
          Preview not available for this file type
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Click the download button to view the file
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{ mt: 2 }}
        >
          Download File
        </Button>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" noWrap sx={{ maxWidth: "80%" }}>
            {fileName || "File Preview"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {renderPreview()}
      </DialogContent>
      <DialogActions>
        <Button startIcon={<Download />} onClick={handleDownload}>
          Download
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
