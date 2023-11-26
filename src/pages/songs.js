import React, { useEffect, useState, useContext, useCallback } from 'react';
import { StateContext } from '@/Context/ReligiousContext';
import { useAccount } from 'wagmi';
import { useDispatch } from 'react-redux';
import RMabi from '@/Contract/rm-abi.json';
import approveAbi from '@/Contract/approve.json';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { fetchSongs } from '@/components/fetchProducts';
import {
   LoadingSpinner,
   ProductLenghtLoadingSpinner,
   SearchIconWhenThereIsNoFilter,
} from '@/components/utils';
import Image from 'next/image';
import SongModal from '@/components/modal/songModalContent';
import Link from 'next/link';
// import { addSong } from '../reduxToolkit/slices/songsSlices';

const Songs = () => {
   const dispatch = useDispatch();

   const {
      approvedProducts,
      Approved,
      setApprovedProducts,
      approveLoadingStates,
      isAllowance,
      fetchSongPrices,
      fetchPrices,
   } = useContext(StateContext); // Initialize purchasedSongs and activeSongIndex state variables

   const [purchasedSongs, setPurchasedSongs] = useState([]);
   const [activeSongIndex, setActiveSongIndex] = useState(null);

   const silver = 'QmbPA4pm9UzRqrBaaKKxviJZueYBGoiqSSW1UWksNzLh3Z';
   const silverHttp = ` https://silver-left-ermine-751.mypinata.cloud/ipfs/${silver}`;

   const [silverLeft, setSilverleft] = useState([]);

   const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9';
   const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
   const [imageUrls, setImageUrls] = useState([]);
   const [messages, setMessages] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [songLoadingStates, setSongLoadingStates] = useState({});
   const [kingdomSongs, setKingdomSongs] = useState([]);
   const [kingdomSongsWithPrice, setKingdomSongsWithPrice] = useState([]);
   const [individualPurchasedStatus, setIndividualPurchasedStatus] =
      useState(false);
   const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
   const [approvalmodalContent, setApprovalModalContent] = useState(null);

   const { address } = useAccount();
   // console.log(address);

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   const approveContractAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   // https://silver-left-ermine-751.mypinata.cloud/ipfs/QmbPA4pm9UzRqrBaaKKxviJZueYBGoiqSSW1UWksNzLh3Z

   const [searchInput, setSearchInput] = useState('');
   const [filteredSongs, setFilteredSongs] = useState(kingdomSongs);

   // const fetchPrices = useCallback(async () => {
   //    // const provider = new ethers.providers.Web3Provider(window.ethereum);
   //    // const signer = provider.getSigner();

   //    const alchemyApiKey = 'o_O5LwKav_r5UECR-59GtRZsIqnhD0N8';
   //    const provider = new ethers.providers.JsonRpcProvider(
   //       `https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}`
   //    );

   //    // const signer = provider.getSigner();

   //    const contract = new ethers.Contract(
   //       RMTestnetContractAddress,
   //       RMabi,
   //       provider
   //       // signer
   //    );

   //    const updatedSongs = [];
   //    for (const song of kingdomSongs) {
   //       const contentId = song.id;

   //       const contentData = await contract.content(contentId);
   //       const contentSplit = contentData.toString();
   //       const contentValues = contentSplit.split(',');

   //       const contentPrice = contentValues[1] ? parseInt(contentValues[1]) : 0;

   //       const songWithPrice = { ...song, contentPrice };

   //       updatedSongs.push(songWithPrice);
   //    }

   //    return updatedSongs;
   // }, [kingdomSongs]);

   // const songsContent = async () => {
   //    try {
   //       const messageURL =
   //          'http://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllSongs';
   //       const response = await axios.get(messageURL);

   //       const data = response.data.data;

   //       // console.log('Original Data:', data);

   //       const songDetails = await Promise.all(
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

   //       // console.log('Message Details:', songDetails);

   //       // const filteredMessages = songDetails.filter(
   //       //    (detail) => detail !== null
   //       // );
   //       setKingdomSongs(songDetails);

   //       // console.log('Filtered Messages:', songDetails);

   //       // Return the filteredDownloads as the API response
   //       // res.status(200).json(filteredMessages);
   //    } catch (error) {
   //       console.error('Error fetching Message details:', error);
   //    }
   // };

   useEffect(() => {
      const fetchSongsWithPrice = async () => {
         try {
            const songsWithPrices = await fetchPrices(kingdomSongs);
            setKingdomSongsWithPrice(songsWithPrices);
            // console.log(songsWithPrices);
            // const response = await axios.get('/api/song');
            // console.log(response);
            // const data = response.data;
            // console.log(data);

            // setKingdomSongs(data);

            const songsDetails = await fetchSongs();
            setKingdomSongs(songsDetails);
            // console.log(songsDetails);
         } catch (error) {
            console.error('Error fetching songs data:', error);
         }
      };
      // songsContent();
      fetchSongsWithPrice();
   }, [fetchPrices, kingdomSongs]);

   useEffect(() => {
      // Filter the messages based on the search input
      const filtered = kingdomSongsWithPrice.filter(
         (song) =>
            song.author.toLowerCase().includes(searchInput.toLowerCase()) ||
            song.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      // console.log(filtered.length);
      setFilteredSongs(filtered);
   }, [searchInput, kingdomSongsWithPrice]);

   const checkUserBalance = async (userAddress) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(userAddress);
      return ethers.utils.formatEther(balance);
   };

   useEffect(() => {
      const checkPurchasedStatus = async () => {
         try {
            const response = await axios.get(
               `https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`
            );

            const purchasedProducts = response.data.data;
            // console.log(purchasedProducts);
            const purchasedMap = {};

            filteredSongs.forEach((song) => {
               const isPurchased = purchasedProducts.some(
                  (product) => product.counterId === song.counterId
               );
               purchasedMap[song.counterId] = isPurchased;
            });

            // console.log(purchasedMap)

            setIndividualPurchasedStatus(purchasedMap);
         } catch (error) {
            console.error('Error checking purchase status:', error);
         }
      };

      checkPurchasedStatus();
   }, [address, filteredSongs]);

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

               setSongLoadingStates((prevStates) => ({
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
                  const purchasedSongs = {
                     id: product.recId,
                     author: product.author,
                     title: product.title,
                     image: product.image,
                     category: product.category,
                     bookFile: product.bookFile,
                     address: address, // Store the user's address with the purchased book
                  };

                  const purchasedSongTitle = purchasedSongs.title;

                  // Display a success toast notification
                  toast.success(`${purchasedSongTitle}, Purchase successful`, {
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

                  setSongLoadingStates((prevStates) => ({
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
            console.error('Product not found in Song Details.');
         }
      } catch (err) {
         console.error('Purchase failed:', err.message);
         setSongLoadingStates((prevStates) => ({
            ...prevStates,
            [product.recId]: false,
         }));
      }
      setSongLoadingStates((prevStates) => ({
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

   // approve address 0x8dFaC13397e766f892bFA55790798A60eaB52921

   if (kingdomSongsWithPrice.length === 0) {
      return (
         <>
            <ProductLenghtLoadingSpinner />
         </>
      );
   }
   return (
      <>
         <div className="w-[95%] m-auto mt-28 ">
            <Toaster />
            <div>
               <form className="flex mb-8 justify-center items-center">
                  <input
                     className="w-[80%] md:w-[320px] px-4 py-2 rounded-md border border-transparent bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                     type="text"
                     placeholder="search songs..."
                     value={searchInput}
                     onChange={(e) => setSearchInput(e.target.value)}
                  />
               </form>
            </div>
            <div className="flex flex-wrap gap-3 p-2 justify-center items-center">
               {filteredSongs.length === 0 ? (
                  <div className="flex justify-center items-center mt-24">
                     {SearchIconWhenThereIsNoFilter('Song')}
                  </div>
               ) : (
                  <>
                     {filteredSongs.map((song, index) => (
                        <div
                           key={song.recId}
                           className="flex justify-between items-center mx-1  px-2 py-3  rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-custom"
                           // className="flex flex-col w-[calc(50% - 1rem)] md:w-[calc(33.33% - 1rem)] lg:w-[calc(25% - 1rem)] 2xl:w-[calc(20% - 1rem)] mb-3 p-2 rounded-md  shadow-custom"
                        >
                           {/* <div className="md:flex-shrink-0"> */}
                           {/* <div className=""> */}
                           <div className="flex items-center w-1/2">
                              <Link
                                 href={`/singleSongs?id=${song.recId}`}
                                 passHref
                              >
                                 <Image
                                    src={`https://gateway.pinata.cloud/ipfs/${song.image}`}
                                    alt={song.title}
                                    width={150}
                                    height={150}
                                    className="h-42 w-52 md:w-52 rounded-md object-center"
                                 />
                              </Link>
                           </div>

                           <div className=" flex flex-col ml-6 w-1/2 text-sm">
                              <span className=" text-white text-md pt-1 pb-1 overflow-hidden whitespace-nowrap">
                                 {song.title.lengt > 15
                                    ? `${song.title.slice(0, 15)}...`
                                    : song.title}
                              </span>
                              <span className="text-gray-500 text-sm">
                                 {song.author}
                              </span>
                              <span className="text-gray-400">
                                 $TKC{' '}
                                 {(song.contentPrice / 1e15).toLocaleString()}
                              </span>
                              <div>
                                 <button
                                    onClick={() => {
                                       openApprovalModal(song);
                                    }}
                                    className="w-full text-white  bg-yellow-700 py-1 px-5 rounded-sm"
                                 >
                                    Approve
                                 </button>
                                 {/* {individualPurchasedStatus[song.counterId] ? (
                                    <button
                                       disabled
                                       className="w-full text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm cursor-not-allowed"
                                    >
                                       Purchased
                                    </button>
                                 ) : (
                                    <>
                                       {approvedProducts.includes(song.recId) ||
                                       isAllowance ? (
                                          <button
                                             onClick={() => {
                                                setSelectedProduct(song);
                                                buyNow(song, address);
                                             }}
                                             className="w-full text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                          >
                                             {songLoadingStates[song.recId] ? (
                                                <LoadingSpinner />
                                             ) : (
                                                'Buy Now'
                                             )}
                                          </button>
                                       ) : (
                                          <button
                                             onClick={() => {
                                                // setSelectedProduct(song);
                                                Approved(song);
                                             }}
                                             className="w-full text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                          >
                                             {approveLoadingStates[
                                                song.recId
                                             ] ? (
                                                <LoadingSpinner />
                                             ) : (
                                                'Approve'
                                             )}
                                          </button>
                                       )}
                                    </>
                                 )} */}
                              </div>
                           </div>
                        </div>
                     ))}
                  </>
               )}
            </div>
            <SongModal
               isOpen={isApprovalModalOpen}
               closeModal={closeApprovalModal}
               song={approvalmodalContent}
               individualPurchasedStatus={individualPurchasedStatus}
               buyNow={buyNow}
               songLoadingStates={songLoadingStates}
            />
         </div>
      </>
   );
};

export default Songs;
