// import { useEffect, useState } from 'react';

// const ImageList = () => {
//    const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9'; // Replace with your IPFS hash
//    const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
//    const [imageUrls, setImageUrls] = useState([]);

//    const fetchImageUrls = async () => {
//       try {
//          // Fetch the list of files and directories in the IPFS folder
//          const response = await fetch(gatewayUrl);
//          if (!response.ok) {
//             throw new Error('Failed to fetch folder content');
//          }

//          // Assuming the response is HTML containing links to files
//          const html = await response.text();

//          // Parse the HTML to extract links to image files
//          const parser = new DOMParser();
//          const doc = parser.parseFromString(html, 'text/html');
//          const links = Array.from(doc.querySelectorAll('a'));

//          // Filter links to include only image files ending with "/img.png"
//          const imageLinks = links.filter((link) =>
//             link.getAttribute('href').includes('/img')
//          );

//          // Create image URLs from the links
//          const urls = imageLinks.map(
//             (link) => `https://ipfs.io${link.getAttribute('href')}`
//          );

//          // Remove duplicates by converting the array to a Set and then back to an array
//          const uniqueUrls = Array.from(new Set(urls));

//          setImageUrls(uniqueUrls);
//       } catch (error) {
//          console.error('Error fetching folder content:', error);
//       }
//    };

//    useEffect(() => {
//       fetchImageUrls();
//    }, [gatewayUrl]);

//    return (
//       <div className="mt-28">
//          <h1>IPFS</h1>
//          <ul className="flex space-x-3">
//             {imageUrls.map((imageUrl, index) => (
//                <li key={index}>
//                   <img
//                      src={imageUrl}
//                      alt={`Image ${index}`}
//                      width={400}
//                      height={250}
//                   />
//                </li>
//             ))}
//          </ul>
//       </div>
//    );
// };

// export default ImageList;

import React, { useEffect, useState } from 'react';
// import Style from '@/styles/messages.module.css';
import { create } from 'ipfs-http-client';
import axios from 'axios';

const Messages = () => {
   const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9'; // Replace with your IPFS hash
   const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
   const [imageUrls, setImageUrls] = useState([]);
   const [messages, setMessages] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);

   // const fetchImageUrls = async () => {
   //    try {
   //       // Fetch the list of files and directories in the IPFS folder
   //       const response = await fetch(gatewayUrl);
   //       if (!response.ok) {
   //          throw new Error('Failed to fetch folder content');
   //       }

   //       // Assuming the response is HTML containing links to files
   //       const html = await response.text();

   //       // Parse the HTML to extract links to image files
   //       const parser = new DOMParser();
   //       const doc = parser.parseFromString(html, 'text/html');
   //       const links = Array.from(doc.querySelectorAll('a'));

   //       // Filter links to include only image files ending with "/img.png"
   //       const imageLinks = links.filter((link) =>
   //          link.getAttribute('href').includes('/img')
   //       );

   //       // Create image URLs from the links
   //       const urls = imageLinks.map(
   //          (link) => `https://ipfs.io${link.getAttribute('href')}`
   //       );

   //       // Set the image URL for each product in the Messages array
   //       const updatedMessages = messagesDetails.map((message, index) => ({
   //          ...message,
   //          imageUrl: urls[index] || 'hello',
   //       }));

   //       // Remove duplicates by converting the array to a Set and then back to an array
   //       const uniqueUrls = Array.from(new Set(urls));

   //       setImageUrls(uniqueUrls);
   //       setMessages(updatedMessages);
   //    } catch (error) {
   //       console.error('Error fetching folder content:', error);
   //    }
   // };

   const [searchInput, setSearchInput] = useState('');
   const [filteredMessages, setFilteredMessages] = useState(messages);
   const [kingdomBook, setKingdomBook] = useState([]);

   const bookURL =
      'http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetAllBooks';

   const ipfs = create({ url: 'https://gateway.pinata.cloud/ipfs/' }); // Replace with the IPFS gateway URL you're using

   const bookFile = async () => {
      // Fetch book data from the server
      const token =
         'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMzQ2NjkzYWItOGZhOS00Mjg4LWEwZmYtMzNkOTZmYzdiOWJmIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDMyZTgwZTE2YWFmZGJiYjIwYmE1NTY5MGYyNzVhMjYwOGUzZWNmYzAiLCJleHAiOjE2OTk1OTc5MDgsImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0.HcQ6DkETMVi3FK6JYgBg49A9mv65jv7B4eJYWGrOnzg'; // Replace with your actual access token // Replace with your actual access token
      const config = {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      };
      const res = await axios.get(bookURL, config);
      const data = res.data.data;

      console.log(data);

      // Fetch and display book details from IPFS
      const bookDetails = [];

      for (const book of data) {
         const ipfsHash = book.hash;
         console.log('IPFS Hash:', ipfsHash);

         try {
            // Fetch content from Pinata API
            const pinataApiUrl = `https://purple-existing-woodpecker-520.mypinata.cloud/ipfs/${ipfsHash}`;
            console.log(pinataApiUrl);

            // Fetch content from Pinata API
            const pinataResponse = await axios.get(pinataApiUrl);

            console.log(pinataResponse);
            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;
               console.log('IPFS Content:', ipfsContent);

               // Assuming the content is JSON, parse it
               const bookInfo = ipfsContent;
               console.log('Parsed IPFS Content:', bookInfo);

               // Include additional fields from the original book data
               const completeBookInfo = {
                  recId: book.recId,
                  counterId: book.counterId,
                  category: book.category,
                  bookFile: book.bookFile,
                  ...bookInfo, // Include the rest of the book info
               };
               console.log('Complete Book Info:', completeBookInfo);

               // Add completeBookInfo to the list of bookDetails
               bookDetails.push(completeBookInfo);
            } else {
               console.error(
                  'Pinata API returned an error:',
                  pinataResponse.status,
                  pinataResponse.statusText
               );
            }
         } catch (error) {
            console.error('Error fetching IPFS content:', error);
         }
      }

      // Update the UI with book details
      setKingdomBook(bookDetails);
   };

   // useEffect(() => {
   //    // Filter the messages based on the search input
   //    const filtered = messagesDetails.filter(
   //       (message) =>
   //          message.artist.toLowerCase().includes(searchInput.toLowerCase()) ||
   //          message.title.toLowerCase().includes(searchInput.toLowerCase())
   //    );

   //    setFilteredMessages(filtered);
   // }, [searchInput]);

   useEffect(() => {
      // fetchImageUrls();
      bookFile();
   }, []);

   const buyNow = (product) => {
      if (product) {
         console.log('Buy Now clicked for:', product.price);
      }
   };

   return (
      <>
         <div className="w-[80%] m-auto mt-28">
            <div
               className=" grid flex-col p-1 rounded-md
                     flex-wrap md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1 "
            >
               {kingdomBook.map((book, i) => (
                  <div
                     key={book.recId}
                     className="w-full mt-2 m-auto flex justify-between p-2
                     space-x-9 bg-white border rounded"
                  >
                     <img
                        src={`https://gateway.pinata.cloud/ipfs/${book.image}`}
                        alt={book.title}
                        width={100}
                        height={100}
                     />
                     <div className="">
                        <p>{book.title}</p>
                        <p>{book.artist}</p>
                     </div>
                     <div className="">
                        <p>{book.category}</p>
                        <p>{book.counterId}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default Messages;

// import React, { useContext, useEffect, useState } from 'react';
// import { useAccount } from 'wagmi';
// import { StateContext } from '@/Context/ReligiousContext';
// import AudioControl from '@/components/audioControl';
// import { PlayIcon, PauseIcon, ThumbsUp, ThumbsDown } from '@/components/icons';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//    setActiveSong,
//    setCurrentTime,
//    setDuration,
//    setProgressBarWidth,
//    setSongDuration,
//    togglePlayback,
//    toggleLike,
//    toggleDislike,
// } from '@/reduxToolkit/slices/audioSlice';

// const Download = () => {
//    const { handlePlayClick, audioRefs, handleSongEnd } =
//       useContext(StateContext);
//    const activeSongId = useSelector((state) => state.audio.activeSongId);
//    const isPlaying = useSelector(
//       (state) => state.audio.songStates[state.audio.activeSongId]
//    );

//    const [purchasedProducts, setPurchasedProducts] = useState([]);
//    const [progressUpdateInterval, setProgressUpdateInterval] = useState(null);
//    // const [isLiked, setIsLiked] = useState(false);
//    const [isLiked, setIsLiked] = useState({});

//    const [isDisliked, setIsDisliked] = useState(false);
//    const [hoveredItemId, setHoveredItemId] = useState(null);
//    const [durationsUpdated, setDurationsUpdated] = useState(null);
//    const [songDurations, setSongDurations] = useState({});

//    const { address } = useAccount();
//    const dispatch = useDispatch();

//    useEffect(() => {
//       // Retrieve the list of purchased products from local storage
//       const storedPurchasedProducts =
//          JSON.parse(localStorage.getItem('purchasedProducts')) || [];

//       // Deserialize the stored products and filter them based on the current user's address
//       const userPurchasedProducts = storedPurchasedProducts
//          .map((serializedProduct) => JSON.parse(serializedProduct))
//          .filter((item) => item.address === address);
//       setPurchasedProducts(userPurchasedProducts);
//    }, [address, dispatch]);

//    const formatTime = (time) => {
//       const minutes = Math.floor(time / 60);
//       // console.log(minutes);
//       const seconds = Math.floor(time % 60);
//       return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
//          2,
//          '0'
//       )}`;
//    };

//    const handleLikes = () => {
//       setIsLiked(true);
//       setIsDisliked(false);
//       console.log('likes');
//       // Any other logic related to handling likes.
//    };

//    const handleDislikes = () => {
//       setIsLiked(false);
//       setIsDisliked(true);
//       console.log('dislike');
//       // Any other logic related to handling dislikes.
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

//    // Function to toggle liking a song
//    const toggleLike = (id) => {
//       setIsLiked((prevLiked) => {
//          const updatedLiked = { ...prevLiked };
//          updatedLiked[id] = !updatedLiked[id];
//          // Store the liked status in local storage or other storage mechanism
//          localStorage.setItem('likedSongs', JSON.stringify(updatedLiked));
//          return updatedLiked;
//       });
//    };

//    // Function to check if a song is liked
//    const isSongLiked = (id) => isLiked[id] === true;

//    if (purchasedProducts.length === 0) {
//       return (
//          <div className="mt-28 text-gray-500 pl-5">
//             <h1>Connect your wallet to see all your products</h1>
//          </div>
//       );
//    }

//    return (
//       <>
//          <div className="w-[80%] m-auto mt-28">
//             <div className="flex flex-col gap-3 p-2">
//                {purchasedProducts.map(
//                   ({ id, file, imageUrl, title, artist }) => (
//                      <div
//                         key={id}
//                         className="flex justify-between items-center py-2 bg-transparent border-t-[1px] border-gray-700"
//                         onMouseEnter={() => setHoveredItemId(id)}
//                         onMouseLeave={() => setHoveredItemId(null)}
//                      >
//                         <div className="text-gray-700 relative">
//                            <audio
//                               preload="auto"
//                               controls={false}
//                               loop
//                               style={{ display: 'none' }}
//                               ref={(ref) => (audioRefs[id] = ref)}
//                               onEnded={() => handleSongEnd(id)}
//                            >
//                               <source src={file} type="audio/mpeg" />
//                            </audio>

//                            <img
//                               src={imageUrl}
//                               alt={`Image ${title}`}
//                               className="rounded-md cursor-pointer"
//                               width={50}
//                               height={50}
//                               onClick={() => handlePlayClick(id)}
//                            />

//                            {activeSongId === id || hoveredItemId === id ? (
//                               <div className="flex justify-center items-center p-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
//                                  <button
//                                     onClick={() =>
//                                        handlePlayClick(
//                                           id,
//                                           title,
//                                           artist,
//                                           imageUrl
//                                        )
//                                     }
//                                  >
//                                     {activeSongId === id ? (
//                                        isPlaying ? (
//                                           <PauseIcon />
//                                        ) : (
//                                           <PlayIcon />
//                                        )
//                                     ) : (
//                                        <PlayIcon />
//                                     )}
//                                  </button>
//                               </div>
//                            ) : null}
//                         </div>
//                         <span className="w-[150px] text-white text-sm overflow-hidden whitespace-nowrap">
//                            {title.length > 20
//                               ? `${title.slice(0, 20)}...`
//                               : title}
//                         </span>
//                         <span className="w-[150px] text-gray-600 text-sm overflow-hidden whitespace-nowrap">
//                            {artist.length > 20
//                               ? `${artist.slice(0, 20)}...`
//                               : artist}
//                         </span>
//                         <div className="w-[50px] flex items-center space-x-4">
//                            {hoveredItemId === id ? (
//                               <>
//                                  <button
//                                     onClick={() => toggleLike(id)}
//                                     // className={`text-white `}
//                                     className={`text-white ${
//                                        isSongLiked(id) ? 'text-red-600' : ''
//                                     }`}
//                                  >
//                                     <ThumbsUp />
//                                  </button>
//                                  <button
//                                     className="text-white"
//                                     onClick={handleDislikes}
//                                  >
//                                     <ThumbsDown />
//                                  </button>
//                               </>
//                            ) : (
//                               <>
//                                  <button className="text-red-600">
//                                     {isSongLiked(id) === true && <ThumbsUp />}
//                                  </button>
//                               </>
//                            )}
//                         </div>
//                         <span className="text-gray-600">
//                            {songDurations[id]
//                               ? formatTime(songDurations[id])
//                               : '0'}
//                         </span>
//                      </div>
//                   )
//                )}
//             </div>
//          </div>

//          {isPlaying || activeSongId ? <AudioControl /> : null}
//       </>
//    );
// };

// export default Download;
