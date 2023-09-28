import React from 'react';
import Style from '@/styles/messages.module.css';

const messages = () => {
   const messages = Array.from({ length: 12 });

   return (
      <>
         <div className={Style.main}>
            <form className={Style.search}>
               <input
                  type="text"
                  placeholder="Search message..."
                  // value={searchInput}
                  // onChange={(e) => setSearchInput(e.target.value)}
               />
            </form>
            <div className={Style.messages}>
               {messages.map((_, index) => (
                  <div key={index}>
                     <h1>Message</h1>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default messages;
