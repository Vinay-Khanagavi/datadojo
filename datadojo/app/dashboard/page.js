'use client'

import {Box, Link, Typography, Button, Stack} from "@mui/material"
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
import QuizIcon from '@mui/icons-material/Quiz';

//Components
import Navbar from '../components/navbar';

import {auth, db} from '../firebase';
import {collection, query, where, getDocs} from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLogout from '../components/logout';




const col6 = ['#3D405B']; // Dark shade
const col2 = ['#E07A5F']; // red
const col3 = ['#81B29A']; // green
const col4 = ['#F4F1DE']; // white
const col5 = ['#F2CC8F']; // yellow
const col1 = ['#191c35']; // Darker shade
const col7 = ['#5FA8D3']; //Blue


export default function Home(){

    // Redirect section
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [name, setName] = useState('');
    const [chats, setChats] = useState([]);
    const [cards, setCards] = useState([]);
    const handleLogout = useLogout();
    const [yourScore, setYourScore] = useState('');
    const [highestScore, setHighestScore] = useState('');
    
    
    const getMaxScore = async() => {
        try {
            const userRef = collection(db, "users");
            
            
            const querySnapshot = await getDocs(userRef);
            
            if (!querySnapshot.empty) {
              let maxScore = 0;
              
              
              querySnapshot.forEach((doc) => {
                const userData = doc.data();
                const userScore = userData.score;
                
                if (userScore > maxScore) {
                  maxScore = userScore;
                }
              });
              
              setHighestScore(maxScore); 
            }
        }
        catch(error)
        {
            console.error(error.message);
        }
   }

    const getNameByEmail = async (email) => {
        try {
          const userRef = collection(db, "users");
          const q = query(userRef, where("email", "==", email)); 
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            setName(userData.name); 
            setYourScore(userData.score);
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
        getMaxScore();
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
            overflow={'hidden'}
            display={'flex'}
            justifyContent={'space-between'}
        >
                    <Navbar />

                        {/*//////////////////////////// Navbar ends here /////////////////////////////////*/}
                        {/*////////////////////// Content container starts //////////////////////*/}
                    <Box
                        height={'100vh'}
                        width={'80vw'}
                    >
                        {/*////////////////////// Top colourful Box  starts //////////////////////*/}
                        <Box
                            width={'76vw'}
                            height={'20vh'}
                            bgcolor={col3}
                            margin={'3vh 2vw'}
                            borderRadius={'0.2em'}
                            padding={'1em'}
                            boxSizing={'border-box'}
                            display={'flex'}
                            flexDirection={'column'}
                            gap={1}
                        >
                            <Typography
                                variant="h6"
                            >
                                Kickstart your DSA learning journey with DataDojo's efficient and flexible platform
                            </Typography>
                            <Typography
                                variant="p"
                                fontWeight={'200'}
                            >
                                Global learning and Lorem Ipsum
                            </Typography>
                            <Box>
                                <Button
                                    variant="contained"
                                    display={'inline-block'}
                                    size="small"
                                    sx={{
                                        background:col6,
                                        '&:hover':
                                        {
                                            background:col4,
                                            color:col6
                                        }
                                    }}
                                >
                                    Start Learning
                                </Button>
                            </Box>
                            
                        </Box>

                        {/*////////////////////// Top colourful Box  ends //////////////////////*/}
                        
                        {/*////////////////////// Container Box starts here for three content boxes  //////////////////////*/}
                        <Box
                            width={'76vw'}
                            height={'80vh'}
                            display={'flex'}
                            flexDirection={'row'}

                            
                        >
                            <Box
                                width={'20vw'}
                                height={'70vh'}
                                margin={'0 1vw 0 2vw'}
                                bgcolor={col6}
                            >

                            </Box>
                            <Box
                                width={'25vw'}
                                height={'70vh'}
                                bgcolor={col6}
                                margin={'0 1vw 0 1vw'}
                            >

                            </Box>
                            <Box
                                width={'30vw'}
                                height={'70vh'}
                                margin={'0 0 0 1vw'}
                                bgcolor={col6}
                            >

                            </Box>
                        </Box>
                        <Box
                            height={'50vh'}
                            width={'80vw'}
                            display={'flex'}
                            justifyContent={'center'}
                            
                            alignItems={'center'}
                            flexWrap={'wrap'}
                            flexDirection={'row'}
                            boxSizing={'border-box'}
                        >
                            {/*///////////// First Box /////////////*/}
                            <Box
                                height={'40vh'}
                                width={'25vw'}
                                bgcolor={col4}
                                borderRadius={'0.5em'}
                                padding={'2em'}
                                margin={'3vh'}
                                boxSizing={'border-box'}
                                display={'flex'}
                                alignContent={'space-around'}
                                flexDirection={'column'}
                                justifyContent={'space-between'}
                            >
                                <Typography
                                    variant="h3"
                                    color={col1}
                                >Welcome, {name}!</Typography>
                                <Box
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    borderTop={'1px solid rgba(0,0,0,0.3)'}
                                    padding={'1em'}
                                >
                                    <Typography
                                        width={'100%'}
                                        textAlign={'center'}
                                        fontSize={'0.7em'}                                >
                                        Your Score 
                                        <Typography
                                            variant="span"
                                            padding={'0.2em 0.8em'}
                                            bgcolor={col3}
                                            color={col4}
                                            fontSize={'2.7em'}
                                            borderRadius={'0.5em'}
                                            margin={'0 0.2em'}
                                        >
                                            {yourScore}
                                        </Typography>
                                    </Typography>
                                    

                                    <Typography
                                        width={'100%'}
                                        textAlign={'center'}
                                        fontSize={'0.7em'}                                >
                                        High Score 
                                        <Typography
                                            variant="span"
                                            padding={'0.2em 0.8em'}
                                            fontSize={'2.7em'}
                                            bgcolor={col2}
                                            color={col4}
                                            borderRadius={'0.5em'}
                                            margin={'0 0.2em'}
                                        >
                                            {highestScore}
                                        </Typography>
                                    </Typography>
                                </Box>
                                
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
                                        <SupportAgentIcon/> Discussion Threads
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
                        </Box>
                        {/*//////////////////////// Container for 3rd and 4th Box //////////////////////////*/}
                        <Box
                            height={'43vh'}
                            width={'100vw'}
                            display={'flex'}
                            justifyContent={'center'}
                            
                            alignItems={'center'}
                            flexWrap={'wrap'}
                            flexDirection={'row'}
                            paddingBottom={'3vh'}
                        >

                            {/*/////////////////////////// Third Box /////////////////////////////////////*/}
                            

                            <Box
                                height={'43vh'}
                                width={'40vw'}
                                bgcolor={col6}
                                borderRadius={'0.5em'}
                                margin={'0 3vh'}
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
                                    height={'35vh'}
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
                                                        textAlign={'center'}
                                                    >{question.shortTitle}</Typography>
                                                    <Typography
                                                        marginRight={'1em'}
                                                        color={question.difficulty === 'easy' ? (
                                                            col3
                                                        ) : question.difficulty === 'medium' ? (
                                                            col5
                                                        ) : question.difficulty === 'hard' ? (
                                                            col2
                                                        ) : null}
                                                    >
                                                        
                                                        {question.difficulty === 'easy' ? (
                                                            <MoodIcon />
                                                        ) : question.difficulty === 'medium' ? (
                                                            <SentimentSatisfiedIcon />
                                                        ) : question.difficulty === 'hard' ? (
                                                            <MoodBadIcon />
                                                        ) : null}
                                                        
                                                    </Typography>
                                                </Box>
                                            </Link>
                                    ))}
                                </Box>

                            </Box>
                            {/*/////////////////////////// Fourth Box //////////////////////////////////*/}
                            <Box
                                height={'43vh'}
                                width={'40vw'}
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
                                        minWidth={'3em'}
                                        maxWidth={'5em'}
                                        minHeight={'6em'}
                                        padding={'1em 1em'}
                                        borderRadius={2}
                                        textAlign={'center'}
                                        sx={{
                                            '&:hover':
                                            {
                                                bgcolor:col4,
                                                color:col1
                                            }
                                        }}
                                        
                                    >
                                        <Typography
                                            variant="span"
                                            display={'inline-block'}
                                            width={'100%'}
                                            color={col5}
                                        >
                                            <BoltIcon />
                                        </Typography>
                                        
                                        {card}
                                    </Typography>
                                    </Link>
                                    
                                    ))}
                                </Box>

                            </Box>
                        </Box>
            </Box>
        </Box>
    )
}