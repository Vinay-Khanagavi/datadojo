'use client'

import { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  Link,
  ListItemText,
  Box 
} from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const col1 = ['#3D405B']; // Dark shade
const col2 = ['#E07A5F']; // red
const col3 = ['#81B29A']; // green
const col4 = ['#F4F1DE']; // white
const col5 = ['#F2CC8F']; // yellow
const col6 = ['#191c35']; // Darker shade

const CodeEditor = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [language, setLanguage] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {

    // Questions from json. Need to check this. Update the Json with more questions
    fetch('editor/questions.json')
      .then(response => response.json())
      .then(data => setQuestions(data.questions));
  }, []);

  const handleLanguageChange = (event, newValue) => {
    setLanguage(newValue);
  };

  const handleRunCode = () => {

    //Backend will go here
    setOutput('Output from backend');
    
    const newScore = score + 1;
    setScore(newScore);
    
    const scoresRef = ref(db, 'scores');
    const newScoreRef = push(scoresRef);
    set(newScoreRef, {
      score: newScore,
      timestamp: Date.now()
    });
  };

  const currentQuestion = questions[currentQuestionIndex] || { problemStatement: '', testCases: [] };

  return (
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
                    justifyContent={'center'}
                >

                </Box>
            </Box>
      <Box
          display="flex"
          flexDirection="row"
          bgcolor={col1}
          gap={2}
          width={'100vw'}
          height={'92vh'}
        >
        <Box
            flex={1}
            sx={{ p: 2 }}
        >
          <Paper
                elevation={3}
                sx={{ p: 2, mb: 2, bgcolor:col6, color:col4}}
                
            >
            <Typography variant="h6" gutterBottom>
              Problem Statement
            </Typography>
            <Typography variant="body1">
              {currentQuestion.problemStatement}
            </Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, bgcolor:col6, color: col4}}>
            <Typography variant="h6" gutterBottom>
              Test Cases
            </Typography>
            <List>
              {currentQuestion.testCases.map((testCase, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Input: ${testCase.input}`}
                    secondary={`Expected Output: ${testCase.expectedOutput}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Current Score: {score}
          </Typography>
        </Box>
        <Box flex={2} sx={{ p: 2, bgcolor:col1}}>
          <Paper elevation={3} sx={{ p: 2, bgcolor:col6, color: col4}}>
            <Tabs value={language} onChange={handleLanguageChange} aria-label="programming language tabs" sx={{color:col4}}>
              <Tab label="Python" sx={{color:col4}} />
              <Tab label="JavaScript" sx={{color:col4}} />
              <Tab label="C" sx={{color:col4}} />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={10}
                sx={{color:col4}}
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Enter your ${['Python', 'JavaScript', 'C'][language]} code here...`}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                sx={{bgcolor:col2}}
                startIcon={<PlayArrowIcon />}
                onClick={handleRunCode}
              >
                Run Code
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Output
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={output}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CodeEditor;
