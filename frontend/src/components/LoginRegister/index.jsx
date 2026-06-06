import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./styles.css";

function LoginRegister() {
  const [mode, setMode] = useState("login");
  const [loginName, setLoginName] = useState("");
  const [error, setError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerForm, setRegisterForm] = useState({
    login_name: "",
    password: "",
    passwordConfirm: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const showLogin = () => {
    setMode("login");
    setError("");
    setRegisterError("");
  };

  const showRegister = () => {
    setMode("register");
    setError("");
    setRegisterSuccess("");
  };

  const errorMessage = (err) => {
    try {
      const parsed = JSON.parse(err.message);
      return parsed.error || err.message;
    } catch {
      return err.message || "Request failed.";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!loginName.trim()) {
      setError("Please enter a login name.");
      return;
    }

    try {
      const user = await login(loginName);
      navigate(`/users/${user._id}`);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handleRegisterChange = (field) => (event) => {
    setRegisterForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("Registration successful. You can now log in.");
  };

  return (
    <Box className="login-register-container">
      <Paper elevation={3} className="login-register-paper">
        <Box className="login-register-switch">
          <Button
            variant={mode === "login" ? "contained" : "outlined"}
            onClick={showLogin}
            fullWidth
          >
            Login
          </Button>
          <Button
            variant={mode === "register" ? "contained" : "outlined"}
            onClick={showRegister}
            fullWidth
          >
            Register
          </Button>
        </Box>

        <Typography variant="h5" component="h1" gutterBottom align="center">
          {mode === "login" ? "Login" : "Register"}
        </Typography>

        {registerSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {registerSuccess}
          </Alert>
        )}

        {mode === "login" ? (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleLogin} className="login-form">
              <TextField
                label="Login Name"
                variant="outlined"
                fullWidth
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                margin="normal"
                autoFocus
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
              <Button onClick={showRegister} fullWidth sx={{ mt: 1 }}>
                Create an account
              </Button>
            </form>
          </>
        ) : (
          <>
            {registerError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {registerError}
              </Alert>
            )}
            <form onSubmit={handleRegister} className="login-form">
              <TextField
                label="Login Name"
                fullWidth
                value={registerForm.login_name}
                onChange={handleRegisterChange("login_name")}
                margin="dense"
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={registerForm.password}
                onChange={handleRegisterChange("password")}
                margin="dense"
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={registerForm.passwordConfirm}
                onChange={handleRegisterChange("passwordConfirm")}
                margin="dense"
              />
              <TextField
                label="First Name"
                fullWidth
                value={registerForm.first_name}
                onChange={handleRegisterChange("first_name")}
                margin="dense"
              />
              <TextField
                label="Last Name"
                fullWidth
                value={registerForm.last_name}
                onChange={handleRegisterChange("last_name")}
                margin="dense"
              />
              <TextField
                label="Location"
                fullWidth
                value={registerForm.location}
                onChange={handleRegisterChange("location")}
                margin="dense"
              />
              <TextField
                label="Occupation"
                fullWidth
                value={registerForm.occupation}
                onChange={handleRegisterChange("occupation")}
                margin="dense"
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={2}
                value={registerForm.description}
                onChange={handleRegisterChange("description")}
                margin="dense"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Register Me
              </Button>
              <Button onClick={showLogin} fullWidth sx={{ mt: 1 }}>
                Back to Login
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default LoginRegister;
