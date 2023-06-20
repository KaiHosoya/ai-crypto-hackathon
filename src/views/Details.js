import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CircularProgress,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  Box,
  CardContent,
  CardMedia,
  Button,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NftIcon from '@mui/icons-material/AccountBalanceWallet';
import { pinJSONToIPFS } from '../api/pinata.js';
import { mintNFT } from '../api/ether.js';
import "../styles/details.css";
import { CreateContent } from '../api/ec2.js';

const RightPanel = ({ selectedItem, onComplete, id, speaker }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await CreateContent(selectedItem, id, speaker)
        .then((res) => {
          console.log("data: ", res);
          setData(res?.data);
          setIsLoading(false);
        }
      );
      console.log("selectedItem: ", selectedItem);
      console.log("id: ", id);
      console.log("speaker: ", speaker);
    };
    fetchData();
  }, [id, selectedItem, speaker]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!data) {
    return <Typography variant="h6">データがありません</Typography>;
  }
  const listItems = data.key_points.split('\n').filter(item => item.trim() !== '').map(item => {
    const cleanItem = item.replace(/"\d+":\s*/, '');
    return cleanItem;
  });


  return (
    <Grid item xs={12} sm={6} style={{ textAlign: 'center', borderLeft: '1px solid #ccc' }}>
        <CardMedia
          component="audio"
          controls
          src={data?.url}
          aria-label="audio player"
        />
        <CardContent>
          <Box
            sx={{
              backgroundColor: '#2c5f2d', // 黒板風の緑色
              color: '#c5c8c6', // チョーク風の文字色
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'Chalkboard, sans-serif',
              fontSize: '18px'
            }}
          >
            <ol style={{paddingLeft: "5px"}}>
              {listItems.map((item, index) => (
                // インデックスをキーとして使用し、テキストをリストアイテムとしてレンダリング
                <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
              ))}
            </ol>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" style={{ backgroundColor: "black", fontSize: 20, fontFamily: "italic" }} onClick={onComplete} fullWidth>
              Finished Listening!!
            </Button>
          </Box>
        </CardContent>
    </Grid>
  );
};

RightPanel.propTypes = {
  selectedItem: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
};

const ConnectWalletButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' }); // Added optional chaining
      if (accounts) {
        const account = accounts[0];
        setAddress(account);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  if (isConnected) {
    return (
      <Typography variant="body1">
        Your address: {address}
      </Typography>
    );
  }

  return (
    <Button variant="contained" color="primary" onClick={connectWallet}>
      Connect Wallet
    </Button>
  );
};

const Details = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(location.state.selectedItem);
    const speaker = location.state.speaker;
    const themeId = location.state.id;
    const fullList = location.state.fullList;
    const [completedItems, setCompletedItems] = useState({});
    const [loadingStatus, setLoadingStatus] = useState(null);
  
    const handleListItemClick = (item) => {
      setSelectedItem(item);
    };

    const createNFT = async (selectedItem) => {
      try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
          alert("Please install MetaMask to issue NFT.");
          return;
        }
    
        setLoadingStatus('uploadingToIPFS'); // IPFSへのアップロードを開始
        const metadata = {
          name: selectedItem,
        };
        const pinataUrl = await pinJSONToIPFS(metadata);
        
        setLoadingStatus('mintingNFT'); // NFTの発行を開始
        
        const accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' });
        if (accounts) {
          const account = accounts[0];
          console.log("Account:", account);
          console.log("Creating NFT...");
          await mintNFT(account, pinataUrl)
          .then(() => {
            console.log("NFT minted!");
            setLoadingStatus('completed');
          })          
          .catch((err) => {
            console.log("Error minting NFT:", err);
          });
          
        }
      } catch (error) {
        console.error("Failed to create NFT", error);
      } 
      console.log("status: ", loadingStatus);
    };    
  
    const handleComplete = () => {
      setCompletedItems({
        ...completedItems,
        [selectedItem]: true,
      });
    };
  
    const allCompleted = Object.values(fullList).every(
      (item) => completedItems[item]
    );
  
    return (
      <>
        <div className="area" >
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
        </div>
        <AppBar position="static" color="primary" sx={{ backgroundColor: '#9AAC8C' }}>
          <Toolbar>
            <Typography variant="h3" component="div" sx={{ color: 'black', textShadow: "6px 3px 0px #868996"}}>
              LECTOREUM
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="md">
          <Box mt={4} mb={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3" component="div">Table of Contents</Typography>
            <Button variant="contained" color="secondary" onClick={() => navigate("/create")}>Back to Create</Button>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} container alignItems="flex-start" style={{ textAlign: 'left', paddingLeft: '16px' }}>
              <List style={{ width: '100%' }}>
                {fullList &&
                  Object.values(fullList.contents).map((item, index) => (
                    <ListItem
                      button
                      key={index}
                      selected={item === selectedItem}
                      onClick={() => handleListItemClick(item)}
                      style={{ justifyContent: 'space-between' }}
                    >
                      <Typography variant="body1">{item}</Typography>
                      <ListItemIcon>
                        {completedItems[item] && <CheckCircleIcon color="primary" />}
                      </ListItemIcon>
                    </ListItem>
                  ))}
              </List>
            </Grid>

            <RightPanel selectedItem={selectedItem} onComplete={handleComplete} id={themeId} speaker={speaker} />
          </Grid>
          {allCompleted && (
            <Box mt={2} textAlign="center">
              {/* // metamaskと接続するボタン */}
              <ConnectWalletButton />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<NftIcon />}
                onClick={() => createNFT(selectedItem)}
              >
                Issue NFT
              </Button>
              <Dialog
                open={loadingStatus !== null}
                onClose={() => {}}
                aria-labelledby="loading-dialog-title"
              >
                <DialogTitle id="loading-dialog-title">Processing</DialogTitle>
                <DialogContent style={{ textAlign: 'center' }}>
                  {loadingStatus === 'uploadingToIPFS' && (
                    <>
                      <CircularProgress />
                      <Typography variant="body1">Uploading to IPFS...</Typography>
                    </>
                  )}
                  {loadingStatus === 'mintingNFT' && (
                    <>
                      <CircularProgress />
                      <Typography variant="body1">Minting NFT...</Typography>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              {loadingStatus === 'completed' && (
                <Dialog
                  open={true}
                  onClose={() => setLoadingStatus(null)}
                  aria-labelledby="congratulations-dialog-title"
                >
                  <DialogTitle id="congratulations-dialog-title">Congratulations!</DialogTitle>
                  <DialogContent style={{ textAlign: 'center' }}>
                    <Typography variant="body1">
                      You have finished listening to all the lessons on this topic. We will certify your personalized certificate of completion!
                    </Typography>
                    <Typography variant="body1">
                      おめでとう！あなたはこのトピックのすべての授業を聞き終わりました。あなただけの修了証を認定します！
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate("/mypage")}
                    >
                      Go to My Page
                    </Button>
                  </DialogContent>
                </Dialog>
              )}
            </Box>
          )}
        </Container>
      </>
    );
  };

  export default Details;