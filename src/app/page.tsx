"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookie from "js-cookie";
import {
  Button,
  TextField,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000",
      paper: "#333",
    },
    text: {
      primary: "#fff",
    },
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#000",
    },
  },
});

type LoginFormInput = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    setApiError(null);

    // Show loading message
    const toastId = toast.loading("Logging in...");

    try {
      const response = await axios.post("/api/login", data);
      const token = response.data.token;
      
      // Set token in local storage
      localStorage.setItem("admin", token);

      toast.success("Login successful!", { id: toastId });
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          p: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
            width: "100%",
          }}
        >
          <TextField
            label="Email"
            type="email"
            variant="filled"
            {...register("email", { required: true })}
            error={!!errors.email}
            helperText={errors.email ? "Email is required" : ""}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            {...register("password", { required: true })}
            error={!!errors.password}
            helperText={errors.password ? "Password is required" : ""}
            fullWidth
          />

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>

          {/* Display API error message below the form */}
          {apiError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {apiError}
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
