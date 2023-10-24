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

   const playNextSong = () => {
      const productIds = purchasedProducts.map((product) => {
         const parsedProduct = JSON.parse(product);
         return parsedProduct.id;
      });

      const currentIndex = productIds.indexOf(activeSongId);

      if (currentIndex !== -1 && currentIndex < productIds.length - 1) {
         const nextSongId = productIds[currentIndex + 1];

         // Find the index of the next song in purchasedProducts
         const nextSongIndex = purchasedProducts.findIndex((product) => {
            const parsedProduct = JSON.parse(product);
            return parsedProduct.id === nextSongId;
         });

         if (nextSongIndex !== -1) {
            // Get the next song's details (title, artist, duration, etc.)
            const nextSongDetails = JSON.parse(
               purchasedProducts[nextSongIndex]
            );
            console.log(nextSongDetails);

            // Retrieve the audio element for the current and next songs
            const currentAudio = audioRefs[activeSongId];
            const nextAudio = audioRefs[nextSongId];

            if (currentAudio && nextAudio) {
               // Pause the current song and reset its currentTime to 0
               currentAudio.pause();
               currentAudio.currentTime = 0;

               // Play the next song
               nextAudio.play();

               // Update the active song in the Redux store
               dispatch(setActiveSong(nextSongId));
               dispatch(updateSongDetails(nextSongDetails));
               // dispatch(setDuration(nextSongDetails.duration));
            }
         }
      }
   };

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

   const playPreviousSong = () => {
      const productIds = purchasedProducts.map((product) => {
         const parsedProduct = JSON.parse(product);
         return parsedProduct.id;
      });

      const currentIndex = productIds.indexOf(activeSongId);

      if (currentIndex > 0) {
         const previousSongId = productIds[currentIndex - 1];

         // Find the index of the previous song in purchasedProducts
         const previousSongIndex = purchasedProducts.findIndex((product) => {
            const parsedProduct = JSON.parse(product);
            return parsedProduct.id === previousSongId;
         });

         if (previousSongIndex !== -1) {
            // Get the previous song's details (title, artist, duration, etc.)
            const previousSongDetails = JSON.parse(
               purchasedProducts[previousSongIndex]
            );

            // Retrieve the audio element for the current and previous songs
            const currentAudio = audioRefs[activeSongId];
            const previousAudio = audioRefs[previousSongId];

            if (currentAudio && previousAudio) {
               // Pause the current song and reset its currentTime to 0
               currentAudio.pause();
               currentAudio.currentTime = 0;

               // Play the previous song
               previousAudio.play();

               // Update the active song in the Redux store
               dispatch(setActiveSong(previousSongId));
               dispatch(updateSongDetails(previousSongDetails));
            }
         }
      }
   };

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
