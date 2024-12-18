'use client'

import {Box, Link, Typography, Button, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material"
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
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';

//Components
import Navbar from '../components/navbar';

import {auth, db} from '../firebase';
import {collection, query, where, getDocs, doc, updateDoc,arrayUnion, arrayRemove, onSnapshot} from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLogout from '../components/logout';


export default function Home(){

    // State variables here please:
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [name, setName] = useState('');
    const [chats, setChats] = useState([]);
    const [cards, setCards] = useState([]);
    const handleLogout = useLogout();
    const [yourScore, setYourScore] = useState('');
    const [highestScore, setHighestScore] = useState('');
    const [appraisalCounts, setAppraisalCounts] = useState({});
    const [userEmail, setUserEmail] = useState('');
    
    
    // state variables for colour mode
    const [mode, setMode] = useState('dark');
    const [col1, setCol1] = useState('#191c35'); // Darker shade
    const [col2, setCol2] = useState('#E07A5F'); // red
    const [col3, setCol3] = useState('#81B29A'); // green
    const [col4, setCol4] = useState('#F4F1DE'); // white
    const [col5, setCol5] = useState('#F2CC8F'); // yellow
    const [col6, setCol6] = useState('#3D405B'); // Dark shade
    const [col7, setCol7] = useState('#5FA8D3'); //Blue
    const [col8, setCol8] = useState('#2b2d44'); //Darker shade




    // Function to fetch max score from db
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

   // Function to fetch chats and appraisals
   const getChatsWithAppraisals = async (email) => {
    const chatRef = collection(db, "threads");
    const querySnapshot = await getDocs(chatRef);
    const docTitles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
    }));
    const appraisals = {};
    docTitles.forEach(doc => {
        appraisals[doc.id] = doc.data.Appraisals ? doc.data.Appraisals.length : 0;
    });
    setChats(docTitles);
    setAppraisalCounts(appraisals);
};

const toggleAppraisal = async (threadId) => {
    console.log("userEmail:",userEmail);
    try {
        const threadDocRef = doc(db, "threads", threadId);
        const threadData = chats.find(chat => chat.id === threadId)?.data;
        
        if (threadData?.Appraisals?.includes(userEmail)) {
           
            await updateDoc(threadDocRef, {
                Appraisals: arrayRemove(userEmail)
            });
            setAppraisalCounts(prev => ({ 
                ...prev, 
                [threadId]: Math.max((prev[threadId] || 1) - 1, 0)
            }));
        } else {
            await updateDoc(threadDocRef, {
                Appraisals: arrayUnion(userEmail)
            });
            setAppraisalCounts(prev => ({ 
                ...prev, 
                [threadId]: (prev[threadId] || 0) + 1 
            }));
        }
        
        setChats(prevChats => 
            prevChats.map(chat => 
                chat.id === threadId
                    ? {
                        ...chat,
                        data: {
                            ...chat.data,
                            Appraisals: chat.data.Appraisals?.includes(userEmail)
                                ? chat.data.Appraisals.filter(email => email !== userEmail)
                                : [...(chat.data.Appraisals || []), userEmail]
                        }
                    }
                    : chat
            )
        );
    } catch (error) {
        console.error("Error updating appraisal: ", error);
    }
};


    const getNameByEmail = async (email) => {
        try {
          const userRef = collection(db, "users");
          const q = query(userRef, where("email", "==", email)); 
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            setName(userData.name);
            setUserEmail(email);
            setYourScore(userData.score);
            setMode(userData.mode);
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
                getChatsWithAppraisals(user.email);
                setIsLoading(false);
                getNameByEmail(user.email);


                // Add this section for colour modes
                const unsubs = onSnapshot(doc(db,"users",user.email), (doc) => {
                    if (doc.exists()) {
                      const userData = doc.data();
                      if (userData.mode) {
                        setMode(userData.mode);
                      }
                      if(userData.mode == "light")
                        {
                            setCol1('#EDE8E2');
                            setCol2('#E07A5F');
                            setCol3('#81B29A');
                            setCol4('#000');
                            setCol5('#F2CC8F');
                            setCol6('#F4F1ED');
                            setCol7('#5FA8D3');
                            setCol8('#FFF'); 
                        }
                        else
                        {
                            setCol1('#191c35');
                            setCol2('#E07A5F');
                            setCol3('#81B29A');
                            setCol4('#F4F1DE');
                            setCol5('#F2CC8F');
                            setCol6('#3D405B');
                            setCol7('#5FA8D3');
                            setCol8('#2b2d44');
                        }
                    }
                  });
                  return () => {
                    unsubs();
                };
                    // Colour modes' section ends here
                
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
                                    href="./chat"
                                    sx={{
                                        background:col6,
                                        color:col4,
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
                            width={'80vw'}
                            height={'80vh'}
                            display={'flex'}
                            flexDirection={'row'}
                        >
                            {/*///////////////// Chat threads box  //////////////////////////*/}
                            <Box
                                width={'20vw'}
                                height={'70vh'}
                                margin={'0 1vw 0 2vw'}
                                bgcolor={col6}
                            >
                                    <Box
                                    height={'12vh'}
                                    width={'100%'}

                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    flexDirection={'column'}
                                >
                                    <Typography
                                        color={col4}
                                        variant="h6"
                                    >
                                         Bot Threads
                                    </Typography>
                                    <Typography
                                        variant="p"
                                    >

                                    </Typography>
                                    <ToggleButtonGroup
                                        color="secondary"
                                        exclusive
                                        sx={{color:col4,
                                            fontSize:'0.8em'
                                        }}
                                        >
                                            <ToggleButton value="private" sx={{color:col4}}>
                                                <Typography>
                                                    <PersonIcon/>
                                                </Typography>
                                            </ToggleButton>
                                            <ToggleButton value="public" sx={{color:col4}}>
                                                <Typography
                                                    fontSize={'0.8em'}
                                                >
                                                    <PublicIcon/>
                                                </Typography>
                                            </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>

                                {/*////////////////////// the saved chats here /////////////////////////////*/}
                                <Box
                                    height={'58vh'}
                                    width={'100%'}
                                    overflow={'auto'}
                                    padding={'0.5em'}
                                    boxSizing={'border-box'}
                                >
                                    {chats.map((chat) =>(
                                    
                                        <Box
                                        key={chat}
                                        color={col4}
                                        boxSizing={'border-box'}
                                        bgcolor={col8}
                                        width={'100%'}
                                        padding={'0.8em'}
                                        marginTop={'5px'}
                                        borderRadius={'0.2em'}
                                        display={'flex'}
                                        justifyContent={'space-between'}
                                        sx={{
                                            '&:hover':
                                            {
                                                bgcolor:col4,
                                                color:col1
                                            }
                                        }}
                                        
                                    >
                                        <Link
                                            underline="none"
                                            href={`./chats/${chat.id}`}
                                            color="inherit"
                                        >
                                            <Typography>{chat.id}</Typography>
                                        </Link>
                                        <Button
                                            sx={{color:col2}}
                                            onClick={() => toggleAppraisal(chat.id)}
                                        >
                                            {appraisalCounts[chat.id] || 0}<WhatshotIcon/>
                                        </Button>
                                    </Box>
                                   
                                    
                                    ))}
                                </Box>
                            </Box>
                            {/*/////////////////// First box finishes here  ///////////////////////////////*/}

                            {/*///////////////////// Second Box starts here ////////////////////////////*/}
                            <Box
                                width={'25vw'}
                                height={'70vh'}
                                bgcolor={col6}
                                margin={'0 1vw 0 1vw'}
                            >
                                    <Box
                                    height={'8vh'}
                                    width={'100%'}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    >
                                    <Typography
                                        color={col4}
                                    >
                                        Flashcards Collection
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
                                        bgcolor={col8}
                                        minWidth={'3em'}
                                        maxWidth={'8em'}
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
                            {/*///////////////////// Second Box ends here ////////////////////////////*/}

                            {/*///////////////////// Third Box starts here ////////////////////////////*/}
                            <Box
                                width={'27vw'}
                                height={'70vh'}
                                margin={'0 0 0 1vw'}
                                bgcolor={col6}
                            >
                                <Box
                                    height={'8vh'}
                                    width={'100%'}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    >
                                    <Typography
                                        color={col4}
                                        
                                    >
                                        Problems
                                    </Typography>
                                </Box>

                                <Box
                                    height={'62vh'}
                                    width={'100%'}
                                    overflow={'auto'}
                                    padding={'0.5em'}
                                    boxSizing={'border-box'}
                                >
                                    {questions.questions.map((question) => (
                                            <Link
                                                underline="none"
                                                href={`./editor/${question.id}`}
                                            >
                                                <Box
                                                    key={question.id}
                                                    color={col4}
                                                    bgcolor={col8}
                                                    width={'100%'}
                                                    boxSizing={'inherit'}
                                                    borderRadius={'0.2em'}
                                                    height={'5vh'}
                                                    margin={'5px auto'}
                                                    padding={'0.4em 0'}
                                                    
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

                            {/*///////////////////// Third Box ends here ////////////////////////////*/}
                        </Box>


                        
            </Box>
        </Box>
    )
}