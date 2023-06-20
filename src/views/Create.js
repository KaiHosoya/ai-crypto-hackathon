import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Select,
  MenuItem,
  TextField,
  Paper,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Box,
  Dialog
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PlayCircleOutline } from '@mui/icons-material';

import "../styles/create.css";
import AudioRecorder from './AudioRecorder';
import { CreateTableOfContents } from '../api/ec2';


const LeftPanel = ({ onGenerate }) => {
  const [theme, setTheme] = useState('');
  const [speaker, setSpeaker] = useState('Bill Gates');

  return (
    <Grid container direction="column" spacing={2}>
      <h1>Choose your teacher</h1>
      <Grid item sx={{ mb: 2 }}>
        <Typography variant="h6">Select a character</Typography>
        <Select fullWidth variant="outlined" value={speaker} onChange={(e) => {setSpeaker(e.target.value)}}>
          <MenuItem value={"Bill Gates"}>Bill Gates</MenuItem>
          <MenuItem value={"Albert Einstein"}>Albert Einstein</MenuItem>
          <MenuItem value={"Steve Jobs"}>Steve Jobs</MenuItem>
          <MenuItem value={"Michael Jackson"}>Michael Jackson</MenuItem>
          <MenuItem value={"Martin Luther King Jr."}>Martin Luther King Jr.</MenuItem>
        </Select>
      </Grid>
      <h1>Enter your topic of interest</h1>
      <Grid item sx={{ mb: 2 }}>
        <Typography variant="h6">Please enter a topic of interest (if blank, randomly generated)</Typography>
        <TextField fullWidth variant="outlined" placeholder="Enter text here" 
          onChange={(e) => setTheme(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={ () => onGenerate(theme, speaker)}>
          Generate
        </Button>
      </Grid>
    </Grid>
  );
};

const RightPanel = ({ isLoading, response, onListItemClick, onClose, isModalOpen }) => {
  return (
    <Dialog open={isModalOpen} onClose={onClose} fullWidth maxWidth="md">
      <Grid container justifyContent="center" alignItems="center" sx={{ p: 3 }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
            <Grid container spacing={2}>
              {response &&
                Object.values(response.contents).map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Card sx={{ my: 1 }}>
                      <CardContent>
                        <CardHeader
                          title={
                            <Typography variant="body1">
                              {index + 1}. {item}
                            </Typography>
                          }
                          action={
                            <IconButton onClick={() => onListItemClick(item)}>
                              <PlayCircleOutline />
                            </IconButton>
                          }
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        )}
      </Grid>
    </Dialog>
  );
};

const Create = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [speaker, setSpeaker] = useState('Einstein');

  const navigate = useNavigate();

  const handleGenerate = async (theme, speaker) => {
    setSpeaker(speaker);
    try {
      setIsLoading(true);
      await CreateTableOfContents(theme)
      .then((response) => {
        console.log("respo:", response);
        setResponse(response);
        setIsModalOpen(true);
        return response;
      }
      )
      .catch((error) => {
        console.log("error:" ,error);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListItemClick = (item) => {
    console.log("response", response);
    navigate('/details', { state: { selectedItem: item, fullList: response, id:  response.id, speaker: speaker} });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <AppBar position="static" color="primary" sx={{ backgroundColor: '#9AAC8C' }}>
          <Toolbar>
            <Typography variant="h3" component="div" sx={{ color: 'black', textShadow: "6px 3px 0px #868996"}}>
              LECTOREUM
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="md">
          <Box sx={{ mt: 4 }}>
            {/* <AudioRecorder /> */}

            <Box sx={{ mt: 4, paddingTop: 20 }}>
              <LeftPanel onGenerate={handleGenerate} />
              <RightPanel
                isLoading={isLoading}
                response={response}
                onListItemClick={handleListItemClick}
                onClose={handleCloseModal}
                isModalOpen={isModalOpen}
              />
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Create;
