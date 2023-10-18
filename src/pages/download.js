import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { messagesDetails } from './api/messagesDetails';

const Download = () => {
   const repetitions = Array.from({ length: 12 });
   const [purchasedProducts, setPurchasedProducts] = useState([]);
   const { address } = useAccount();

   useEffect(() => {
      // Retrieve the list of purchased products from local storage
      const storedPurchasedProducts =
         JSON.parse(localStorage.getItem('purchasedProducts')) || [];

      // Filter the purchased products based on the current user's address
      const userPurchasedProducts = storedPurchasedProducts.filter(
         (item) => item.address === address
      );

      setPurchasedProducts(userPurchasedProducts);
   }, [address]);

   if (purchasedProducts.length === 0) {
      return (
         <div className="mt-28 text-gray-500 pl-5">
            <h1>Connect your wallet to see all your products</h1>
         </div>
      );
   }

   return (
      <>
         <div className="w-[80%] m-auto mt-28">
            <span className="text-white capitalize">
               total: {purchasedProducts.length}
            </span>
            <div className="flex flex-wrap gap-3 p-2 justify-center items-center">
               {purchasedProducts.map(({ product }) => (
                  <div
                     key={product.id}
                     className="flex justify-between items-center mx-1  px-2 py-3  rounded-md border border-s-green-800"
                  >
                     <div className="text-gray-700">
                        <img
                           src={product.imageUrl}
                           alt={`Image ${product.title}`}
                           className="rounded-md"
                           width={150}
                           height={150}
                        />
                     </div>
                     <div className="flex flex-col m-1">
                        <span className="text-white">{product.title}</span>
                        <span className="text-gray-600">{product.artist}</span>
                        {/* <span className="text-white">{product.price}</span> */}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default Download;
