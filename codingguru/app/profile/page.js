'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import {useState, useEffect} from "react";
import {auth} from '../firebase';
import useLogout from '../components/logout';
import { CircularProgress } from "@mui/material";


import {
  Box,
  Typography,
  Button,
  Link,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';

const col1 = ['#3D405B']; // Dark shade
const col2 = ['#E07A5F']; // red
const col3 = ['#81B29A']; // green
const col4 = ['#F4F1DE']; // white
const col5 = ['#F2CC8F']; // yellow
const col6 = ['#191c35']; // Darker shade

const Container = styled.div`
  background-color: #282c34;
  color: #3d405b;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Navigation = styled.div`
  width: 92vw;
  height: 8vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4vw;
  margin-bottom: 2rem;
`;

const ProfileCard = styled.div`
  background-color: #f4f1de;
  border-radius: 8px;
  padding: 2rem;
  width: 70vw;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const EditButton = styled.button`
  background-color: #e07a5f;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: darken(#e07a5f, 10%);
  }
`;

const StatItem = styled.div`
  background-color: #e07a5f;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
`;

const StatLabel = styled.p`
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
`;

const StatValue = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
`;

function Profile() {
  const handleLogout = useLogout();

  // Redirect section
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
      console.log("Component mounted, starting auth check");
      const timeoutId = setTimeout(() => {
          if (isLoading) {
              console.log("Auth check timed out");
              setAuthError("Authentication check timed out");
              setIsLoading(false);
          }
      }, 1200000); // 10 second timeout

      const unsubscribe = auth.onAuthStateChanged((user) => {
          console.log("Auth state changed:", user ? "User logged in" : "User not logged in");
          if (user) {
              console.log("User authenticated, setting loading to false");
              setIsLoading(false);
          } else {
              console.log("User not authenticated, redirecting to signin");
              router.push('/signin');
          }
      }, (error) => {
          console.error("Auth error:", error);
          setAuthError(error.message);
          setIsLoading(false);
      });

      return () => {
          unsubscribe();
          clearTimeout(timeoutId);
      };
  }, [router]);

  if (isLoading) {
      return (
          <Box
              bgcolor={col4}
              width={'100vw'}
              height={'100vh'}
              display="flex"
              justifyContent="center"
              alignItems="center"
          >
              <CircularProgress
                    height={'10'}
                    borderRadius={'10'}
                    color="success"
                ></CircularProgress>
          </Box>
      ); 
  }

  if (authError) {
      return (
          <Box
              bgcolor={col4}
              width={'100vw'}
              height={'100vh'}
              display="flex"
              justifyContent="center"
              alignItems="center"
          >
              <Typography variant="h4">Error: {authError}</Typography>
          </Box>
      );
  }


      // Redirect section ends

  return (
    <Container>
      {/* Navigation Section */}
      <Box
                        width='92vw'
                        height='8vh'
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        padding={'0 4vw'}
                        >
                            <Typography
                            color={col4}
                            margin='0.5em'
                            fontSize='2em'
                            >
                                <Link
                                    color='inherit'
                                    underline='none'
                                    href='./'
                                >
                                    Learn Buddy
                                </Link>
                            </Typography>

                            <Box
                                display={'flex'}
                                justifyContent={'space-around'}
                                width={'30vw'}
                            >
                                <Button
                                    href='./dashboard/'
                                    
                                    sx={{color:col4,
                                        borderBottom:`4px solid ${col4}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4,
                                                    
                                        }

                                    }}
                                >
                                    <HomeIcon display={'block'} />
                                    
                                </Button>
                                <Button
                                    href='./editor/'
                                    sx={{color:col2,
                                        borderBottom:`4px solid ${col2}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col2
                                        }

                                    }}
                                >
                                    <CodeIcon />
                                </Button>
                                <Button
                                    href='./chat/'
                                    sx={{color:col3,
                                        borderBottom:`4px solid ${col3}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col3
                                        }

                                    }}
                                >
                                    <SupportAgentIcon />
                                </Button>
                                <Button
                                    href='./fcgen/'
                                    sx={{color:col5,
                                        borderBottom:`4px solid ${col5}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col5
                                        }

                                    }}
                                >
                                    <BoltIcon />
                                </Button>
                            </Box>
                            
                            <Box>
                                <Button
                                    href="./profile/"
                                    sx={{color:col4,
                                        
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <Person4Icon/>
                                </Button>
                                <Button
                                    href="./profile/"
                                    onClick={handleLogout}
                                    sx={{color:col4,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }
                                    }}
                                >
                                    <LogoutIcon/>
                                </Button>
                            </Box>
                            
                        </Box>

      {/* Profile Content */}
      <ProfileCard>
        <ProfileHeader>
          <Button onClick={() => router.back()} sx={{ color: col1 }}>
            <ArrowBackIcon />
          </Button>
          <ProfileName>Profile</ProfileName>
          <EditButton>Edit Profile</EditButton>
        </ProfileHeader>

        <h2>Statistics</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
        <StatItem>
            <StatLabel>Questions Solved</StatLabel>
            <StatValue>1200</StatValue>
        </StatItem>
        <StatItem>
            <StatLabel>Easy Questions</StatLabel>
            <StatValue>800</StatValue>
        </StatItem>
        <StatItem>
            <StatLabel>Medium Questions</StatLabel>
            <StatValue>300</StatValue>
        </StatItem>
        <StatItem>
            <StatLabel>Hard Questions</StatLabel>
            <StatValue>100</StatValue>
        </StatItem>
        <StatItem>
            <StatLabel>Questions to Solve</StatLabel>
            <StatValue>200</StatValue>
        </StatItem>
        </div>

        <h2>Achievements</h2>
        <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
        }}
        >
        {/* Achievement Item 1 */}
        <div
            style={{
            backgroundColor: '#e07a5f',
            color: 'white',
            padding: '1rem',
            borderRadius: '5px',
            textAlign: 'center',
            }}
    >
            <img
              src="path/to/achievement1.png"
              alt="Achievement 1 Icon"
              style={{ width: '50px', height: '50px', marginBottom: '10px' }}
            />
            <h3>Achievement Title 1</h3>
            <p>Level 2</p>
        </div>

          {/* Achievement Item 2 (Repeat as needed) */}
        <div
            style={{
              backgroundColor: '#e07a5f',
              color: 'white',
              padding: '1rem',
              borderRadius: '5px',
              textAlign: 'center',
            }}
        >
            <img
            src="path/to/achievement2.png"
            alt="Achievement 2 Icon"
            style={{ width: '50px', height: '50px', marginBottom: '10px' }}
            />
            <h3>Achievement Title 2</h3>
            <p>Level 5</p>
        </div>
          {/* Add more achievement items as needed */}
        </div>
    </ProfileCard>
    </Container>
);
}

export default Profile;