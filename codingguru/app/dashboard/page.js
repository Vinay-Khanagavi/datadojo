'use client'

import { useState } from "react"
import {Box, Link, Typography, Button, Stack} from "@mui/material"
import questions from '../editor/questions.json';

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import { FlashlightIcon } from "lucide-react";

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
                                    href='./dashboard/'
                                    sx={{color:col4,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <HomeIcon display={'block'} />
                                    
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
                        </Box>

                        {/*//////////////////////////// Navbar ends here /////////////////////////////////*/}
                        
                        <Box
                            height={'92vh'}
                            width={'100vw'}
                            display={'flex'}
                            justifyContent={'center'}
                            gap={7}
                            alignItems={'flex-start'}
                            flexWrap={'wrap'}
                            flexDirection={'row'}
                        >
                            {/*///////////// First Box /////////////*/}
                            <Box
                                height={'40vh'}
                                width={'25vw'}
                                bgcolor={col4}
                                borderRadius={'0.5em'}
                                padding={'2em'}
                                boxSizing={'border-box'}
                            >
                                <Typography
                                    variant="h2"
                                    color={col1}
                                >Welcome, John Doe!</Typography>
                            </Box>
                            {/*///////////// Second Box /////////////*/}
                            <Box
                                height={'40vh'}
                                width={'55vw'}
                                bgcolor={col6}
                                borderRadius={'0.5em'}
                            >
                                <Box
                                    height={'8vh'}
                                    width={'100%'}
                                    borderBottom={"1px solid "+ col1}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                >
                                    <Typography
                                        color={col4}
                                    >
                                        <SupportAgentIcon/> Socratic Agent Discussions
                                    </Typography>
                                </Box>

                                {/*////////////////////// Update this section. map the saved chats here /////////////////////////////*/}
                                <Stack></Stack>

                            </Box>

                            <Box
                                height={'40vh'}
                                width={'55vw'}
                                bgcolor={col6}
                                borderRadius={'0.5em'}
                            >
                                <Box
                                    height={'8vh'}
                                    width={'100%'}
                                    borderBottom={"1px solid "+ col1}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    >
                                    <Typography
                                        color={col4}
                                        
                                    >
                                        <CodeIcon/> DSA problems
                                    </Typography>
                                </Box>

                                <Box
                                    height={'32vh'}
                                    width={'100%'}
                                    overflow={'auto'}
                                >
                                    {questions.questions.map((question) => (
                                            <Link
                                                underline="none"
                                                href={`./editor/${question.id}`}
                                            >
                                                <Box
                                                    key={question.id}
                                                    color={col4}
                                                    width={'100%'}
                                                    height={'5vh'}
                                                    boxSizing={'border-box'}
                                                    borderBottom={"1px solid "+ col1}
                                                    display={'flex'}
                                                    alignItems={'center'}
                                                    justifyContent={'space-between'}
                                                    sx={{'&:hover':{
                                                        bgcolor:col4,
                                                        color:col1
                                                    }}}
                                                >
                                                    <Typography
                                                        marginLeft={'1em'}
                                                    >{question.shortTitle}</Typography>
                                                    <Typography
                                                        marginRight={'1em'}
                                                    >
                                                        {question.difficulty}
                                                    </Typography>
                                                </Box>
                                            </Link>
                                    ))}
                                </Box>

                            </Box>

                            <Box
                                height={'40vh'}
                                width={'25vw'}
                                bgcolor={col6}
                                borderRadius={'0.5em'}
                            >
                                <Box
                                    height={'8vh'}
                                    width={'100%'}
                                    borderBottom={"1px solid "+ col1}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    >
                                    <Typography
                                        color={col4}
                                        
                                    >
                                        <BoltIcon/> Flashcards
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        
        </Box>
    )
}