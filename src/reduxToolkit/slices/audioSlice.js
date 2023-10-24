// audioSlice.js
import { createSlice } from '@reduxjs/toolkit';

const audioSlice = createSlice({
   name: 'audio',
   initialState: {
      activeSongId: null,
      songStates: {}, // Object to store the playing state of each song
      repeat: false, // Add a repeat state
      volume: 1,
      volumeBar: false,
      prev: null, // Track previous song
      next: null, // Track next song
      currentTime: 0,
      duration: 0,
      progressBarWidth: 0,
      songDetails: {
         title: '',
         artist: '',
         duration: 0, // You can include other details you need
      },
   },
   reducers: {
      // setActiveSong: (state, action) => {
      //    state.activeSongId = action.payload;
      //    state.songStates[action.payload] = true; // Start playing the new song.
      // },
      setActiveSong: (state, action) => {
         state.activeSongId = action.payload;
         state.songStates[action.payload] = true; // Start playing the new song.
         state.currentTime = 0; // Reset currentTime when a new song is selected.
         state.duration = 0; // Reset duration when a new song is selected.
      },

      togglePlayback: (state, action) => {
         const songId = action.payload;
         if (songId === state.activeSongId) {
            state.songStates[songId] = !state.songStates[songId]; // Toggle play/pause state of the active song.
         }
      },
      toggleRepeat: (state) => {
         state.repeat = !state.repeat;
      },
      setVolume: (state, action) => {
         state.volume = action.payload;
      },
      setNextSong: (state, action) => {
         state.next = action.payload;
         console.log(state, action);
      },
      setPreviousSong: (state, action) => {
         state.prev = action.payload;
      },
      handleControls: (state, { payload }) => {
         if (payload === 'prev') {
            if (state.prev !== null) {
               state.next = state.activeSongId;
               state.activeSongId = state.prev;
               state.prev = null;
            }
         } else if (payload === 'next') {
            if (state.next !== null) {
               state.prev = state.activeSongId;
               state.activeSongId = state.next;
               state.next = null;
            }
         }
      },
      updateSongDetails: (state, action) => {
         // Update the songDetails with the new details
         state.songDetails = action.payload;
      },
      setCurrentTime: (state, { payload }) => {
         state.currentTime = payload;
      },
      setDuration: (state, { payload }) => {
         state.duration = payload;
      },
      setProgressBarWidth: (state, { payload }) => {
         state.progressBarWidth = payload;
      },
      setVolume: (state, { payload }) => {
         state.volume = payload;
      },
      setVolumeBar: (state, { payload }) => {
         state.volumeBar = payload;
      },
   },
});

export const {
   togglePlayback,
   setActiveSong,
   toggleRepeat,
   setVolume,
   setNextSong,
   setPreviousSong,
   handleControls,
   updateSongDetails,
   setCurrentTime,
   setProgressBarWidth,
   setVolumeBar,
   setDuration,
} = audioSlice.actions;
export default audioSlice.reducer;

// import React, {
//    useState,
//    useEffect,
//    useRef,
//    useContext,
//    createContext,
// } from 'react';
// import axios from 'axios';
// import { ethers } from 'ethers';
// import abi from '../Contract/abi.json';
// import { useAccount } from 'wagmi';

// ///////for download//////

// import { useDispatch, useSelector } from 'react-redux';
// import {
//    togglePlayback,
//    setActiveSong,
//    setCurrentTime,
//    setProgressBarWidth,
// } from '@/reduxToolkit/slices/audioSlice';

// //////////////////////////////

// export const StateContext = createContext({});

// export const StateContextProvider = ({ children }) => {
//    //    const { contract } = useContract(
//    //       // '0x29c6Cd6d269F5CB422eB21B8D7b636384Bc66123'
//    //       '0x46525740483e6cf321313372F8eCa8bBb625a57B'
//    //    );

//    // const address = useAddress();
//    // const connect = useMetamask();
//    // const disconnect = useDisconnect();

//    const minningTestnetContractAddress =
//       '0x72BC9712BEb034977f5A0830CE1F3E6ff9440486';

//    const { address } = useAccount();

//    // console.log(address);
//    /////////////// for download///////

//    const audioRef = useRef(null);
//    const audioRefs = {};
//    // const purchasedSongs = useSelector((state) => state.songs.purchasedSongs);

//    const songStates = useSelector((state) => state.audio.songStates);
//    const activeSongId = useSelector((state) => state.audio.activeSongId);
//    const repeat = useSelector((state) => state.audio.repeat);
//    const isPlaying = useSelector(
//       (state) => state.audio.songStates[state.audio.activeSongId]
//    );

//    const dispatch = useDispatch();
//    //////////////////////////////////

//    const [accounts, setAccounts] = useState('');
//    const [isLoading, setIsLoading] = useState(false);
//    const [isConnected, setIsConnected] = useState(false);
//    const [dailyRoi, setDailyRoi] = useState(0);
//    const [progressUpdateInterval, setProgressUpdateInterval] = useState(null);

//    // const [walletConnected, setWalletConnected] = useState(false);

//    // const handlePlayClick = (productId) => {
//    //    const audio = audioRefs[productId];

//    //    if (audio) {
//    //       if (productId === activeSongId) {
//    //          // Toggle play/pause state when clicking play button
//    //          if (audio.paused) {
//    //             console.log('Playing...');
//    //             audio.play().catch((error) => {
//    //                console.error('Failed to play audio:', error);
//    //             });
//    //             console.log('stop Playing...');
//    //          } else {
//    //             console.log('Pausing...');
//    //             audio.pause();
//    //          }
//    //          if (isPlaying) {
//    //             // If it's playing, pause the audio
//    //             audio.pause();
//    //             clearInterval(progressUpdateInterval); // Stop updating the progress bar
//    //          } else {
//    //             // If it's paused, play the audio
//    //             audio.play().catch((error) => {
//    //                console.error('Failed to play audio:', error);
//    //             });

//    //             // Start a new interval to update the progress bar
//    //             const interval = setInterval(() => {
//    //                // Update the progress bar based on the audio's current time
//    //                const currentTime = audio.currentTime;
//    //                // console.log(currentTime);
//    //                const totalTime = audio.duration;
//    //                // console.log(totalTime);
//    //                if (!isNaN(totalTime)) {
//    //                   const percentage = (currentTime / totalTime) * 100;
//    //                   dispatch(setProgressBarWidth(percentage));
//    //                   dispatch(setCurrentTime(currentTime));
//    //                }
//    //             }, 1000); // Update every 1000 milliseconds (1 second)
//    //             setProgressUpdateInterval(interval);
//    //          }

//    //          // Toggle the playback state in the Redux store
//    //          dispatch(togglePlayback(productId));
//    //       } else {
//    //          // If a new song is clicked, play it and update the state
//    //          dispatch(setActiveSong(productId));

//    //          // Pause other songs and update their playback state
//    //          Object.keys(audioRefs).forEach((songId) => {
//    //             if (songId !== productId) {
//    //                const otherAudio = audioRefs[songId];
//    //                if (otherAudio) {
//    //                   otherAudio.pause();
//    //                   dispatch(togglePlayback(songId));
//    //                }
//    //             }
//    //          });

//    //          // Handle song repeat logic
//    //          if (repeat) {
//    //             // Play the same song again
//    //             audio.currentTime = 0;
//    //             audio.play().catch((error) => {
//    //                console.error('Failed to play audio:', error);
//    //             });
//    //          }
//    //       }
//    //    }
//    // };

//    // const handleAudioPlayPause = () => {
//    //    if (activeSongId) {
//    //       const audio = audioRefs[activeSongId];

//    //       if (audio) {
//    //          if (audio.paused) {
//    //             console.log('Playing...');
//    //             audio.play().catch((error) => {
//    //                console.error('Failed to play audio:', error);
//    //             });
//    //             console.log('stop Playing...');
//    //          } else {
//    //             console.log('Pausing...');
//    //             audio.pause();
//    //          }

//    //          if (isPlaying) {
//    //             // If it's playing, pause the audio
//    //             audio.pause();
//    //             clearInterval(progressUpdateInterval); // Stop updating the progress bar
//    //             setProgressUpdateInterval(null); // Clear the interval reference
//    //          } else {
//    //             // If it's paused, play the audio
//    //             audio.play().catch((error) => {
//    //                console.error('Failed to play audio:', error);
//    //             });

//    //             // Start a new interval to update the progress bar
//    //             const interval = setInterval(() => {
//    //                // Update the progress bar based on the audio's current time
//    //                const currentTime = audio.currentTime;
//    //                console.log(currentTime);
//    //                const totalTime = audio.duration;
//    //                if (!isNaN(totalTime)) {
//    //                   const percentage = (currentTime / totalTime) * 100;
//    //                   dispatch(setProgressBarWidth(percentage));
//    //                   dispatch(setCurrentTime(currentTime));
//    //                }
//    //             }, 1000); // Update every 1000 milliseconds (1 second)
//    //             setProgressUpdateInterval(interval);

//    //             console.log(interval);
//    //          }

//    //          // Toggle the playback state in the Redux store
//    //          dispatch(togglePlayback(activeSongId));
//    //       }
//    //    }
//    // };

//    const handleAudioPlayPause = (isPlaying) => {
//       if (activeSongId) {
//          const audio = audioRefs[activeSongId];

//          if (audio) {
//             if (audio.paused) {
//                console.log('Playing...');
//                audio.play().catch((error) => {
//                   console.error('Failed to play audio:', error);
//                });
//                console.log('stop Playing...');
//             } else {
//                console.log('Pausing...');
//                audio.pause();
//             }

//             if (isPlaying) {
//                // If it's playing, pause the audio
//                audio.pause();
//                if (progressUpdateInterval) {
//                   clearInterval(progressUpdateInterval);
//                   setProgressUpdateInterval(null); // Clear the interval reference
//                }
//             } else {
//                // If it's paused, play the audio
//                audio.play().catch((error) => {
//                   console.error('Failed to play audio:', error);
//                });

//                // Clear the previous interval reference, if any
//                if (progressUpdateInterval) {
//                   clearInterval(progressUpdateInterval);
//                   setProgressUpdateInterval(null);
//                }

//                // Smoothly update the progress bar using requestAnimationFrame
//                const updateProgressBar = () => {
//                   const currentTime = audio.currentTime;
//                   const totalTime = audio.duration;

//                   if (!isNaN(totalTime)) {
//                      const percentage = (currentTime / totalTime) * 100;
//                      const clampedPercentage = Math.min(
//                         100,
//                         Math.max(0, percentage)
//                      ); // Ensure it's within the valid range
//                      dispatch(setProgressBarWidth(clampedPercentage));
//                      dispatch(setCurrentTime(currentTime));

//                      if (clampedPercentage < 100) {
//                         // Continue updating while the audio is not at the end
//                         requestAnimationFrame(updateProgressBar);
//                      } else {
//                         // Playback reached the end, clear the interval
//                         clearInterval(progressUpdateInterval);
//                         setProgressUpdateInterval(null);
//                      }
//                   }
//                };

//                // Start updating the progress bar
//                requestAnimationFrame(updateProgressBar);
//             }

//             // Toggle the playback state in the Redux store
//             dispatch(togglePlayback(activeSongId));
//          }
//       }
//    };

//    const handlePlayClick = (productId) => {
//       const audio = audioRefs[productId];

//       if (audio) {
//          if (productId === activeSongId) {
//             handleAudioPlayPause();
//          } else {
//             // Clear the progress update interval for the previous song
//             if (progressUpdateInterval) {
//                clearInterval(progressUpdateInterval);
//             }

//             // If a new song is clicked, play it and update the state
//             dispatch(setActiveSong(productId));

//             // Pause other songs and update their playback state
//             Object.keys(audioRefs).forEach((songId) => {
//                if (songId !== productId) {
//                   const otherAudio = audioRefs[songId];
//                   if (otherAudio) {
//                      otherAudio.pause();
//                      dispatch(togglePlayback(songId));
//                   }
//                }
//             });

//             // Handle song repeat logic
//             if (repeat) {
//                // Play the same song again
//                audio.currentTime = 0;
//                audio.play().catch((error) => {
//                   console.error('Failed to play audio:', error);
//                });
//             }
//          }
//       }
//    };

//    const handleSongEnd = (productId) => {
//       // Check if the song should be repeated, if not, update its state
//       if (!repeat) {
//          dispatch(togglePlayback(productId)); // Update the playback state in the Redux store
//       }
//    };

//    // const handlePlayClick = (productId) => {
//    //    const audio = audioRefs[productId];

//    //    if (audio) {
//    //       if (productId === activeSongId) {
//    //          // Toggle play/pause state when clicking play button
//    //          if (audio.paused) {
//    //             console.log('Playing...');
//    //             audio.play().catch((error) => {
//    //                console.error('Failed to play audio:', error);
//    //             });
//    //          } else {
//    //             console.log('Pausing...');
//    //             audio.pause();
//    //          }

//    //          // Toggle the playback state in the Redux store
//    //          dispatch(togglePlayback(productId));
//    //       } else {
//    //          // If a new song is clicked, play it and update the state
//    //          dispatch(setActiveSong(productId));

//    //          // Pause other songs and update their playback state
//    //          Object.keys(audioRefs).forEach((songId) => {
//    //             if (songId !== productId) {
//    //                const otherAudio = audioRefs[songId];
//    //                if (otherAudio) {
//    //                   otherAudio.pause();
//    //                   dispatch(togglePlayback(songId)); // Update the playback state in the Redux store
//    //                }
//    //             }
//    //          });
//    //       }
//    //       // Handle song repeat logic
//    //       if (repeat) {
//    //          // Play the same song again
//    //          audio.currentTime = 0;
//    //          audio.play().catch((error) => {
//    //             console.error('Failed to play audio:', error);
//    //          });
//    //       }
//    //    }
//    // };

//    const signIn = async () => {
//       // setWalletConnected(true);

//       setIsConnected(false);
//       try {
//          // if (!isConnected) {
//          if (window.ethereum) {
//             // // Call the ConnectButton component
//             // // ConnectButton();

//             const accounts = await window.ethereum.request({
//                method: 'eth_requestAccounts',
//             });

//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const signer = provider.getSigner();

//             setIsLoading(true);

//             const messageHash = ethers.utils.hashMessage(
//                'Sign-in to web3 kigdom-coin e-comerce'
//             );
//             const signature = await signer.signMessage(messageHash);

//             // Save the signature in local storage
//             localStorage.setItem('userSignature', signature);

//             const userSignature = localStorage.getItem('userSignature');

//             if (userSignature) {
//                // Include the signature in the request header

//                const authURL =
//                   'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

//                const res = await axios.post(
//                   authURL,
//                   {
//                      address: accounts[0], // Use the user's address
//                      signature: userSignature, // Use the user's signature
//                   },
//                   {
//                      headers: {
//                         'Content-Type': 'application/json',
//                      },
//                   }
//                );
//                console.log(res);

//                if (res.data.statusCode === 200) {
//                   // Store responseData in localStorage
//                   const responseData = res.data.data;
//                   localStorage.setItem(
//                      'responseData',
//                      JSON.stringify(responseData)
//                   );
//                   // Now you can access it later by parsing it back
//                   const storedData = JSON.parse(
//                      localStorage.getItem('responseData')
//                   );
//                } else {
//                   console.error(
//                      `API request failed with status code ${res.status}`
//                   );
//                   if (res.status === 401) {
//                      console.error(
//                         'Unauthorized: Check your authorization token.'
//                      );
//                   }
//                }
//             } else {
//                console.error('User signature not found in local storage');
//             }
//             setIsLoading(false);
//          } else {
//             console.error('MetaMask not installed');
//          }
//       } catch (error) {
//          console.error('Error signing in with message hash:', error);
//       }
//    };

//    ///// UNSTAKE F(x) ///////////
//    const UnStake = async () => {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);

//       const signer = provider.getSigner();

//       const contract = new ethers.Contract(
//          minningTestnetContractAddress,
//          abi,
//          signer
//       );
//       // setNoProfitYet(false);
//       // setStakeLoading(true);
//       try {
//          let tx;

//          // if (profitPool == 0) {
//          //    setNoProfitYet(true);
//          //    setTimeout(() => {
//          //       setNoProfitYet(false);
//          //    }, 3000);
//          // // } else {
//          //    setNoProfitYet(false);
//          //    setProfitLoading(true);
//          tx = await contract.unStake(0, {
//             gasLimit: 200000,
//             gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
//          });
//          const receipt = await tx.wait();
//          if (receipt.status == 1) {
//             // setProfitLoading(false);
//             // Reload the page after a successful transaction
//             window.location.reload();
//          } else {
//             // setProfitLoading(false);
//          }
//          // }
//       } catch (err) {
//          console.error(err);
//       }
//       // setStakeLoading(false);
//    };

//    useEffect(() => {
//       const ROI = async () => {
//          // daily roi

//          try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             // const provider = new ethers.getDefaultProvider(
//             //    'https://bsc-dataseed1.binance.org/'
//             // );

//             // const signer = provider.getSigner();
//             const contractInstance = new ethers.Contract(
//                minningTestnetContractAddress,
//                abi,
//                provider
//             );

//             const roi = await contractInstance.YEAR_RATE();
//             const dailyRoi = roi.toString();
//             const dailyRoiInEther = ethers.utils.formatUnits(dailyRoi, 'ether');
//             const dailyRoiAmount = (dailyRoiInEther / 60) * 30;
//             console.log(dailyRoiAmount);
//             setDailyRoi(dailyRoiAmount);
//          } catch (err) {
//             console.log(err);
//          }
//       };
//       ROI();
//    }, []);

//    // const Connect = () => {
//    //    // <w3m-button balance="hide" />;
//    //    // setIsConnected(true);
//    //    // signIn();
//    //    return <w3m-button balance="hide" />;
//    // };

//    // useEffect(() => {
//    //    // Check if the third-party component is connected when the component mounts
//    //    if (window.ethereum) {
//    //       setIsConnected(true);
//    //    }
//    // }, []);

//    // const connectWallet = async () => {
//    //    try {
//    //       if (window.ethereum) {
//    //          const accounts = await window.ethereum.request({
//    //             method: 'eth_requestAccounts',
//    //          });

//    //          const provider = new ethers.providers.Web3Provider(window.ethereum);
//    //          const signer = provider.getSigner();

//    //          setIsLoading(true);

//    //          const messageHash = ethers.utils.hashMessage(
//    //             'Sign-in to web3 kigdom-coin e-commerce'
//    //          );
//    //          const signature = await signer.signMessage(messageHash);

//    //          // Save the signature in local storage
//    //          localStorage.setItem('userSignature', signature);

//    //          console.log(signature);

//    //          const userSignature = localStorage.getItem('userSignature');

//    //          console.log(userSignature);

//    //          if (userSignature) {
//    //             // Make a POST request to authenticate the user
//    //             const res = await axios.post(
//    //                'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser',
//    //                {
//    //                   address: accounts[0], // Use the user's address
//    //                   signature: userSignature, // Use the user's signature
//    //                },
//    //                {
//    //                   headers: {
//    //                      'Content-Type': 'application/json',
//    //                   },
//    //                }
//    //             );

//    //             console.log(res);

//    //             if (res.status === 200) {
//    //                const responseData = res.data.data;

//    //                // Store responseData in localStorage
//    //                localStorage.setItem(
//    //                   'responseData',
//    //                   JSON.stringify(responseData)
//    //                );

//    //                // Now you can access it later by parsing it back
//    //                const storedData = JSON.parse(
//    //                   localStorage.getItem('responseData')
//    //                );

//    //                console.log(responseData);

//    //                // You can use storedData as needed in your application
//    //             } else {
//    //                console.error(
//    //                   `Authentication request failed with status code ${res.status}`
//    //                );
//    //                if (res.status === 401) {
//    //                   console.error(
//    //                      'Unauthorized: Check your authorization token.'
//    //                   );
//    //                }
//    //             }
//    //          } else {
//    //             console.error('User signature not found in local storage');
//    //          }
//    //          setIsLoading(false);
//    //       } else {
//    //          console.error('MetaMask not installed');
//    //       }
//    //    } catch (error) {
//    //       console.error('Error signing in with message hash:', error);
//    //    }
//    // };

//    // const connectWallet = async () => {
//    //    try {
//    //       if (window.ethereum) {
//    //          const accounts = await window.ethereum.request({
//    //             method: 'eth_requestAccounts',
//    //          });

//    //          const provider = new ethers.providers.Web3Provider(window.ethereum);
//    //          const signer = provider.getSigner();

//    //          setIsLoading(true);

//    //          const messageHash = ethers.utils.hashMessage(
//    //             'Sign-in to web3 kigdom-coin e-comerce'
//    //          );
//    //          const signature = await signer.signMessage(messageHash);

//    //          // Save the signature in local storage
//    //          localStorage.setItem('userSignature', signature);

//    //          const userSignature = localStorage.getItem('userSignature');

//    //          if (userSignature) {
//    //             // Include the signature in the request header

//    //             const authURL =
//    //                'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

//    //             const res = await axios.post(
//    //                authURL,
//    //                {
//    //                   address: accounts[0], // Use the user's address
//    //                   signature: userSignature, // Use the user's signature
//    //                },
//    //                {
//    //                   headers: {
//    //                      'Content-Type': 'application/json',
//    //                   },
//    //                }
//    //             );

//    //             if (res.data.statusCode === 200) {
//    //                // Store responseData in localStorage
//    //                const responseData = res.data.data;
//    //                localStorage.setItem(
//    //                   'responseData',
//    //                   JSON.stringify(responseData)
//    //                );
//    //                // Now you can access it later by parsing it back
//    //                const storedData = JSON.parse(
//    //                   localStorage.getItem('responseData')
//    //                );
//    //             } else {
//    //                console.error(
//    //                   `API request failed with status code ${res.status}`
//    //                );
//    //                if (res.status === 401) {
//    //                   console.error(
//    //                      'Unauthorized: Check your authorization token.'
//    //                   );
//    //                }
//    //             }
//    //          } else {
//    //             console.error('User signature not found in local storage');
//    //          }
//    //          setIsLoading(false);
//    //       } else {
//    //          console.error('MetaMask not installed');
//    //       }
//    //    } catch (error) {
//    //       console.error('Error signing in with message hash:', error);
//    //    }
//    // };

//    // const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
//    // console.log(wallet);
//    // if (wallet) {
//    //    if (wallet[0]) {
//    //       const ethersProvider = new ethers.providers.Web3Provider(
//    //          wallet[0].provider,
//    //          'any'
//    //       );

//    //       const signer = ethersProvider.getSigner();

//    //       console.log(signer);
//    //    } else {
//    //       console.log(
//    //          "Wallet is not connected yet or doesn't have a selected address."
//    //       );
//    //    }
//    // }

//    return (
//       <StateContext.Provider
//          value={{
//             // connectWallet,
//             signIn,
//             UnStake,
//             handlePlayClick,
//             songStates,
//             activeSongId,
//             audioRefs,
//             repeat,
//             handleSongEnd,
//             handleAudioPlayPause,

//             // walletConnected,
//             // Connect,
//          }}
//       >
//          {children}
//       </StateContext.Provider>
//    );
// };
// {
//    /* {books.map((book) => {
//             const { recId, author, category, description, price, cover } = book;

//             return (
//                <div key={recId}>
//                   <img
//                      src={cover}
//                      alt={`Cover for ${recId}`}
//                      width={150}
//                      height={100}
//                   />
//                   <p>{recId}</p>
//                   <p>{author}</p>
//                   <p>{description}</p>
//                   <p>{price}</p>
//                   <p>{category}</p>
//                </div>
//             );
//          })} */
// }

// //  API Key: 56dea089dd75273bcbfa
// //  API Secret: a1e23bc067312846d4546f93e547947dffbad67d2745c5fb5d6888d1f2ca501b
// //  JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwY2MxYzEwZC1iZGNhLTRjNzEtYWFjZS1hMGY0NDczMmEyZDAiLCJlbWFpbCI6Im9uYWhzdW5kYXkwNjEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1NmRlYTA4OWRkNzUyNzNiY2JmYSIsInNjb3BlZEtleVNlY3JldCI6ImExZTIzYmMwNjczMTI4NDZkNDU0NmY5M2U1NDc5NDdkZmZiYWQ2N2QyNzQ1YzVmYjVkNjg4OGQxZjJjYTUwMWIiLCJpYXQiOjE2OTY1MTI3NDJ9.iQ91nbTy8bSdbhGQPysioTB62w6I8L6v3SNWJbwnu5c
