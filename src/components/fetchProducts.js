// fetchBooks.js
import React, { useCallback } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

// export const fetchPrices = async (kingdomBook) => {
//    // const provider = new ethers.providers.getDefaultProvider('homestead', {
//    //    alchemy: 'o_O5LwKav_r5UECR-59GtRZsIqnhD0N8',
//    // });
//    const provider = new ethers.providers.Web3Provider(window.ethereum);

//    const signer = provider.getSigner();

//    const contract = new ethers.Contract(
//       RMTestnetContractAddress,
//       RMabi,
//       // provider
//       signer
//    );

//    const updatedMessages = [];
//    for (const book of kingdomBook) {
//       const contentId = book.id;

//       const contentData = await contract.content(contentId);
//       const contentSplit = contentData.toString();
//       // console.log(contentSplit);
//       const contentValues = contentSplit.split(','); // Splitting the string by comma

//       // Assuming the second value (index 1) represents the price
//       const contentPrice = contentValues[1] ? parseInt(contentValues[1]) : 0;
//       // console.log(contentPrice);

//       // // Assuming other values in 'contentData' correspond to other properties in 'book'
//       const bookWithPrice = { ...book, contentPrice };
//       // console.log(bookWithPrice);

//       updatedMessages.push(bookWithPrice);
//    }

//    // console.log(updatedMessages);
//    return updatedMessages;
// };

export const fetchBooks = async () => {
   // const bookURL = '/api/book';
   // console.log('book');

   try {
      const bookURL =
         'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllBooks';
      const response = await axios.get(bookURL);

      const data = response.data.data;

      console.log('Original Data:', data);

      const bookDetails = await Promise.all(
         data.map(async (book) => {
            // console.log(book);
            try {
               const ipfsHash = book.hash;
               const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

               const pinataResponse = await axios.get(pinataApiUrl);

               // console.log(pinataResponse);
               if (pinataResponse.status === 200) {
                  const ipfsContent = pinataResponse.data;
                  // console.log(ipfsContent);

                  const completeMessageInfo = {
                     recId: book.recId,
                     hash: book.hash,
                     counterId: book.counterId,
                     category: book.category,
                     bookFile: book.bookFile,
                     type: book.type,
                     likesCount: book.likesCount,
                     commentsCount: book.commentsCount,
                     ...ipfsContent,
                  };

                  // console.log('Complete Message Info:', completeMessageInfo);

                  return completeMessageInfo;
               } else {
                  console.error(
                     'Pinata API returned an error:',
                     pinataResponse.status,
                     pinataResponse.statusText
                  );
                  return null;
               }
            } catch (error) {
               console.error('Error fetching IPFS content:', error);
               return null;
            }
         })
      );

      const filteredBooks = bookDetails.filter((book) => book !== null);
      // console.log('Filtered Books:', filteredBooks);
      return filteredBooks;
      // Inside the catch block for IPFS content retrieval
   } catch (error) {
      if (axios.isAxiosError(error)) {
         // Handle Axios errors (e.g., network errors) differently
         console.error('Axios error fetching IPFS content:', error);
      } else {
         console.error('Error fetching IPFS content:', error);
      }
      return null;
   }
};

export const fetchSongs = async () => {
   const songsURL =
      'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllSongs';

   try {
      const response = await axios.get(songsURL);
      const data = response.data.data;

      const songDetails = await Promise.all(
         data.map(async (song) => {
            const ipfsHash = song.hash;
            const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

            const pinataResponse = await axios.get(pinataApiUrl);

            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;

               const completeSongInfo = {
                  recId: song.recId,
                  hash: song.hash,
                  counterId: song.counterId,
                  category: song.category,
                  bookFile: song.bookFile,
                  type: song.type,
                  likesCount: song.likesCount,
                  commentsCount: song.commentsCount,
                  ...ipfsContent,
               };

               // console.log(completeSongInfo);

               return completeSongInfo;
            } else {
               console.error(
                  'Pinata API returned an error:',
                  pinataResponse.status,
                  pinataResponse.statusText
               );
               return null;
            }
         })
      );

      // console.log(songDetails);

      // return songDetails.filter((song) => song !== null);

      const filteredSongs = songDetails.filter((song) => song !== null);
      // console.log('Filtered songs:', filteredSongs);
      return filteredSongs;
   } catch (error) {
      console.error('Error fetching songs details:', error);
      return [];
   }
};

export const useFetchMessages = () => {
   const fetchMessages = useCallback(async () => {
      try {
         const messageURL =
            'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetAllMessages';

         // const messageURL = '/api/message';

         const response = await axios.get(messageURL);
         // console.log('Response:', response.data.data);

         const data = response.data.data;

         const messageDetails = await Promise.all(
            data.map(async (message) => {
               const ipfsHash = message.hash;
               const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

               const pinataResponse = await axios.get(pinataApiUrl);

               if (pinataResponse.status === 200) {
                  const ipfsContent = pinataResponse.data;

                  const completeMessageInfo = {
                     recId: message.recId,
                     hash: message.hash,
                     counterId: message.counterId,
                     category: message.category,
                     bookFile: message.bookFile,
                     type: message.type,
                     likesCount: message.likesCount,
                     commentsCount: message.commentsCount,
                     ...ipfsContent,
                  };

                  // console.log(completeMessageInfo);

                  return completeMessageInfo;
               } else {
                  console.error(
                     'Pinata API returned an error:',
                     pinataResponse.status,
                     pinataResponse.statusText
                  );
                  return null;
               }
            })
         );

         const filteredMessages = messageDetails.filter(
            (message) => message !== null
         );
         // console.log('Filtered message:', filteredMessages);
         return filteredMessages;
      } catch (error) {
         console.error('Error fetching message details:', error);
         return [];
      }
   }, []);

   return fetchMessages;
};

export const getTransactions = async (address) => {
   const downloadsUrl = `https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetTransactions/${address}`;

   try {
      const response = await axios.get(downloadsUrl);
      const data = response.data.data;

      console.log(data, response);

      const validDownloadDetails = await Promise.all(
         data.map(async (download) => {
            const ipfsHash = download.hash;
            const pinataApiUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

            const pinataResponse = await axios.get(pinataApiUrl);

            if (pinataResponse.status === 200) {
               const ipfsContent = pinataResponse.data;

               // Assuming ipfsContent is in JSON format
               const { author, title, image } = ipfsContent;

               const completeDownloadInfo = {
                  recId: download.recId,
                  hash: download.hash,
                  counterId: download.counterId,
                  address: download.address,
                  type: download.type,
                  transactionHash: download.transactionHash,
                  dataFile: download.dataFile,
                  author,
                  title,
                  image,
                  // Add other fields as needed
               };

               // console.log(completeDownloadInfo)
               return completeDownloadInfo;
            } else {
               console.error(
                  'Pinata API returned an error:',
                  pinataResponse.status,
                  pinataResponse.statusText
               );
               return null;
            }
         })
      );

      // console.log(validDownloadDetails);

      // Remove null values (failed downloads) and update state with the array
      return validDownloadDetails.filter((detail) => detail !== null);
   } catch (error) {
      // console.error('Error fetching download details:', error);
   }
};

// import Image from 'next/image';
// // import React, { useCallback, useEffect, useState } from 'react';
// import { ChevronLeft, ChevronRight, SendComment } from './icons';
// import { useAccount } from 'wagmi';
// // import axios from 'axios';

// const CommentsSection = ({ recId, type }) => {
//    const { address } = useAccount();

//    // const [isCommentsVisible, setCommentsVisible] = useState(false);
//    const [commentText, setCommentText] = useState('');
//    const [comments, setComments] = useState([]);
//    const [showAllComments, setShowAllComments] = useState(false);
//    const [newComment, setNewComment] = useState('');

//    // const toggleCommentsVisibility = () => {
//    //    setCommentsVisible((prev) => !prev);
//    // };

//    // Function to toggle showing all comments
//    const toggleShowAllComments = () => {
//       setShowAllComments((prev) => !prev);
//       // console.log('show all');
//    };

//    // const handleCommentSubmit = async () => {
//    //    const commentUrl =
//    //       'https://hokoshokos-001-site1.etempurl.com/api/Catalog/CommentonItem';

//    //    try {
//    //       const response = await axios.post(commentUrl, {
//    //          address: address,
//    //          fileId: recId,
//    //          type: type,
//    //          commentText,
//    //       });

//    //       // Handle the response as needed (e.g., show a success message)
//    //       //  console.log('Comment submitted successfully:', response);

//    //       // Clear the input field
//    //       setCommentText('');
//    //    } catch (error) {
//    //       // Handle any errors during the fetch
//    //       console.error('Error submitting comment:', error);
//    //    }
//    // };

//    const handleCommentSubmit = async () => {
//       const commentUrl =
//          'https://hokoshokos-001-site1.etempurl.com/api/Catalog/CommentOnItem';

//       try {
//          const response = await axios.post(commentUrl, {
//             address: address,
//             fileId: recId,
//             type: type,
//             commentText,
//          });

//          // Update comments state to include the new comment
//          setComments((prevComments) => [
//             ...(Array.isArray(prevComments) ? prevComments : []),
//             { recId: response.data.recId, address, commentText },
//          ]);

//          // Display the new comment immediately after submission
//          setNewComment(commentText);

//          // Clear the input field
//          setCommentText('');
//       } catch (error) {
//          // Handle any errors during the fetch
//          console.error('Error submitting comment:', error);
//       }
//    };

//    const fetchComments = useCallback(async () => {
//       const getCommentsForItemUrl =
//          'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetCommentsForItem';

//       try {
//          const response = await axios.post(getCommentsForItemUrl, {
//             address: address,
//             fileId: recId,
//             type: type,
//          });

//          // Assuming the response.data contains an array of comments for the item
//          const fetchedComments = response.data.data || [];
//          // console.log(fetchedComments);

//          // Update the comments state with the fetched comments
//          setComments(fetchedComments);
//       } catch (error) {
//          // Handle error if the request fails
//          console.error('Error fetching comments:', error);
//       }
//    }, [recId, type, address]);

//    // Call the fetchComments function when the component mounts or as needed
//    useEffect(() => {
//       fetchComments();
//    }, [recId, type, address, fetchComments]);

//    // useEffect(() => {
//    //    const fetchComments = async () => {
//    //       const getCommentsForItemUrl =
//    //          'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetCommentsForItem';

//    //       try {
//    //          const response = await axios.post(getCommentsForItemUrl, {
//    //             address: address,
//    //             fileId: recId,
//    //             type: type,
//    //          });

//    //          console.log(response.data);

//    //          // // Sort comments in ascending order based on timestamps
//    //          // const sortedComments = response.data.sort((a, b) => {
//    //          //    // Replace 'timestamp' with your comment timestamp field
//    //          //    return new Date(b.createdAt) - new Date(a.createdAt);
//    //          // });

//    //          // console.log(sortedComments);

//    //          // Set the sorted comments in the state
//    //          // setComments(response.data || []);
//    //          setComments(response.data || []);

//    //          // Handle the response as needed (e.g., update the state with comments)
//    //          // console.log('Comments fetched successfully:', response);
//    //       } catch (error) {
//    //          // Handle any errors during the fetch
//    //          console.error('Error fetching comments:', error);
//    //       }
//    //    };

//    //    // Fetch comments when the component mounts
//    //    fetchComments();
//    // }, [recId, type, address]);

//    // console.log(comments);

//    function shortenAddress(address, startLength = 6, endLength = 4) {
//       if (!address) return '';
//       return `${address.substring(0, startLength)}...${address.substring(
//          address.length - endLength
//       )}`;
//    }

//    function formatTimestamp(timestamp) {
//       const date = new Date(timestamp);
//       const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
//       // console.log(formattedDate);
//       return formattedDate;
//    }

//    // console.log(comments.length);

//    return (
//       <div className="mt-4">
//          {/* <div> */}
//          <>
//             <span className="text-white">Comment</span>
//             <div className=" flex justify-between items-center rounded-md border border-[#DAA851] mb-2 ">
//                <input
//                   className="w-full px-4 py-2 bg-transparent text-white focus:outline-none focus:none focus:none focus:border-transparent"
//                   //   className="w-full px-4 py-2 rounded-md border border-[#DAA851] bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-[#DAA851] focus:border-transparent"
//                   type="text"
//                   placeholder="Say Something"
//                   value={commentText}
//                   onChange={(e) => setCommentText(e.target.value)}
//                />
//                <button
//                   className={` px-2 py-1 rounded-md text-[#DAA851] hover:text-yellow-600  transform -rotate-45  ${
//                      !commentText.trim()
//                         ? ' text-gray-800  hover:text-gray-900 cursor-not-allowed '
//                         : ''
//                   }`}
//                   onClick={handleCommentSubmit}
//                   disabled={!commentText.trim()}
//                >
//                   <SendComment />
//                </button>
//             </div>
//             {comments.length === undefined || comments.length === 0 ? (
//                <p className="text-white text-sm">
//                   No comments yet for this item.
//                </p>
//             ) : (
//                <>
//                   <span className="text-[#DAA851] capitalize">
//                      previous comments
//                   </span>

//                   {Array.isArray(comments) && (
//                      <>
//                         {showAllComments
//                            ? comments.map((comment, index) => (
//                                 <div
//                                    key={index}
//                                    className="flex flex-col justify-center py-2"
//                                 >
//                                    <div className="flex">
//                                       <Image
//                                          src="/images/logo.png"
//                                          alt="comment avatar"
//                                          className="w-12 h-12"
//                                          width={80}
//                                          height={80}
//                                       />
//                                       <div className="bg-[#483a25] py-1 px-2 rounded-r-md rounded-bl-md ">
//                                          <span className="text-white text-sm font-bold ">
//                                             {shortenAddress(comment.address)}
//                                          </span>
//                                          <p className="text-white text-xs">
//                                             {comment.commentText}
//                                          </p>
//                                          <p className="text-[#DAA851] text-xs text-end">
//                                             {formatTimestamp(comment.createdAt)}
//                                          </p>
//                                       </div>
//                                    </div>
//                                 </div>
//                              ))
//                            : comments.slice(0, 2).map((comment, index) => (
//                                 // Render only the first two comments
//                                 <div
//                                    key={index}
//                                    className="flex flex-col justify-center py-2"
//                                 >
//                                    <div className="flex">
//                                       <Image
//                                          src="/images/logo.png"
//                                          alt="comment avatar"
//                                          className="w-12 h-12"
//                                          width={80}
//                                          height={80}
//                                       />
//                                       <div className="bg-[#483a25] py-1 px-2 rounded-r-md rounded-bl-md ">
//                                          <span className="text-white text-sm font-bold ">
//                                             {shortenAddress(comment.address)}
//                                          </span>
//                                          <p className="text-white text-xs">
//                                             {comment.commentText}
//                                          </p>
//                                          <p className="text-[#DAA851] text-xs text-end">
//                                             {formatTimestamp(comment.createdAt)}
//                                          </p>
//                                       </div>
//                                    </div>
//                                 </div>
//                              ))}
//                      </>
//                   )}
//                   {Array.isArray(comments) && comments.length > 2 && (
//                      <span
//                         className="text-purple-400 capitalize text-sm flex justify-end pt-2 cursor-pointer"
//                         onClick={toggleShowAllComments}
//                      >
//                         {showAllComments
//                            ? 'hide comments'
//                            : 'view more comments...'}
//                      </span>
//                   )}
//                </>
//             )}
//          </>
//          {/* </div> */}
//       </div>
//    );
// };

// export default CommentsSection;
