// import { useAccount, useSignMessage } from 'wagmi';
// import React from 'react';

// const SignInToConnect = () => {
//    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
//       message: 'Sign-in to web3 kigdom-coin e-commerce',
//    });

//    const { address, isConnecting, isDisconnected } = useAccount();

//    // Show nothing if the user is signed in
//    if (address && !isDisconnected) {
//       return null;
//    }
//    console.log(address);

//    return (
//       <div className="text-white mt-28">
//          <button
//             className="text-white"
//             disabled={isLoading || isConnecting}
//             onClick={() => signMessage()}
//          >
//             SignIn
//          </button>
//          {isSuccess && <div className="text-white">Signature: {data}</div>}
//          {isError && <div className="text-white">Error signing message</div>}
//       </div>
//    );
// };

// export default SignInToConnect;

//   <div className="md:flex w-[85%] flex-row m-auto pt-8 justify-around  gap-4">
//          {messageDetails ? (
//             <>
//                <div className=" relative w-full h-full">
//                   <Image
//                      src={`https://gateway.pinata.cloud/ipfs/${messageDetails.image}`}
//                      alt="single image"
//                      width={200}
//                      height={150}
//                      className="h-72 w-[100%] md:w-full rounded-md object-center"
//                      // className="h-72 w-full rounded-md object-center"
//                      // layout="fixed"
//                   />
//                   <span className="absolute right-0 bottom-0 bg-black bg-opacity-70 rounded-md p-1 text-yellow-600">
//                      TKC${' '}
//                      {(messageDetails.contentPrice / 1e15).toLocaleString()}
//                   </span>
//                </div>

//                <div className="w-full">
//                   <h2 className="text-white text-xl">
//                      {messageDetails.title}
//                   </h2>
//                   <h4 className="text-gray-500 text-sm">
//                      {messageDetails.category}
//                   </h4>
//                   <p className="text-white text-sm ">
//                      {messageDetails.description}
//                   </p>
//                   <span className="flex justify-start items-center space-x-3 mt-2">
//                      <button
//                         // className={`${
//                         //    likedItem ? 'text-yellow-700' : 'text-white'
//                         // }`}
//                         className="text-yellow-600"
//                         onClick={() => handleLikeSubmit(messageDetails)}
//                      >
//                         {likedItem ? <ThumbsUpSolid /> : <ThumbsUp />}
//                      </button>
//                      <span className="text-white">
//                         {messageDetails.likesCount}{' '}
//                         {messageDetails.likesCount === 1 ? 'like' : 'likes'}
//                      </span>
//                   </span>

//                   <div className="w-full flex justify-between items-center space-x-4 ">
//                      <div className="w-full">
//                         {individualPurchasedStatus[
//                            messageDetails.counterId
//                         ] ? (
//                            <button
//                               disabled
//                               className="w-full text-white mt-1 bg-gray-500 py-1 px-2 rounded-sm cursor-not-allowed"
//                            >
//                               Purchased
//                            </button>
//                         ) : (
//                            <>
//                               {approvedProducts.includes(
//                                  messageDetails.recId
//                               ) || isAllowance ? (
//                                  <button
//                                     onClick={() => {
//                                        buyNow(messageDetails);
//                                     }}
//                                     className="w-full text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
//                                  >
//                                     {messageLoadingStates[
//                                        messageDetails.recId
//                                     ] ? (
//                                        <LoadingSpinner />
//                                     ) : (
//                                        'Buy Now'
//                                     )}
//                                  </button>
//                               ) : (
//                                  <button
//                                     onClick={() => {
//                                        Approved(messageDetails);
//                                     }}
//                                     className="w-full  text-white mt-1 bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50"
//                                  >
//                                     {approveLoadingStates[
//                                        messageDetails.recId
//                                     ] ? (
//                                        <LoadingSpinner />
//                                     ) : (
//                                        'Approve'
//                                     )}
//                                  </button>
//                               )}
//                            </>
//                         )}
//                      </div>
//                   </div>
//                </div>
//                <div className="w-full md:mt-1 mt-9 ">
//                   <span className="text-white">Comment</span>
//                   <CommentsSection
//                      recId={messageDetails.recId}
//                      type={messageDetails.type}
//                   />
//                </div>
//             </>
//          ) : (
//             <p>Product not found</p>
//          )}
//       </div>
//       <div className="mt-20 mb-8 w-[90%] m-auto">
//          <div>
//             <h2 className="text-[#DAA851]  my-8">
//                Related items Based On Category
//             </h2>

//             <div className="flex flex-wrap gap-3 p-2 justify-center md:justify-start items-center">
//                {filteredCategories.map((relatedMessage) => (
//                   <div
//                      key={relatedMessage.recId}
//                      // className="flex transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 "
//                      // className="transition transform hover:-translate-y-1 duration-300  motion-reduce:transition-none motion-reduce:transform-none shadow-newCustom py-1 px-2 rounded-lg "

//                      className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-newCustom rounded-lg py-2 px-2"
//                   >
//                      <Link
//                         href={`/singleMessages?id=${relatedMessage.recId}`}
//                         passHref
//                      >
//                         <Image
//                            src={`https://gateway.pinata.cloud/ipfs/${relatedMessage.image}`}
//                            className="object-cover w-auto h-24 rounded-md"
//                            width={200}
//                            height={150}
//                            alt={relatedMessage.title}
//                         />
//                         <div className="flex flex-col">
//                            <span className="text-gray-500">
//                               {/* {relatedMessage.author} */}

//                               <span className="text-gray-500 text-sm">
//                                  {relatedMessage.author.length > 20
//                                     ? `${relatedMessage.author.slice(
//                                          0,
//                                          20
//                                       )}...`
//                                     : relatedMessage.author}
//                               </span>
//                            </span>
//                            <span className="text-white text-sm">
//                               {relatedMessage.title}
//                            </span>
//                         </div>
//                         <div className=" flex justify-center text-white mt-1   bg-yellow-700 py-1 px-2 rounded-sm hover:bg-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-opacity-50">
//                            <span className="text-sm">
//                               TKC${' '}
//                               {(
//                                  relatedMessage.contentPrice / 1e15
//                               ).toLocaleString()}
//                            </span>
//                         </div>
//                      </Link>
//                   </div>
//                ))}
//             </div>
//          </div>
//       </div>
//    </div>
