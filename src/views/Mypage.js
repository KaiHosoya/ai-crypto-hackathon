import React, { useState, useEffect } from "react";
import { tokenURIs } from "../api/ether.js";
import { AppBar, Box, Button, Card, CardContent, CardMedia, Typography, Grid, Toolbar, IconButton, Modal, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const Mypage = () => {
  const [nfts, setNfts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentNFT, setCurrentNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNFTs = async () => {
      const walletAddress = "0x2003d72269b38D6F4be2ac844362AA5024425EEF";
      const tokens = await tokenURIs(walletAddress);

      const nftsData = await Promise.all(tokens.map(async ({ tokenId, tokenURI }) => {
        const response = await fetch(tokenURI);
        const data = await response.json();
        return {
          tokenId,
          image: data.image,
          name: data.name,
          description: data.description,
        };
      }));

      setNfts(nftsData);
      setIsLoading(false);
    };

    fetchNFTs();
  }, []);

  const openModal = (nft) => {
    setCurrentNFT(nft);
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setCurrentNFT(null);
    setModalIsOpen(false);
  }

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: '#9AAC8C' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate('/create')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My page
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {isLoading ? (
          // ローディング画面表示
          <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "calc(100vh - 64px)" }}>
            <CircularProgress />
          </Grid>
        ) : (
          // NFTのリスト表示
          <Grid container spacing={2}>
            {nfts.map((nft, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={nft.image}
                    alt={`NFT ${nft.tokenId}`}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">{nft.name}</Typography>
                    <Button variant="outlined" color="primary" onClick={() => openModal(nft)}>
                      Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="nft-details-modal-title"
        aria-describedby="nft-details-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          {currentNFT && (
            <Box>
              <Typography variant="h5" component="div" gutterBottom id="nft-details-modal-title">
                {currentNFT.name}
              </Typography>
              <CardMedia
                component="img"
                height="140"
                image={currentNFT.image}
                alt={`NFT ${currentNFT.tokenId}`}
                style={{ width: "100%", height: "auto" }}
              />
              <Typography variant="body1" gutterBottom id="nft-details-modal-description">
                {currentNFT.description}
              </Typography>
              <Button variant="contained" color="secondary" onClick={closeModal}>
                Close
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Mypage;