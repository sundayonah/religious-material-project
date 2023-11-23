import React, {
   useState,
   useEffect,
   useRef,
   useContext,
   createContext,
} from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import abi from '../Contract/abi.json';
import { useAccount } from 'wagmi';
import ApproveAbi from '@/Contract/approve.json';

///////for download//////

import { useDispatch, useSelector } from 'react-redux';
import {
   togglePlayback,
   setActiveSong,
   setCurrentTime,
   setProgressBarWidth,
   setDuration,
   updateSongDetails,
} from '@/reduxToolkit/slices/audioSlice';
import RMabi from '@/Contract/rm-abi.json';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import toast, { Toaster } from 'react-hot-toast';

//////////////////////////////

export const StateContext = createContext({});

export const StateContextProvider = ({ children }) => {
   //    const { contract } = useContract(
   //       // '0x29c6Cd6d269F5CB422eB21B8D7b636384Bc66123'
   //       '0x46525740483e6cf321313372F8eCa8bBb625a57B'
   //    );

   // const connect = useMetamask();
   // const disconnect = useDisconnect();

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   const { address } = useAccount();

   /////////////// for download///////

   const audioRef = useRef(null);
   const audioRefs = {};
   // const purchasedSongs = useSelector((state) => state.songs.purchasedSongs);

   const songStates = useSelector((state) => state.audio.songStates);
   const activeSongId = useSelector((state) => state.audio.activeSongId);
   const repeat = useSelector((state) => state.audio.repeat);
   const isPlaying = useSelector(
      (state) => state.audio.songStates[state.audio.activeSongId]
   );

   const dispatch = useDispatch();
   //////////////////////////////////

   const [accounts, setAccounts] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isConnected, setIsConnected] = useState(false);
   const [dailyRoi, setDailyRoi] = useState(0);
   const [progressUpdateInterval, setProgressUpdateInterval] = useState(null);

   const [isApproved, setIsApproved] = useState(false);
   const [approvedProducts, setApprovedProducts] = useState([]);
   const [approveLoadingStates, setApproveLoadingStates] = useState({});
   const [isAllowance, setIsAllowance] = useState(false);

   // //FETCH CONTRACT
   // const Fetch_Contract = (PROVIDER) =>
   //    new ethers.Contract(contractAddress, contractAbi, PROVIDER);

   // // CONNECTING WITH WITH CONTRACT
   // const connectWithSmartContract = async (contrat_Address, contract_ABI) => {
   //    try {
   //       const web3modal = new useWeb3Modal();
   //       const connection = await web3modal.connect();
   //       const provider = new ethers.providers.Web3Provider(connection);
   //       const signer = provider.getSigner();

   //       const contract = Fetch_Contract(signer);
   //       console.log(contract);

   //       return contract;
   //    } catch (error) {
   //       console.log(error);
   //    }
   // };

   // const [walletConnected, setWalletConnected] = useState(false);

   const handleSongEnd = (productId) => {
      // Check if the song should be repeated, if not, update its state
      if (!repeat) {
         dispatch(togglePlayback(productId)); // Update the playback state in the Redux store
      }
   };
   const startProgressUpdateInterval = (audio) => {
      const interval = setInterval(() => {
         const currentTime = audio.currentTime;
         console.log(currentTime);
         const totalTime = audio.duration;
         console.log(totalTime);
         if (!isNaN(totalTime)) {
            const percentage = (currentTime / totalTime) * 100;
            dispatch(setProgressBarWidth(percentage));
            dispatch(setCurrentTime(currentTime));
            dispatch(setDuration(totalTime));
         }
      }, 1000); // Update every 1000 milliseconds (1 second)
      return interval;
   };

   const handlePlayClick = (productId, title, artist, imageUrl) => {
      const audio = audioRefs[productId];
      console.log(audio);

      if (audio) {
         if (productId === activeSongId) {
            if (audio.paused) {
               audio.play().catch((error) => {
                  console.error('Failed to play audio:', error);
               });
            } else {
               audio.pause();
            }
         } else {
            dispatch(setActiveSong(productId));
            dispatch(updateSongDetails({ title, artist, imageUrl }));

            Object.keys(audioRefs).forEach((songId) => {
               if (songId !== productId) {
                  const otherAudio = audioRefs[songId];
                  if (otherAudio) {
                     otherAudio.pause();
                     dispatch(togglePlayback(songId));
                  }
               }
            });
         }
         dispatch(togglePlayback(productId));
      }
   };

   // const handlePlayClick = async (
   //    productId,
   //    title,
   //    artist,
   //    imageUrl,
   //    audioSource
   // ) => {
   //    const audio = audioRefs[productId];

   //    if (audio) {
   //       if (productId === activeSongId) {
   //          if (audio.paused) {
   //             try {
   //                await audio.play();
   //             } catch (error) {
   //                console.error('Failed to play audio:', error);
   //             }
   //          } else {
   //             audio.pause();
   //          }
   //       } else {
   //          dispatch(setActiveSong(productId));
   //          dispatch(updateSongDetails({ title, artist, imageUrl }));

   //          // Update the audio source dynamically before playing
   //          audio.src = audioSource;

   //          Object.keys(audioRefs).forEach((songId) => {
   //             if (songId !== productId) {
   //                const otherAudio = audioRefs[songId];
   //                if (otherAudio) {
   //                   otherAudio.pause();
   //                   dispatch(togglePlayback(songId));
   //                }
   //             }
   //          });
   //       }
   //       dispatch(togglePlayback(productId));
   //    }
   // };

   // const signIn = async () => {
   //    // setWalletConnected(true);

   //    setIsConnected(false);
   //    try {
   //       // if (!isConnected) {
   //       if (window.ethereum) {
   //          // // Call the ConnectButton component
   //          // // ConnectButton();

   //          const accounts = await window.ethereum.request({
   //             method: 'eth_requestAccounts',
   //          });

   //          const provider = new ethers.providers.Web3Provider(window.ethereum);
   //          const signer = provider.getSigner();

   //          setIsLoading(true);

   // const messageHash = ethers.utils.hashMessage(
   //    'Sign-in to web3 kigdom-coin e-comerce'
   // );
   //          const signature = await signer.signMessage(messageHash);

   //          // Save the signature in local storage
   //          localStorage.setItem('userSignature', signature);

   //          const userSignature = localStorage.getItem('userSignature');

   //          if (userSignature) {
   //             // Include the signature in the request header

   //             const authURL =
   //                'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

   //             const res = await axios.post(
   //                authURL,
   //                {
   //                   address: accounts[0], // Use the user's address
   //                   signature: userSignature, // Use the user's signature
   //                },
   //                {
   //                   headers: {
   //                      'Content-Type': 'application/json',
   //                   },
   //                }
   //             );
   //             console.log(res);

   //             if (res.data.statusCode === 200) {
   //                // Store responseData in localStorage
   //                const responseData = res.data.data;
   //                localStorage.setItem(
   //                   'responseData',
   //                   JSON.stringify(responseData)
   //                );

   //                console.log(responseData);
   //                // Now you can access it later by parsing it back
   //                const storedData = JSON.parse(
   //                   localStorage.getItem('responseData')
   //                );
   //             } else {
   //                console.error(
   //                   `API request failed with status code ${res.status}`
   //                );
   //                if (res.status === 401) {
   //                   console.error(
   //                      'Unauthorized: Check your authorization token.'
   //                   );
   //                }
   //             }
   //          } else {
   //             console.error('User signature not found in local storage');
   //          }
   //          setIsLoading(false);
   //       } else {
   //          console.error('MetaMask not installed');
   //       }
   //    } catch (error) {
   //       console.error('Error signing in with message hash:', error);
   //    }
   // };

   ///// UNSTAKE F(x) ///////////

   // const Connect = () => {
   //    // <w3m-button balance="hide" />;
   //    // setIsConnected(true);
   //    // signIn();
   //    return <w3m-button balance="hide" />;
   // };

   // useEffect(() => {
   //    // Check if the third-party component is connected when the component mounts
   //    if (window.ethereum) {
   //       setIsConnected(true);
   //    }
   // }, []);

   const Connect = async () => {
      try {
         if (window.ethereum) {
            const accounts = await window.ethereum.request({
               method: 'eth_requestAccounts',
            });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            console.log(accounts);

            setIsLoading(true);

            const messageHash = ethers.utils.hashMessage(
               'Sign-in to web3 kigdom-coin e-commerce'
            );
            const signature = await signer.signMessage(messageHash);

            // Save the signature in local storage
            localStorage.setItem('userSignature', signature);

            console.log(signature);

            const userSignature = localStorage.getItem('userSignature');

            console.log(userSignature);

            if (userSignature) {
               // Make a POST request to authenticate the user
               const res = await axios.post(
                  'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser',
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
               console.log(accounts[0]);
               console.log(res);

               if (res.status === 200) {
                  const responseData = res.data.data;

                  // Store responseData in localStorage
                  localStorage.setItem(
                     'responseData',
                     JSON.stringify(responseData)
                  );

                  // Now you can access it later by parsing it back
                  const storedData = JSON.parse(
                     localStorage.getItem('responseData')
                  );

                  console.log(responseData);

                  // You can use storedData as needed in your application
               } else {
                  console.error(
                     `Authentication request failed with status code ${res.status}`
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

   const Purchase = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
         RMTestnetContractAddress,
         RMabi,
         signer
      );

      try {
         let tx;

         tx = await contract.purchase(contentId, TokenAddress, {
            gasLimit: 200000,
            gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
         });
         console.log(tx);
         const receipt = await tx.wait();
         console.log(receipt);
         if (receipt.status == 1) {
            window.location.reload();
         } else {
         }
      } catch (err) {
         console.error(err);
      }
   };

   const Approved = async (product) => {
      try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         const contractInstance = new ethers.Contract(
            TokenAddress,
            ApproveAbi,
            signer
         );

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

         setApproveLoadingStates((prevStates) => ({
            ...prevStates,
            [product.recId]: true,
         }));

         const contentPrice = product.contentPrice;

         const priceToString = contentPrice.toString();
         const price = ethers.utils.parseEther(priceToString, 'ether');

         let tx;
         tx = await contractInstance.approve(
            RMTestnetContractAddress,
            ethers.constants.MaxUint256,
            {
               gasLimit: 600000,
               gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
            }
         );

         // setIsApproved(true);
         const receipt = await tx.wait();
         //   check if the transaction was successful
         if (receipt.status === 1) {
            setIsApproved(true);
            setApproveLoadingStates((prevStates) => ({
               ...prevStates,
               [product.recId]: false,
            }));

            // Update the approvedProducts state
            setApprovedProducts((prevProducts) => [
               ...prevProducts,
               product.recId,
            ]);

            console.log('purchasing');
         } else {
            console.log('approving fail');
         }

         setIsApproved(true);
      } catch (error) {
         console.error(error);
      }

      setApproveLoadingStates((prevStates) => ({
         ...prevStates,
         [product.recId]: false,
      }));
   };

   useEffect(() => {
      const checkAllowance = async () => {
         if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const signer = provider.getSigner();

            const contractInstance = new ethers.Contract(
               TokenAddress,
               ApproveAbi,
               signer
            );
            const isAllowed = await contractInstance.allowance(
               address,
               RMTestnetContractAddress
            );
            if (isAllowed > ethers.utils.parseEther('1000', 'ether')) {
               setIsAllowance(true);
            }
         } else {
            // Handle the case where Ethereum provider is not available
            console.error(
               'Ethereum provider (window.ethereum) is not available'
            );
         }
      };
      checkAllowance();
   }, [address]);

   // console.log(isAllowance);

   const fetchPrices = async (kingdomBook) => {
      // const provider = new ethers.providers.getDefaultProvider('homestead', {
      //    alchemy: 'o_O5LwKav_r5UECR-59GtRZsIqnhD0N8',
      // });
      // const provider = new ethers.providers.Web3Provider(window.ethereum);

      const alchemyApiKey = 'o_O5LwKav_r5UECR-59GtRZsIqnhD0N8';
      const provider = new ethers.providers.JsonRpcProvider(
         `https://polygon-mumbai.g.alchemyapi.io/v2/${alchemyApiKey}`
      );

      // const signer = provider.getSigner();

      const contract = new ethers.Contract(
         RMTestnetContractAddress,
         RMabi,
         provider
         // signer
      );

      const updatedBooks = [];
      for (const book of kingdomBook) {
         const contentId = book.id;

         const contentData = await contract.content(contentId);
         const contentSplit = contentData.toString();
         // console.log(contentSplit);
         const contentValues = contentSplit.split(','); // Splitting the string by comma

         // Assuming the second value (index 1) represents the price
         const contentPrice = contentValues[1] ? parseInt(contentValues[1]) : 0;
         // console.log(contentPrice);

         // // Assuming other values in 'contentData' correspond to other properties in 'book'
         const bookWithPrice = { ...book, contentPrice };
         // console.log(bookWithPrice);

         updatedBooks.push(bookWithPrice);
      }

      // console.log(updatedBooks);
      return updatedBooks;
   };

   // useEffect(() => {
   //    const checkPurchasedStatus = async () => {
   //       try {
   //          const response = await axios.get(
   //             `http://kingdomcoin-001-site1.ctempurl.com/api/Catalog/GetTransactions/${address}`
   //          );

   //          const purchasedProducts = response.data.data;
   //          const purchasedMap = {};

   //          filteredMessages.forEach((message) => {
   //             const isPurchased = purchasedProducts.some(
   //                (product) => product.counterId === message.counterId
   //             );
   //             purchasedMap[message.counterId] = isPurchased;
   //          });

   //          // console.log(purchasedMap);

   //          setIndividualPurchasedStatus(purchasedMap);
   //       } catch (error) {
   //          console.error('Error checking purchase status:', error);
   //       }
   //    };

   //    checkPurchasedStatus();
   // }, [address, filteredMessages]);

   return (
      <StateContext.Provider
         value={{
            // connectWallet,
            fetchPrices,
            Purchase,
            // signIn,
            handlePlayClick,
            isAllowance,
            songStates,
            activeSongId,
            audioRefs,
            repeat,
            approvedProducts,
            isApproved,
            approveLoadingStates,
            Approved,
            setIsApproved,
            setApproveLoadingStates,
            setApprovedProducts,
            handleSongEnd,

            // walletConnected,
            Connect,
         }}
      >
         {children}
      </StateContext.Provider>
   );
};

//  API Key: 56dea089dd75273bcbfa
//  API Secret: a1e23bc067312846d4546f93e547947dffbad67d2745c5fb5d6888d1f2ca501b
//  JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwY2MxYzEwZC1iZGNhLTRjNzEtYWFjZS1hMGY0NDczMmEyZDAiLCJlbWFpbCI6Im9uYWhzdW5kYXkwNjEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1NmRlYTA4OWRkNzUyNzNiY2JmYSIsInNjb3BlZEtleVNlY3JldCI6ImExZTIzYmMwNjczMTI4NDZkNDU0NmY5M2U1NDc5NDdkZmZiYWQ2N2QyNzQ1YzVmYjVkNjg4OGQxZjJjYTUwMWIiLCJpYXQiOjE2OTY1MTI3NDJ9.iQ91nbTy8bSdbhGQPysioTB62w6I8L6v3SNWJbwnu5c
