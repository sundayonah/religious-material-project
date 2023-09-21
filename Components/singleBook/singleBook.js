import React from 'react';
import Header from '../header/Header';
import Style from './single.module.css';
import Image from 'next/image';

const singleBook = () => {
   return (
      <>
         <div className={Style.main}>
            <div className={Style.img}>
               <Image
                  src="https://course-api.com/images/store/product-11.jpeg"
                  width={400}
                  height={300}
                  alt="single image"
               />
            </div>
            <div className={Style.imgContent}>
               <h4>Rich Book</h4>
               <h4>Author: Religious Material</h4>
               <p>
                  Describe the technical challenges you encountered during the
                  project. Be specific and provide examples. For instance, you
                  might mention issues related to data synchronization between
                  front-end and back-end, handling complex user interactions, or
                  optimizing performance.
               </p>
               <span>$9.99</span>
               <span>Buy Now</span>
            </div>
            {/* <div className={Style.priceBuy}></div> */}
         </div>
      </>
   );
};

export default singleBook;
