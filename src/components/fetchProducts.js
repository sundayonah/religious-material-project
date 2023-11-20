// fetchBooks.js
import React, { useCallback } from 'react';
import axios from 'axios';

// export const fetchBooks = async () => {
//    const bookURL = '/api/book';

//    try {
//       const res = await axios.get(bookURL);
//       const data = res.data.data;

//       const bookDetails = await Promise.all(
//          data.map(async (book) => {
//             const ipfsHash = book.hash;
//             const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

//             try {
//                const pinataResponse = await axios.get(pinataApiUrl);

//                if (pinataResponse.status === 200) {
//                   const ipfsContent = pinataResponse.data;

//                   const completeBookInfo = {
//                      recId: book.recId,
//                      hash: book.hash,
//                      counterId: book.counterId,
//                      category: book.category,
//                      bookFile: book.bookFile,
//                      ...ipfsContent,
//                   };

//                   return completeBookInfo;
//                } else {
//                   console.error(
//                      'Pinata API returned an error:',
//                      pinataResponse.status,
//                      pinataResponse.statusText
//                   );
//                   return null;
//                }
//             } catch (error) {
//                console.error('Error fetching IPFS content:', error);
//                return null;
//             }
//          })
//       );

//       const filteredBooks = bookDetails.filter((book) => book !== null);
//       return filteredBooks;
//    } catch (error) {
//       console.error('Error fetching book details:', error);
//       return [];
//    }
// };

export const fetchBooks = async () => {
   // const bookURL = '/api/book';

   try {
      const bookURL =
         'http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllBooks';
      const response = await axios.get(bookURL);

      const data = response.data.data;

      // console.log('Original Data:', data);

      const bookDetails = await Promise.all(
         data.map(async (message) => {
            try {
               const ipfsHash = message.hash;
               const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

               const pinataResponse = await axios.get(pinataApiUrl);

               // console.log(pinataResponse);
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

      // console.log('Message Details:', bookDetails);

      // const filteredMessages = bookDetails.filter(
      //    (detail) => detail !== null
      // );

      // console.log('Filtered Messages:', bookDetails);

      // Return the filteredDownloads as the API response
      // res.status(200).json(filteredMessages);
      // console.log('Book Details:', bookDetails);

      const filteredBooks = bookDetails.filter((book) => book !== null);
      // console.log('Filtered Books:', filteredBooks);
      return filteredBooks;
   } catch (error) {
      console.error('Error fetching books details:', error);
      return [];
   }
};

export const fetchSongs = async () => {
   const songsURL =
      'http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllSongs';

   try {
      const res = await axios.get(songsURL);
      const data = res.data.data;
      // console.log('Response:', res.data.data);

      const songDetails = await Promise.all(
         data.map(async (song) => {
            const ipfsHash = song.hash;
            const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

            const pinataResponse = await axios.get(pinataApiUrl);

            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;

               const completeBookInfo = {
                  recId: song.recId,

                  hash: song.hash,
                  counterId: song.counterId,
                  category: song.category,
                  bookFile: song.bookFile,
                  ...ipfsContent,
               };

               return completeBookInfo;
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

      return songDetails.filter((song) => song !== null);
   } catch (error) {
      console.error('Error fetching songs details:', error);
      return [];
   }
};

export const useFetchMessages = () => {
   const fetchMessages = useCallback(async () => {
      try {
         const messageURL =
            'http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllSongs';

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

         return messageDetails.filter((message) => message !== null);
      } catch (error) {
         console.error('Error fetching message details:', error);
         return [];
      }
   }, []);

   return fetchMessages;
};

export const getTransactions = async (address) => {
   const downloadsUrl = `http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`;

   // const downloadsUrl = '/api/getAllDownload';

   try {
      const res = await axios.get(downloadsUrl);
      const data = res.data.data;
      // console.log(data);

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

//  const buyNow = async (product, details) => {
//     try {
//        if (product) {
//           // Check if the user is connected to a Web3 provider
//           if (window.ethereum) {
//              const provider = new ethers.providers.Web3Provider(
//                 window.ethereum
//              );
//              const signer = provider.getSigner();

//              if (address === undefined) {
//                 toast.success(`Please Connect Your Wallet.`, {
//                    duration: 4000,
//                    position: 'top-right',
//                    icon: '❌',
//                    // style: {
//                    //    background: '#fff',
//                    //    // border: '1px solid #a16206',
//                    // },
//                 });
//                 return;
//              }
//              // Check if the user is authenticated and obtain the user's address

//              // Find the index of the product in songDetails using its id
//              const productIndex = messagesDetails.findIndex(
//                 (message) => message.id === product.id
//              );

//              setMessagesLoadingStates((prevStates) => ({
//                 ...prevStates,
//                 [product.id]: true,
//              }));
//              if (productIndex !== -1) {
//                 // Retrieve the corresponding image URL based on the product's index
//                 const imageUrl = imageUrls[productIndex];

//                 // Convert the product's price to Wei (assuming it's in Ether)
//                 const priceInEther = product.price.toString();

//                 console.log(priceInEther);
//                 // // const priceInWei = ethers.utils.parseEther(priceInEther);

//                 // Initialize the contract instance
//                 const contract = new ethers.Contract(
//                    RMTestnetContractAddress,
//                    RMabi,
//                    signer
//                 );

//                 const contentId = parseInt(product.id);
//                 const token = TokenAddress;

//                 // const valueInWei = ethers.utils.parseEther(
//                 //    product.price.toString()
//                 // ); // Convert the product price to Wei

//                 // Call the smart contract's purchase function
//                 let tx;
//                 tx = await contract.purchase(contentId, token, {
//                    // value: valueInWei, // Send the price as value in Wei
//                    gasLimit: 200000, // Adjust the gas limit as needed
//                    gasPrice: ethers.utils.parseUnits('10.0', 'gwei'), // Adjust the gas price as needed
//                 });

//                 const receipt = await tx.wait();

//                 // If the purchase is successful, store the purchased product in local storage

//                 if (receipt.status === 1) {
//                    const purchasedMessage = {
//                       ...product,
//                       imageUrl,
//                       address: address,
//                    };

//                    // Store purchased products in localStorage
//                    const serializedProduct = JSON.stringify(purchasedMessage);
//                    const storedPurchasedProducts =
//                       JSON.parse(localStorage.getItem('purchasedMessages')) ||
//                       [];
//                    storedPurchasedProducts.push(serializedProduct);
//                    localStorage.setItem(
//                       'purchasedMessages',
//                       JSON.stringify(storedPurchasedProducts)
//                    );

//                    const purchasedSongTitle = purchasedMessage.title;

//                    // Display a success toast notification
//                    toast.success(`${purchasedSongTitle}, Purchase successful`, {
//                       duration: 4000,
//                       position: 'bottom-right',
//                       icon: '✅',
//                    });
//                    setMessagesLoadingStates((prevStates) => ({
//                       ...prevStates,
//                       [product.id]: false,
//                    }));
//                 } else {
//                    console.error('Transaction Not Successful');
//                 }
//              } else {
//                 console.error('Product not found in songDetails.');
//              }
//           } else {
//              console.error('User is not connected to a Web3 provider.');
//           }
//        }
//     } catch (err) {
//        console.error('Purchase failed:', err);
//     }
//     setMessagesLoadingStates((prevStates) => ({
//        ...prevStates,
//        [product.id]: false,
//     }));
//  };
