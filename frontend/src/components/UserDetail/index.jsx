import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setUser(null);
    setError(null);
    fetchModel(`/user/${userId}`)
      .then((data) => {
        if (!cancelled) {
          setUser(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || String(err));
        }
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (error) {
    return (
      <Typography color="error" variant="body1">
        Could not load user: {error}
      </Typography>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
        <CircularProgress size={28} />
        <Typography variant="body2">Loading profile…</Typography>
      </Box>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {fullName}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Location
      </Typography>
      <Typography variant="body1" gutterBottom>
        {user.location}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Occupation
      </Typography>
      <Typography variant="body1" gutterBottom>
        {user.occupation}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        About
      </Typography>
      <Typography
        variant="body1"
        paragraph
        dangerouslySetInnerHTML={{ __html: user.description }}
      />
      <Button
        variant="contained"
        component={RouterLink}
        to={`/photos/${user._id}`}
        sx={{ mt: 1 }}
      >
        View photos
      </Button>
    </Box>
  );
}

export default UserDetail;
