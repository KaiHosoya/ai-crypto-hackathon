const ethers = require("ethers");

// InfuraのCeloのエンドポイントを設定します
const provider = new ethers.providers.JsonRpcProvider("https://celo-alfajores.infura.io/v3/92c1b10f5de24c31b5f3407563e2c842");

// 秘密キーは環境変数などから取得するべきです。これは例です。
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

// サイナーを作成します
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// 事前にデプロイされたコントラクトのアドレスを指定します
const contractAddress = "0x39Fc163cfcC4Bb8FB0dC302C63b6f2EAc7ca2347";
const abi = require("../resources/abi.json");

// サイナーとともにコントラクトに接続します
const contract = new ethers.Contract(contractAddress, abi, wallet);

export const mintNFT = async (recipient, tokenURI) => {
  try {
    console.log("recipient:", recipient);
    // コントラクトのsafeMintメソッドを呼び出して新しいトークンをmintします
    const tx = await contract.safeMint(recipient, tokenURI);
    await tx.wait();

    console.log("Token minted successfully");
  } catch (error) {
    console.error("Failed to mint the token:", error);
  }
};

// 所有するNFTのtokenURIを配列で返します
export const tokenURIs = async(walletAddress) => {
  try {
      // Transferイベントのフィルターを設定
      const transferEventFilter = contract.filters.Transfer(null, walletAddress);

      // Transferイベントを取得
      const events = await contract.queryFilter(transferEventFilter);

      const tokens = [];

      // 各イベントに対してトークンURIを取得
      for (let event of events) {
          const tokenId = event.args.tokenId;
          const tokenURI = await contract.tokenURI(tokenId);
          tokens.push({ tokenId, tokenURI });
      }

      return tokens;

  } catch (error) {
      console.error("Error fetching NFT tokens:", error);
  }
};



