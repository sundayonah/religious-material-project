// export default function handler(req, res) {
//    res.status(200).json({ name: 'John Doe' });
// }

// pages/api/hello.js

// pages/api/getAllMessages.js
import axios from 'axios';

export default async function handler(req, res) {
   try {
      const messageURL =
         'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetAllMessages';

      const response = await axios.get(messageURL);

      const data = response.data.data;

      const messageDetails = await Promise.all(
         data.map(async (message) => {
            const ipfsHash = message.hash;
            const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

            const pinataResponse = await axios.get(pinataApiUrl);

            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;

               const completeMessageInfo = {
                  recId: message.recId,
                  hash: message.hash,
                  counterId: message.counterId,
                  category: message.category,
                  bookFile: message.bookFile,
                  type: message.type,
                  ...ipfsContent,
               };

               // console.log(completeMessageInfo);

               return completeMessageInfo;
            } else {
               console.error(
                  'Pinata API returned an error:',
                  pinataResponse.status,
                  pinataResponse.statusText
               );
               return null;
            }
         })
      );
      const filteredMessages = messageDetails.filter(
         (detail) => detail !== null
      );

      // Return the filteredDownloads as the API response
      res.status(200).json(filteredMessages);
   } catch (error) {
      console.error('Error fetching download details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}
