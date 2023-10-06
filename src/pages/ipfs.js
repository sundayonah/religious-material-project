// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// // const ipfsAPI = require('ipfs-http-client');

// // const BooksList = () => {
// //    const [books, setBooks] = useState([]);
// //    const [file, setFile] = useState(null);

// //    useEffect(() => {
// //       const fetchBooks = async () => {
// //          try {
// //             // Fetch books data from the API
// //             const response = await axios.get(
// //                'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks'
// //             );
// //             console.log(response);

// //             if (response.status === 200) {
// //                const booksData = response.data.data;
// //                // Create an instance of the IPFS client
// //                const ipfs = ipfsAPI('localhost', '5001'); // IPFS API endpoint

// //                // Iterate over the books and upload images to IPFS
// //                const booksWithIPFSImages = await Promise.all(
// //                   booksData.map(async (book) => {
// //                      try {
// //                         // Assuming the API provides image URLs in the 'imageUrl' field
// //                         const imageUrl = book.imageUrl;
// //                         const imageBuffer = await fetch(imageUrl).then((res) =>
// //                            res.arrayBuffer()
// //                         );
// //                         const imageBufferArray = Array.from(
// //                            new Uint8Array(imageBuffer)
// //                         );
// //                         const ipfsFile = await ipfs.add({
// //                            path: 'book-image.jpg', // You can provide a suitable file name
// //                            content: imageBufferArray,
// //                         });
// //                         const ipfsHash = ipfsFile.cid.toString();
// //                         book.ipfsImageHash = ipfsHash;
// //                         return book;
// //                      } catch (error) {
// //                         console.error('Error uploading image to IPFS:', error);
// //                         return book;
// //                      }
// //                   })
// //                );

// //                setBooks(booksWithIPFSImages);
// //             } else {
// //                console.error(
// //                   `API request failed with status code ${response.status}`
// //                );
// //             }
// //          } catch (error) {
// //             console.error('Error fetching books:', error);
// //          }
// //       };

// //       fetchBooks();
// //    }, []);

// //    return (
// //       <div>
// //          <h1>IPFS</h1>
// //          <h1>IPFS</h1>
// //          <h1>IPFS</h1>
// //          <h1>IPFS</h1>
// //          <ul>
// //             {books.map((book) => (
// //                <li key={book.id}>
// //                   <h3>{book.title}</h3>
// //                   <img
// //                      src={`https://ipfs.io/ipfs/${book.ipfsImageHash}`}
// //                      alt={book.title}
// //                   />
// //                </li>
// //             ))}
// //          </ul>
// //       </div>
// //    );
// // };

// // export default BooksList;

// /// hello new

// // import axios from 'axios';
// // import React, { useEffect, useState } from 'react';

// // const Ipfs = () => {
// //    const [books, setBooks] = useState([]);

// //    const booksURL =
// //       'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks';

// //    // Function to fetch books using the stored token
// //    const fetchBooks = async () => {
// //       try {
// //          // Get the stored token from local storage
// //          const storedData = JSON.parse(localStorage.getItem('responseData'));
// //          const token = storedData.token;
// //          console.log(storedData);
// //          console.log(token);

// //          if (token) {
// //             // Make a GET request to the books endpoint with the token in the Authorization header
// //             const res = await axios.get(booksURL, {
// //                headers: {
// //                   Authorization: `Bearer ${token}`,
// //                },
// //             });
// //             console.log(res);

// //             if (res.data.statusCode === 200) {
// //                const booksData = res.data; // Access the res data

// //                setBooks(booksData.data);
// //             } else {
// //                console.error(
// //                   `API request failed with status code ${res.status}`
// //                );
// //                if (res.status === 401) {
// //                   console.error(
// //                      'Unauthorized: Check your authorization token.'
// //                   );
// //                }
// //             }
// //          } else {
// //             console.error('Token not found in local storage');
// //          }
// //       } catch (error) {
// //          console.error('Error fetching books:', error);
// //       }
// //    };

// //    // Now you can call fetchBooks whenever you need to fetch books

// //    /*
// //          data: [
// //             {
// //                recId: '1',
// //                cover: ' ... (length: 59455)',
// //                name: ' ... (length: 17)',
// //                author: ' ... (length: 13)',
// //                category: ' ... (length: 7)',
// //               description: ' ... (length: 37)',
// //               price: 1.5,
// //               bookFile: ' ... (length: 25)'
// //             },
// //           */
// //    useEffect(() => {
// //       fetchBooks();
// //    }, []);
// //    return <div>Ipfs</div>;
// // };

// // export default Ipfs;

// import { create } from 'ipfs-http-client';

// // import IpfsImg from '@/pages/api/hello';
// const BooksList = () => {
//    const [books, setBooks] = useState([]);
//    const [file, setFile] = useState(null);

//    // Function to upload an image to IPFS via Pinata and retrieve the IPFS hash
//    const uploadImageToIPFS = async (imageUrl) => {
//       try {
//          // Create an IPFS client
//          const ipfs = create({
//             host: 'ipfs-api.pinata.cloud',
//             port: 443,
//             protocol: 'https',
//             headers: {
//                authorization: `Bearer 5215a74e525dd12d8c6b:3d90e51f58691609de847f314ef402705e2a6851474817089ea9dcb2862a90b`, // Replace with your API Key and API Secret
//             },
//          });

//          console.log(ipfs);

//          // Fetch the image and convert it to an ArrayBuffer
//          const imageBuffer = await fetch(imageUrl).then((res) =>
//             res.arrayBuffer()
//          );

//          console.log(imageBuffer);

//          // Convert the ArrayBuffer to an array of bytes
//          const imageBufferArray = Array.from(new Uint8Array(imageBuffer));

//          // Upload the image to IPFS via Pinata
//          const ipfsFile = await ipfs.add(imageBufferArray);
//          const ipfsHash = ipfsFile.path; // Get the IPFS hash from the 'path' property

//          return ipfsHash;
//       } catch (error) {
//          console.error('Error uploading image to IPFS via Pinata:', error);
//          return null; // Return null in case of an error
//       }
//    };

//    useEffect(() => {
//       const fetchBooks = async () => {
//          try {
//             // Fetch books data from the API
//             const response = await axios.get(
//                'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks'
//             );

//             if (response.status === 200) {
//                const booksData = response.data.data;

//                // Iterate over the books and upload images to IPFS via Pinata
//                const booksWithIPFSImages = await Promise.all(
//                   booksData.map(async (book) => {
//                      console.log(book);
//                      try {
//                         const imageUrl = book.imageUrl;
//                         const ipfsHash = await uploadImageToIPFS(imageUrl);
//                         console.log(ipfsHash);

//                         if (ipfsHash) {
//                            book.ipfsImageHash = ipfsHash;
//                         }

//                         return book;
//                      } catch (error) {
//                         console.error(
//                            'Error uploading image to IPFS via Pinata:',
//                            error
//                         );
//                         return book;
//                      }
//                   })
//                );
//                console.log(booksWithIPFSImages);

//                // setBooks(booksWithIPFSImages);
//             } else {
//                console.error(
//                   `API request failed with status code ${response.status}`
//                );
//             }
//          } catch (error) {
//             console.error('Error fetching books:', error);
//          }
//       };

//       fetchBooks();
//    }, []);

//    const fetchImg = () => {
//       // const res = fetch(IpfsImg);
//       // console.log(res);
//    };

//    return (
//       <div>
//          <h1>IPFS</h1>
//          <ul>
//             {books.map((book) => (
//                <li key={book.id}>
//                   <h3>{book.title}</h3>
//                   <img
//                      src={`https://ipfs.io/ipfs/${book.ipfsImageHash}`}
//                      alt={book.title}
//                   />
//                </li>
//             ))}
//          </ul>
//       </div>
//    );
// };

// export default BooksList;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const IPFSImages = () => {
//    const [ipfsHashes, setIpfsHashes] = useState([]);

//    useEffect(() => {
//       // Fetch the IPFS hashes of the uploaded images from the backend
//       const fetchImageIPFSHashes = async () => {
//          try {
//             const response = await axios.get('/api/hello'); // Relative URL to your API route
//             console.log(response);
//             const fetchedHashes = response.data;
//             console.log(fetchedHashes);
//             setIpfsHashes(fetchedHashes);
//          } catch (error) {
//             console.error('Error fetching image IPFS hashes:', error);
//          }
//       };

//       fetchImageIPFSHashes();
//    }, []);

//    return (
//       <div>
//          <h1>IPFS Images</h1>
//          <h1>IPFS Images</h1>
//          <h1>IPFS Images</h1>
//          <h1>IPFS Images</h1>
//          <h1>IPFS Images</h1>
//          <img
//             src="https://gateway.pinata.cloud/ipfs/QmZ1H416AAJd4ritEAXzuarmy1t1Huw87mFkd9gaHemHwV"
//             alt=""
//             width={200}
//             height={150}
//          />
//          <h1>hello</h1>

//          {/* <ul>
//             {ipfsHashes.map((ipfsHash, index) => (
//                <li key={index}>
//                   <img
//                      src={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
//                      width={300}
//                      height={150}
//                      alt={`Image ${index}`}
//                   />
//                </li>
//             ))}
//          </ul> */}
//       </div>
//    );
// };

// export default IPFSImages;

import { useEffect, useState } from 'react';

const ImageList = () => {
   const ipfsHash = 'QmfMQiWGrcswgwc3BsjLuprEV95ZQhHQj6a4Ygy1NHhVs9'; // Replace with your IPFS hash
   const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
   const [imageUrls, setImageUrls] = useState([]);

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

         // // Filter links to include only image files
         // const imageLinks = links.filter((link) =>
         //    link.getAttribute('href').startsWith('/ipfs/')
         // );

         // Filter links to include only image files ending with "/img.png"
         const imageLinks = links.filter((link) =>
            link.getAttribute('href').includes('/img')
         );

         // Create image URLs from the links
         const urls = imageLinks.map(
            (link) => `https://ipfs.io${link.getAttribute('href')}`
         );

         // Remove duplicates by converting the array to a Set and then back to an array
         const uniqueUrls = Array.from(new Set(urls));

         setImageUrls(uniqueUrls);
      } catch (error) {
         console.error('Error fetching folder content:', error);
      }
   };

   useEffect(() => {
      fetchImageUrls();
   }, [gatewayUrl]);

   return (
      <div>
         <h1>IPFS Images</h1>
         <h1>IPFS Images</h1>
         <h1>IPFS Images</h1>
         <h1>IPFS Images</h1>
         <h1>IPFS Images</h1>
         <h1>IPFS Images</h1>
         <ul className="flex space-x-3">
            {imageUrls.map((imageUrl, index) => (
               <li key={index}>
                  <img
                     src={imageUrl}
                     alt={`Image ${index}`}
                     width={400}
                     height={250}
                  />
               </li>
            ))}
         </ul>
      </div>
   );
};

export default ImageList;
