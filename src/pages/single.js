// pages / products / [id].js;

import React from 'react';
import { useRouter } from 'next/router';
import Products from './api/[id]'; // Import your product data
import Style from '@/styles/single.module.css';

const Single = () => {
   const router = useRouter();
   const { id } = router.query; // Get the product ID from the query parameter

   // Find the product with the matching ID
   const product = Products.find((product) => product.id === id);

   // const categories = Products.map((category) => category.category);
   // console.log(categories);

   if (product) {
      return (
         <>
            <div className="ml-2 mt-28 text-gray-400 w-full bg-green-500 md:bg-red-500 lg:bg-blue-500 ">
               <p className="text-center sm:text-left">Loading...</p>
            </div>

            <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
               <div class="flex-shrink-0">
                  <img
                     class="h-12 w-12"
                     src="/images/explore2.jpg"
                     alt="ChitChat Logo"
                  />
               </div>
               <div>
                  <div class="text-xl font-medium text-black">ChitChat</div>
                  <p class="text-gray-500">You have a new message!</p>
               </div>
            </div>
            <div class="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 mt-6">
               <img
                  class="block mx-auto h-24 rounded-full sm:mx-0 sm:flex-shrink-0"
                  src="/images/explore2.jpg"
                  alt="Woman's Face"
               />
               <div class="text-center space-y-2 sm:text-left">
                  <div class="space-y-0.5">
                     <p class=" text-lg text-black font-semibold">
                        Erin Lindford
                     </p>
                     <p class="text-gray-500 font-medium">Product Engineer</p>
                  </div>
                  <button class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
                     Message
                  </button>
               </div>
            </div>
            <div class="max-w-md mx-auto mt-3 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
               <div class="md:flex">
                  <div class="md:flex-shrink-0">
                     <img
                        class=" h-48 w-full object-cover md:h-full rounded-sm md:w-48"
                        src="/images/explore2.jpg"
                        alt="Man looking at item at a store"
                     />
                  </div>
                  <div class="p-8">
                     <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        Case study
                     </div>
                     <a
                        href="#"
                        class="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
                     >
                        Finding customers for your new business
                     </a>
                     <p class="mt-2 text-gray-500">
                        Getting a new business off the ground is a lot of hard
                        work. Here are five ideas you can use to find your first
                        customers.
                     </p>
                  </div>
               </div>
            </div>
         </>
      );
   }

   // Render the product details
   return (
      <div>
         <div className={Style.main}>
            {product ? (
               <>
                  <img
                     className=" object-cover rounded-sm"
                     src={product.image}
                     width={300}
                     height={200}
                     alt="single image"
                  />

                  {/* <img class="h-48 w-full object-cover md:h-full md:w-48" src="/img/store.jpg" alt="Man looking at item at a store" /> */}

                  <div className={Style.imgContent}>
                     <h4 className="text-white">{product.title}</h4>
                     <h4 className="text-gray-500">{product.category}</h4>
                     <p className="text-white">{product.description}</p>

                     <div className={Style.priceBuy}>
                        <span className="text-white">${product.price}</span>
                        <button className="text-white">Buy Now</button>
                     </div>
                  </div>
               </>
            ) : (
               <p>Product not found</p>
            )}
         </div>
      </div>
   );
};

export default Single;

// 'use client';

// import Header from '@/Components/header';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import Style from '../style/single.module.css';
// const SingleBook = () => {
//    const router = useRouter();
//    const { id } = router.query;
//    const [product, setProduct] = useState(null);

//    // const url = 'https://course-api.com/javascript-store-single-product';

//    // import product directly from api
//    // and check if id == id coming from api
//    // show product else "An has Error has occur"

//    console.log(id);

//    useEffect(() => {
//       const fetchData = async () => {
//          try {
//             if (id) {
//                // const response = await fetch(`/api/products/${id}`);
//                const response = await fetch(`/products/${id}`);
//                console.log(response);
//                if (!response.ok) {
//                   throw new Error(`HTTP error! Status: ${response.status}`);
//                }
//                const data = await response.json();

//                console.log(data);
//                setProduct(data);
//             }
//          } catch (error) {
//             console.error(error);
//          }
//       };

//       fetchData();
//    }, [id]);

//    // if (!product) {
//    //    // Handle the loading state here
//    //    return (
//    //       <>
//    //          <div>Loading...</div>
//    //          <p>Wait while we fetch data</p>
//    //       </>
//    //    );
//    // }

//    // Render the product details once product is available
//    return (
//       <>
//          <Header />
//          <hr />
//          {/* <div className={Style.main}>
//             <div className={Style.img}>
//                <img
//                   src={product.image}
//                   width={400}
//                   height={300}
//                   alt="single image"
//                />
//             </div>
//             <div className={Style.imgContent}>
//                <h4>{product.title}</h4>
//                <p>{product.description}</p>

//                <div className={Style.priceBuy}>
//                   <span>${product.price}</span>
//                   <button>Buy Now</button>
//                </div>
//             </div>
//          </div> */}
//          <p>{id}</p>
//       </>
//    );
// };

// export default SingleBook;
