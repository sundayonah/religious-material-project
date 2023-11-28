import Image from 'next/image';
import React, { useEffect, useState } from 'react';
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
         'https://hokoshokos-001-site1.etempurl.com/api/Catalog/CommentonItem';

      try {
         const response = await axios.post(commentUrl, {
            address: address,
            fileId: recId,
            type: type,
            commentText,
         });

         // Update comments state to include the new comment
         setComments([
            ...comments,
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

   useEffect(() => {
      const fetchComments = async () => {
         const commentsUrl =
            'https://hokoshokos-001-site1.etempurl.com/api/Catalog/GetCommentsForItem';

         try {
            const response = await axios.post(commentsUrl, {
               address: address,
               fileId: recId,
               type: type,
            });

            console.log(response.data);

            // Set the comments in the state
            setComments(response.data || []);

            // Handle the response as needed (e.g., update the state with comments)
            // console.log('Comments fetched successfully:', response);
         } catch (error) {
            // Handle any errors during the fetch
            console.error('Error fetching comments:', error);
         }
      };

      // Fetch comments when the component mounts
      fetchComments();
   }, [recId, type, address]);

   function shortenAddress(address, startLength = 6, endLength = 4) {
      if (!address) return '';
      return `${address.substring(0, startLength)}...${address.substring(
         address.length - endLength
      )}`;
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
                  className=" text-white px-2 py-1 rounded-md"
                  onClick={handleCommentSubmit}
               >
                  <SendComment />
               </button>
            </div>
            {comments.length === undefined || comments.length === 0 ? (
               <p className="text-white">No comments yet for this item.</p>
            ) : (
               <>
                  <span className="text-[#DAA851] capitalize">
                     previous comments
                  </span>

                  {Array.isArray(comments) && (
                     <>
                        {showAllComments
                           ? comments.map((comment) => (
                                <div
                                   key={comment.recId}
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
                                         <span className="text-white test-small font-bold ">
                                            {shortenAddress(comment.address)}
                                         </span>
                                         <p className="text-white test-small">
                                            {comment.commentText}
                                         </p>
                                      </div>
                                   </div>
                                </div>
                             ))
                           : comments.slice(0, 2).map((comment) => (
                                // Render only the first two comments
                                <div
                                   key={comment.recId}
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
                                         <span className="text-white test-small font-bold ">
                                            {shortenAddress(comment.address)}
                                         </span>
                                         <p className="text-white test-small">
                                            {comment.commentText}
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
            {/* Display the newly added comment */}
            {/* {newComment && (
               <div className="flex flex-col justify-center py-2">
                  <div className="flex">
                     <Image
                        src="/images/logo.png"
                        alt="comment avatar"
                        className="w-12 h-12"
                        width={80}
                        height={80}
                     />
                     <div className="bg-[#63533c] py-1 px-2 rounded-r-2xl rounded-bl-2xl ">
                        <span className="text-white test-small font-bold ">
                           {shortenAddress(address)}
                        </span>
                        <p className="text-white test-small">{newComment}</p>
                     </div>
                  </div>
               </div>
            )} */}
         </>
         {/* </div> */}
      </div>
   );
};

export default CommentsSection;
