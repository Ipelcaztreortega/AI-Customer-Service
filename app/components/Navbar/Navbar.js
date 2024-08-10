// app/components/Navbar.js
'use client'; // Ensure this is the first line

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Import the Image component from next/image
import { auth } from "../../../config/firebaseConfig"; // Adjust the path as needed
import { signOut, onAuthStateChanged } from "firebase/auth";
import { IconButton, Menu, MenuItem, Avatar, Typography, Box, AppBar, Toolbar, Button } from "@mui/material";
import { useRouter } from 'next/navigation'; // Use next/navigation for Next.js 13+ app directory

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter(); // Ensure this is within a client component

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      router.push("/");
    } catch (error) {
      console.error("Logout error", error);
    }
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Image src="/home.png" alt="Home" width={50} height={50} />
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            AI Assistant
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar src={user.photoURL || ""}>{user.email[0]}</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    width: 200,
                  },
                }}
              >
                <MenuItem disabled>
                  <Typography>{user.email}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link href="/Login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/Signup" passHref>
                <Button color="inherit">Signup</Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
