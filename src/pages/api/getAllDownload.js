import axios from 'axios';
import { useAccount } from 'wagmi';

export default async function handler(req, res) {
   const { address } = req.query;
   const downloadsUrl = `http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetTransactions/${address}`;
   try {
      const response = await axios.get(downloadsUrl);
      const data = response.data.data;

      const validDownloadDetails = await Promise.all(
         data.map(async (download) => {
            const ipfsHash = download.hash;
            const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

            const pinataResponse = await axios.get(pinataApiUrl);

            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;

               // Assuming ipfsContent is in JSON format
               const { author, title, image } = ipfsContent;

               const completeDownloadInfo = {
                  recId: download.recId,
                  hash: download.hash,
                  counterId: download.counterId,
                  address: download.address,
                  type: download.type,
                  transactionHash: download.transactionHash,
                  dataFile: download.dataFile,
                  author,
                  title,
                  image,
               };

               // console.log(completeDownloadInfo);
               return completeDownloadInfo;
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

      const filteredDownloads = validDownloadDetails.filter(
         (detail) => detail !== null
      );

      // Return the filteredDownloads as the API response
      res.status(200).json(filteredDownloads);
   } catch (error) {
      console.error('Error fetching download details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}
