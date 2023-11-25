import React, { useCallback, useContext, useEffect, useState } from 'react';
import Style from '@/styles/messages.module.css';
import { useAccount } from 'wagmi';
import { StateContext } from '@/Context/ReligiousContext';
import { ethers } from 'ethers';
import RMabi from '@/Contract/rm-abi.json';
import ApproveAbi from '@/Contract/approve.json';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useFetchMessages } from '@/components/fetchProducts';
import {
   LoadingSpinner,
   ProductLenghtLoadingSpinner,
   SearchIconWhenThereIsNoFilter,
} from '@/components/utils';
import Image from 'next/image';
import MessageModal from '@/components/modal/messageModalContent';
import Link from 'next/link';

const Messages = () => {
   const {
      approvedProducts,
      Approved,
      setApprovedProducts,
      approveLoadingStates,
      isAllowance,
      Connect,
      fetchPrices,
   } = useContext(StateContext);

   const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9';
   const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
   const [imageUrls, setImageUrls] = useState([]);
   const [messages, setMessages] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [messagesLoadingStates, setMessagesLoadingStates] = useState({});
   const [kingdomMessages, setKingdomMessages] = useState([]);
   const [kingdomMessagesWithPrice, setKingdomMessagesWithPrice] = useState([]);
   const [individualPurchasedStatus, setIndividualPurchasedStatus] =
      useState(false);

   const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
   const [approvalmodalContent, setApprovalModalContent] = useState(null);

   // const [approveLoadingStates, setApproveLoadingStates] = useState({});
   // const [isApproved, setIsApproved] = useState(false);
   // const [approvedProducts, setApprovedProducts] = useState([]);

   const { address } = useAccount();

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   const [searchInput, setSearchInput] = useState('');
   const [filteredMessages, setFilteredMessages] = useState(kingdomMessages);

   const messagesFetchHook = useFetchMessages();

   // const messagesContent = async () => {
   //    try {
   //       const messageURL =
   //          'http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllMessages';
   //       const response = await axios.get(messageURL);

   //       const data = response.data.data;

   //       // console.log('Original Data:', data);

   //       const messageDetails = await Promise.all(
   //          data.map(async (message) => {
   //             try {
   //                const ipfsHash = message.hash;
   //                const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

   //                const pinataResponse = await axios.get(pinataApiUrl);

   //                // console.log(pinataResponse);
   //                if (pinataResponse.status === 200) {
   //                   const ipfsContent = pinataResponse.data;

   //                   const completeMessageInfo = {
   //                      recId: message.recId,
   //                      hash: message.hash,
   //                      counterId: message.counterId,
   //                      category: message.category,
   //                      bookFile: message.bookFile,
   //                      type: message.type,
   //                      ...ipfsContent,
   //                   };

   //                   // console.log('Complete Message Info:', completeMessageInfo);

   //                   return completeMessageInfo;
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

   //       // console.log('Message Details:', messageDetails);

   //       // const filteredMessages = messageDetails.filter(
   //       //    (detail) => detail !== null
   //       // );
   //       setKingdomMessages(messageDetails);

   //       // console.log('Filtered Messages:', messageDetails);

   //       // Return the filteredDownloads as the API response
   //       // res.status(200).json(filteredMessages);
   //    } catch (error) {
   //       console.error('Error fetching Message details:', error);
   //    }
   // };

   // Function to fetch prices for each message
   // const fetchPrices = useCallback(async () => {
   //    // const provider = new ethers.providers.Web3Provider(window.ethereum);

   //    const alchemyApiKey = 'o_O5LwKav_r5UECR-59GtRZsIqnhD0N8';
   //    const provider = new ethers.providers.JsonRpcProvider(
   //       `https://polygon-mumbai.g.alchemyapi.io/v2/${alchemyApiKey}`
   //    );

   //    // const signer = provider.getSigner();

   //    const contract = new ethers.Contract(
   //       RMTestnetContractAddress,
   //       RMabi,
   //       provider
   //       // signer
   //    );
   //    const updatedMessages = [];
   //    for (const message of kingdomMessages) {
   //       const contentId = message.counterId;
   //       // const { counterId } = message;
   //       // console.log(counterId);

   //       const contentData = await contract.content(contentId);
   //       const contentSplit = contentData.toString();
   //       const contentValues = contentSplit.split(','); // Splitting the string by comma

   //       // Assuming the second value (index 1) represents the price
   //       const contentPrice = contentValues[1] ? parseInt(contentValues[1]) : 0;

   //       // const priceToNormal = contentPrice / 1e15;

   //       // // Assuming other values in 'contentData' correspond to other properties in 'message'
   //       const messageWithPrice = { ...message, contentPrice };
   //       // console.log(messageWithPrice);

   //       updatedMessages.push(messageWithPrice);
   //    }

   //    return updatedMessages;
   // }, [kingdomMessages]);

   useEffect(() => {
      const FetchMessagesWithPrice = async () => {
         const messagesWithPrices = await fetchPrices(kingdomMessages);
         setKingdomMessagesWithPrice(messagesWithPrices);

         // const response = await axios.get('/api/message');
         // const data = response.data;
         // console.log(data);

         // setKingdomMessages(data);

         const messagesDetails = await messagesFetchHook();
         // console.log(messagesDetails);
         setKingdomMessages(messagesDetails);
      };
      // messagesContent();
      FetchMessagesWithPrice();
   }, [kingdomMessages, fetchPrices, messagesFetchHook]);

   // Filter the messages based on the search input
   useEffect(() => {
      const filtered = kingdomMessagesWithPrice.filter(
         (message) =>
            message.author.toLowerCase().includes(searchInput.toLowerCase()) ||
            message.title.toLowerCase().includes(searchInput.toLowerCase())
      );

      setFilteredMessages(filtered);
   }, [searchInput, kingdomMessagesWithPrice]);

   useEffect(() => {
      const checkPurchasedStatus = async () => {
         try {
            const response = await axios.get(
               `https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`
            );

            const purchasedProducts = response.data.data;
            const purchasedMap = {};

            filteredMessages.forEach((message) => {
               const isPurchased = purchasedProducts.some(
                  (product) => product.counterId === message.counterId
               );
               purchasedMap[message.counterId] = isPurchased;
            });

            // console.log(purchasedMap);

            setIndividualPurchasedStatus(purchasedMap);
         } catch (error) {
            console.error('Error checking purchase status:', error);
         }
      };

      checkPurchasedStatus();
   }, [address, filteredMessages]);

   const buyNow = async (product) => {
      try {
         if (product) {
            if (window.ethereum) {
               const provider = new ethers.providers.Web3Provider(
                  window.ethereum
               );

               const signer = provider.getSigner();

               if (address === undefined) {
                  toast.success(`Please Connect Your Wallet.`, {
                     duration: 4000,
                     position: 'top-right',
                     icon: '❌',
                     style: {
                        background: '#fff',
                        border: '1px solid #a16206',
                     },
                  });
                  return;
               }

               setMessagesLoadingStates((prevStates) => ({
                  ...prevStates,
                  [product.recId]: true,
               }));

               const contentId = product.counterId;
               const token = TokenAddress;

               const contract = new ethers.Contract(
                  RMTestnetContractAddress,
                  RMabi,
                  signer
               );

               // Make the purchase through the smart contract

               let tx;
               tx = await contract.purchase(contentId, token, {
                  gasLimit: 200000, // Adjust the gas limit as needed
                  gasPrice: ethers.utils.parseUnits('10.0', 'gwei'), // Adjust the gas price as needed
               });

               const receipt = await tx.wait();
               // console.log(receipt);

               if (receipt.status === 1) {
                  // Update the approvedProducts state
                  setApprovedProducts((prevProducts) => [
                     ...prevProducts,
                     product.recId,
                  ]);
                  // Create a product details object
                  const purchasedMessages = {
                     id: product.recId,
                     author: product.author,
                     title: product.title,
                     image: product.image,
                     category: product.category,
                     bookFile: product.bookFile,
                     address: address, // Store the user's address with the purchased book
                  };

                  // // Serialize the purchased product before storing it
                  // const serializedProduct = JSON.stringify(purchasedMessages);

                  // // Add the purchased product to localStorage
                  // const storedPurchasedMessages =
                  //    JSON.parse(localStorage.getItem('purchasedMessages')) ||
                  //    [];
                  // storedPurchasedMessages.push(serializedProduct);
                  // localStorage.setItem(
                  //    'purchasedMessages',
                  //    JSON.stringify(storedPurchasedMessages)
                  // );

                  const purchasedBookTitle = purchasedMessages.title;

                  // Display a success toast notification
                  toast.success(`${purchasedBookTitle}, Purchase successful`, {
                     duration: 4000,
                     position: 'bottom-right',
                     icon: '✅',
                  });

                  // Call the API to add the transaction
                  const transactionData = {
                     hash: product.hash,
                     counterId: product.counterId,
                     address: address,
                     type: product.type,
                     transactionHash: receipt.transactionHash,
                  };

                  // console.log(transactionData);

                  // Make a POST request to the API endpoint
                  const addTransactionResponse = await axios.post(
                     'https://hokoshokos-001-site1.etempurl.com/api/Catalog/AddTransactions',
                     transactionData
                  );
                  console.log(addTransactionResponse);

                  // Check the response from the API
                  if (addTransactionResponse.status === 200) {
                     console.log(
                        'Transaction added successfully:',
                        addTransactionResponse.data
                     );
                  } else {
                     console.error(
                        'Failed to add transaction:',
                        addTransactionResponse.statusText
                     );
                  }

                  setMessagesLoadingStates((prevStates) => ({
                     ...prevStates,
                     [product.recId]: false,
                  }));
               } else {
                  console.error('Transaction Not Successful');
               }
               // console.log('done');
            } else {
               console.error('User is not connected to a Web3 provider.');
            }
            // Perform any other actions here if needed
         } else {
            console.error('Product not found in Message Details.');
         }
      } catch (err) {
         console.error('Purchase failed:', err.message);
         setMessagesLoadingStates((prevStates) => ({
            ...prevStates,
            [product.recId]: false,
         }));
      }
      setMessagesLoadingStates((prevStates) => ({
         ...prevStates,
         [product.recId]: false,
      }));
   };

   const openApprovalModal = (product) => {
      setApprovalModalContent(product);
      setIsApprovalModalOpen(true);
   };

   const closeApprovalModal = () => {
      setApprovalModalContent(null);
      setIsApprovalModalOpen(false);
   };

   if (kingdomMessagesWithPrice.length === 0) {
      return (
         <>
            <ProductLenghtLoadingSpinner />
         </>
      );
   }

   // console.log(selectedProduct);

   return (
      <div className="w-[95%] m-auto mt-28 ">
         <Toaster />
         <div className="flex mt-8 justify-evenly items-center mb-3">
            <h4 className="text-white">Messages</h4>
            <form>
               <input
                  className="w-full md:w-[320px] px-4 py-2 rounded-md border border-transparent bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                  type="text"
                  placeholder="Search message..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
               />
            </form>
         </div>
         {/* <div className="flex flex-wrap gap-3 p-2 justify-center md:justify-start items-center"> */}
         <div className="flex flex-wrap gap-3 p-2 justify-center items-center">
            {filteredMessages.length === 0 ? (
               <div className="flex justify-center items-center mt-24">
                  {SearchIconWhenThereIsNoFilter('Messages')}
               </div>
            ) : (
               <>
                  {filteredMessages.map((message, index) => (
                     // <div key={message.id} className={Style.messagesDetails}>
                     <div
                        key={message.recId}
                        // className="border rounded-md p-2"
                        className=" rounded-md p-3 m-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-custom"
                     >
                        <Link
                           href={`/singleMessages?id=${message.recId}`}
                           passHref
                        >
                           <div
                              class="md:flex-shrink-0 cursor-pointer"
                              // onClick={() => openModal(message)}
                           >
                              <Image
                                 src={`https://gateway.pinata.cloud/ipfs/${message.image}`}
                                 alt={message.title}
                                 width={200}
                                 height={150}
                                 className="h-42 w-72 md:w-52 rounded-md object-center"
                              />
                           </div>
                        </Link>
                        <div className="flex flex-col justify-center items-start pt-1">
                           <span className="text-white text-sm pt-1 pb-1">
                              {message.title}
                           </span>
                           <span className="text-gray-400 italic text-small">
                              {message.author}
                           </span>
                           <span className="text-gray-300">
                              $TKC{' '}
                              {(message.contentPrice / 1e15).toLocaleString()}
                           </span>
                        </div>
                        <div className="w-full">
                           <button
                              onClick={() => {
                                 openApprovalModal(message);
                              }}
                              className="w-full text-white  bg-yellow-700 py-1 px-5 rounded-sm"
                           >
                              Approve
                           </button>
                           {/* <BookModal
                                    isOpen={isApprovalModalOpen}
                                    closeModal={closeApprovalModal}
                                    book={approvalmodalContent}
                                    individualPurchasedStatus={
                                       individualPurchasedStatus
                                    }
                                    buyNow={buyNow}
                                    bookLoad */}

                           {/* {hasPurchased(address, message.recId) ? ( */}
                           {/* {individualPurchasedStatus[message.counterId] ? (
                              <button
                                 disabled
                                 className="w-full text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm cursor-not-allowed"
                              >
                                 Purchased
                              </button>
                           ) : (
                              <>
                                 {approvedProducts.includes(message.recId) ||
                                 isAllowance ? (
                                    <button
                                       onClick={() => {
                                          setSelectedProduct(message);
                                          buyNow(message);
                                       }}
                                       className="w-full text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                    >
                                       {messagesLoadingStates[message.recId] ? (
                                          <LoadingSpinner />
                                       ) : (
                                          'Buy Now'
                                       )}
                                    </button>
                                 ) : (
                                    <button
                                       onClick={() => {
                                          // setSelectedProduct(message);
                                          Approved(message);
                                       }}
                                       className="w-full text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                    >
                                       {approveLoadingStates[message.recId] ? (
                                          <LoadingSpinner />
                                       ) : (
                                          'Approve'
                                       )}
                                    </button>
                                 )}
                              </> */}
                           {/* )} */}
                        </div>
                     </div>
                  ))}
               </>
            )}
         </div>
         <MessageModal
            isOpen={isApprovalModalOpen}
            closeModal={closeApprovalModal}
            message={approvalmodalContent}
            individualPurchasedStatus={individualPurchasedStatus}
            buyNow={buyNow}
            messagesLoadingStates={messagesLoadingStates}
         />

         {/* {isModalOpen && (
            <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
               <div className="bg-white p-5 rounded-md max-w-md w-full">
                  {modalContent && (
                     <>
                        <div className="flex justify-end">
                           <button
                              onClick={closeModal}
                              className="text-gray-600 hover:text-gray-800"
                           >
                              <CloseIcon />
                           </button>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                           <Image
                              src={`https://gateway.pinata.cloud/ipfs/${modalContent.image}`}
                              alt={modalContent.title}
                              width={400}
                              height={300}
                              className="rounded-md mb-4"
                           />
                           <h2 className="text-xl font-bold">
                              {modalContent.title}
                           </h2>
                           <p className="text-gray-600">
                              {modalContent.author}
                           </p>
                           <p className="text-gray-600">
                              {modalContent.description}
                           </p>
                           <div className="w-full flex justify-center items-center  mt-3 space-x-4">
                              <b className="border border-yellow-700 bg-transparent py-1 px-2 rounded-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50 text-black">
                                 $TKC {modalContent.contentPrice / 1e15}
                              </b>
                              <button className="w-[50%] text-white  bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50">
                                 Approve
                              </button>
                           </div>
                        </div>
                     </>
                  )}
               </div>
            </div>
         )} */}
      </div>
   );
};

export default Messages;
