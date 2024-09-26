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

return(
<Box
    width={'100vw'}
    height={'100vh'}
    overflow={'hidden'}
    display={'flex'}
    flexDirection={'row'}

>
        <Navbar/>

        <Box
            width={'80vw'}
            height={'100vh'}
            bgcolor={col1}
            display={'flex'}
            flexDirection={'column'}

        >
            <Box
                width={'76vw'}
                height={'20vh'}
                margin={'4vh 2vw 2vh 2vw'}
                bgcolor={col6}
                borderRadius={'0.2em'}
            >
            </Box>
            <Box
                width={'76vw'}
                height={'70vh'}
                margin={'0 2vw 4vh 2vw'}
                bgcolor={col6}
            >

            
            </Box>
        </Box>
</Box>


);


}