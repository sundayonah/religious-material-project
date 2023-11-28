import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, SendComment } from './icons';
import { useAccount } from 'wagmi';
import axios from 'axios';

const CommentsSection = ({ recId, type }) => {
   const { address } = useAccount();

   // const [isCommentsVisible, setCommentsVisible] = useState(false);
   const [commentText, setCommentText] = useState('');
   const [comments, setComments] = useState([]);
   const [showAllComments, setShowAllComments] = useState(false);
   const [newComment, setNewComment] = useState('');

   // const toggleCommentsVisibility = () => {
   //    setCommentsVisible((prev) => !prev);
   // };

   // Function to toggle showing all comments
   const toggleShowAllComments = () => {
      setShowAllComments((prev) => !prev);
      // console.log('show all');
   };

   // const handleCommentSubmit = async () => {
   //    const commentUrl =
   //       'https://hokoshokos-001-site1.etempurl.com/api/Catalog/CommentonItem';

   //    try {
   //       const response = await axios.post(commentUrl, {
   //          address: address,
   //          fileId: recId,
   //          type: type,
   //          commentText,
   //       });

   //       // Handle the response as needed (e.g., show a success message)
   //       //  console.log('Comment submitted successfully:', response);

   //       // Clear the input field
   //       setCommentText('');
   //    } catch (error) {
   //       // Handle any errors during the fetch
   //       console.error('Error submitting comment:', error);
   //    }
   // };

   const handleCommentSubmit = async () => {
      const commentUrl =
         'https://hokoshokos-001-site1.etempurl.com/api/Catalog/CommentOnItem';

      try {
         const response = await axios.post(commentUrl, {
            address: address,
            fileId: recId,
            type: type,
            commentText,
         });

         // Update comments state to include the new comment
         setComments((prevComments) => [
            ...(Array.isArray(prevComments) ? prevComments : []),
            { recId: response.data.recId, address, commentText },
         ]);

         // Display the new comment immediately after submission
         setNewComment(commentText);

         // Clear the input field
         setCommentText('');
      } catch (error) {
         // Handle any errors during the fetch
         console.error('Error submitting comment:', error);
      }
   };

   const fetchComments = useCallback(async () => {
      const getCommentsForItemUrl =
         'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetCommentsForItem';

      try {
         const response = await axios.post(getCommentsForItemUrl, {
            address: address,
            fileId: recId,
            type: type,
         });

         // Assuming the response.data contains an array of comments for the item
         const fetchedComments = response.data.data || [];
         // console.log(fetchedComments);

         // Update the comments state with the fetched comments
         setComments(fetchedComments);
      } catch (error) {
         // Handle error if the request fails
         console.error('Error fetching comments:', error);
      }
   }, [recId, type, address]);

   // Call the fetchComments function when the component mounts or as needed
   useEffect(() => {
      fetchComments();
   }, [recId, type, address, fetchComments]);

   // useEffect(() => {
   //    const fetchComments = async () => {
   //       const getCommentsForItemUrl =
   //          'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetCommentsForItem';

   //       try {
   //          const response = await axios.post(getCommentsForItemUrl, {
   //             address: address,
   //             fileId: recId,
   //             type: type,
   //          });

   //          console.log(response.data);

   //          // // Sort comments in ascending order based on timestamps
   //          // const sortedComments = response.data.sort((a, b) => {
   //          //    // Replace 'timestamp' with your comment timestamp field
   //          //    return new Date(b.createdAt) - new Date(a.createdAt);
   //          // });

   //          // console.log(sortedComments);

   //          // Set the sorted comments in the state
   //          // setComments(response.data || []);
   //          setComments(response.data || []);

   //          // Handle the response as needed (e.g., update the state with comments)
   //          // console.log('Comments fetched successfully:', response);
   //       } catch (error) {
   //          // Handle any errors during the fetch
   //          console.error('Error fetching comments:', error);
   //       }
   //    };

   //    // Fetch comments when the component mounts
   //    fetchComments();
   // }, [recId, type, address]);

   // console.log(comments);

   function shortenAddress(address, startLength = 6, endLength = 4) {
      if (!address) return '';
      return `${address.substring(0, startLength)}...${address.substring(
         address.length - endLength
      )}`;
   }

   function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      // console.log(formattedDate);
      return formattedDate;
   }

   return (
      <div className="mt-4">
         {/* <div> */}
         <>
            <span className="text-white">Comment</span>
            <div className=" flex justify-between items-center rounded-md border border-[#DAA851] mb-2 ">
               <input
                  className="w-full px-4 py-2 bg-transparent text-white focus:outline-none focus:none focus:none focus:border-transparent"
                  //   className="w-full px-4 py-2 rounded-md border border-[#DAA851] bg-[#342b1c] text-white focus:outline-none focus:ring-2 focus:ring-[#DAA851] focus:border-transparent"
                  type="text"
                  placeholder="Say Something"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
               />
               <button
                  className={` px-2 py-1 rounded-md  text-yellow-500 hover:text-yellow-600  transform -rotate-45  ${
                     !commentText.trim()
                        ? ' text-gray-800  hover:text-gray-900 cursor-not-allowed '
                        : ''
                  }`}
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
               >
                  <SendComment />
               </button>
            </div>
            {comments.length === undefined || comments.length === 0 ? (
               <p className="text-white text-sm">
                  No comments yet for this item.
               </p>
            ) : (
               <>
                  <span className="text-[#DAA851] capitalize">
                     previous comments
                  </span>

                  {Array.isArray(comments) && (
                     <>
                        {showAllComments
                           ? comments.map((comment, index) => (
                                <div
                                   key={index}
                                   className="flex flex-col justify-center py-2"
                                >
                                   <div className="flex">
                                      <Image
                                         src="/images/logo.png"
                                         alt="comment avatar"
                                         className="w-12 h-12"
                                         width={80}
                                         height={80}
                                      />
                                      <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                                         <span className="text-white text-sm font-bold ">
                                            {shortenAddress(comment.address)}
                                         </span>
                                         <p className="text-white text-xs">
                                            {comment.commentText}
                                         </p>
                                         <p className="text-yellow-300 text-xs text-end">
                                            {formatTimestamp(comment.createdAt)}
                                         </p>
                                      </div>
                                   </div>
                                </div>
                             ))
                           : comments.slice(0, 2).map((comment, index) => (
                                // Render only the first two comments
                                <div
                                   key={index}
                                   className="flex flex-col justify-center py-2"
                                >
                                   <div className="flex">
                                      <Image
                                         src="/images/logo.png"
                                         alt="comment avatar"
                                         className="w-12 h-12"
                                         width={80}
                                         height={80}
                                      />
                                      <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                                         <span className="text-white text-sm font-bold ">
                                            {shortenAddress(comment.address)}
                                         </span>
                                         <p className="text-white text-xs">
                                            {comment.commentText}
                                         </p>
                                         <p className="text-yellow-300 text-xs text-end">
                                            {formatTimestamp(comment.createdAt)}
                                         </p>
                                      </div>
                                   </div>
                                </div>
                             ))}
                     </>
                  )}
                  {Array.isArray(comments) && comments.length > 2 && (
                     <span
                        className="text-purple-400 capitalize text-sm flex justify-end pt-2 cursor-pointer"
                        onClick={toggleShowAllComments}
                     >
                        {showAllComments
                           ? 'hide comments'
                           : 'view more comments...'}
                     </span>
                  )}
               </>
            )}
         </>
         {/* </div> */}
      </div>
   );
};

export default CommentsSection;
