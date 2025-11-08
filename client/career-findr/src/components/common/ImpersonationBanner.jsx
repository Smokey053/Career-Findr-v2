import React from "react";
import { Alert, Button, Box, Chip } from "@mui/material";
import { PersonOff, Visibility } from "@mui/icons-material";
import { useImpersonation } from "../../contexts/ImpersonationContext";

export default function ImpersonationBanner() {
  const { isImpersonating, impersonatedUser, originalUser, stopImpersonation } =
    useImpersonation();

  if (!isImpersonating) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      icon={<Visibility />}
      sx={{
        position: "fixed",
        top: 64,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderRadius: 0,
        justifyContent: "center",
      }}
      action={
        <Button
          color="inherit"
          size="small"
          startIcon={<PersonOff />}
          onClick={stopImpersonation}
        >
          Exit Impersonation
        </Button>
      }
    >
      <Box display="flex" alignItems="center" gap={1}>
        <strong>Impersonation Mode:</strong>
        You are viewing as
        <Chip
          label={`${impersonatedUser?.email || "Unknown User"} (${
            impersonatedUser?.role || "N/A"
          })`}
          size="small"
          color="warning"
        />
        <span>|</span>
        Admin:
        <Chip label={originalUser?.email || "Unknown Admin"} size="small" />
      </Box>
    </Alert>
  );
}
