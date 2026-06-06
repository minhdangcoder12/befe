import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { matchPath, useLocation } from "react-router-dom";

import "./styles.css";
import { useAuth } from "../../context/AuthContext";
import fetchModel from "../../lib/fetchModelData";

function TopBar() {
  const location = useLocation();
  const [contextTitle, setContextTitle] = useState("");
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
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
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
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
