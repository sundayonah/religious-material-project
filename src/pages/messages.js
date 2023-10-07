import React, { useEffect, useState } from 'react';
import Style from '@/styles/messages.module.css';

const Messages = () => {
   const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9'; // Replace with your IPFS hash
   const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
   const [imageUrls, setImageUrls] = useState([]);
   const [messages, setMessages] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);

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

   //       // Remove duplicates by converting the array to a Set and then back to an array
   //       const uniqueUrls = Array.from(new Set(urls));

   //       setImageUrls(uniqueUrls);
   //    } catch (error) {
   //       console.error('Error fetching folder content:', error);
   //    }
   // };

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
      console.log(filtered);

      setFilteredMessages(filtered);
   }, [searchInput]);

   useEffect(() => {
      fetchImageUrls();
   }, [gatewayUrl]);

   const buyNow = (product) => {
      if (product) {
         console.log('Buy Now clicked for:', product.price);
      }
   };

   return (
      <>
         <div className="w-[80%] m-auto mt-28">
            <div>
               <form className="flex mt-8 justify-between items-center">
                  <h4 className="text-white">Messages</h4>
                  <input
                     className="px-20 py-2 rounded-md"
                     type="text"
                     placeholder="Search message..."
                     value={searchInput}
                     onChange={(e) => setSearchInput(e.target.value)}
                  />
               </form>
            </div>
            <div className={Style.messages}>
               {filteredMessages.map((message, index) => (
                  <div key={message.id} className={Style.messagesDetails}>
                     <div className="">
                        <img
                           src={imageUrls[index] || ''}
                           alt={`Image ${index}`}
                           className="rounded-md"
                           width={200}
                           height={150}
                        />
                     </div>
                     <div className="flex flex-col ml-6 text-sm">
                        <span className="text-white">{message.artist}</span>
                        <span className="text-white pt-1 pb-1">
                           {message.title}
                        </span>
                        <span className="text-gray-400">$ {message.price}</span>

                        <button
                           onClick={() => {
                              setSelectedProduct(message);
                              buyNow(message);
                           }}
                           className="text-white mt-5 bg-yellow-700 p-1 rounded-sm"
                        >
                           Buy Now
                        </button>
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
