'use client'

import { useState } from "react"
import {Box, Link, Typography, Button} from "@mui/material"

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';

const col1 = ['#3D405B']; // Dark shade
const col2 = ['#E07A5F']; // red
const col3 = ['#81B29A']; // green
const col4 = ['#F4F1DE']; // white
const col5 = ['#F2CC8F']; // yellow
const col6 = ['#191c35']; // Darker shade

export default function Home(){



    return(
        <Box
            width={'100vw'}
            height={'100vh'}
            display={'flex'}
            bgcolor={col1}
        >
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
                                    href='./profile/'
                                    sx={{color:col4,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <HomeIcon />
                                </Button>
                                <Button
                                    href='./editor/'
                                    sx={{color:col4,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <CodeIcon />
                                </Button>
                                <Button
                                    href='./chat/'
                                    sx={{color:col4,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <SupportAgentIcon />
                                </Button>
                                <Button
                                    href='./fcgen/'
                                    sx={{color:col4,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <BoltIcon />
                                </Button>
                            </Box>

                            <Button
                                href="./"
                                sx={{color:col4,
                                    '&:hover':{
                                        color:col1,
                                        backgroundColor:col4
                                    }

                                }}
                            >
                                <Person4Icon/>
                            </Button>
                        </Box>
        </Box>
    )
}