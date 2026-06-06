import "./App.css";

import React from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login-register" replace />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route path="/login-register" element={<LoginRegister />} />

                  <Route path="/" element={<ProtectedRoute><Navigate to="/users" replace /></ProtectedRoute>} />
                  <Route path="/users/:userId" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
                  <Route path="/photos/:userId" element={<ProtectedRoute><UserPhotos /></ProtectedRoute>} />
                  <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
