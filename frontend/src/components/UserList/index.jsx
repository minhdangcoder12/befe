import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import { useAuth } from "../../context/AuthContext";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    let cancelled = false;
    
    if (!currentUser) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchModel("/user/list")
      .then((data) => {
        if (!cancelled) {
          setUsers(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || String(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  if (error) {
    return (
      <Typography color="error" variant="body2" sx={{ p: 1 }}>
        Could not load users: {error}
      </Typography>
    );
  }

  if (loading) {
    return (
      <div className="user-list-loading">
        <CircularProgress size={28} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading users…
        </Typography>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (users.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No users found.
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Users
      </Typography>
      <List component="nav" dense disablePadding>
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItemButton component={Link} to={`/users/${user._id}`}>
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
              />
            </ListItemButton>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
