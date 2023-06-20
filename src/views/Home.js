import React from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { Box, Typography, Card, CardContent } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    navigate("/create");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      padding="2rem"
      textAlign="center"
      style={{ backgroundColor: '#FFF2ED' }}
    >
      <Card elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Lectoreumへようこそ
          </Typography>
          
          <Typography variant="body1" component="p" gutterBottom>
            好きな教科は、ありますか。<br />
            嫌いな教科は、ありますか。<br />
            好きな先生がいたから、好きになった教科は、ありますか。<br />
            好きな教科がない人が、Lectoreumを通して、<br />
            少しでも興味を持てる分野が増えますように。
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        style={{ backgroundColor: '#FFB74D', color: 'white' }}
        size="large"
        onClick={handleButtonClick}
      >
        Click here
      </Button>
    </Box>
  );
};

export default Home;
