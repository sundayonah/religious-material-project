// import Onboard, { chains } from '@web3-onboard/core';
// import injectedModule from '@web3-onboard/injected-wallets';
// import { useEffect } from 'react';

// const injected = injectedModule();

// const wallets = [injected];

// const INFURA_ID = '8e36cc87e6b2432daab667d3cbcd3734';

// const chainsData = [
//    {
//       id: 1,
//       token: 'ETH',
//       label: 'Ethereum Mainnet',
//       rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
//    },
//    {
//       id: 42161,
//       token: 'ARB-ETH',
//       label: 'Arbitrum One',
//       rpcUrl: 'https://rpc.ankr.com/arbitrum',
//    },
//    {
//       id: '0xa4ba',
//       token: 'ARB',
//       label: 'Arbitrum Nova',
//       rpcUrl: 'https://nova.arbitrum.io/rpc',
//    },
//    {
//       id: 137,
//       token: 'MATIC',
//       label: 'Matic Mainnet',
//       rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
//    },
//    {
//       id: '0x2105',
//       token: 'ETH',
//       label: 'Base',
//       rpcUrl: 'https://mainnet.base.org',
//    },
// ];

// const appMetadata = {
//    name: 'My App',
//    icon: '<SVG_ICON_STRING>',
//    logo: '<SVG_LOGO_STRING>',
//    description: 'My app using Onboard',
//    recommendedInjectedWallets: [
//       { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
//       { name: 'MetaMask', url: 'https://metamask.io' },
//    ],
// };

// // Export a function that initializes and returns the Onboard instance
// export function initializeWebOnboard() {
//    return Onboard({
//       wallets,
//       chains: chainsData,
//       appMetadata,
//    });
// }

// // import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
// // import { WagmiConfig } from 'wagmi';
// // import {
// //    arbitrum,
// //    bsc,
// //    bscTestnet,
// //    goerli,
// //    mainnet,
// //    polygon,
// //    sepolia,
// // } from 'wagmi/chains';

// // // 1. Get projectId
// // const projectId = 'de7693706b2bb6e9b2e049f09e7ebad1';

// // // 2. Create wagmiConfig
// // const metadata = {
// //    name: 'Minning dApp',
// //    description: 'Web3Modal Example',
// //    url: 'https://web3modal.com',
// //    icons: ['https://avatars.githubusercontent.com/u/37784886'],
// // };
// // const chains = [mainnet, arbitrum, bsc, bscTestnet, polygon, sepolia, goerli];
// // const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// // // 3. Create modal
// // createWeb3Modal({ wagmiConfig, projectId, chains });

// // import Onboard, { chains } from '@web3-onboard/core';
// // import injectedModule from '@web3-onboard/injected-wallets';
// // import { useEffect } from 'react';

// // import { initializeWebOnboard } from '@/Context/Web3OnBoardContext'; // Import the function

// upload image
const handleSubmit = async (e) => {
   e.preventDefault();
   setCloseForm(false);
   setLoading(true);
   if (file) {
      try {
         const formData = new FormData();
         formData.append('file', file);

         const res = await axios({
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
            data: formData,
            headers: {
               pinata_api_key: `5215a74e525dd12d8c6b`,
               pinata_secret_api_key: `3d90e51f58691609de847f314ef402705e2a6851474817089ea9dcb2862a90b`,
               'Content-Type': 'multipart/form-data',
            },
         });
         console.log(res, 'response');
         const image = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
         await UploadImage({
            ...imageInfo,
            image: image,
            category: category,
         });
         console.log(image);
         setFile(null);
      } catch (error) {
         console.log(error);
      }
   }
   setFile(null);
   setLoading(false);
};

const retrieveFile = (e) => {
   const data = e.target.files[0];
   const reader = new window.FileReader();
   reader.readAsArrayBuffer(data);
   reader.onloadend = () => {
      setFile(e.target.files[0]);
   };
   e.preventDefault();
};

// display image to ui
const onImageChange = (event) => {
   if (event.target.files && event.target.files[0]) {
      setDisplay(URL.createObjectURL(event.target.files[0]));
   }
};

const signIn = async () => {
   try {
      if (window.ethereum) {
         // // Call the ConnectButton component
         // // ConnectButton();

         const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
         });

         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         setIsLoading(true);

         const messageHash = ethers.utils.hashMessage(
            'Sign-in to web3 kigdom-coin e-comerce'
         );
         const signature = await signer.signMessage(messageHash);

         // Save the signature in local storage
         localStorage.setItem('userSignature', signature);

         const userSignature = localStorage.getItem('userSignature');

         if (userSignature) {
            // Include the signature in the request header

            const authURL =
               'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

            const res = await axios.post(
               authURL,
               {
                  address: accounts[0], // Use the user's address
                  signature: userSignature, // Use the user's signature
               },
               {
                  headers: {
                     'Content-Type': 'application/json',
                  },
               }
            );
            console.log(res);

            if (res.data.statusCode === 200) {
               // Store responseData in localStorage
               const responseData = res.data.data;
               localStorage.setItem(
                  'responseData',
                  JSON.stringify(responseData)
               );
               // Now you can access it later by parsing it back
               const storedData = JSON.parse(
                  localStorage.getItem('responseData')
               );
            } else {
               console.error(
                  `API request failed with status code ${res.status}`
               );
               if (res.status === 401) {
                  console.error(
                     'Unauthorized: Check your authorization token.'
                  );
               }
            }
         } else {
            console.error('User signature not found in local storage');
         }
         setIsLoading(false);
      } else {
         console.error('MetaMask not installed');
      }
   } catch (error) {
      console.error('Error signing in with message hash:', error);
   }
};

// import React from 'react';
// import { useWeb3Modal } from '@web3modal/wagmi/react';

// const Download = () => {
//    const repetitions = Array.from({ length: 12 });
//    const { open } = useWeb3Modal();

//    // console.log(open());

//    return (
//       <>
//          <div className="w-[80%] m-auto mt-28">
//             <div className="flex flex-wrap gap-3 p-2 justify-center items-center">
//                {repetitions.map((_, index) => (
//                   <div
//                      key={index}
//                      className="flex justify-between items-center mx-1  px-2 py-3  rounded-md border border-s-green-800"
//                   >
//                      <div className="text-gray-700">
//                         <img
//                            src="/images/play-1.png"
//                            alt=""
//                            className=""
//                            width={100}
//                            height={150}
//                         />
//                      </div>
//                      <div className="flex flex-col m-1">
//                         <span className="text-white">title</span>
//                         <span className="text-gray-600">artist</span>
//                      </div>
//                   </div>
//                ))}
//             </div>
//          </div>
//       </>
//    );
// };

// export default Download;

//////////////////////////////////// DOWNLOAD///////////////

// import { useDispatch, useSelector } from 'react-redux';
// import {
//    togglePlayback,
//    setActiveSong,
// } from '@/reduxToolkit/slices/audioSlice';

//   const audioRef = useRef(null);

//   const dispatch = useDispatch();

// const audioRefs = {};
// const purchasedSongs = useSelector((state) => state.songs.purchasedSongs);

// const songStates = useSelector((state) => state.audio.songStates);
// const activeSongId = useSelector((state) => state.audio.activeSongId);

// Function to handle play/pause logic
// const handlePlayClick = (productId) => {
//    const audio = audioRefs[productId];

//    if (audio) {
//       if (productId === activeSongId) {
//          // Toggle play/pause state when clicking play button
//          if (audio.paused) {
//             console.log('Playing...');
//             audio.play().catch((error) => {
//                console.error('Failed to play audio:', error);
//             });
//          } else {
//             console.log('Pausing...');
//             audio.pause();
//          }

//          // Toggle the playback state in the Redux store
//          dispatch(togglePlayback(productId));
//       } else {
//          // If a new song is clicked, play it and update the state
//          dispatch(setActiveSong(productId));

//          // Pause other songs and update their playback state
//          Object.keys(audioRefs).forEach((songId) => {
//             if (songId !== productId) {
//                const otherAudio = audioRefs[songId];
//                if (otherAudio) {
//                   otherAudio.pause();
//                   dispatch(togglePlayback(songId)); // Update the playback state in the Redux store
//                }
//             }
//          });
//       }
//    }
// };

//   <div className="song-info">
//      <h2>{purchasedSongs[activeSongIndex].title}</h2>
//      <p>{purchasedSongs[activeSongIndex].artist}</p>
//   </div>;

// const playNextSong = () => {
//    const productIds = purchasedProducts.map((product) => {
//       const parsedProduct = JSON.parse(product);
//       console.log(parsedProduct);
//       return parsedProduct.id;
//    });

//    const currentIndex = productIds.indexOf(activeSongId);

//    if (currentIndex !== -1 && currentIndex < productIds.length - 1) {
//       const nextSongId = productIds[currentIndex + 1];

//       // Get the next song's details (title, artist, duration, etc.)
//       const nextSongDetails = parsedProduct[currentIndex + 1];
//       console.log(nextSongDetails);

//       // Retrieve the audio element for the current and next songs
//       const currentAudio = audioRefs[activeSongId];
//       const nextAudio = audioRefs[nextSongId];

//       if (currentAudio && nextAudio) {
//          // Pause the current song and reset its currentTime to 0
//          currentAudio.pause();
//          currentAudio.currentTime = 0;

//          // Play the next song
//          nextAudio.play();

//          // Update the active song in the Redux store
//          dispatch(setActiveSong(nextSongId));
//          dispatch(updateSongDetails(nextSongDetails));
//       }
//    }
// };

// const playPreviousSong = () => {
//    const productIds = purchasedProducts.map((product) => {
//       const parsedProduct = JSON.parse(product);
//       return parsedProduct.id;
//    });

//    const currentIndex = productIds.indexOf(activeSongId);

//    if (currentIndex > 0) {
//       const previousSongId = productIds[currentIndex - 1];
//       // Get the previous song's details
//       const previousSongDetails = parsedProduct[currentIndex - 1];

//       // Retrieve the audio element for the current and previous songs
//       const currentAudio = audioRefs[activeSongId];
//       const previousAudio = audioRefs[previousSongId];

//       if (currentAudio && previousAudio) {
//          // Pause the current song and reset its currentTime to 0
//          currentAudio.pause();
//          currentAudio.currentTime = 0;

//          // Play the previous song
//          previousAudio.play();

//          // Update the active song in the Redux store
//          dispatch(setActiveSong(previousSongId));
//          dispatch(updateSongDetails(previousSongDetails));
//       }
//    }
// };

import React, {
   useRef,
   useState,
   useEffect,
   useContext,
   useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
   PrevIcon,
   NextIcon,
   PauseIcon,
   PlayIcon,
   RepeatIcon,
   SpeakerIcon,
} from '@/components/icons';
import {
   togglePlayback,
   setActiveSong,
   toggleRepeat,
   setVolume,
   setNextSong,
   setPreviousSong,
   updateSongDetails,
   setCurrentTime,
   setProgressBarWidth,
   setDuration,
   handleControls, // New action for handling prev/next
} from '@/reduxToolkit/slices/audioSlice';
import { StateContext } from '@/Context/ReligiousContext';
import Volume from './Volume';

const AudioPlayer = () => {
   const ref = useRef(null);

   const dispatch = useDispatch();
   const {
      handlePlayClick,
      //   songStates,
      //   activeSongId,
      audioRefs,
      handleSongEnd,
      handleAudioPlayPause,
   } = useContext(StateContext);
   const [mousedown, setMouseDown] = useState(false);
   const [progressUpdateInterval, setProgressUpdateInterval] = useState(null);

   // const [currentTime, setCurrentTime] = useState(0);
   // const [duration, setDuration] = useState(0);

   const songStates = useSelector((state) => state.audio.songStates);
   const activeSongId = useSelector((state) => state.audio.activeSongId);

   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );

   const currentTime = useSelector((state) => state.audio.currentTime);
   const duration = useSelector((state) => state.audio.duration);
   const progressBarWidth = useSelector(
      (state) => state.audio.progressBarWidth
   );

   const songDetails = useSelector((state) => state.audio.songDetails);
   // console.log(songDetails);

   // const currentTime = useSelector((state) => state.audio.currentTime);
   const volume = useSelector((state) => state.audio.volume);

   const purchasedProducts =
      JSON.parse(localStorage.getItem('purchasedProducts')) || [];

   // console.log('Active Song ID:', activeSongId);

   const handlePlayPause = () => {
      handleAudioPlayPause();
   };

   // const handlePlayPause = () => {
   //    // Ensure there's an active song
   //    if (activeSongId) {
   //       // Toggle the play/pause state in the Redux store
   //       dispatch(togglePlayback(activeSongId));

   //       const audio = audioRefs[activeSongId];
   //       // Retrieve the audio element for the active song
   //       console.log(audio);

   //       if (audio) {
   //          // if (isPlaying) {
   //          //    // If it's playing, pause the audio
   //          //    audio.pause();
   //          // } else {
   //          //    // If it's paused, play the audio
   //          //    audio.play().catch((error) => {
   //          //       console.error('Failed to play audio:', error);
   //          //    });
   //          // }

   //          if (isPlaying) {
   //             // If it's playing, pause the audio
   //             audio.pause();
   //             clearInterval(progressUpdateInterval); // Stop updating the progress bar
   //          } else {
   //             // If it's paused, play the audio
   //             audio.play().catch((error) => {
   //                console.error('Failed to play audio:', error);
   //             });

   //             // Start a new interval to update the progress bar
   //             const interval = setInterval(() => {
   //                // Update the progress bar based on the audio's current time
   //                const currentTime = audio.currentTime;
   //                // console.log(currentTime);
   //                const totalTime = audio.duration;
   //                // console.log(totalTime);
   //                if (!isNaN(totalTime)) {
   //                   const percentage = (currentTime / totalTime) * 100;
   //                   dispatch(setProgressBarWidth(percentage));
   //                   dispatch(setCurrentTime(currentTime));
   //                }
   //             }, 1000); // Update every 1000 milliseconds (1 second)
   //             setProgressUpdateInterval(interval);
   //          }
   //       }
   //    }
   // };

   // const playNextSong = () => {
   //    const productIds = purchasedSongs.map((product) => {
   //       const parsedProduct = JSON.parse(product);
   //       return parsedProduct.id;
   //    });

   //    const currentIndex = productIds.indexOf(activeSongId);

   //    if (currentIndex !== -1 && currentIndex < productIds.length - 1) {
   //       const nextSongId = productIds[currentIndex + 1];

   //       // Find the index of the next song in purchasedSongs
   //       const nextSongIndex = purchasedSongs.findIndex((product) => {
   //          const parsedProduct = JSON.parse(product);
   //          return parsedProduct.id === nextSongId;
   //       });

   //       if (nextSongIndex !== -1) {
   //          // Get the next song's details (title, artist, duration, etc.)
   //          const nextSongDetails = JSON.parse(purchasedSongs[nextSongIndex]);

   //          // Retrieve the audio element for the current and next songs
   //          const currentAudio = audioRefs[activeSongId];
   //          const nextAudio = audioRefs[nextSongId];
   //          if (currentAudio && nextAudio) {
   //             currentAudio.pause();
   //             currentAudio.currentTime = 0;

   //             nextAudio.play().then(() => {
   //                // Update the active song in the Redux store after the audio has started playing
   //                dispatch(setActiveSong(nextSongId));
   //                dispatch(updateSongDetails(nextSongDetails));

   //                nextAudio.addEventListener('loadedmetadata', () => {
   //                   // Update the duration and progress bar width when the new audio is ready
   //                   const newDuration = nextAudio.duration;
   //                   dispatch(setDuration(newDuration));

   //                   const interval = startProgressUpdateInterval(nextAudio);
   //                   setProgressUpdateInterval(interval);
   //                });
   //             });
   //          }
   //       }
   //    }
   // };

   // const playPreviousSong = () => {
   //    const productIds = purchasedSongs.map((product) => {
   //       const parsedProduct = JSON.parse(product);
   //       return parsedProduct.id;
   //    });

   //    const currentIndex = productIds.indexOf(activeSongId);

   //    if (currentIndex > 0) {
   //       const previousSongId = productIds[currentIndex - 1];

   //       // Find the index of the previous song in purchasedSongs
   //       const previousSongIndex = purchasedSongs.findIndex((product) => {
   //          const parsedProduct = JSON.parse(product);
   //          return parsedProduct.id === previousSongId;
   //       });

   //       if (previousSongIndex !== -1) {
   //          // Get the previous song's details (title, artist, duration, etc.)
   //          const previousSongDetails = JSON.parse(
   //             purchasedSongs[previousSongIndex]
   //          );

   //          // Retrieve the audio element for the current and previous songs
   //          const currentAudio = audioRefs[activeSongId];
   //          const previousAudio = audioRefs[previousSongId];

   //          if (currentAudio && previousAudio) {
   //             // Pause the current song and reset its currentTime to 0
   //             currentAudio.pause();
   //             currentAudio.currentTime = 0;

   //             previousAudio.play().then(() => {
   //                // Update the active song in the Redux store after the audio has started playing
   //                dispatch(setActiveSong(previousSongId));
   //                dispatch(updateSongDetails(previousSongDetails));

   //                previousAudio.addEventListener('loadedmetadata', () => {
   //                   // Update the duration and progress bar width when the new audio is ready
   //                   const newDuration = previousAudio.duration;
   //                   dispatch(setDuration(newDuration));

   //                   // Clear the existing progress update interval before starting a new one
   //                   clearInterval(progressUpdateInterval);

   //                   const interval = setInterval(handleProgressUpdate, 1000);
   //                   setProgressUpdateInterval(interval);
   //                });
   //             });
   //          }
   //       }
   //    }
   // };

   // console the currentTime and duration

   // Define a function to format time (for example, to display in MM:SS format)
   const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      // console.log(minutes);
      const seconds = Math.floor(time % 60);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
         2,
         '0'
      )}`;
   };

   const handleVolume = (e) => {
      if (e.target.classList.contains('input')) return;

      // Get the active song's audio element using the activeSongId
      const audio = audioRefs[activeSongId];

      if (audio) {
         if (volume > 0) {
            dispatch(setVolume(0)); // Update the volume in Redux
            audio.volume = 0; // Mute the audio
         } else {
            dispatch(setVolume(1)); // Update the volume in Redux
            audio.volume = 1; // Unmute the audio
         }
      }
   };

   const handleVolumeChange = (e) => {
      dispatch(setVolume(e.target.value)); // Update the volume in Redux
      const audio = audioRefs[activeSongId]; // Get the correct audio element
      if (audio) {
         audio.volume = e.target.value; // Set the volume
      }
   };

   // useEffect(() => {
   //    if (currentTime < 1) return;
   //    const totalTime = ref.current?.duration;
   //    // console.log(currentTime);
   //    const percentage = ((currentTime / Math.floor(totalTime)) * 100).toFixed(
   //       8
   //    );
   //    dispatch(setProgressBarWidth(percentage));
   // }, [currentTime, dispatch]);

   // const handleMouseDown = (e, flag) => {
   //    if (flag && !e.target.classList.contains('progress')) return;
   //    const currentPoint = e.clientX - e.target.getBoundingClientRect().left;
   //    console.log(currentPoint);
   //    const totalWidth = e.currentTarget.clientWidth;
   //    let percentage = ((currentPoint / totalWidth) * 100).toFixed(8);
   //    if (percentage > 100) percentage = 100;
   //    const newTime = Math.floor((percentage / 100) * ref.current.duration);
   //    dispatch(setCurrentTime(newTime));
   //    ref.current.currentTime = newTime;
   //    dispatch(setProgressBarWidth(percentage));
   // };

   return (
      <>
         <div
            onClick={(e) => {
               handleMouseDown(e, true);
            }}
            onMouseMove={(e) => {
               if (mousedown && e.target.classList.contains('progress')) {
                  handleMouseDown(e, false);
               }
            }}
            onMouseDown={() => setMouseDown(true)}
            onMouseLeave={() => setMouseDown(false)}
            className="w-[99.4%] progress border-t-[5px] border-red-300 relative mx-auto"
         >
            <div
               style={{ width: `${progressBarWidth}%` }}
               className=" relative -top-1 border-t-[5px] border-t-red-500"
            >
               <span
                  className=" absolute -top-2.5 -right-3 w-4 h-4 hover:scale-110 rounded-full bg-red-800 "
                  onMouseUp={() => setMouseDown(false)}
               ></span>
            </div>
         </div>
         <div className="fixed bottom-0 w-full bg-black  p-5">
            <div className="flex justify-between items-center">
               <div className=" flex justify-center items-center">
                  <button
                     onClick={playPreviousSong}
                     className="text-white px-2"
                  >
                     <PrevIcon />
                  </button>
                  <button
                     className="text-white"
                     onClick={() => handlePlayPause()}
                  >
                     {activeSongId && isPlaying ? <PlayIcon /> : <PauseIcon />}
                  </button>
                  <button onClick={playNextSong} className="text-white px-2">
                     <NextIcon />
                  </button>

                  <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-xs px-3">
                        {formatTime(currentTime)} / {formatTime(duration)}
                     </span>
                  </div>

                  {/* <span className="text-gray-500 text-xs px-3">
                     4:44 / 7:16
                  </span> */}
               </div>
               <div className="flex justify-center items-center">
                  <img
                     src="/images/explore2.jpg"
                     alt={`Image`}
                     className="rounded-md cursor-pointer object-contain"
                     width={30}
                     height={30}
                     //  onClick={() => handlePlayClick(id)}
                  />
                  <div className="flex flex-col text-xs px-2">
                     {/* <span className="text-white">Song Title</span>
                     <span className=" text-gray-500">Artist Name</span> */}
                     <span className="text-white">{songDetails.title}</span>
                     <span className="text-gray-500">{songDetails.artist}</span>
                  </div>
               </div>
               <div className="flex justify-center items-center">
                  {/* <input
                     type="range"
                     value={volume}
                     onChange={handleVolumeChange}
                     min="0"
                     max="1"
                     step="0.01"
                  /> */}
                  <Volume
                     handleVolume={handleVolume}
                     handleVolumeChange={handleVolumeChange}
                  />
                  ;
                  <button className="text-white px-2">
                     <RepeatIcon />
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};

export default AudioPlayer;

////////////////////////////////////////////////
//////////////////////////////////////////////

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

//    // const isSongLiked = useSelector((state) => state.audio.likedSongs);
//    // const isDisliked = useSelector((state) => state.audio.dislikedSongs);

//    const likedSongs = useSelector((state) => state.audio.likedSongs);
//    const dislikedSongs = useSelector((state) => state.audio.dislikedSongs);

//    const isLiked = likedSongs[activeSongId] || false;
//    const isDisliked = dislikedSongs[dislikedSongs.id] || false;
//    const isSongLiked = (id) => likedSongs[id];

//    const handleLike = () => {
//       console.log('likeed', isLiked);
//       dispatch(toggleLike({ songId: activeSongId, isLiked: !isLiked }));
//    };

//    const handleDislike = () => {
//       console.log('dis likeed', isDisliked);

//       dispatch(
//          toggleDislike({ songId: activeSongId, isDisliked: !isDisliked })
//       );
//    };

//    const [purchasedProducts, setPurchasedProducts] = useState([]);
//    const [progressUpdateInterval, setProgressUpdateInterval] = useState(null);
//    // const [isLiked, setIsLiked] = useState(false);
//    // const [isLiked, setIsLiked] = useState({});

//    // const [isDisliked, setIsDisliked] = useState(false);
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

//    // const handleLikes = () => {
//    //    setIsLiked(true);
//    //    setIsDisliked(false);
//    //    console.log('likes');
//    //    // Any other logic related to handling likes.
//    // };

//    // const handleDislikes = () => {
//    //    setIsLiked(false);
//    //    setIsDisliked(true);
//    //    console.log('dislike');
//    //    // Any other logic related to handling dislikes.
//    // };

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

//    // // Function to toggle liking a song
//    // const toggleLike = (id) => {
//    //    setIsLiked((prevLiked) => {
//    //       const updatedLiked = { ...prevLiked };
//    //       updatedLiked[id] = !updatedLiked[id];
//    //       // Store the liked status in local storage or other storage mechanism
//    //       localStorage.setItem('likedSongs', JSON.stringify(updatedLiked));
//    //       return updatedLiked;
//    //    });
//    // };

//    // const handleLikes = (id) => {
//    //    dispatch(toggleLike({ songId: id, isLiked: true }));
//    //    dispatch(toggleDislike({ songId: id, isDisliked: false }));
//    //    // Any other logic related to handling likes.
//    // };

//    // // Function to toggle disliking a song
//    // const handleDislikes = (id) => {
//    //    dispatch(toggleLike({ songId: id, isLiked: false }));
//    //    dispatch(toggleDislike({ songId: id, isDisliked: true }));
//    //    // Any other logic related to handling dislikes.
//    // };

//    // Function to check if a song is liked

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
//                                     onClick={handleLike}
//                                     // className={`text-white `}
//                                     className={`text-white ${
//                                        isSongLiked(id) ? 'text-red-600' : ''
//                                     }`}
//                                  >
//                                     <ThumbsUp />
//                                  </button>
//                                  <button
//                                     className="text-white"
//                                     onClick={handleDislike}
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

// import React, { useEffect, useState } from 'react';
import { CloseIcon, FilterIcon, OpenIcon } from '../icons';
import SongDownloads from './songDownloads';
import { MessagesDownload } from './messagesDownload';
import { BooksDownload } from './booksDownload';

const DownloadSidebar = () => {
   const sideMenu = ['All', 'Books', 'Messages', 'Songs'];

   const [sideBarOpen, setSideBarOpen] = useState(false);
   const [selectedFilter, setSelectedFilter] = useState('All');
   const [downloadedSongs, setDownloadedSongs] = useState([]);
   const [downloadedMessages, setDownloadedMessages] = useState([]);
   const [downloadedBooks, setDownloadedBooks] = useState([]);
   // Add a state for downloaded books when available

   const toggleMenu = () => {
      setSideBarOpen(!sideBarOpen);
   };

   const closeMenu = () => {
      setSideBarOpen(false);
   };

   const handleFilterClick = (filter) => {
      setSelectedFilter(filter);
   };

   useEffect(() => {
      // Load downloaded songs and messages from local storage
      const songs = JSON.parse(localStorage.getItem('purchasedProducts')) || [];
      const messages =
         JSON.parse(localStorage.getItem('purchasedMessages')) || [];

      setDownloadedSongs(songs);
      setDownloadedMessages(messages);

      // You can add similar code to load downloaded books when available
   }, []);

   const renderContent = () => {
      switch (selectedFilter) {
         case 'All':
            return (
               <>
                  <SongDownloads />
                  <MessagesDownload />
                  <BooksDownload />
                  {/* Add rendering for Books here */}
               </>
            );
         case 'Books':
            // Implement your Books rendering logic
            return <BooksDownload />;
         case 'Songs':
            return <SongDownloads />;
         case 'Messages':
            return <MessagesDownload />;
         default:
            return null;
      }
   };

   return (
      <>
         <div className="flex justify-center items-center ">
            {/* <div className="md:hidden">
               {sideBarOpen ? (
                  ''
               ) : (
                  <button
                     onClick={toggleMenu}
                     className="text-white rounded-md"
                  >
                     <OpenIcon />
                  </button>
               )}
            </div> */}
            {/* <div
               className="flex"
               className={`${
                  sideBarOpen
                     ? 'block left-0 px-5 py-4 w-[30%] min-h-full top-0 border-r-[1px] border-gray-800 bg-[#2c2518] z-50'
                     : 'hidden'
               } md:flex flex-col absolute`}
            > */}
            {/* <div className="flex justify-end"> */}
            {/* {sideBarOpen && (
                     <button
                        onClick={closeMenu}
                        className="text-white  rounded-md md:hidden"
                     >
                        <CloseIcon />
                     </button>
                  )} */}
            {/* </div> */}
            {/* <h5 className="text-[#DAA851]">Library</h5> */}
            <div>
               <form className="flex mb-8 justify-center items-center">
                  <input
                     className="w-[80%] md:w-[320px] px-4 py-2 rounded-md border border-transparent bg-slate-300/25 text-white focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                     type="text"
                     placeholder="search songs..."
                     // value={searchInput}
                     // onChange={(e) => setSearchInput(e.target.value)}
                  />
               </form>
            </div>
            <FilterIcon />
            {sideMenu.map((menu, i) => (
               <div key={i} className=" text-gray-600">
                  <button
                     onClick={() => handleFilterClick(menu)}
                     className={` px-1 hover:text-gray-500 ${
                        selectedFilter === menu ? 'text-[#DAA851]' : ''
                     }`}
                  >
                     {menu}
                  </button>
               </div>
            ))}
            {/* </div> */}
         </div>

         <div className="w-full">{renderContent()}</div>
      </>
   );
};

// export default DownloadSidebar;

const approveContract = new ethers.Contract(
   approveContractAddress,
   approveAbi,
   signer
);
// const value = ethers.utils.parseUnits(purchasedPrice, 'ether');
// const valString = value.toString();
// console.log(valString);

const priceInEther = ethers.utils.parseEther(purchasedPrice.toString());

// Approve the contract to spend tokens on your behalf
const approvalTx = await approveContract.approve(
   RMTestnetContractAddress,
   priceInEther,
   {
      gasLimit: 8000000, // Adjust the gas limit as needed
   }
);

console.log(approvalTx);

// Wait for the approval transaction to be mined
await approvalTx.wait();

//API Key: 49270efd7e905a81cab6
//API Secret: d1c01e382edc1f128bc49e904def11798c8b3c124ce62df273305b3bb1c950af
//JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwY2MxYzEwZC1iZGNhLTRjNzEtYWFjZS1hMGY0NDczMmEyZDAiLCJlbWFpbCI6Im9uYWhzdW5kYXkwNjEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0OTI3MGVmZDdlOTA1YTgxY2FiNiIsInNjb3BlZEtleVNlY3JldCI6ImQxYzAxZTM4MmVkYzFmMTI4YmM0OWU5MDRkZWYxMTc5OGM4YjNjMTI0Y2U2MmRmMjczMzA1YjNiYjFjOTUwYWYiLCJpYXQiOjE2OTkzMTUwMjN9.daojj7OGyrYveuKuRD-nyz6bousFnOWmvBY-OXmfxuA

// const signIn = useCallback(async () => {
try {
   // if (isConnected && !isSignInCompleted) {
   // if (!isSignInCompleted) {
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const signer = provider.getSigner();

   // const userAddress = await signer.getAddress();

   const messageHash = ethers.utils.hashMessage(
      'Sign-in to web3 kigdom-coin marketplace projects'
   );
   const signature = await signer.signMessage(messageHash);

   localStorage.setItem('userSignature', signature);

   const userSignature = localStorage.getItem('userSignature');

   if (userSignature) {
      const authURL =
         'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

      const res = await axios.post(
         authURL,
         {
            address: address, // Use the user's address from signer
            signature: userSignature,
         },
         {
            headers: {
               'Content-Type': 'application/json',
            },
         }
      );
      console.log(res);

      // // Check if data property is not null or undefined
      // if (res.data?.data) {
      //    // Destructure properties with optional chaining
      //    const { refreshToken, tokenExpirationDate, userId } =
      //       res.data.data;

      //    // Now you can use these values as needed
      //    console.log('refreshToken:', refreshToken);
      //    console.log('tokenExpirationDate:', tokenExpirationDate);
      //    console.log('userId:', userId);
      // } else {
      //    console.error(
      //       'Error in server response. Data property is null or undefined.'
      //    );
      // }

      if (res.data?.statusCode === 200) {
         const responseData = res.data.data;
         console.log(responseData);
         localStorage.setItem('responseData', JSON.stringify(responseData));
         setSignInCompleted(true);
      } else {
         console.error(`API request failed with status code ${res.status}`);
         if (res.status === 401) {
            console.error('Unauthorized: Check your authorization token.');
         }
      }
      localStorage.setItem('signInCompleted', 'true');
   } else {
      console.error('User signature not found in local storage');
   }
   setIsLoading(false);
   // } else {
   //    console.error('MetaMask not installed or user already signed in.');
   // }
} catch (error) {
   console.error('Error signing in with message hash:', error);
}
// }, [isSignInCompleted, address]);

// useEffect(() => {
//    const checkWalletConnection = async () => {
//       if (address !== undefined) {
//          signIn();
//       }
//    };

//    checkWalletConnection();
// }, [address, signIn]);
