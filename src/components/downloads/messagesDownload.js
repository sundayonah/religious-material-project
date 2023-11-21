// import { StateContext } from '@/Context/ReligiousContext';
// import React, { useContext, useEffect, useState } from 'react';
// import { useAccount } from 'wagmi';
// import { PauseIcon, PlayIcon, ThumbsDown, ThumbsUp } from '../icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleDislike, toggleLike } from '@/reduxToolkit/slices/audioSlice';
// import { saveLikesAndDislikesToLocalStorage } from '../local-storage';

// export const MessagesDownload = ({
//    selectedFilter,
//    filteredDownloadProduct,
// }) => {
//    const { address } = useAccount();
//    const dispatch = useDispatch();

//    const { handlePlayClick, audioRefs, handleSongEnd } =
//       useContext(StateContext);
//    const activeSongId = useSelector((state) => state.audio.activeSongId);
//    const isPlaying = useSelector(
//       (state) => state.audio.songStates[state.audio.activeSongId]
//    );

//    const likedSongs = useSelector((state) => state.audio.likedSongs);
//    const dislikedSongs = useSelector((state) => state.audio.dislikedSongs);

//    const [purchasedProducts, setPurchasedProducts] = useState([]);
//    const [hoveredItemId, setHoveredItemId] = useState(null);
//    const [durationsUpdated, setDurationsUpdated] = useState(null);
//    const [songDurations, setSongDurations] = useState({});
//    const [sideBarOpen, setSideBarOpen] = useState(false);

//    // useEffect(() => {
//    //    const getTransactions = async () => {
//    //       const sermonUrl = `http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetTransactions/${address}`;
//    //       // ' http://kingdomcoin-001-site1.ctempurl.com/MESSAGE/247e1068-26d0-4597-8dbe-6b6b35aeebae.mp3';

//    //       const res = await fetch(sermonUrl);
//    //       const data = await res.json();

//    //       console.log(data);
//    //    };
//    //    getTransactions();
//    // }, [address]);

//    useEffect(() => {
//       // Retrieve the list of purchased products from local storage
//       const storedPurchasedProducts =
//          JSON.parse(localStorage.getItem('purchasedMessages')) || [];
//       // console.log(storedPurchasedProducts);

//       // Deserialize the stored products and filter them based on the current user's address
//       const userPurchasedProducts = storedPurchasedProducts
//          .map((serializedProduct) => JSON.parse(serializedProduct))
//          .filter((item) => {
//             return item.address === address;
//          });
//       //console.log(userPurchasedProducts);
//       setPurchasedProducts(userPurchasedProducts);
//    }, [address]);

//    const formatTime = (time) => {
//       const minutes = Math.floor(time / 60);
//       const seconds = Math.floor(time % 60);
//       return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
//          2,
//          '0'
//       )}`;
//    };

//    useEffect(() => {
//       const fetchSongDurations = async () => {
//          const newDurations = {};

//          for (const { id, file } of purchasedProducts) {
//             const audio = new Audio(file);

//             // Use the promise-based approach to get duration
//             const duration = await new Promise((resolve) => {
//                audio.addEventListener('loadedmetadata', () => {
//                   resolve(audio.duration);
//                });
//                audio.load();
//             });
//             newDurations[id] = duration;
//          }
//          setSongDurations(newDurations);
//       };

//       if (purchasedProducts.length > 0) {
//          fetchSongDurations();
//       }
//    }, [purchasedProducts]);

//    const handleToggleLike = (id) => {
//       if (likedSongs[id]) {
//          dispatch(toggleLike({ songId: id, isDisliked: false }));
//       } else {
//          dispatch(toggleLike({ songId: id, isLiked: true }));
//       }
//       // Update local storage after dispatching actions
//       saveLikesAndDislikesToLocalStorage(likedSongs, dislikedSongs);
//    };

//    const handleToggleDislike = (id) => {
//       if (dislikedSongs[id]) {
//          dispatch(toggleDislike({ songId: id, isLiked: false }));
//       } else {
//          dispatch(toggleDislike({ songId: id, isDisliked: true }));
//       }
//       // Update local storage after dispatching actions
//       saveLikesAndDislikesToLocalStorage(likedSongs, dislikedSongs);
//    };

//    // Filter the purchased products based on the selected filter
//    purchasedProducts.filter((product) => {
//       if (selectedFilter === 'All') {
//          return true; // Show all products
//       } else if (selectedFilter === 'Messages') {
//          return /* your condition to filter songs */;
//       }
//       // Handle other cases for Messages, etc.
//       return /* your condition for Messages */;
//    });

//    //    console.log(filteredProducts);

//    if (purchasedProducts.length === 0) {
//       return (
//          <div className="mt-28 text-gray-500 pl-5">
//             <h1 className="capitalize text-2xl">
//                Connect your wallet to see all your messages
//             </h1>
//          </div>
//       );
//    }

//    return (
//       <>
//          <div className="w-full flex flex-col gap-3 ">
//             {purchasedProducts.map(({ id, file, image, title, author }) => (
//                <div
//                   key={id}
//                   className="flex justify-between items-center py-2 bg-transparent border-b-[1px] border-gray-700"
//                   onMouseEnter={() => setHoveredItemId(id)}
//                   onMouseLeave={() => setHoveredItemId(null)}
//                >
//                   <div className="text-gray-700 relative">
//                      <audio
//                         preload="auto"
//                         controls={false}
//                         loop
//                         style={{ display: 'none' }}
//                         ref={(ref) => (audioRefs[id] = ref)}
//                         onEnded={() => handleSongEnd(id)}
//                      >
//                         <source src={file} type="audio/mpeg" />
//                      </audio>
//                      <img
//                         src={`https://gateway.pinata.cloud/ipfs/${image}`}
//                         alt={`Image ${title}`}
//                         className="rounded-md cursor-pointer"
//                         width={50}
//                         height={50}
//                         onClick={() => handlePlayClick(id)}
//                      />
//                      {activeSongId === id || hoveredItemId === id ? (
//                         <div className="flex justify-center items-center p-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
//                            <button
//                               onClick={() =>
//                                  handlePlayClick(id, title, author, image)
//                               }
//                            >
//                               {activeSongId === id ? (
//                                  isPlaying ? (
//                                     <PauseIcon />
//                                  ) : (
//                                     <PlayIcon />
//                                  )
//                               ) : (
//                                  <PlayIcon />
//                               )}
//                            </button>
//                         </div>
//                      ) : null}
//                   </div>
//                   <span className="w-[150px] text-white text-sm overflow-hidden whitespace-nowrap">
//                      {title.length > 20 ? `${title.slice(0, 20)}...` : title}
//                   </span>
//                   <span className="w-[150px] text-gray-600 text-sm overflow-hidden whitespace-nowrap">
//                      {author.length > 20 ? `${author.slice(0, 20)}...` : author}
//                   </span>
//                   <div className="w-[50px] flex items-center space-x-4">
//                      {hoveredItemId === id ? (
//                         <>
//                            <button
//                               onClick={() => handleToggleLike(id)}
//                               className={`${
//                                  likedSongs[id]
//                                     ? 'text-likeColor'
//                                     : 'text-white'
//                               }`}
//                            >
//                               <ThumbsUp />
//                            </button>
//                            <button
//                               className={`${
//                                  dislikedSongs[id]
//                                     ? 'text-likeColor'
//                                     : 'text-white'
//                               }`}
//                               // className="text-white"
//                               onClick={() => handleToggleDislike(id)}
//                            >
//                               <ThumbsDown />
//                            </button>
//                         </>
//                      ) : (
//                         <>
//                            <button className="text-likeColor">
//                               {likedSongs[id] && <ThumbsUp />}
//                               {dislikedSongs[id] && <ThumbsDown />}
//                            </button>
//                         </>
//                      )}
//                   </div>
//                   <span className="text-gray-600">
//                      {songDurations[id] ? formatTime(songDurations[id]) : '0'}
//                   </span>
//                </div>
//             ))}
//          </div>
//       </>
//    );
// };
