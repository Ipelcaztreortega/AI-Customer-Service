'use client'; // Ensure this is the first line

import React, { useState } from "react";
import { auth, googleProvider } from "../../../config/firebaseConfig"; // Adjust the path as needed
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useRouter } from 'next/navigation'; // Use next/navigation for Next.js 13+ app directory
import Link from 'next/link'; // Import Link for navigation

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); // Ensure this is within a client component

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      router.push("/UserChat"); // Redirect to a welcome page or dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Login successful!");
      router.push("/UserChat"); // Redirect after successful Google login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Log In
        </Button>
      </form>
      <Button
        onClick={handleGoogleLogin}
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Log In with Google
      </Button>
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
        Don&apos;t have an account?{" "}
        <Link href="/Signup" passHref>
          <Button variant="text" color="primary">
            Sign Up
          </Button>
        </Link>
      </Typography>
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default UserLogin;
