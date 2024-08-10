'use client'

import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { auth, db } from '../../config/firebaseConfig'; // Adjust the path as needed
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if displayName is available
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          // Fetch the user's name from Firestore
          try {
            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              setUserName(userData.name || 'User');
            } else {
              setUserName('User');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUserName('User');
          }
        }
      } else {
        setUserName('Guest');
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    setMessage(''); // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message }, // Add the user's message to the chat
      { role: 'assistant', content: '' }, // Add a placeholder for the assistant's response
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
    setIsLoading(false);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
    >
      <Stack
        direction={'column'}
        width='600px'
        height='700px'
        border='1px solid black'
        p={2}
        spacing={3}
      >
        {/* Greeting Box */}
        <Box
          bgcolor='primary.light'
          color='text.primary'
          borderRadius={16}
          p={2}
          mb={2}
          display='flex'
          justifyContent='center'
        >
          <Typography variant="h6">
            Welcome {userName}
          </Typography>
        </Box>

        <Stack
          direction={'column'}
          spacing={2}
          flexGrow='1'
          overflow='auto'
          maxHeight='100%'
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                // If the message is assistant then it'll be on the left else the right
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
