'use client'

import { Container,Link, Typography, Card, Box,Grid, Paper, TextField, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import questions from '../editor/questions.json';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import { CircularProgress } from "@mui/material";
import MoodIcon from '@mui/icons-material/Mood';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import WhatshotIcon from '@mui/icons-material/Whatshot';

//Components
import Navbar from '../components/navbar';

import {auth, db} from '../firebase';
import {collection, query, where, getDocs, doc, updateDoc,arrayUnion, arrayRemove } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLogout from '../components/logout';


const col6 = ['#3D405B']; // Dark shade
const col2 = ['#E07A5F']; // red
const col3 = ['#81B29A']; // green
const col4 = ['#F4F1DE']; // white
const col5 = ['#F2CC8F']; // yellow
const col1 = ['#191c35']; // Darkest shade
const col7 = ['#5FA8D3']; //Blue
const col8 = ['#2b2d44']; //Darker shade



export default function Home(){

    // Redirect section
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const handleLogout = useLogout();

    
    const [questions, setQuestions] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    
    const handleSubmit =async() =>{
        
        fetch('api/quiz',{
            method: 'POST',
            body:text,
        })
        .then((res) => res.json())
        .then((data) => setQuestions(data))
        console.log(questions)
    }


    useEffect(() => {
        console.log("Component mounted, starting auth check");
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                console.log("Auth check timed out");
                setAuthError("Authentication check timed out");
                setIsLoading(false);
            }
        }, 12000000); // 20 minute timeout

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
                bgcolor={col1}
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



return(
<Box
            width={'100vw'}
            minHeight={'100vh'}
            backgroundColor={col1}
            display={'flex'}
            overflow={'hidden'}
            >
                    <Navbar />

                    <Box
                        width={'80vw'}
                        height={'100vh'}
                        bgcolor={col1}
                        display={'flex'}
                        flexDirection={'column'}
                    >
                        <Box
                            width={'76vw'}
                            height={'25vh'}
                            margin={'4vh 2vw 2vh 2vw'}
                            
                            borderRadius={'0.2em'}
                            color={col4}
                            padding={'1em'}
                            display={'flex'}
                            flexDirection={'column'}
                        >
                            <Typography
                                variant="h4"
                                marginBottom={'0.4em'}
                            >
                                Quiz
                            </Typography>
                            <Box
                                width={'100%'}
                                display={'flex'}
                                flexDirection={'row'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Box
                                    width={'85%'}
                                >
                                    <TextField
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        label="Enter a topic name"
                                        fullWidth

                                        borderColor={'#fff'}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                              '& fieldset': {
                                                borderColor: 'white',
                                              },
                                              '&:hover fieldset': {
                                                borderColor: 'white',
                                              },
                                              '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                              },
                                            },
                                            '& .MuiInputLabel-root': {
                                              color: 'white',
                                            },
                                            '& .MuiOutlinedInput-input': {
                                              color: 'white',
                                            },
                                          }}
                                    />
                                </Box>
                                <Box
                                    width={'15%'}
                                    padding={'0.5em'}
                                >
                                    <Button
                                        variant='contained'
                                        sx={{
                                            bgcolor:col5,
                                            color:col1,
                                            borderRadius:'2em',
                                            padding:'0.8em 2em',
                                            '&:hover':{
                                                background:col4,
                                                color:col6
                                            }
                                        }}
                                        onClick={handleSubmit}
                                    >
                                        Generate 
                                        <DynamicFormIcon />
                                    </Button>
                                </Box>
                            </Box>
                            
                        </Box>
                        <Box
                            width={'76vw'}
                            height={'75vh'}
                            margin={'0 2vw 4vh 2vw'}
                            
                            padding={'1em'}
                        >
                            
                        
                        </Box>
                    </Box>


                    
            </Box>


);


}