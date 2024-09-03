'use client'
import user from '@clerk/nextjs';
import {useEffect, useState} from 'react';
import {db} from '../firebase';
import {doc, getDoc, setDoc, CollectionReference, collection} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import {Container, Box, Typography, Link, Button, Card, CardActionArea, CardContent} from '@mui/material'
import Grid from '@mui/material/Grid2'


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

export default function Flashcards(){

 //   const {isLoaded, isSIgnedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])

    useEffect(() => {
        async function getFlashcards(){
            const docRef = doc(collection(db, 'cards'))
            const docSnap = await getDoc(docRef)

            if(docSnap.exists())
            {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            }
            else
            {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()

    }, [user])


    

    const handleCardClick = (id) => {
        router.push('/flashcard?id=${id}')
    }
return(
    <Box
        width={'100vw'}
        minHeight={'100vh'}
        backgroundColor={col1}
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
                        <Grid container spacing={3}
                    
                    >
                        {flashcards.map((flashcard, index) =>
                            (  <Grid item xs={12} sm={6} md={4} key = {index}
                                
                                >
                                <Card
                                sx={{background:col1, borderRadius:'0.5em'}}
                                >
                                    <CardActionArea
                                        sx={{background:bgOne, borderRadius:'0.5em'}}
                                        onClick={() => {
                                            handleCardClick(index)
                                        }}
                                        backgroundColor={col1}
                                    >
                                        <CardContent
                                            sx={{background:bgOne, borderRadius:'0.5em'}}
                                        >
                                            <Box
                                                backgroundColor={col6}
                                                sx={{
                                                    fontWeight:'200',
                                                    perspective: '1000px',
                                                    '&>div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width:'100%',
                                                        height:'200px',
                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.6)',
                                                        transform: flipped[index]
                                                        ? 'rotateY(180deg)'
                                                        : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'absolute',
                                                        width:'100%',
                                                        height:'100%',
                                                        backfaceVisibility: "hidden",
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box'
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)'
                                                    },

                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography
                                                            variant="h5"
                                                            component="div"
                                                            color={col4}
                                                        >
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography
                                                            variant="h5"
                                                            component="div"
                                                            color={col4}
                                                        >
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                            )
                        )}
                    </Grid>
    </Box>







)
}