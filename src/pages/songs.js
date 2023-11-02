import React, { useEffect, useState, useContext } from 'react';
import { StateContext } from '@/Context/ReligiousContext';
import { useAccount } from 'wagmi';
import { useDispatch } from 'react-redux';
import RMabi from '@/Contract/rm-abi.json';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
// import { addSong } from '../reduxToolkit/slices/songsSlices';

const Songs = () => {
   const dispatch = useDispatch();

   const { UnStake } = useContext(StateContext);
   // Initialize purchasedSongs and activeSongIndex state variables
   const [purchasedSongs, setPurchasedSongs] = useState([]);
   const [activeSongIndex, setActiveSongIndex] = useState(null);

   const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9';
   const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
   const [imageUrls, setImageUrls] = useState([]);
   const [messages, setMessages] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [songLoadingStates, setSongLoadingStates] = useState({});

   const { address } = useAccount();
   // console.log(address);

   const songDetails = [
      {
         id: '12343556',
         // id: 'rec43w3ipXvP28vog',
         title: 'high-back bench',
         artist: 'John Doe',
         category: 'healing',
         // file: 'https',
         file: '/phill_thompson.mp3',
         price: 1.09,
         imageUrl: '',
      },
      {
         id: '9876423546',
         title: 'albany table',
         artist: 'John Doe',
         category: 'faith',
         file: '/Minister_GUC.mp3',
         price: 79.99,
         imageUrl: '',
      },
      {
         id: '56987545',
         title: 'accent chair traditional',
         artist: 'John Doe',
         category: 'faith',
         file: '/Ludovico Piano.mp3',
         price: 25.99,
         imageUrl: '',
      },
      {
         id: 'recBohCqQsot4Q4II',
         title: 'wooden table',
         artist: 'John Doe',
         category: 'faith',
         file: 'https',
         price: 45.99,
         imageUrl: '',
      },
      {
         id: 'recDG1JRZnbpRHpoy',
         title: 'dining table',
         artist: 'John Doe',
         category: 'faith',
         file: 'https',
         price: 6.99,
         imageUrl: '',
      },
      {
         id: 'recNWGyP7kjFhSqw3',
         title: 'sofa set',
         artist: 'John Doe',
         category: 'supernatural',
         file: 'https',
         price: 69.99,
         imageUrl: '',
      },
   ];

   const fetchImageUrls = async () => {
      try {
         // Fetch the list of files and directories in the IPFS folder
         const response = await fetch(gatewayUrl);
         if (!response.ok) {
            throw new Error('Failed to fetch folder content');
         }

         // Assuming the response is HTML containing links to files
         const html = await response.text();

         // Parse the HTML to extract links to image files
         const parser = new DOMParser();
         const doc = parser.parseFromString(html, 'text/html');
         const links = Array.from(doc.querySelectorAll('a'));

         // Filter links to include only image files ending with "/img.png"
         const imageLinks = links.filter((link) =>
            link.getAttribute('href').includes('/img')
         );

         // Create image URLs from the links
         const urls = imageLinks.map(
            (link) => `https://ipfs.io${link.getAttribute('href')}`
         );

         // Set the image URL for each product in the Songs array
         const updatedMessages = songDetails.map((song, index) => ({
            ...song,
            imageUrl: urls[index] || 'hello',
         }));

         // Remove duplicates by converting the array to a Set and then back to an array
         const uniqueUrls = Array.from(new Set(urls));
         setImageUrls(uniqueUrls);
         // console.log(uniqueUrls);
         setMessages(updatedMessages);
      } catch (error) {
         console.error('Error fetching folder content:', error);
      }
   };

   const [searchInput, setSearchInput] = useState('');
   const [filteredSongs, setFilteredSongs] = useState(messages);

   useEffect(() => {
      // Filter the messages based on the search input
      const filtered = songDetails.filter(
         (song) =>
            song.artist.toLowerCase().includes(searchInput.toLowerCase()) ||
            song.title.toLowerCase().includes(searchInput.toLowerCase())
      );

      setFilteredSongs(filtered);
   }, [searchInput]);

   useEffect(() => {
      fetchImageUrls();
   }, [gatewayUrl]);

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

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

   // const buyNow = async (product) => {
   //    try {
   //       if (product) {
   //          // Check if the user is connected to a Web3 provider
   //          if (window.ethereum) {
   //             const provider = new ethers.providers.Web3Provider(
   //                window.ethereum
   //             );
   //             const signer = provider.getSigner();

   //             // Check if the user is authenticated and obtain the user's address
   //             const userAddress = await signer.getAddress();

   //             // Find the index of the product in songDetails using its id
   //             const productIndex = songDetails.findIndex(
   //                (song) => song.id === product.id
   //             );

   //             if (productIndex !== -1) {
   //                // Retrieve the corresponding image URL based on the product's index
   //                const imageUrl = imageUrls[productIndex];

   //                // Convert the product's price to Wei (assuming it's in Ether)
   //                const priceInEther = product.price.toString();

   //                console.log(priceInEther);
   //                // const priceInWei = ethers.utils.parseEther(priceInEther);

   //                // Initialize the contract instance
   //                const contract = new ethers.Contract(
   //                   RMTestnetContractAddress,
   //                   RMabi,
   //                   signer
   //                );

   //                const contentId = parseInt(product.id);
   //                const token = TokenAddress;

   //                // const valueInWei = ethers.utils.parseEther(
   //                //    product.price.toString()
   //                // ); // Convert the product price to Wei

   //                // Call the smart contract's purchase function
   //                let tx;
   //                tx = await contract.purchase(contentId, token, {
   //                   // value: valueInWei, // Send the price as value in Wei
   //                   gasLimit: 200000, // Adjust the gas limit as needed
   //                   gasPrice: ethers.utils.parseUnits('10.0', 'gwei'), // Adjust the gas price as needed
   //                });

   //                const receipt = await tx.wait();

   //                // If the purchase is successful, store the purchased product in local storage

   //                if (receipt.status === 1) {
   //                   console.log('bingo');
   //                   const purchasedProduct = {
   //                      ...product,
   //                      imageUrl,
   //                      address: userAddress,
   //                   };

   //                   // Store purchased products in localStorage
   //                   const serializedProduct = JSON.stringify(purchasedProduct);
   //                   const storedPurchasedProducts =
   //                      JSON.parse(localStorage.getItem('purchasedProducts')) ||
   //                      [];
   //                   storedPurchasedProducts.push(serializedProduct);
   //                   localStorage.setItem(
   //                      'purchasedProducts',
   //                      JSON.stringify(storedPurchasedProducts)
   //                   );
   //                } else {
   //                   console.error('Transaction Not Successful');
   //                }
   //             } else {
   //                console.error('Product not found in songDetails.');
   //             }
   //          } else {
   //             console.error('User is not connected to a Web3 provider.');
   //          }
   //       }
   //    } catch (err) {
   //       console.error('Purchase failed:', err);
   //    }
   // };

   const buyNow = async (product) => {
      try {
         if (product) {
            // Check if the user is connected to a Web3 provider
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
                        background: '#a16206',
                        border: '1px solid #a16206',
                        color: '#fff',
                     },
                  });
                  return;
               }

               // Check if the user is authenticated and obtain the user's address

               // Find the index of the product in songDetails using its id
               const productIndex = songDetails.findIndex(
                  (song) => song.id === product.id
               );
               setSongLoadingStates((prevStates) => ({
                  ...prevStates,
                  [product.id]: true,
               }));

               if (productIndex !== -1) {
                  // Retrieve the corresponding image URL based on the product's index
                  const imageUrl = imageUrls[productIndex];

                  // Convert the product's price to Wei (assuming it's in Ether)
                  // const priceInEther = product.price.toString();

                  // console.log(priceInEther);
                  // const priceInWei = ethers.utils.parseEther(priceInEther);
                  // console.log(priceInWei);
                  // Initialize the contract instance
                  const contract = new ethers.Contract(
                     RMTestnetContractAddress,
                     RMabi,
                     signer
                  );

                  // Make the purchase through the smart contract
                  const contentId = parseInt(product.id); // Convert the product.id to uint256
                  const token = TokenAddress; // Use the token address from your configuration
                  // const valueInWei = ethers.utils.parseEther(
                  //    product.price.toString()
                  // ); // Convert the product price to Wei

                  // Call the smart contract's purchase function
                  let tx;
                  tx = await contract.purchase(contentId, token, {
                     // value: valueInWei, // Send the price as value in Wei
                     gasLimit: 200000, // Adjust the gas limit as needed
                     gasPrice: ethers.utils.parseUnits('10.0', 'gwei'), // Adjust the gas price as needed
                  });

                  const receipt = await tx.wait();

                  // If the purchase is successful, store the purchased product in local storage

                  if (receipt.status === 1) {
                     console.log('bingo');
                     const purchasedProduct = {
                        ...product,
                        imageUrl,
                        address: address,
                     };

                     // Store purchased products in localStorage
                     const serializedProduct = JSON.stringify(purchasedProduct);
                     const storedPurchasedProducts =
                        JSON.parse(localStorage.getItem('purchasedProducts')) ||
                        [];
                     storedPurchasedProducts.push(serializedProduct);
                     localStorage.setItem(
                        'purchasedProducts',
                        JSON.stringify(storedPurchasedProducts)
                     );

                     const purchasedSongTitle = purchasedProduct.title;

                     // Display a success toast notification
                     toast.success(
                        `${purchasedSongTitle}, Purchase successful`,
                        {
                           duration: 4000,
                           position: 'bottom-right',
                           icon: '✅',
                        }
                     );
                     setSongLoadingStates((prevStates) => ({
                        ...prevStates,
                        [product.id]: false,
                     }));
                  } else {
                     console.error('Transaction Not Successful');
                  }
               } else {
                  console.error('Product not found in songDetails.');
               }
            } else {
               console.error('User is not connected to a Web3 provider.');
            }
         }
      } catch (err) {
         console.error('Purchase failed:', err);
         setSongLoadingStates((prevStates) => ({
            ...prevStates,
            [product.id]: false,
         }));
      }
   };

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
               {filteredSongs.map((song, index) => (
                  <div
                     key={song.id}
                     className="flex justify-between items-center mx-1  px-2 py-3  rounded-md  shadow-custom"
                     // className="flex flex-col w-[calc(50% - 1rem)] md:w-[calc(33.33% - 1rem)] lg:w-[calc(25% - 1rem)] 2xl:w-[calc(20% - 1rem)] mb-3 p-2 rounded-md  shadow-custom"
                  >
                     <div className="md:flex-shrink-0">
                        <img
                           src={imageUrls[index] || ''}
                           alt={`Image ${index}`}
                           className="rounded-md"
                           width={150}
                           height={150}
                        />
                     </div>

                     <div className="flex flex-col ml-6 text-sm">
                        <span className=" text-white text-small pt-1 pb-1 overflow-hidden whitespace-nowrap">
                           {song.title.length > 15
                              ? `${song.title.slice(0, 15)}...`
                              : song.title}
                        </span>
                        <span className="text-white text-sm">
                           {song.artist}
                        </span>
                        <span className="text-gray-400">$TKC {song.price}</span>
                        <div>
                           {hasPurchased(address, song.id) ? (
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
                                 className="text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover-bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                              >
                                 {songLoadingStates[song.id] ? (
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
            </div>
         </div>
      </>
   );
};

export default Songs;
