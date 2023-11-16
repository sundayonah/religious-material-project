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
// import { addSong } from '../reduxToolkit/slices/songsSlices';

const Songs = () => {
   const dispatch = useDispatch();

   const { UnStake } = useContext(StateContext);
   // Initialize purchasedSongs and activeSongIndex state variables
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

   const { address } = useAccount();
   // console.log(address);

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   const approveContractAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   // https://silver-left-ermine-751.mypinata.cloud/ipfs/QmbPA4pm9UzRqrBaaKKxviJZueYBGoiqSSW1UWksNzLh3Z

   const [searchInput, setSearchInput] = useState('');
   const [filteredSongs, setFilteredSongs] = useState(kingdomSongs);

   const fetchPrices = useCallback(async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
         RMTestnetContractAddress,
         RMabi,
         signer
      );

      const updatedSongs = [];
      for (const song of kingdomSongs) {
         const contentId = song.id;

         const contentData = await contract.content(contentId);
         const contentSplit = contentData.toString();
         const contentValues = contentSplit.split(',');

         const contentPrice = contentValues[1] ? parseInt(contentValues[1]) : 0;

         const songWithPrice = { ...song, contentPrice };

         updatedSongs.push(songWithPrice);
      }

      return updatedSongs;
   }, [kingdomSongs]);

   useEffect(() => {
      const fetchSongsWithPrice = async () => {
         const songsWithPrices = await fetchPrices();
         setKingdomSongsWithPrice(songsWithPrices);
         // console.log(songsWithPrices);

         const messagesDetails = await fetchSongs();
         setKingdomSongs(messagesDetails);
         // console.log(messagesDetails);
      };
      fetchSongsWithPrice();
   }, [fetchPrices]);

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

   const hasPurchased = (userAddress, contentId) => {
      const purchasedProducts =
         JSON.parse(localStorage.getItem('purchasedProducts')) || [];
      return purchasedProducts.some((product) => {
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

               setSongLoadingStates((prevStates) => ({
                  ...prevStates,
                  [product.recId]: true,
               }));
               const contract = new ethers.Contract(
                  RMTestnetContractAddress,
                  RMabi,
                  signer
               );

               // Make the purchase through the smart contract
               const contentId = product.counterId;
               const token = TokenAddress;

               let tx;
               tx = await contract.purchase(contentId, token, {
                  gasLimit: 400000, // Adjust the gas limit as needed
                  gasPrice: ethers.utils.parseUnits('10.0', 'gwei'), // Adjust the gas price as needed
               });

               const receipt = await tx.wait();
               console.log(receipt);

               if (receipt.status === 1) {
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

                  console.log(purchasedSongs);

                  // Serialize the purchased product before storing it
                  const serializedProduct = JSON.stringify(purchasedSongs);

                  // Add the purchased product to localStorage
                  const storedPurchasedSoongs =
                     JSON.parse(localStorage.getItem('purchasedProducts')) ||
                     [];
                  storedPurchasedSoongs.push(serializedProduct);
                  localStorage.setItem(
                     'purchasedProducts',
                     JSON.stringify(storedPurchasedSoongs)
                  );

                  const purchasedSongTitle = purchasedSongs.title;

                  // Display a success toast notification
                  toast.success(`${purchasedSongTitle}, Purchase successful`, {
                     duration: 4000,
                     position: 'bottom-right',
                     icon: '✅',
                  });

                  // Call the API to add the transaction
                  const transactionData = {
                     hash: receipt.transactionHash,
                     address: address,
                     counterId: product.counterId,
                     type: 'purchase',
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

                  setSongLoadingStates((prevStates) => ({
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

   // approve address 0x8dFaC13397e766f892bFA55790798A60eaB52921

   if (kingdomSongsWithPrice.length === 0) {
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

   // if (filteredSongs.length === 0) {
   //    return (
   // <div className="flex justify-center items-center mt-80">
   //    <p className="text-2xl text-gray-400">
   //             No songs found matching the search.
   //          </p>
   //       </div>
   //    );
   // }
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
                     <p className="text-2xl text-gray-400">
                        No Songs 🎵 found matching the search.
                     </p>
                  </div>
               ) : (
                  <>
                     {filteredSongs.map((song, index) => (
                        <div
                           key={song.recId}
                           className="flex justify-between items-center mx-1  px-2 py-3  rounded-md  shadow-custom"
                           // className="flex flex-col w-[calc(50% - 1rem)] md:w-[calc(33.33% - 1rem)] lg:w-[calc(25% - 1rem)] 2xl:w-[calc(20% - 1rem)] mb-3 p-2 rounded-md  shadow-custom"
                        >
                           <div className="md:flex-shrink-0">
                              <img
                                 src={`https://gateway.pinata.cloud/ipfs/${song.image}`}
                                 alt={song.title}
                                 className="rounded-md"
                                 width={150}
                                 height={150}
                              />
                           </div>

                           <div className="flex flex-col ml-6 text-sm">
                              <span className=" text-gray-500 text-sm pt-1 pb-1 overflow-hidden whitespace-nowrap">
                                 {song.title.length > 15
                                    ? `${song.title.slice(0, 15)}...`
                                    : song.title}
                              </span>
                              <span className="text-white text-sm">
                                 {song.author}
                              </span>
                              <span className="text-gray-400">
                                 $TKC {song.contentPrice}
                              </span>
                              <div>
                                 {hasPurchased(address, song.recId) ? (
                                    <button
                                       disabled
                                       className="text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm"
                                    >
                                       Purchased
                                    </button>
                                 ) : (
                                    <button
                                       onClick={() => {
                                          setSelectedProduct(song);
                                          buyNow(song, address);
                                       }}
                                       className="text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                                    >
                                       {songLoadingStates[song.recId] ? (
                                          <div class="flex items-center justify-center  px-4 ">
                                             <div class="flex items-center justify-center  w-6 h-6">
                                                <div class="w-2 h-2 mr-1 bg-white rounded-full animate-ping delay-100"></div>
                                                <div class="w-2 h-4 mr-1 bg-white rounded-full animate-pulse delay-500"></div>
                                                <div class="w-2 h-2 mr-1 bg-white rounded-full animate-ping delay-700"></div>
                                                <div class="w-2 h-4 bg-white rounded-full animate-pulse delay-1000"></div>
                                             </div>
                                          </div>
                                       ) : (
                                          'Buy Now'
                                       )}
                                    </button>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))}
                  </>
               )}
            </div>
         </div>
      </>
   );
};

export default Songs;
