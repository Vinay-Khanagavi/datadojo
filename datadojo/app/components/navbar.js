'use client';
import { Box, Link, Typography, Button, Stack, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";

//MUI Icons used: Keep adding here to have a consistent dependency
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';

import MoodIcon from '@mui/icons-material/Mood';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

//Import component
import useLogout from './logout';

//Import react components
import { useState, useEffect } from "react";
import { useRouter, usePathname} from "next/navigation";

//Import firebase config & firestore components
import {auth, db} from '../firebase';
import { collection, getDocs, query, orderBy } from "firebase/firestore";

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

const activeColor = col1;

const logout = useLogout();

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            setLoading(true);
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("score", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeaderboardData(data);
            setLoading(false);
        };

        fetchLeaderboardData();
    }, []);

    const NavButton = ({ href, icon, text }) => (
        <Button
            fullWidth
            href={href}
            sx={{
                color: col4,
                textTransform: 'none',
                padding: '1em',
                textAlign: 'left',
                justifyContent: 'flex-start',
                backgroundColor: isActive(href) ? activeColor : 'transparent',
                '&:hover': {
                    color: col1,
                    backgroundColor: isActive(href) ? activeColor : col4,
                }
            }}
        >
            <Box width='15%'>
                {icon}
            </Box>
            <Typography>
                {text}
            </Typography>
        </Button>
    );

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
                                <NavButton href="/dashboard" icon={<HomeIcon />} text="Dashboard" />
                                <NavButton href="/editor" icon={<CodeIcon />} text="Code Editor" />
                                <NavButton href="/fcgen" icon={<BoltIcon />} text="Flashcards" />
                                <NavButton href="/chat" icon={<SupportAgentIcon />} text="Socratic Bot" />
                                <NavButton href="/test" icon={<DynamicFormIcon />} text="Mock Test" />


                                <Button
                                    fullWidth
                                    onClick={handleOpen}
                                    
                                    sx={{color:col4,
                                        textTransform: 'none',
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    
                                    
                                    <Box
                                        width={'15%'}
                                    >
                                        <LeaderboardIcon />
                                    </Box>
                                    <Typography>
                                        Leaderboard
                                    </Typography>
                                </Button>

                                {/*/////////////// Modal ///////////////////*/}
                            
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box
                                        width={'40vw'}
                                        maxHeight={'50vh'}
                                        overflow={'auto'}
                                        sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        
                                        bgcolor: col6,
                                        color:col4,
                                        boxShadow: 24,
                                        p: 4,
                                    }}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                                            Leaderboard
                                        </Typography>
                                        {loading ? (
                                            <CircularProgress />
                                        ) : (
                                            <TableContainer
                                                component={Paper}
                                                sx={{
                                                    bgcolor:col4,
                                                    color:col4
                                                }}
                                            >
                                                <Table sx={{ minWidth: 350 }} aria-label="leaderboard table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Rank</TableCell>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell align="right">Score</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {leaderboardData.map((row, index) => (
                                                            <TableRow
                                                                key={row.id}
                                                                sx={{ 
                                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                                    backgroundColor: row.email === auth.currentUser?.email ? col3 : 'inherit'
                                                                }}
                                                            >
                                                                <TableCell component="th" scope="row">
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell>{row.name}</TableCell>
                                                                <TableCell align="right">{row.score}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </Box>
                                </Modal>
                                
                            </Box>
                            
                            <Box
                                width={'100%'}
                            >
                                
                                <Button
                                    fullWidth
                                    href='./profile/'
                                    sx={{color:col4,
                                        textTransform: 'none',
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <Box
                                        width={'15%'}
                                    >
                                        <Person4Icon/>
                                    </Box>
                                    <Typography>
                                        Profile
                                    </Typography>
                                    
                                </Button>
                                <Button
                                    fullWidth
                                    
                                    onClick={logout}
                                    sx={{color:col4,
                                        textTransform: 'none',
                                        padding:'1em',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <Box
                                        width={'15%'}
                                    >
                                        <LogoutIcon/>
                                    </Box>
                                    <Typography>
                                        Logout
                                    </Typography>
                                    
                                    
                                </Button>
                            </Box>
                            
                            

                        </Box>
                        )

}
export default Navbar;