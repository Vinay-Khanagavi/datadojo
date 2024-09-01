'use client'
import * as React from 'react';
import {Container, Box, Typography, TextField, Button, Link} from '@mui/material';
import { createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#E0E3E7',
            '--TextField-brandBorderHoverColor': '#B2BAC2',
            '--TextField-brandBorderFocusedColor': '#6F7E8C',
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },

      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&::before, &::after': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
    },
  });

export default function Home() {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const outerTheme = useTheme();
  const col1 = ['#3D405B'] // Dark shade
  const col2 = ['#E07A5F'] //red
  const col3 = ['#81B29A'] //green
  const col4 = ['#F4F1DE'] //white
  const col5 = ['#F2CC8F'] //yellow

  return (
      <Box
        width='100vw'
        height='100vh'
        bgcolor={col1}
      >
            {/*/////////////////// Navbar /////////////////*/}
            <Box
              width='100vw'
              height='8vh'
              display='flex'
              justifContent='space-between'
              alignItems='center'
              
            >
                <Typography
                  color={col4}
                  margin='0.5em'
                  fontSize='2em'
                >Learn Buddy</Typography>
            </Box>
          {/*/////////////////////// Central box /////////////////////////////*/}

              <Box
                width='40vw'
                height='30vh'
                
                margin={'0 auto'}
              >
                {/*///////////////////// Image placeholder //////////////////////////// */}
                      <Box
                        height='10vw'
                        width='10vw'
                      >

                      </Box>
                      <Typography
                          fontSize='1.2em'
                          textAlign='center'
                          color={col4}
                          variant='h4'
                      >
                        Welcome to Learn Buddy
                      </Typography>
                      <Typography
                        variant='h5'
                        fontSize='1em'
                        textAlign='center'
                        color={col4}
                        fontWeight='100'
                      >
                        Create a free Learn Buddy account and quench your curiosity today!
                      </Typography>
              </Box>

              {/*/////////////////////////// Login container /////////////////////////////*/}

              <Box
                width='100vw'
                height='62vh'
                display='flex'
                justifyContent='center'
              >
                  <ThemeProvider theme={customTheme(outerTheme)}>
                  <form
                    width='50vw'
                    display='flex'
                    justifyContent='center'
                  >
                    <TextField
                        variant='filled'
                        label='Email Address'
                        fullWidth
                        
                        sx={{
                          backgroundColor: col4,
                          '& .MuiFilledInput-root': {
                            backgroundColor: col4,
                            borderRadius: '0.5em',
                            '&:before, &:after': {
                              borderRadius: '12px',
                            },
                          },
                          color: '#000'
                        }}
                    >

                    </TextField>
                    <Box
                    padding='1em'
                    width='25vw'
                    ></Box>
                    <TextField
                        variant='filled'
                        label='Password'
                        fullWidth
                        sx={{
                          backgroundColor: col4,
                          '& .MuiFilledInput-root': {
                            backgroundColor: col4,
                          },
                          color: '#000'
                        }}
                    >
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                          id="standard-adornment-password"
                          type={showPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                      </TextField>
                      <Box
                        padding='1em'
                        ></Box>
                      <Button
                        sx={{backgroundColor:col2,
                          color:'#fff'
                        }}
                      >
                          Create FREE account
                      </Button>
                  </form>
                  </ThemeProvider>
              </Box>

      </Box>
  );
}
