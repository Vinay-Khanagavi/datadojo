'use client'

import {Box, Link, Typography, Button, Stack} from "@mui/material"
import questions from '../editor/questions.json';

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import { CircularProgress } from "@mui/material";

import {auth, db} from '../firebase';
import {collection, query, where, getDocs} from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLogout from '../components/logout';

const col1 = ['#3D405B']; // Dark shade
const col2 = ['#E07A5F']; // red
const col3 = ['#81B29A']; // green
const col4 = ['#F4F1DE']; // white
const col5 = ['#F2CC8F']; // yellow
const col6 = ['#191c35']; // Darker shade

export default function Home(){

    // Redirect section
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [name, setName] = useState('');
    const [chats, setChats] = useState([]);
    const [cards, setCards] = useState([]);
    const handleLogout = useLogout();

    const getNameByEmail = async (email) => {
        console.log(email)
        try {
          const userRef = collection(db, "users");
          const q = query(userRef, where("email", "==", email)); 
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            setName(userData.name); 
          } else {
            console.log("No user found with this email.");
            setAuthError("User data not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthError(error.message);
        }
      };

      const getChats = async() => {
        const chatRef = collection(db, "threads");
        const querySnapshot = await getDocs(chatRef);
        const docTitles = querySnapshot.docs.map((doc) => doc.id);
        setChats(docTitles);
      }

      const getCards = async() => {
        const cardsRef = collection(db, "cards");
        const qSnap = await getDocs(cardsRef);
        const cardTitles = qSnap.docs.map((doc) => doc.id);
        setCards(cardTitles);

      }

    useEffect(() => {
        getCards();
        getChats();
        console.log("Component mounted, starting auth check");
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                console.log("Auth check timed out");
                setAuthError("Authentication check timed out");
                setIsLoading(false);
            }
        }, 1200000); 

        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("Auth state changed:", user ? "User logged in" : "User not logged in");
            if (user) {
                console.log("User authenticated, setting loading to false");
                setIsLoading(false);
                getNameByEmail(user.email);
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


        // Redirect section ends

        
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
                                >Welcome, {name}!</Typography>
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

                                {/*////////////////////// the saved chats here /////////////////////////////*/}
                                <Box
                                    display={'flex'}
                                    margin={1}
                                    gap={1}
                                    overflow={'auto'}
                                    flexWrap={'wrap'}
                                >
                                    {chats.map((chat) =>(
                                    <Link
                                        underline="none"
                                        href={`./chats/${chat}`}
                                    >
                                        <Typography
                                        key={chat}
                                        color={col4}
                                        bgcolor={col1}
                                        padding={'0.5em 1em'}
                                        borderRadius={2}
                                        sx={{
                                            '&:hover':
                                            {
                                                bgcolor:col4,
                                                color:col1
                                            }
                                        }}
                                        
                                    >
                                        {chat}
                                    </Typography>
                                    </Link>
                                    
                                    ))}
                                </Box>
                                


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
                                
                                <Box
                                    display={'flex'}
                                    height={'32vh'}
                                    margin={1}
                                    gap={1}
                                    overflow={'auto'}
                                    flexWrap={'wrap'}
                                    
                                >
                                    {cards.map((card) =>(
                                    <Link
                                        underline="none"
                                        href={`./flashcards/${card}`}
                                    >
                                        <Typography
                                        key={card}
                                        color={col4}
                                        bgcolor={col1}
                                        padding={'1em 1em'}
                                        borderRadius={2}
                                        sx={{
                                            '&:hover':
                                            {
                                                bgcolor:col4,
                                                color:col1
                                            }
                                        }}
                                        
                                    >
                                        {card}
                                    </Typography>
                                    </Link>
                                    
                                    ))}
                                </Box>

                            </Box>
                        </Box>
                        
        </Box>
    )
}