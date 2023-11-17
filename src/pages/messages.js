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
import { LoadingSpinner } from '@/components/loading';

const Messages = () => {
   const {
      approvedProducts,
      Approved,
      setApprovedProducts,
      approveLoadingStates,
   } = useContext(StateContext);

   const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9';
   const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
   const [imageUrls, setImageUrls] = useState([]);
   const [messages, setMessages] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [messagesLoadingStates, setMessagesLoadingStates] = useState({});
   const [kingdomMessages, setKingdomMessages] = useState([]);
   const [kingdomMessagesWithPrice, setKingdomMessagesWithPrice] = useState([]);
   // const [approveLoadingStates, setApproveLoadingStates] = useState({});
   // const [isApproved, setIsApproved] = useState(false);
   // const [approvedProducts, setApprovedProducts] = useState([]);

   const { address } = useAccount();

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   const [searchInput, setSearchInput] = useState('');
   const [filteredMessages, setFilteredMessages] = useState(kingdomMessages);

   // Function to fetch prices for each message
   const fetchPrices = useCallback(async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
         RMTestnetContractAddress,
         RMabi,
         signer
      );

      const updatedMessages = [];
      for (const message of kingdomMessages) {
         const contentId = message.id;

         const contentData = await contract.content(contentId);
         const contentSplit = contentData.toString();
         // console.log(contentSplit);
         const contentValues = contentSplit.split(','); // Splitting the string by comma

         // Assuming the second value (index 1) represents the price
         const contentPrice = contentValues[1] ? parseInt(contentValues[1]) : 0;

         // // Assuming other values in 'contentData' correspond to other properties in 'message'
         const messageWithPrice = { ...message, contentPrice };

         updatedMessages.push(messageWithPrice);
         // updatedMessages.push(contentPrice);
      }

      // console.log(updatedMessages);
      return updatedMessages;
   }, [kingdomMessages]);

   const messagesFetchHook = useFetchMessages();

   useEffect(() => {
      const FetchMessagesWithPrice = async () => {
         const messagesWithPrices = await fetchPrices();
         setKingdomMessagesWithPrice(messagesWithPrices);

         const messagesDetails = await messagesFetchHook();
         setKingdomMessages(messagesDetails);
      };
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

   const hasPurchased = (userAddress, contentId) => {
      const purchasedMesages =
         JSON.parse(localStorage.getItem('purchasedMessages')) || [];
      return purchasedMesages.some((product) => {
         const parsedProduct = JSON.parse(product);
         return (
            parsedProduct.address === userAddress &&
            parsedProduct.id === contentId
         );
      });
   };

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
               console.log(receipt);

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

                  // Serialize the purchased product before storing it
                  const serializedProduct = JSON.stringify(purchasedMessages);

                  // Add the purchased product to localStorage
                  const storedPurchasedMessages =
                     JSON.parse(localStorage.getItem('purchasedMessages')) ||
                     [];
                  storedPurchasedMessages.push(serializedProduct);
                  localStorage.setItem(
                     'purchasedMessages',
                     JSON.stringify(storedPurchasedMessages)
                  );

                  const purchasedBookTitle = purchasedMessages.title;

                  // Display a success toast notification
                  toast.success(`${purchasedBookTitle}, Purchase successful`, {
                     duration: 4000,
                     position: 'bottom-right',
                     icon: '✅',
                  });

                  // Call the API to add the transaction
                  const transactionData = {
                     hash: receipt.transactionHash,
                     address: address,
                     counterId: product.counterId,
                     type: product.type,
                     transactionHash: receipt.transactionHash,
                  };

                  console.log(transactionData);

                  // Make a POST request to the API endpoint
                  const addTransactionResponse = await axios.post(
                     'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/AddTransactions',
                     transactionData
                  );

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
               console.log('done');
            } else {
               console.error('User is not connected to a Web3 provider.');
            }
            // Perform any other actions here if needed
         } else {
            console.error('Product not found in Book Details.');
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

   if (kingdomMessagesWithPrice.length === 0) {
      return (
         <>
            <div class="flex items-center justify-center   mt-80">
               <div class="flex items-center justify-center  w-6 h-6">
                  <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-pulse delay-500">
                     Lo
                  </div>
                  <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-ping delay-100">
                     ad
                  </div>
                  <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-pulse delay-500">
                     i
                  </div>
                  <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-ping delay-700">
                     n
                  </div>
                  <div class="w-24 h-24 p-5 bg-[#DAA851] rounded-full animate-pulse delay-1000">
                     g
                  </div>
               </div>
            </div>
         </>
      );
   }

   // console.log(kingdomMessagesWithPrice);

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
         <div className="flex flex-wrap gap-3 p-2 justify-center items-center">
            {filteredMessages.length === 0 ? (
               <div className="flex justify-center items-center mt-24">
                  <p className="text-2xl text-gray-400">
                     No Messages 🔽 found matching the search.
                  </p>
               </div>
            ) : (
               <>
                  {filteredMessages.map((message, index) => (
                     // <div key={message.id} className={Style.messagesDetails}>
                     <div
                        key={message.recId}
                        // className="border rounded-md p-2"
                        className=" rounded-md p-3 m-2 shadow-custom"
                     >
                        <div class="md:flex-shrink-0">
                           <img
                              src={`https://gateway.pinata.cloud/ipfs/${message.image}`}
                              alt={message.title}
                              className="rounded-md"
                              width={200}
                              height={150}
                           />
                        </div>
                        <div className="flex flex-col justify-center items-start pt-1">
                           <span className="text-white text-sm pt-1 pb-1">
                              {message.title}
                           </span>
                           <span className="text-gray-400 italic text-small">
                              {message.author}
                           </span>
                           <span className="text-gray-300">
                              $TKC {message.contentPrice}
                           </span>
                        </div>
                        <div className="flex justify-center items-center">
                           {hasPurchased(address, message.recId) ? (
                              <button
                                 disabled
                                 className="w-full text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm"
                              >
                                 Purchased
                              </button>
                           ) : (
                              <>
                                 {/* {isApproved ? ( */}
                                 {approvedProducts.includes(message.recId) ? (
                                    <button
                                       onClick={() => {
                                          setSelectedProduct(message);
                                          buyNow(message, address);
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
                              </>
                           )}
                        </div>
                     </div>
                  ))}
               </>
            )}
         </div>
      </div>
   );
};

export default Messages;
