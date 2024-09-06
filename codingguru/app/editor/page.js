'use client';

import { Paper, Typography, Tabs, Tab, Button, TextField, List, ListItem, ListItemText, Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase';
import questions from './questions.json'; // Direct import from JSON
import useLogout from '../components/logout';
import Editor from '@monaco-editor/react';

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import {useEffect, useState} from 'react';
import LogoutIcon from '@mui/icons-material/Logout';


export default function ProblemSolver() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // For Handling undefined or non-integer id gracefully
  

  const col6 = ['#3D405B']; // Dark shade
  const col2 = ['#E07A5F']; // red
  const col3 = ['#81B29A']; // green
  const col4 = ['#F4F1DE']; // white
  const col5 = ['#F2CC8F']; // yellow
  const col1 = ['#191c35']; // Darker shade

  const [language, setLanguage] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [score, setScore] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const handleLogout = useLogout();


  const handleLanguageChange = (event, newValue) => {
    setLanguage(newValue);
  };

  const languages = ['python', 'javascript', 'c'];



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
        content: `Here is the code:\n${code}\nTest cases:\n${JSON.stringify(selectedQuestion.testCases)}`,
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
    setOutput(result);
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
                                        borderBottom:`4px solid ${col4}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4,
                                                    
                                        }

                                    }}
                                >
                                    <HomeIcon display={'block'} />
                                    
                                </Button>
                                <Button
                                    href='./editor/'
                                    sx={{color:col2,
                                        borderBottom:`4px solid ${col2}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col2
                                        }

                                    }}
                                >
                                    <CodeIcon />
                                </Button>
                                <Button
                                    href='./chat/'
                                    sx={{color:col3,
                                        borderBottom:`4px solid ${col3}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col3
                                        }

                                    }}
                                >
                                    <SupportAgentIcon />
                                </Button>
                                <Button
                                    href='./fcgen/'
                                    sx={{color:col5,
                                        borderBottom:`4px solid ${col5}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col5
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
              
              <Editor
                  height="30vh"
                  language={languages[language]} // Switches the editor language dynamically
                  value={code}
                  theme="vs-dark"
                  onChange={(value) => setCode(value)}
                  options={{
                    fontSize: 18, // Set the font size
                    fontFamily: ' monospace', // Set the font family
                    lineHeight: 22, // Optional: Adjust the line height
                    
                  }}
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
              <TextField sx={{
                            '& .MuiOutlinedInput-root': {
                              '& .MuiInputBase-input': {
                                color: col4, // Change the font color
                              },
                            },
                          }}
                          fullWidth multiline rows={6} variant="outlined" value={output} InputProps={{ readOnly: true }}>
                {output}
              </TextField>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
