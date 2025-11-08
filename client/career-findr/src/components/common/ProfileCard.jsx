import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";

export default function ProfileCard({
  name,
  email,
  phone,
  location,
  avatar,
  role,
  bio,
  tags = [],
  verified = false,
  actions = [],
  onClick,
}) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { boxShadow: 6 } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            src={avatar}
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: "primary.main",
              fontSize: "2rem",
            }}
          >
            {name?.[0]?.toUpperCase()}
          </Avatar>

          <Typography variant="h6" align="center" gutterBottom>
            {name}
          </Typography>

          {role && (
            <Chip label={role} size="small" color="primary" sx={{ mb: 1 }} />
          )}

          {verified && (
            <Chip
              label="Verified"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Box>

        {bio && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            paragraph
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {bio}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" flexDirection="column" gap={1}>
          {email && (
            <Box display="flex" alignItems="center" gap={1}>
              <Email fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" noWrap>
                {email}
              </Typography>
            </Box>
          )}

          {phone && (
            <Box display="flex" alignItems="center" gap={1}>
              <Phone fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {phone}
              </Typography>
            </Box>
          )}

          {location && (
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {location}
              </Typography>
            </Box>
          )}
        </Box>

        {tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
            {tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </CardContent>

      {actions.length > 0 && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              size="small"
              variant={action.variant || "text"}
              color={action.color || "primary"}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
            >
              {action.label}
            </Button>
          ))}
        </CardActions>
      )}
    </Card>
  );
}
