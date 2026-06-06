import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

import "./styles.css";
import { useAuth } from "../../context/AuthContext";
import fetchModel from "../../lib/fetchModelData";

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [contextTitle, setContextTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoButton = () => {
    setUploadError("");
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    setUploading(true);
    setUploadError("");
    try {
      await fetchModel("/photos/new", {
        method: "POST",
        body: formData,
      });
      navigate(`/photos/${user._id}`, { state: { uploadedAt: Date.now() } });
    } catch (err) {
      setUploadError(err.message || "Could not upload photo.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const path = location.pathname;

    const usersListMatch = matchPath({ path: "/users", end: true }, path);
    if (usersListMatch) {
      setContextTitle("Users");
      return;
    }

    const userDetailMatch = matchPath(
      { path: "/users/:userId", end: true },
      path,
    );
    if (userDetailMatch) {
      const { userId } = userDetailMatch.params;
      let cancelled = false;
      fetchModel(`/user/${userId}`)
        .then((user) => {
          if (!cancelled && user) {
            setContextTitle(`${user.first_name} ${user.last_name}`);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setContextTitle("User");
          }
        });
      return () => {
        cancelled = true;
      };
    }

    const photosMatch = matchPath(
      { path: "/photos/:userId", end: true },
      path,
    );
    const photoUserId = photosMatch?.params.userId;
    if (photoUserId) {
      let cancelled = false;
      fetchModel(`/user/${photoUserId}`)
        .then((user) => {
          if (!cancelled && user) {
            setContextTitle(`Photos of ${user.first_name} ${user.last_name}`);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setContextTitle("Photos");
          }
        });
      return () => {
        cancelled = true;
      };
    }

    setContextTitle("");
    return undefined;
  }, [location.pathname]);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" color="inherit" component="div">
          {user ? `Hi ${user.first_name}` : "Please Login"}
        </Typography>
        <div className="topbar-right">
          {user && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoSelected}
              />
              <Button
                color="inherit"
                onClick={handlePhotoButton}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Add Photo"}
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          {uploadError && (
            <Typography variant="caption" color="inherit">
              {uploadError}
            </Typography>
          )}
          <Typography
            variant="subtitle1"
            color="inherit"
            component="div"
            className="topbar-context"
          >
            {contextTitle}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
