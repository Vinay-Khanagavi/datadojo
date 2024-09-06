'use client';

import { Paper, Typography, Tabs, Tab, Button, TextField, List, ListItem, ListItemText, Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase';
import questions from '../questions.json'; // Direct import from JSON

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import {useEffect, useState} from 'react';

export default function ProblemSolver() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // For Handling undefined or non-integer id gracefully
  

  const col1 = ['#3D405B']; // Dark shade
  const col2 = ['#E07A5F']; // red
  const col3 = ['#81B29A']; // green
  const col4 = ['#F4F1DE']; // white
  const col5 = ['#F2CC8F']; // yellow
  const col6 = ['#191c35']; // Darker shade

  const [language, setLanguage] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [score, setScore] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState('');

  const handleLanguageChange = (event, newValue) => {
    setLanguage(newValue);
  };


  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setSelectedQuestionId(question.id);
    setCode('');
    setOutput('');
  };



  const handleRunCode = async () => {
  try {

    const messages = [
      {
        role: "system",
        content: "You are a code execution engine that runs code and validates it against test cases.",
      },
      {
        role: "user",
        content: `Here is the code:\n${code}\nTest cases input:\n${JSON.stringify(testCase.input)}`,
      },
    ];

    const response = await fetch('/api/editor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break; 
      }
      result += decoder.decode(value, { stream: true });
    }

    console.log(result); // Process the result
    return result;
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
};






  return (
    <Box width="100vw" height="100vh" bgcolor={col1}>
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

      <Box display="flex" flexDirection="row" bgcolor={col1} gap={2} width="100vw" height="92vh">
        <Box flex={1} sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: col6, color: col4 }}>
            <Typography variant="h6" gutterBottom>
              Problem Statement
            </Typography>
            <Box height={'20vh'} width={'100%'} overflow={'auto'}>
              {questions.questions.map((question) => (
                <Box
                  key={question.id}
                  onClick={() => handleQuestionSelect(question)}
                  color={selectedQuestionId === question.id ? col1 : col4}
                  bgcolor={selectedQuestionId === question.id ? col3 : col1}
                  width={'100%'}
                  padding={'10px 0'}
                  boxSizing={'border-box'}
                  borderBottom={"1px solid "+ col1}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  sx={{
                    '&:hover':{
                      bgcolor:col4,
                      color:col1
                    },
                    cursor: 'pointer'
                  }}
                >
                  <Typography marginLeft={'1em'}>{question.problemStatement}</Typography>
                  <Typography marginRight={'1em'}>{question.difficulty}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
          {selectedQuestion && (
            <Paper elevation={3} sx={{ p: 2, bgcolor: col6, color: col4 }}>
              <Typography variant="h6" gutterBottom>
                Test Cases for {selectedQuestion.shortTitle}
              </Typography>
              <Box
                height={'30vh'}
                overflow={'auto'}
              >
              <List>
                {selectedQuestion.testCases.map((testCase, index) => (
                  <ListItem key={index} color={col4}>
                    <ListItemText primary={`Input: ${testCase.input}`} secondary={`Expected Output: ${testCase.expectedOutput}`}
                       sx={{ 
                        "& .MuiTypography-root": { // Targeting the secondary text
                          color: col3 // Your desired color
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              </Box>
            </Paper>
          )}
          <Paper
              elevation={3} sx={{ p: 2, mb: 2, bgcolor: col6, color: col4 }} marginTop={'2'}
          >
            <Typography variant="h6" sx={{ mt: 2 }}>
              Current Score: {score}
            </Typography>
          </Paper>
          
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
                sx={{
                  '& .MuiInputBase-input': {
                    color: col4, // Set the text color to white
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: col4, // Optionally, set the border color to white
                  },
                  '& .MuiInputLabel-root': {
                    color: col4, // Set the label color to white
                  },
                }}
                inputProps={{
                  style: { color: col4 }, // Ensure the entered text color is white
                }}
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
