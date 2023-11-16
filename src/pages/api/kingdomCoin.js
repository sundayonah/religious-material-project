const path = require('path');

export default function handler(req, res) {
   const ethers = require('ethers');
   // import dotenv from 'dotenv';
   const pinataSDK = require('@pinata/sdk');
   const axios = require('axios');
   const fs = require('fs');
   const { getContracts } = require('@/components/ipfsFolder/getContract');

   // dotenv.config();

   // const { pinataJWT } = process.env;
   const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwY2MxYzEwZC1iZGNhLTRjNzEtYWFjZS1hMGY0NDczMmEyZDAiLCJlbWFpbCI6Im9uYWhzdW5kYXkwNjEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0OTI3MGVmZDdlOTA1YTgxY2FiNiIsInNjb3BlZEtleVNlY3JldCI6ImQxYzAxZTM4MmVkYzFmMTI4YmM0OWU5MDRkZWYxMTc5OGM4YjNjMTI0Y2U2MmRmMjczMzA1YjNiYjFjOTUwYWYiLCJpYXQiOjE2OTkzMTUwMjN9.daojj7OGyrYveuKuRD-nyz6bousFnOWmvBY-OXmfxuA';

   const pinata = new pinataSDK({ pinataJWTKey: jwt });

   async function pinFileToIPFSAsync(filePath) {
      const readableStreamForFile = fs.createReadStream(filePath);

      const options = {
         pinataMetadata: {
            name: 'Coin',
            keyvalues: {
               customKey: 'KingdomCoin 1',
               customKey2: 'KingdomCoin 2',
            },
         },
         pinataOptions: {
            cidVersion: 0,
         },
      };

      const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
      console.log(result);
      return result;
   }

   async function generateContent(filePath) {
      const { kingdomCoinMarketPlace } = await getContracts();
      const imageHash = await pinFileToIPFSAsync(filePath);

      const imageCID = imageHash.IpfsHash;

      const counterID = await kingdomCoinMarketPlace.counter();

      console.log(counterID);

      const allProduct = {
         image: imageCID,
         id: counterID + 1,
         title: 'KingdomCoin',
         price: 19.99,
      };

      const options = {
         pinataMetadata: {
            name: 'Coin',
            keyvalues: {
               customKey: 'KingdomCoin 1',
               customKey2: 'KingdomCoin 2',
            },
         },
         pinataOptions: {
            cidVersion: 0,
         },
      };

      const result = await pinata.hashMetadata(allProduct, options);
      console.log(result);
      return result;
   }
   const filePath = path.join(
      process.cwd(),
      'public',
      'images',
      'convinient.jpeg'
   );

   console.log(filePath);

   generateContent('../../yolvaSrc.png') // Provide the correct file path
      .then((result) => {
         console.log(result);
      })
      .catch((err) => {
         console.log(err);
      });
}
