import axios from "axios";

const pinataApiKey = "5072941522996104460a";
const pinataSecretApiKey = "0fee3ebe45829c1f63face178255ac152d05e0dec9b141333123ed9dc998b173";

const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

export const pinJSONToIPFS = async (JSONBody) => {
  const data = {
    "description": "Einstein gave a lecture on relativity", 
    "external_url": "https://openseacreatures.io/3", 
    "image": "https://cdn.midjourney.com/238752f7-80d6-4483-b1df-5e0849c7c602/0_0.png", 
    "name": "The Theory of Relativity",
  }

  const headers = {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
      "Content-Type": "application/json"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("IPFS Hash:", response.data.IpfsHash);
    console.log("URL:", `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
  }
}