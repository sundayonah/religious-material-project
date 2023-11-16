import { ethers } from 'ethers';
import KingdomMarketPlace from '@/Contract/rm-abi.json';
// import dotenv from 'dotenv';
import { NETWORKS } from '@/components/ipfsFolder/config';

// dotenv.config();

// const { PRIVATE_KEY, MUMBAI_URL } = process.env;

const PRIVATE_KEY =
   '1f1aec904899569d60605bfdb13428c689bdce679f31a72ea4c8a13ea5d31cf7';

const MUMBAI_URL = 'https://rpc-mumbai.polygon.com/';

const chainID = 80001;

const network = NETWORKS[chainID];

async function getContracts() {
   if (!PRIVATE_KEY) {
      throw new Error('DEPLOYER_PRIVATE_KEY is undefined');
   }
   // Get signer
   const deployer = new ethers.Wallet(PRIVATE_KEY);
   const provider = new ethers.providers.JsonRpcProvider(MUMBAI_URL);
   const signer = deployer.connect(provider);

   // Get contract instances
   const kingdomCoinMarketPlace = new ethers.Contract(
      network.KINGDOM_MARKET_PLACE_PROXY,
      KingdomMarketPlace,
      signer
   );

   return {
      signer,
      kingdomCoinMarketPlace,
   };
}

export { getContracts };
