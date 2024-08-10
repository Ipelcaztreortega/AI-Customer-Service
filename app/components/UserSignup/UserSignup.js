'use client'; // Ensure this is the first line

import React, { useState } from "react";
import { auth, googleProvider, db} from "../../../config/firebaseConfig"; // Adjust the path as needed
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useRouter } from 'next/navigation'; // Use next/navigation for Next.js 13+ app directory
import Link from "next/link";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user information to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
      });

      alert("Signup successful!");
      router.push("/UserChat");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user information to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName || "User",
      });

      alert("Google Signup successful!");
      router.push("/UserChat");
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
        Signup
      </Typography>
      <form onSubmit={handleSignup} style={{ width: "100%" }}>
        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          margin="normal"
        />
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
          Sign Up
        </Button>
      </form>
      <Button
        onClick={handleGoogleSignup}
        variant="outlined"
        color="secondary"
        fullWidth
      >
        Sign Up with Google
      </Button>
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
        Already have an account?{" "}
        <Link href="/Login" passHref>
          <Button variant="text" color="primary">
            Log In
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

export default UserSignup;
