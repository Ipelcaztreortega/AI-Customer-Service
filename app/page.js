// app/page.js
'use client';

import Link from 'next/link';
import { Button, Typography, Box } from '@mui/material';

export default function Home() {
  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Effortless Customer Service with AI
        </Typography>
        <Typography variant="body1">
          Our AI-powered assistant is here to help you with all your customer service needs. Get instant answers and personalized support.
        </Typography>
      </Box>
      <Link href="/Signup" passHref>
        <Button variant="contained" color="primary">
          Get Started
        </Button>
      </Link>
    </main>
  );
}
