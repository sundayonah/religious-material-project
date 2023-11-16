// fetchBooks.js
import React, { useCallback } from 'react';
import axios from 'axios';

export const fetchBooks = async () => {
   const bookURL =
      'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetAllBooks';

   const token =
      'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDc4NzJmNGMtNmQ0MC00M2IyLWE1Y2ItOGE1ZmQwZTA1NDBhIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDk3NTZCNzA0OEJlMzRlNzA0QzI3RGVFYjdkQjM0QkUxQTkxMGFCOTIiLCJleHAiOjE3MDAyNDU0NTksImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.NutJY74M-eLlkTIvvPsRAFe5Xye8bHy2B5k4EtE3wno';
   // 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDgxNWQ1Y2YtNTg2ZS00ODgwLTk3MzktNWM2NmQxYzA2ZjRmIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDMyRTgwRTE2YWFmZGJiYjIwQkE1NTY5MGYyNzVhMjYwOGUzRWNGYzAiLCJleHAiOjE3MDAyNDM5NDksImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.2ely65EqGLmqMsxE2h35ozUSnKmOwNuJTiKmqjhJvuQ';
   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   };

   try {
      const res = await axios.get(bookURL, config);
      const data = res.data.data;
      // console.log(data);

      const bookDetails = await Promise.all(
         data.map(async (book) => {
            const ipfsHash = book.hash;
            const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

            const pinataResponse = await axios.get(pinataApiUrl);

            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;

               const completeBookInfo = {
                  recId: book.recId,
                  counterId: book.counterId,
                  category: book.category,
                  bookFile: book.bookFile,
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

      return bookDetails.filter((book) => book !== null);
   } catch (error) {
      console.error('Error fetching book details:', error);
      return [];
   }
};

export const fetchSongs = async () => {
   const songsURL =
      'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetAllSongs';

   const token =
      'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDc4NzJmNGMtNmQ0MC00M2IyLWE1Y2ItOGE1ZmQwZTA1NDBhIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDk3NTZCNzA0OEJlMzRlNzA0QzI3RGVFYjdkQjM0QkUxQTkxMGFCOTIiLCJleHAiOjE3MDAyNDU0NTksImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.NutJY74M-eLlkTIvvPsRAFe5Xye8bHy2B5k4EtE3wno';
   // 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDgxNWQ1Y2YtNTg2ZS00ODgwLTk3MzktNWM2NmQxYzA2ZjRmIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDMyRTgwRTE2YWFmZGJiYjIwQkE1NTY5MGYyNzVhMjYwOGUzRWNGYzAiLCJleHAiOjE3MDAyNDM5NDksImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.2ely65EqGLmqMsxE2h35ozUSnKmOwNuJTiKmqjhJvuQ';

   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   };

   try {
      const res = await axios.get(songsURL, config);
      const data = res.data.data;

      const bookDetails = await Promise.all(
         data.map(async (book) => {
            const ipfsHash = book.hash;
            const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

            const pinataResponse = await axios.get(pinataApiUrl);

            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;

               const completeBookInfo = {
                  recId: book.recId,
                  counterId: book.counterId,
                  category: book.category,
                  bookFile: book.bookFile,
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

      return bookDetails.filter((book) => book !== null);
   } catch (error) {
      console.error('Error fetching songs details:', error);
      return [];
   }
};

// export const fetchMessages = useCallback(async () => {
//    const messageURL =
//       'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetAllMessages';
//    const token =
//       'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDc4NzJmNGMtNmQ0MC00M2IyLWE1Y2ItOGE1ZmQwZTA1NDBhIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDk3NTZCNzA0OEJlMzRlNzA0QzI3RGVFYjdkQjM0QkUxQTkxMGFCOTIiLCJleHAiOjE3MDAyNDU0NTksImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.NutJY74M-eLlkTIvvPsRAFe5Xye8bHy2B5k4EtE3wno';
//    // 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDgxNWQ1Y2YtNTg2ZS00ODgwLTk3MzktNWM2NmQxYzA2ZjRmIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDMyRTgwRTE2YWFmZGJiYjIwQkE1NTY5MGYyNzVhMjYwOGUzRWNGYzAiLCJleHAiOjE3MDAyNDM5NDksImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.2ely65EqGLmqMsxE2h35ozUSnKmOwNuJTiKmqjhJvuQ';
//    const config = {
//       headers: {
//          Authorization: `Bearer ${token}`,
//       },
//    };

//    try {
//       const res = await axios.get(messageURL, config);
//       // console.log(res);
//       const data = res.data.data;

//       // console.log(data);

//       const messageDetails = await Promise.all(
//          data.map(async (book) => {
//             const ipfsHash = book.hash;
//             const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

//             const pinataResponse = await axios.get(pinataApiUrl);

//             if (pinataResponse.status === 200) {
//                const ipfsContent = pinataResponse.data;

//                const completeMessageInfo = {
//                   recId: book.recId,
//                   counterId: book.counterId,
//                   category: book.category,
//                   bookFile: book.bookFile,
//                   ...ipfsContent,
//                };

//                // console.log(completeMessageInfo);

//                return completeMessageInfo;
//             } else {
//                console.error(
//                   'Pinata API returned an error:',
//                   pinataResponse.status,
//                   pinataResponse.statusText
//                );
//                return null;
//             }
//          })
//       );

//       return messageDetails.filter((book) => book !== null);
//    } catch (error) {
//       console.error('Error fetching message details:', error);
//       return [];
//    }
// }, []);

export const useFetchMessages = () => {
   const fetchMessages = useCallback(async () => {
      try {
         // const messageURL =
         //    'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetAllMessages';

         const messageURL = '/api/hello';
         const token =
            'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDc4NzJmNGMtNmQ0MC00M2IyLWE1Y2ItOGE1ZmQwZTA1NDBhIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDk3NTZCNzA0OEJlMzRlNzA0QzI3RGVFYjdkQjM0QkUxQTkxMGFCOTIiLCJleHAiOjE3MDAyNDU0NTksImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.NutJY74M-eLlkTIvvPsRAFe5Xye8bHy2B5k4EtE3wno';

         const config = {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         };

         const res = await axios.get(messageURL, config);
         // console.log('Response:', res.data);

         const data = res.data.data;

         const messageDetails = await Promise.all(
            data.map(async (book) => {
               const ipfsHash = book.hash;
               const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

               const pinataResponse = await axios.get(pinataApiUrl);

               if (pinataResponse.status === 200) {
                  const ipfsContent = pinataResponse.data;

                  const completeMessageInfo = {
                     recId: book.recId,
                     counterId: book.counterId,
                     category: book.category,
                     bookFile: book.bookFile,
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

         return messageDetails.filter((book) => book !== null);
      } catch (error) {
         console.error('Error fetching message details:', error);
         return [];
      }
   }, []); // The empty dependency array ensures the callback doesn't change between renders

   return fetchMessages;
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
