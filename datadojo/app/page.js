'use client'
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '2em',
            padding: '0.75em 2em',
            fontSize: '1.1em',
            fontWeight: 'bold',
            textTransform: 'none',
          },
        },
      },
    },
  });

export default function Home() {
  const outerTheme = useTheme();

  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <Box
        bgcolor="#191c35"
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxWidth="500px"
          width="100%"
        >
          <Box mb={4}>
            <Image src="/logo.png" width={200} height={200} alt="DataDojo Logo" />
          </Box>
          <Typography variant="h2" color="#f4f1de" mb={4}>
            DataDojo
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            href="../signin/"
            sx={{
              bgcolor: '#E07A5F',
              color: '#f4f1de',
              '&:hover': {
                bgcolor: '#f4f1de',
                color: '#E07A5F',
              },
            }}
          >
            Launch
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}