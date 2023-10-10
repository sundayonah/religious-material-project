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
            <p>hello</p>

            <div
               className=" grid flex-col p-1 rounded-md
                     flex-wrap md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-1 "
            >
               {messagesDetails.map((message, i) => (
                  <div
                     key={i}
                     className="w-full mt-2 m-auto flex justify-between p-2 space-x-9 bg-white border rounded"
                  >
                     <div className="">
                        <p>{message.title}</p>
                        <p>{message.artist}</p>
                     </div>
                     <div className="">
                        <p>{message.category}</p>
                        <p>{message.price}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default Messages;
