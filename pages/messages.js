import Header from '@/Components/header';
import React from 'react';
import Style from '@/style/messages.module.css';

const messages = () => {
   return (
      <>
         <Header />
         <hr />
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
               <div>
                  <h1>Message</h1>
               </div>
               <div>
                  <h1>Message</h1>
               </div>
               <div>
                  <h1>Message</h1>
               </div>
               <div>
                  <h1>Message</h1>
               </div>
               <div>
                  <h1>Message</h1>
               </div>
               <div>
                  <h1>Message</h1>
               </div>
               <div>
                  <h1>Message</h1>
               </div>
               <div>
                  <h1>Message</h1>
               </div>
               <div>
                  <h1>Message</h1>
               </div>
            </div>
         </div>
      </>
   );
};

export default messages;
