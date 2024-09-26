'use client';
import {Box, Link, Typography, Button, Stack} from "@mui/material"

//MUI Icons used: Keep adding here to have a consistent dependency
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
import QuizIcon from '@mui/icons-material/Quiz';

//Import component
import handleLogout from './logout';

//Import react components
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const col6 = ['#3D405B']; // Dark shade
const col2 = ['#E07A5F']; // red
const col3 = ['#81B29A']; // green
const col4 = ['#F4F1DE']; // white
const col5 = ['#F2CC8F']; // yellow
const col1 = ['#191c35']; // Darker shade
const col7 = ['#5FA8D3']; //Blue

const lcol1 = ['#E4E2DE']; //Offwhite
const lcol2 = ['#FFF']; //White
const lcol3 = [''];



const Navbar = () => {
    return(
                    <Box
                        width='20vw'
                        height='100vh'
                        display='flex'
                        boxSizing={'border-box'}
                        justifyContent='space-between'
                        flexDirection={'column'}
                        alignItems='center'
                        padding={'0 1vw'}
                        bgcolor={col6}
                        >
                            <Typography
                            color={col4}
                            margin='0.5em'
                            fontSize='2em'
                            textAlign={'left'}
                            borderBottom={'1px solid rgba(0,0,0,0.3)'}
                            >
                                <Link
                                    color='inherit'
                                    underline='none'
                                    href='./'
                                    textAlign={'left'}
                                >
                                    DataDojo
                                </Link>
                            </Typography>
                            
                            <Box
                                width={'100%'}

                            >
                                <Typography
                                color={col4}>
                                Welcome!
                                </Typography>
                                
                            </Box>
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                justifyContent={'flex-start'}
                                height={'60vw'}
                                width={'100%'}
                                paddingTop={'5vh'}
                            >
                                <Button
                                    fullWidth
                                    href='./dashboard/'
                                    
                                    sx={{color:col4,
                                        padding:'1em',
                                        background:col1,
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4,
                                        }

                                    }}
                                >
                                    <HomeIcon display={'block'} />
                                    Dashboard
                                </Button>
                                <Button
                                    fullWidth
                                    href='./editor/'
                                    
                                    sx={{color:col4,
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <CodeIcon />
                                    Code Editor
                                </Button>

                                <Button
                                    fullWidth
                                    href='./fcgen/'
                                    
                                    sx={{color:col4,
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <BoltIcon />
                                    Flashcards
                                </Button>

                                <Button
                                    fullWidth
                                    href='./chat/'
                                    
                                    sx={{color:col4,
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <SupportAgentIcon />
                                    Socratic Bot
                                </Button>
                                
                                <Button
                                    fullWidth
                                    href='./test/'
                                    
                                    sx={{color:col4,
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <QuizIcon />
                                    Mock Test
                                </Button>
                                
                            </Box>
                            
                            <Box>
                                
                                <Button
                                    fullWidth
                                    href='./profile/'
                                    sx={{color:col4,
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <Person4Icon/>
                                    Profile
                                </Button>
                                <Button
                                    fullWidth
                                    
                                    onClick={handleLogout}
                                    sx={{color:col4,
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <LogoutIcon/>
                                    Logout
                                </Button>
                            </Box>
                            
                        </Box>
                        )

}
export default Navbar;