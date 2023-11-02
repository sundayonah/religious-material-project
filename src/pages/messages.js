import React, { useContext, useEffect, useState } from 'react';
import Style from '@/styles/messages.module.css';
import { useAccount } from 'wagmi';
import { StateContext } from '@/Context/ReligiousContext';
import { ethers } from 'ethers';
import RMabi from '@/Contract/rm-abi.json';
import toast, { Toaster } from 'react-hot-toast';

const Messages = () => {
   const { UnStake } = useContext(StateContext);

   const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9';
   const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
   const [imageUrls, setImageUrls] = useState([]);
   const [messages, setMessages] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [messagesLoadingStates, setMessagesLoadingStates] = useState({});

   const { address } = useAccount();

   const RMTestnetContractAddress =
      '0xF00Ab09b8FA49dD07da19024d6D213308314Ddb8';
   const TokenAddress = '0x8dFaC13397e766f892bFA55790798A60eaB52921';

   const messagesDetails = [
      {
         id: '34567543',
         title: 'high-back bench',
         artist: 'peter jury',
         category: 'healing',
         // file: 'https',
         file: '/Ludovico Gonzales-Soft.mp3',
         price: 9.99,
         imageUrl: '',
      },
      {
         id: '98765433',
         title: 'albany table',
         artist: 'peter jury',
         category: 'faith',
         file: '/Ludovico Gonzales.mp3',
         price: 79.99,
         imageUrl: '',
      },
      {
         id: 're1c8kkCmSiMkbkiko',
         title: 'accent chair traditional',
         artist: 'John Doe',
         category: 'faith',
         file: '',
         price: 25.99,
         imageUrl: '',
      },
      {
         id: 're1cBohCqQsot4Q4II',
         title: 'wooden table',
         artist: 'John Doe',
         category: 'faith',
         file: 'https',
         price: 45.99,
         imageUrl: '',
      },
      {
         id: 're1cDG1JRZnbpRHpoy',
         title: 'dining table',
         artist: 'John Doe',
         category: 'faith',
         file: 'https',
         price: 6.99,
         imageUrl: '',
      },
      {
         id: 're1cNWGyP7kjFhSqw3',
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

         // Set the image URL for each product in the Messages array
         const updatedMessages = messagesDetails.map((message, index) => ({
            ...message,
            imageUrl: urls[index] || 'hello',
         }));

         // Remove duplicates by converting the array to a Set and then back to an array
         const uniqueUrls = Array.from(new Set(urls));

         setImageUrls(uniqueUrls);
         setMessages(updatedMessages);
      } catch (error) {
         console.error('Error fetching folder content:', error);
      }
   };

   const [searchInput, setSearchInput] = useState('');
   const [filteredMessages, setFilteredMessages] = useState(messages);

   useEffect(() => {
      // Filter the messages based on the search input
      const filtered = messagesDetails.filter(
         (message) =>
            message.artist.toLowerCase().includes(searchInput.toLowerCase()) ||
            message.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      // console.log(filtered);

      setFilteredMessages(filtered);
   }, [searchInput]);

   useEffect(() => {
      fetchImageUrls();
   }, [gatewayUrl]);

   const hasPurchased = (userAddress, contentId) => {
      const purchasedMesages =
         JSON.parse(localStorage.getItem('purchasedMessages')) || [];
      return purchasedMesages.some((product) => {
         const parsedProduct = JSON.parse(product);
         return (
            parsedProduct.address === userAddress &&
            parsedProduct.id === contentId
         );
      });
   };

   // const buyNow = (product, userAddress) => {
   //    if (product && userAddress) {
   //       // Find the index of the product in songDetails using its id
   //       const productIndex = messagesDetails.findIndex(
   //          (message) => message.id === product.id
   //       );

   //       if (productIndex !== -1) {
   //          // Retrieve the corresponding image URL based on the product's index
   //          const imageUrl = imageUrls[productIndex];

   //          // Store the purchased product with the imageUrl and user address
   //          const purchasedMessage = {
   //             ...product,
   //             imageUrl,
   //             address: userAddress, // Include the user's address
   //          };

   //          // Serialize the purchased product before storing it
   //          const serializedProduct = JSON.stringify(purchasedMessage);

   //          // Retrieve the existing purchased products or initialize an empty array
   //          const purchasedMessages =
   //             JSON.parse(localStorage.getItem('purchasedMessages')) || [];

   //          // Add the purchased product to the array
   //          purchasedMessages.push(serializedProduct);
   //          localStorage.setItem(
   //             'purchasedMessages',
   //             JSON.stringify(purchasedMessages)
   //          );
   //       } else {
   //          console.error('Product not found in songDetails.');
   //       }
   //    }
   // };

   const buyNow = async (product, details) => {
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
               const productIndex = messagesDetails.findIndex(
                  (message) => message.id === product.id
               );

               setMessagesLoadingStates((prevStates) => ({
                  ...prevStates,
                  [product.id]: true,
               }));
               if (productIndex !== -1) {
                  // Retrieve the corresponding image URL based on the product's index
                  const imageUrl = imageUrls[productIndex];

                  // Convert the product's price to Wei (assuming it's in Ether)
                  const priceInEther = product.price.toString();

                  console.log(priceInEther);
                  // // const priceInWei = ethers.utils.parseEther(priceInEther);

                  // Initialize the contract instance
                  const contract = new ethers.Contract(
                     RMTestnetContractAddress,
                     RMabi,
                     signer
                  );

                  const contentId = parseInt(product.id);
                  console.log(contentId);
                  const token = TokenAddress;

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
                  console.log('Purchase successful. Transaction:', tx);

                  const receipt = await tx.wait();

                  // If the purchase is successful, store the purchased product in local storage

                  if (receipt.status === 1) {
                     console.log('bingo');
                     const purchasedMessage = {
                        ...product,
                        imageUrl,
                        address: address,
                     };

                     // Store purchased products in localStorage
                     const serializedProduct = JSON.stringify(purchasedMessage);
                     const storedPurchasedProducts =
                        JSON.parse(localStorage.getItem('purchasedMessages')) ||
                        [];
                     storedPurchasedProducts.push(serializedProduct);
                     localStorage.setItem(
                        'purchasedMessages',
                        JSON.stringify(storedPurchasedProducts)
                     );

                     const purchasedSongTitle = purchasedMessage.title;

                     // Display a success toast notification
                     toast.success(
                        `${purchasedSongTitle}, Purchase successful`,
                        {
                           duration: 4000,
                           position: 'bottom-right',
                           icon: '✅',
                        }
                     );
                     setMessagesLoadingStates((prevStates) => ({
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
      }
      setMessagesLoadingStates((prevStates) => ({
         ...prevStates,
         [product.id]: false,
      }));
   };

   return (
      <div className="w-[95%] m-auto mt-28 ">
         <Toaster />
         <div className="flex mt-8 justify-evenly items-center mb-3">
            <h4 className="text-white">Messages</h4>
            <form>
               <input
                  className="px-20 py-2 rounded-md"
                  type="text"
                  placeholder="Search message..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
               />
            </form>
         </div>
         <div className="flex flex-wrap gap-3 p-2 justify-center items-center">
            {filteredMessages.map((message, index) => (
               // <div key={message.id} className={Style.messagesDetails}>
               <div
                  key={message.id}
                  // className="border rounded-md p-2"
                  className=" rounded-md p-3 m-2 shadow-custom"
               >
                  <div class="md:flex-shrink-0">
                     <img
                        src={imageUrls[index] || ''}
                        alt={`Image ${index}`}
                        className="rounded-md"
                        width={200}
                        height={150}
                     />
                  </div>
                  <div className="flex flex-col justify-center items-start pt-1">
                     <span className="text-white text-sm pt-1 pb-1">
                        {message.title}
                     </span>
                     <span className="text-white text-small">
                        {message.artist}
                     </span>
                     <span className="text-gray-400">$TKC {message.price}</span>
                  </div>
                  <div className="flex justify-center items-center">
                     {hasPurchased(address, message.id) ? (
                        <button
                           disabled
                           className="w-full text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm"
                        >
                           Purchased
                        </button>
                     ) : (
                        <button
                           onClick={() => {
                              setSelectedProduct(message);
                              buyNow(message, address);
                           }}
                           className="w-full text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover-bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                           {messagesLoadingStates[message.id] ? (
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
            ))}
         </div>
      </div>
   );
};

export default Messages;
