import { StateContext } from '@/Context/ReligiousContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import {
   CloseIcon,
   FilterIcon,
   PauseIcon,
   PlayIcon,
   ThumbsDown,
   ThumbsDownSolid,
   ThumbsUp,
   ThumbsUpSolid,
} from '../components/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
   setActiveSong,
   toggleDislike,
   toggleLike,
   togglePlayback,
   updateSongDetails,
} from '@/reduxToolkit/slices/audioSlice';
import { saveLikesAndDislikesToLocalStorage } from '../components/local-storage';
import AudioControl from '@/components/audioControl';
import { getTransactions } from '@/components/fetchProducts';
import axios from 'axios';
import {
   LoadingSpinner,
   ProductLenghtLoadingSpinner,
   SearchIconWhenThereIsNoFilter,
} from '@/components/utils';
import Image from 'next/image';
import { BooksDownload } from '@/components/booksDownload';

const ProductsDownload = ({ selectedFilter, filteredDownloadProduct }) => {
   // }) => {
   const { address } = useAccount();
   const dispatch = useDispatch();

   //    const { handlePlayClick, audioRefs, handleSongEnd } =
   //       useContext(StateContext);

   const audioRefs = useRef(null);
   //    const audioRefs = {};
   const activeSongId = useSelector((state) => state.audio.activeSongId);
   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );

   const likedSongs = useSelector((state) => state.audio.likedSongs);
   const dislikedSongs = useSelector((state) => state.audio.dislikedSongs);

   const [purchasedProducts, setPurchasedProducts] = useState([]);
   const [filterProducts, setFilterProducts] = useState([]);
   const [hoveredItemId, setHoveredItemId] = useState(null);
   const [durationsUpdated, setDurationsUpdated] = useState(null);
   const [songDurations, setSongDurations] = useState({});
   const [sideBarOpen, setSideBarOpen] = useState(false);
   const [searchInput, setSearchInput] = useState('');
   const [productsModal, setProductsModal] = useState(false);
   const [productsFilter, setProductsFilter] = useState('');
   const [selectedType, setSelectedType] = useState('all');
   const [pdfPurchasedProducts, setPdfPurchasedProducts] = useState([]);
   const [mp3PurchasedProducts, setMp3PurchasedProducts] = useState([]);
   const [productMerged, setProductMerged] = useState([]);

   //    useEffect(() => {
   //       const getTransactions = async () => {
   //          const downloadsUrl = `http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetTransactions/${address}`;

   //          try {
   //             const res = await axios.get(downloadsUrl);
   //             const data = res.data.data;
   //             // console.log(data);

   //             const downloadDetails = await Promise.all(
   //                data.map(async (download) => {
   //                   const ipfsHash = download.hash;
   //                   const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;

   //                   const pinataResponse = await axios.get(pinataApiUrl);

   //                   if (pinataResponse.status === 200) {
   //                      const ipfsContent = pinataResponse.data;

   //                      // Assuming ipfsContent is in JSON format
   //                      const { author, title, image } = ipfsContent;

   //                      const completeDownloadInfo = {
   //                         recId: download.recId,
   //                         hash: download.hash,
   //                         counterId: download.counterId,
   //                         address: download.address,
   //                         type: download.type,
   //                         transactionHash: download.transactionHash,
   //                         dataFile: download.dataFile,
   //                         author,
   //                         title,
   //                         image,
   //                      };

   //                      console.log(completeDownloadInfo);
   //                      return completeDownloadInfo;
   //                   } else {
   //                      console.error(
   //                         'Pinata API returned an error:',
   //                         pinataResponse.status,
   //                         pinataResponse.statusText
   //                      );
   //                      return null;
   //                   }
   //                })
   //             );

   //             // Remove null values (failed downloads) and update state with the array
   //             const validDownloadDetails = downloadDetails.filter(
   //                (detail) => detail !== null
   //             );
   //             setPurchasedProducts(validDownloadDetails);
   //          } catch (error) {
   //             console.error('Error fetching download details:', error);
   //          }
   //       };

   //       getTransactions();
   //    }, [address]);

   const openBookModal = () => {
      setProductsModal(true);
   };

   const closeBookModal = () => {
      setProductsModal(false);
   };

   // useEffect(() => {
   //    const getAllDownload = async () => {
   //       try {
   //          const response = await axios.get(
   //             `/api/getAllDownload?address=${address}`
   //          );
   //          const data = response.data.data;
   //          console.log(data);

   //          setPurchasedProducts(data);
   //       } catch (error) {
   //          console.error('Error fetching datas:', error);
   //       }
   //    };
   //    getAllDownload();
   // }, [address]);

   useEffect(() => {
      const getDownloads = async () => {
         try {
            const tx = await getTransactions(address);

            // setProductButton(tx);
            // console.log(tx);

            // Separate books from other types
            const pdfProducts = tx.filter((product) => product.type === 'BOOK');
            const mp3Products = tx.filter((product) => product.type !== 'BOOK');

            // console.log(pdfProducts);
            // console.log(mp3Products);

            setPdfPurchasedProducts(pdfProducts);
            setMp3PurchasedProducts(mp3Products);

            const merged = [...pdfProducts, ...mp3Products];
            setProductMerged(tx);

            // console.log(merged);
         } catch (error) {
            console.error('Error fetching download details:', error);
         }
      };

      getDownloads();
   }, [address]);

   // Fiter Products by Types, author, title
   const displayButtons = () => {
      if (!productMerged.length) {
         return null; // Handle the case where products are not loaded yet
      }

      const buttons = [
         'all',
         // ...new Set(mp3PurchasedProducts.map((product) => product.type)),
         ...new Set(productMerged.map((product) => product.type)),
      ];
      // console.log(buttons);

      return buttons.map((button) => (
         <button
            className="block px-4 py-2 w-full text-left hover:bg-[#342b1c] rounded-lg text-lg capitalize  text-gray-500 hover:text-gray-600 "
            key={button}
            onClick={() => setSelectedType(button)}
         >
            {button}
         </button>
      ));
   };
   displayButtons();

   // Filter the products based on the search input and type
   // useEffect(() => {
   //    if (!productMerged || !pdfPurchasedProducts) {
   //       return;
   //    }

   //    let filtered = productMerged.filter(
   //       (product) =>
   //          product.type !== 'BOOK' &&
   //          pdfPurchasedProducts.some(
   //             (pdfProduct) => pdfProduct.recId === product.recId
   //          ) &&
   //          (product.author.toLowerCase().includes(searchInput.toLowerCase()) ||
   //             product.title.toLowerCase().includes(searchInput.toLowerCase()))
   //    );

   //    if (selectedType !== 'all') {
   //       filtered = filtered.filter((product) => product.type === selectedType);
   //    }

   //    setFilterProducts(filtered);
   // }, [searchInput, productMerged, selectedType, pdfPurchasedProducts]);

   // Filter the messages based on the search input and type
   useEffect(() => {
      ///// let filtered = [...kingdomBooksWithPrice];

      let filtered = mp3PurchasedProducts.filter(
         // let filtered = productMerged.filter(
         (message) =>
            message.author.toLowerCase().includes(searchInput.toLowerCase()) ||
            message.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      // console.log(filtered);

      if (selectedType !== 'all') {
         filtered = filtered.filter((product) => product.type === selectedType);
      }

      setFilterProducts(filtered);
   }, [searchInput, mp3PurchasedProducts, selectedType]);
   // }, [searchInput, productMerged, selectedType]);

   const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
         2,
         '0'
      )}`;
   };

   useEffect(() => {
      const fetchSongDurations = async () => {
         try {
            const newDurations = {};

            for (const { recId, dataFile, type } of mp3PurchasedProducts) {
               const audioFileURL = `https://kinccoin.bsite.net/${type}/${dataFile}`; // Replace this with your audio file URL
               const audio = new Audio(audioFileURL);
               // console.log(audio);

               // Promisify getting the duration
               const duration = await new Promise((resolve, reject) => {
                  audio.addEventListener('loadedmetadata', () => {
                     // Ensure that the duration is finite before resolving
                     if (!isNaN(audio.duration) && isFinite(audio.duration)) {
                        resolve(audio.duration);
                     } else {
                        reject(new Error('Invalid audio duration'));
                     }
                  });
                  audio.addEventListener('error', (error) => {
                     reject(error); // Reject promise on error
                  });
                  audio.preload = 'metadata'; // Preload metadata for duration
                  audio.load();
               });

               // console.log(duration);

               newDurations[recId] = duration;
            }
            // console.log(newDurations);
            setSongDurations(newDurations);
         } catch (error) {
            console.error('Error fetching song durations:', error);
            // Handle errors, display a message, or retry fetching durations
         }
      };

      if (mp3PurchasedProducts.length > 0) {
         fetchSongDurations();
      }
   }, [mp3PurchasedProducts]);

   //    useEffect(() => {
   //       const fetchSongDurations = async () => {
   //          const newDurations = {};

   //          for (const { recId, dataFile } of mp3PurchasedProducts) {
   //             console.log({ recId, dataFile });
   //             const audio = new Audio(dataFile);
   //             console.log(audio);

   //             // Use the promise-based approach to get duration
   //             const duration = await new Promise((resolve) => {
   //                audio.addEventListener('loadedmetadata', () => {
   //                   resolve(audio.duration);
   //                });
   //                audio.load();
   //             });
   //             newDurations[recId] = duration;
   //             console.log(duration);
   //          }
   //          console.log(newDurations);
   //          setSongDurations(newDurations);
   //       };

   //       if (mp3PurchasedProducts.length > 0) {
   //          fetchSongDurations();
   //       }
   //    }, [mp3PurchasedProducts]);

   const handleSongEnd = (recId) => {
      // Check if the download should be repeated, if not, update its state
      if (!repeat) {
         dispatch(togglePlayback(recId)); // Update the playback state in the Redux store
      }
   };

   const handlePlayClick = (recId, title, artist, imageUrl) => {
      const audio = audioRefs[recId];

      if (audio) {
         if (recId === activeSongId) {
            if (audio.paused) {
               audio.play().catch((error) => {
                  console.error('Failed to play audio:', error);
               });
            } else {
               audio.pause();
            }
         } else {
            dispatch(setActiveSong(recId));
            dispatch(updateSongDetails({ title, artist, imageUrl }));

            Object.keys(audioRefs).forEach((songId) => {
               if (songId !== recId) {
                  const otherAudio = audioRefs[songId];
                  if (otherAudio) {
                     otherAudio.pause();
                     dispatch(togglePlayback(songId));
                  }
               }
            });
         }
         dispatch(togglePlayback(recId));
      }
   };

   const handleToggleLike = (recId) => {
      if (likedSongs[recId]) {
         dispatch(toggleLike({ songId: recId, isDisliked: false }));
      } else {
         dispatch(toggleLike({ songId: recId, isLiked: true }));
      }
      // Update local storage after dispatching actions
      saveLikesAndDislikesToLocalStorage(likedSongs, dislikedSongs);
   };

   const handleToggleDislike = (recId) => {
      if (dislikedSongs[recId]) {
         dispatch(toggleDislike({ songId: recId, isLiked: false }));
      } else {
         dispatch(toggleDislike({ songId: recId, isDisliked: true }));
      }
      // Update local storage after dispatching actions
      saveLikesAndDislikesToLocalStorage(likedSongs, dislikedSongs);
   };

   // Filter the purchased products based on the selected filter
   mp3PurchasedProducts.filter((product) => {
      if (selectedFilter === 'All') {
         return true; // Show all products
      } else if (selectedFilter === 'Messages') {
         return /* your condition to filter songs */;
      }
      // Handle other cases for Messages, etc.
      return /* your condition for Messages */;
   });

   //    console.log(filteredProducts);

   if (mp3PurchasedProducts.length === 0) {
      return (
         <div className="flex flex-col justify-center items-center space-y-9 mt-28 text-gray-500 pl-5">
            {/* <ProductLenghtLoadingSpinner /> */}
            <h1 className="capitalize text-2xl">
               Connect your wallet to see all your purchased Products
            </h1>
            {/* <img
               src="/images/connect-your-wallet.png"
               alt="connect your wallet"
               width={300}
               height={200}
               className=""
            /> */}
         </div>
      );
   }

   return (
      <>
         <div className="md:w-[80%] px-4 flex flex-col m-auto mt-28">
            <div className="flex justify-center items-center mb-7 relative">
               <div
                  className=" flex justify-center items-center mb-4"
                  //    ref={sidebarRef}
               >
                  <input
                     type="text"
                     className=" md:w-[320px] px-4 py-2 rounded-md border border-transparent bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                     placeholder="search products by type, title, author..."
                     value={searchInput}
                     onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button
                     onClick={openBookModal}
                     className="flex mx-3 py-1 px-3 text-[#DAA851] rounded-md space-x-2 border border-[#DAA851]"
                  >
                     <span className="text-white text-sm">Filter</span>
                     <FilterIcon />
                  </button>
               </div>
               {productsModal && (
                  <div className="absolute top-12 right-0 md:right-8 lg:right-1/4 xl:right-72 2xl:right-1/3 flex items-center z-10 ">
                     <div className="w-64 p-4 bg-[#2c2518] rounded-lg shadow-custom">
                        <div className="flex justify-end">
                           <button
                              onClick={closeBookModal}
                              className="text-white rounded-md p-1  hover:bg-[#342b1c]"
                           >
                              <CloseIcon />
                           </button>
                        </div>
                        <span className="text-[#daa851]">TYPE</span>
                        <div>{displayButtons()}</div>
                     </div>
                  </div>
               )}
            </div>

            {filterProducts.length !== 0 ? (
               <>
                  <div className=" w-[90%] flex justify-start items-center text-gray-200 space-x-3 mb-3 ">
                     <span className="flex justify-center items-center border border-[#daa851] rounded-full px-2 py-1">
                        {productMerged.length}
                     </span>
                     <span className="">Item(s) Purchased 🛒 🛍️ </span>
                  </div>
                  {filterProducts.map(
                     ({ recId, dataFile, type, image, title, author }) => (
                        <div
                           key={recId}
                           className="flex justify-between items-center py-2 bg-transparent border-b-[1px] border-gray-700"
                           onMouseEnter={() => setHoveredItemId(recId)}
                           onMouseLeave={() => setHoveredItemId(null)}
                        >
                           <div className="text-gray-700 relative">
                              <audio
                                 preload="auto"
                                 controls={false}
                                 loop
                                 style={{ display: 'none' }}
                                 ref={(ref) => (audioRefs[recId] = ref)}
                                 onEnded={() => handleSongEnd(recId)}
                              >
                                 <source
                                    src={`https://kinccoin.bsite.net/${type}/${dataFile}`}
                                    type="audio/mpeg"
                                 />
                              </audio>
                              <Image
                                 src={`https://gateway.pinata.cloud/ipfs/${image}`}
                                 alt={`Image ${title}`}
                                 className="rounded-md cursor-pointer"
                                 width={50}
                                 height={50}
                                 onClick={() => handlePlayClick(recId)}
                              />
                              {activeSongId === recId ||
                              hoveredItemId === recId ? (
                                 <div className="flex justify-center items-center p-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                                    <button
                                       onClick={() =>
                                          handlePlayClick(
                                             recId,
                                             title,
                                             author,
                                             image
                                          )
                                       }
                                    >
                                       {activeSongId === recId ? (
                                          isPlaying ? (
                                             <PauseIcon />
                                          ) : (
                                             <PlayIcon />
                                          )
                                       ) : (
                                          <PlayIcon />
                                       )}
                                    </button>
                                 </div>
                              ) : null}
                           </div>
                           <div className="w-[50%] flex justify-between px-4 ">
                              <span className="w-[150px] text-white  text-sm overflow-hidden whitespace-nowrap">
                                 {title.length > 20
                                    ? `${title.slice(0, 20)}...`
                                    : title}
                              </span>
                              <span className="w-[150px] text-gray-600 text-sm overflow-hidden whitespace-nowrap">
                                 {author.length > 20
                                    ? `${author.slice(0, 20)}...`
                                    : author}
                              </span>
                           </div>
                           {/* <span>{type}</span> */}
                           <div className="w-[50px] flex items-center space-x-4">
                              {hoveredItemId === recId ? (
                                 <>
                                    <button
                                       onClick={() => handleToggleLike(recId)}
                                       className={`${
                                          likedSongs[recId]
                                             ? 'text-likeColor'
                                             : 'text-white'
                                       }`}
                                    >
                                       {/* <ThumbsUp /> */}
                                       {likedSongs[recId] ? (
                                          <ThumbsUpSolid />
                                       ) : (
                                          <ThumbsUp />
                                       )}
                                    </button>
                                    <button
                                       className={`${
                                          dislikedSongs[recId]
                                             ? 'text-likeColor'
                                             : 'text-white'
                                       }`}
                                       // className="text-white"
                                       onClick={() =>
                                          handleToggleDislike(recId)
                                       }
                                    >
                                       {dislikedSongs[recId] ? (
                                          <ThumbsDownSolid />
                                       ) : (
                                          <ThumbsDown />
                                       )}
                                    </button>
                                 </>
                              ) : (
                                 <>
                                    <button className="text-likeColor">
                                       {/* {likedSongs[recId] && <ThumbsUp />}
                                       {dislikedSongs[recId] && <ThumbsDown />} */}
                                       {likedSongs[recId] && <ThumbsUpSolid />}
                                       {dislikedSongs[recId] && (
                                          <ThumbsDownSolid />
                                       )}
                                    </button>
                                 </>
                              )}
                           </div>
                           <span className="text-gray-600">
                              {songDurations[recId]
                                 ? formatTime(songDurations[recId])
                                 : '0'}
                           </span>
                        </div>
                     )
                  )}
               </>
            ) : (
               <>{SearchIconWhenThereIsNoFilter('Product')}</>
            )}
            <div>
               <BooksDownload pdfPurchasedProducts={pdfPurchasedProducts} />
            </div>
         </div>
         {isPlaying || activeSongId ? (
            <AudioControl
               audioRefs={audioRefs}
               mp3PurchasedProducts={mp3PurchasedProducts}
            />
         ) : null}
      </>
   );
};

export default ProductsDownload;
