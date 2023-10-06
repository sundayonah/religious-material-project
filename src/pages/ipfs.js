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
