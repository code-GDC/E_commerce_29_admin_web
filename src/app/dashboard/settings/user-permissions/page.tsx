'use client';

import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast"; // Import toast
import { Button, TextField, Box, Typography, createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'dark',
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

type IFormInput = {
  AdminUserName: string;
  FirstName: string;
  LastName: string;
  Password: string;
  Email: string;
};

const AdminCreationPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setApiError(null);

    try {
      const response = await axios.post("/api/signup", data);
      console.log("Signup successful", response.data);

      // Show success toast message
      toast.success(response.data.message || "Admin created successfully");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
        // Show error toast message
        toast.error(error.response.data.message);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          p: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create Admin
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: 400,
            width: '100%',
          }}
        >
          <TextField
            label="Username"
            variant="filled"
            {...register("AdminUserName", { required: true })}
            error={!!errors.AdminUserName}
            helperText={errors.AdminUserName ? 'Username is required' : ''}
            fullWidth
          />
          <TextField
            label="First Name"
            variant="filled"
            {...register("FirstName", { required: true })}
            error={!!errors.FirstName}
            helperText={errors.FirstName ? 'First Name is required' : ''}
            fullWidth
          />
          <TextField
            label="Last Name"
            variant="filled"
            {...register("LastName")}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            {...register("Password", { required: true })}
            error={!!errors.Password}
            helperText={errors.Password ? 'Password is required' : ''}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            variant="filled"
            {...register("Email", { required: true })}
            error={!!errors.Email}
            helperText={errors.Email ? 'Email is required' : ''}
            fullWidth
          />

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Create Admin
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminCreationPage;
