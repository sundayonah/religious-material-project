import React from 'react';
import Style from '@/styles/messages.module.css';

const messages = () => {
   const messages = Array.from({ length: 12 });

   return (
      <>
         <div className={Style.main}>
            <div>
               <form className={Style.search}>
                  <h4>Messages</h4>
                  <input
                     type="text"
                     placeholder="Search message..."
                     // value={searchInput}
                     // onChange={(e) => setSearchInput(e.target.value)}
                  />
               </form>
            </div>
            <div className={Style.messages}>
               {messages.map((_, index) => (
                  <div key={index} className={Style.messagesDetails}>
                     <div className={Style.imgCard}>
                        <img
                           src="https://imgs.search.brave.com/xldZyl-DW5iTxSawkBqHmuFaoHXFFnYHgISgjCi61Zs/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdDMu/ZGVwb3NpdHBob3Rv/cy5jb20vMTE3Nzk3/My8xODY4Mi9pLzYw/MC9kZXBvc2l0cGhv/dG9zXzE4NjgyODI1/MC1zdG9jay1waG90/by15b3VuZy1wcmll/c3QtcmVhZGluZy1i/aWJsZS5qcGc"
                           alt=""
                           className={Style.img}
                           width={300}
                           height={150}
                        />
                     </div>
                     <div className={Style.artistDetails}>
                        <span>Pastor, preacher.</span>
                        <span>Preaching is changing, and more preachers.</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default messages;
