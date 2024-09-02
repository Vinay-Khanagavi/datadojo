'use client';

import { useRouter } from 'next/router';
import { Paper, Typography, Tabs, Tab, Button, TextField, List, ListItem, ListItemText, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase';
import questions from './editor/questions.json'; // Direct import from JSON

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import Link from 'next/link';

export default function ProblemSolver() {
  const router = useRouter();
  const { id } = router.query;

  // For Handling undefined or non-integer id gracefully
  const question = questions.questions.find(q => q.id === parseInt(id)) || null;

  const col1 = '#3D405B'; // Dark shade
  const col2 = '#E07A5F'; // Red
  const col4 = '#F4F1DE'; // White
  const col6 = '#191c35'; // Darker shade

  const [language, setLanguage] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [score, setScore] = useState(0);

  const handleLanguageChange = (event, newValue) => {
    setLanguage(newValue);
  };

  const handleRunCode = () => {
    // Simulate backend code execution
    setOutput('Output from backend');


    const newScore = score + 1;
    setScore(newScore);

    const scoresRef = ref(db, 'scores');
    const newScoreRef = push(scoresRef);
    set(newScoreRef, {
      score: newScore,
      timestamp: Date.now(),
    });
  };


  if (!id || !question) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box width="100vw" height="100vh" bgcolor={col1}>
      <Box width="92vw" height="8vh" display="flex" justifyContent="space-between" alignItems="center" padding="0 4vw">
        <Typography color={col4} margin="0.5em" fontSize="2em">
          <Link href="/">Learn Buddy</Link>
        </Typography>
        <Box display="flex" justifyContent="space-around" width="30vw">
          <Button href="/dashboard/" sx={{ color: col4, '&:hover': { color: col1, backgroundColor: col4 } }}>
            <HomeIcon />
          </Button>
          <Button href="/editor/" sx={{ color: col4, '&:hover': { color: col1, backgroundColor: col4 } }}>
            <CodeIcon />
          </Button>
          <Button href="/chat/" sx={{ color: col4, '&:hover': { color: col1, backgroundColor: col4 } }}>
            <SupportAgentIcon />
          </Button>
          <Button href="/fcgen/" sx={{ color: col4, '&:hover': { color: col1, backgroundColor: col4 } }}>
            <BoltIcon />
          </Button>
        </Box>
        <Button href="/profile/" sx={{ color: col4, '&:hover': { color: col1, backgroundColor: col4 } }}>
          <Person4Icon />
        </Button>
      </Box>

      <Box display="flex" flexDirection="row" bgcolor={col1} gap={2} width="100vw" height="92vh">
        <Box flex={1} sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: col6, color: col4 }}>
            <Typography variant="h6" gutterBottom>
              Problem Statement
            </Typography>
            <Typography variant="body1">{question.problemStatement}</Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, bgcolor: col6, color: col4 }}>
            <Typography variant="h6" gutterBottom>
              Test Cases
            </Typography>
            <List>
              {question.testCases.map((testCase, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`Input: ${testCase.input}`} secondary={`Expected Output: ${testCase.expectedOutput}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Current Score: {score}
          </Typography>
        </Box>

        <Box flex={2} sx={{ p: 2, bgcolor: col1 }}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: col6, color: col4 }}>
            <Tabs value={language} onChange={handleLanguageChange} sx={{ color: col4 }}>
              <Tab label="Python" sx={{ color: col4 }} />
              <Tab label="JavaScript" sx={{ color: col4 }} />
              <Tab label="C" sx={{ color: col4 }} />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={10}
                sx={{ color: col4 }}
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Enter your ${['Python', 'JavaScript', 'C'][language]} code here...`}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" sx={{ bgcolor: col2 }} startIcon={<PlayArrowIcon />} onClick={handleRunCode}>
                Run Code
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Output
              </Typography>
              <TextField fullWidth multiline rows={4} variant="outlined" value={output} InputProps={{ readOnly: true }} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
