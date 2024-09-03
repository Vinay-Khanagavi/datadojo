'use client'

import { collection, writeBatch, doc, getDoc} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Container,Link, Typography, Card, Box,Grid, Paper, TextField, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useState} from "react";
import {db} from '../firebase';
import Head from 'next/head';


import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';


const col1 = ['#3D405B'] // Dark shade
const col2 = ['#E07A5F'] //red
const col3 = ['#81B29A'] //green
const col4 = ['#F4F1DE'] //white
const col5 = ['#F2CC8F'] //yellow
const col6 = ['#191c35']; // Darker shade

export default function Generate(){

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
        }, 10000); // 10 second timeout

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
                <Typography variant="h4">Loading...</Typography>
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

    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()
    
    const handleSubmit =async() =>{
        
        fetch('api/fcgen',{
            method: 'POST',
            body:text,
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
        console.log(flashcards)
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))

    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    
    const saveFlashcards = async() => {
        if(!name)
        {
            alert('Please enter a name')
            return
        }
        const batch = writeBatch(db)
        const userDocRef =  doc(collection(db, 'cards'), user.id)
        const docSnap = await getDoc(userDocRef)

        if(docSnap.exists())
        {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name))
            {
                alert("Flashcard collection with the same name exists")
                return
            }
            else
            {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else
        {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        });

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    const bgOne = '#40407a'
    const bgTwo = '#706fd3'
    const bgThree = "#fff"

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
            <Box
                sx={{mt:4, mb:6, display:'flex', flexDirection: 'column', alignItems: 'center'}}
                backgroundColor ={col1}
                
                justifyContent={'center'}
                alignContent={'center'}
            >
                <Typography
                    fontSize={'1.5em'}                    color={col4}
                    fontWeight={100}
                >
                    Generate flashcards and save them in your account
                </Typography>
                <Paper
                    sx={{p:4, backgroundColor: '#1e272e', borderRadius:'0.5em', border:'1px solid #706fd3'}}
                    padding={2}
                    width={{md:'80%',sm:'80%',xs:'80%'}}
                    
                >
                    <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    
                    label="Enter prompt"
                    fullWidth
                    rows={4}
                    borderColor={'#fff'}
                    multiline
                    variant="standard"
                    sx = {{
                        mb:2,
                        color:'#fff',
                        '& .MuiInputBase-root': {
                            color: 'white',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',  // Outline color
                          },
                          '& .MuiInputLabel-root': {
                            color: 'white',  // Label color
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',  // Outline color when focused
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'white',  // Label color when focused
                    }}}
                    />
                    <Button
                        variant='contained'
                        
                        onClick={handleSubmit}
                        
                    >
                        Submit
                    </Button>
                </Paper>
            </Box>
            {
                flashcards.length>0 && (<Box sx={{mt:4}}>
                    <Typography variant="h5">
                        Flashcards Preview
                    </Typography>
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

                    <Box sx={{mt:4, display:'flex', justifyContent:'center'}}>
                        <Button
                            variant="contained"
                            onClick={handleOpen}
                            sx={{
                                backgroundColor:col3
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle
                >
                    Save Flashcards
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    >

                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
            </Box>
        

    )
}