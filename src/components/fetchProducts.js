// fetchBooks.js
import React, { useCallback } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

// export const fetchPrices = async (kingdomBook) => {
//    // const provider = new ethers.providers.getDefaultProvider('homestead', {
//    //    alchemy: 'o_O5LwKav_r5UECR-59GtRZsIqnhD0N8',
//    // });
//    const provider = new ethers.providers.Web3Provider(window.ethereum);

//    const signer = provider.getSigner();

//    const contract = new ethers.Contract(
//       RMTestnetContractAddress,
//       RMabi,
//       // provider
//       signer
//    );

//    const updatedMessages = [];
//    for (const book of kingdomBook) {
//       const contentId = book.id;

//       const contentData = await contract.content(contentId);
//       const contentSplit = contentData.toString();
//       // console.log(contentSplit);
//       const contentValues = contentSplit.split(','); // Splitting the string by comma

//       // Assuming the second value (index 1) represents the price
//       const contentPrice = contentValues[1] ? parseInt(contentValues[1]) : 0;
//       // console.log(contentPrice);

//       // // Assuming other values in 'contentData' correspond to other properties in 'book'
//       const bookWithPrice = { ...book, contentPrice };
//       // console.log(bookWithPrice);

//       updatedMessages.push(bookWithPrice);
//    }

//    // console.log(updatedMessages);
//    return updatedMessages;
// };

export const fetchBooks = async () => {
   // const bookURL = '/api/book';

   try {
      const bookURL =
         'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllBooks';
      const response = await axios.get(bookURL);

      const data = response.data.data;

      // console.log('Original Data:', data);

      const bookDetails = await Promise.all(
         data.map(async (book) => {
            // console.log(book);
            try {
               const ipfsHash = book.hash;
               const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

               const pinataResponse = await axios.get(pinataApiUrl);

               // console.log(pinataResponse);
               if (pinataResponse.status === 200) {
                  const ipfsContent = pinataResponse.data;
                  // console.log(ipfsContent);

                  const completeMessageInfo = {
                     recId: book.recId,
                     hash: book.hash,
                     counterId: book.counterId,
                     category: book.category,
                     bookFile: book.bookFile,
                     type: book.type,
                     ...ipfsContent,
                  };

                  // console.log('Complete Message Info:', completeMessageInfo);

                  return completeMessageInfo;
               } else {
                  console.error(
                     'Pinata API returned an error:',
                     pinataResponse.status,
                     pinataResponse.statusText
                  );
                  return null;
               }
            } catch (error) {
               console.error('Error fetching IPFS content:', error);
               return null;
            }
         })
      );

      const filteredBooks = bookDetails.filter((book) => book !== null);
      // console.log('Filtered Books:', filteredBooks);
      return filteredBooks;
      // Inside the catch block for IPFS content retrieval
   } catch (error) {
      if (axios.isAxiosError(error)) {
         // Handle Axios errors (e.g., network errors) differently
         console.error('Axios error fetching IPFS content:', error);
      } else {
         console.error('Error fetching IPFS content:', error);
      }
      return null;
   }
};

export const fetchSongs = async () => {
   const songsURL =
      'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllSongs';

   try {
      const res = await axios.get(songsURL);
      const data = res.data.data;
      console.log('Response:', res.data.data);

      const songDetails = await Promise.all(
         data.map(async (song) => {
            const ipfsHash = song.hash;
            const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

            const pinataResponse = await axios.get(pinataApiUrl);

            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;

               const completeSongInfo = {
                  recId: song.recId,
                  hash: song.hash,
                  counterId: song.counterId,
                  category: song.category,
                  bookFile: song.bookFile,
                  type: song.type,
                  ...ipfsContent,
               };

               // console.log(completeSongInfo);

               return completeSongInfo;
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

      // console.log(songDetails);

      // return songDetails.filter((song) => song !== null);

      const filteredSongs = songDetails.filter((song) => song !== null);
      // console.log('Filtered songs:', filteredSongs);
      return filteredSongs;
   } catch (error) {
      console.error('Error fetching songs details:', error);
      return [];
   }
};

export const useFetchMessages = () => {
   const fetchMessages = useCallback(async () => {
      try {
         const messageURL =
            'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllMessages';

         // const messageURL = '/api/message';

         const res = await axios.get(messageURL);
         // console.log('Response:', res.data.data);

         const data = res.data.data;

         const messageDetails = await Promise.all(
            data.map(async (message) => {
               const ipfsHash = message.hash;
               const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

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
            (message) => message !== null
         );
         // console.log('Filtered message:', filteredMessages);
         return filteredMessages;
      } catch (error) {
         console.error('Error fetching message details:', error);
         return [];
      }
   }, []);

   return fetchMessages;
};

export const getTransactions = async (address) => {
   const downloadsUrl = `https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`;

   // const downloadsUrl = '/api/getAllDownload';

   try {
      const res = await axios.get(downloadsUrl);
      const data = res.data.data;
      // console.log(data);

      const validDownloadDetails = await Promise.all(
         data.map(async (download) => {
            const ipfsHash = download.hash;
            const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

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
                  // Add other fields as needed
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

      // console.log(validDownloadDetails);

      // Remove null values (failed downloads) and update state with the array
      return validDownloadDetails.filter((detail) => detail !== null);
   } catch (error) {
      // console.error('Error fetching download details:', error);
   }
};
