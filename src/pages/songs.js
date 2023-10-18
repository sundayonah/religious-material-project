import React, { useEffect, useState, useContext } from 'react';
import { StateContext } from '@/Context/ReligiousContext';
import { useAccount } from 'wagmi';

// import Style from '@/styles/messages.module.css';

const Messages = () => {
   const { UnStake } = useContext(StateContext);

   const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9';
   const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
   const [imageUrls, setImageUrls] = useState([]);
   const [messages, setMessages] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);

   const { address } = useAccount();
   // console.log(address);

   const messagesDetails = [
      {
         id: 'rec43w3ipXvP28vog',
         title: 'high-back bench',
         artist: 'John Doe',
         category: 'healing',
         file: 'https',
         price: 9.99,
         imageUrl: '',
      },
      {
         id: 'rec4f2RIftFCb7aHh',
         title: 'albany table',
         artist: 'John Doe',
         category: 'faith',
         file: 'https',
         price: 79.99,
         imageUrl: '',
      },
      {
         id: 'rec8kkCmSiMkbkiko',
         title: 'accent chair',
         artist: 'John Doe',
         category: 'faith',
         file: 'https',
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

         // Set the image URL for each product in the Messages array
         const updatedMessages = messagesDetails.map((message, index) => ({
            ...message,
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
   const [filteredMessages, setFilteredMessages] = useState(messages);

   useEffect(() => {
      // Filter the messages based on the search input
      const filtered = messagesDetails.filter(
         (message) =>
            message.artist.toLowerCase().includes(searchInput.toLowerCase()) ||
            message.title.toLowerCase().includes(searchInput.toLowerCase())
      );

      setFilteredMessages(filtered);
   }, [searchInput]);

   useEffect(() => {
      fetchImageUrls();
   }, [gatewayUrl]);

   const buyNow = (product) => {
      if (product) {
         // UnStake();

         // Find the index of the product in messagesDetails using its id
         const productIndex = messagesDetails.findIndex(
            (message) => message.id === product.id
         );

         if (productIndex !== -1) {
            // Retrieve the corresponding image URL based on the product's index
            const imageUrl = imageUrls[productIndex];

            // Store the purchased product with the imageUrl
            const purchasedProduct = {
               ...product,
               imageUrl,
            };

            // Add the purchased product and associated address to the mapping
            const purchasedProducts =
               JSON.parse(localStorage.getItem('purchasedProducts')) || [];
            purchasedProducts.push({ product: purchasedProduct, address });
            localStorage.setItem(
               'purchasedProducts',
               JSON.stringify(purchasedProducts)
            );
         } else {
            console.error('Product not found in messagesDetails.');
         }
      }
   };

   // const buyNow = (product) => {
   //    if (product) {
   //       // UnStake();
   //       console.log(product);

   //       // Store the essential information of the purchased product
   //       const purchasedProduct = {
   //          id: product.id,
   //          title: product.title,
   //          artist: product.artist,
   //          price: product.price,
   //          // imageUrl: uniqueUrls,
   //          // Include any other relevant fields you need
   //       };
   //       console.log(purchasedProduct);

   //       // Add the purchased product and associated address to the mapping
   //       const purchasedProducts =
   //          JSON.parse(localStorage.getItem('purchasedProducts')) || [];
   //       purchasedProducts.push({ product: purchasedProduct, address });
   //       localStorage.setItem(
   //          'purchasedProducts',
   //          JSON.stringify(purchasedProducts)
   //       );
   //       console.log(purchasedProducts);
   //       console.log(address);
   //    }
   // };

   // const buyNow = (product) => {
   //    if (product) {
   //       UnStake();

   //       // Add the purchased product and associated address to the mapping
   //       const purchasedProducts =
   //          JSON.parse(localStorage.getItem('purchasedProducts')) || [];
   //       purchasedProducts.push({ product, address });
   //       localStorage.setItem(
   //          'purchasedProducts',
   //          JSON.stringify(purchasedProducts)
   //       );
   //       console.log(purchasedProducts);
   //       console.log(address);
   //    }
   // };

   return (
      <>
         <div className="w-[95%] m-auto mt-28 ">
            <div>
               <form className="flex mb-8 justify-center items-center">
                  <input
                     className="w-[80%] md:w-[320px] px-4 py-2 rounded-md border border-transparent bg-slate-300/25 text-white focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent"
                     type="text"
                     placeholder="search songs..."
                     value={searchInput}
                     onChange={(e) => setSearchInput(e.target.value)}
                  />
               </form>
            </div>
            <div className="flex flex-wrap gap-3 p-2 justify-center items-center">
               {filteredMessages.map((message, index) => (
                  <div
                     key={message.id}
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
                        <span className="text-white text-small pt-1 pb-1">
                           {message.title}
                        </span>
                        <span className="text-white text-sm">
                           {message.artist}
                        </span>
                        <span className="text-gray-400">
                           $TKC {message.price}
                        </span>
                        <div>
                           <button
                              onClick={() => {
                                 setSelectedProduct(message);
                                 buyNow(message);
                              }}
                              className="text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
                           >
                              Buy Now
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default Messages;

// .messagesDetails {
//    display: flex;
//    padding: 1rem;
//    border-radius: 0.5rem;
//    box-shadow: 0.4rem 0.4rem 1rem #111, -0.4rem -0.4rem 1rem #333;
//    box-shadow-index: 0.4rem 0.4rem 1rem #111 inset,
//       -0.4rem -0.4rem 1rem #333 inset;
// }
