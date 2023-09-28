import React from 'react';
import Style from '@/styles/songs.module.css';

const Songs = () => {
   const repetitions = Array.from({ length: 12 });

   return (
      <>
         <hr />
         <div className={Style.main}>
            <form className={Style.search}>
               <input
                  type="text"
                  placeholder="Search songs..."
                  // value={searchInput}
                  // onChange={(e) => setSearchInput(e.target.value)}
               />
            </form>
            <div className={Style.songs}>
               {repetitions.map((_, index) => (
                  <div key={index} className={Style.songDetails}>
                     <div className={Style.imgCard}>
                        <img
                           src="https://imgs.search.brave.com/Yt7ANTS12Zv5enO6ryAZnxpmdabPW_KJgPs_RQy8-b8/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LndlcGlrLmNv/bS9zdGF0aWNzLzEz/ODgzNTMxL3ByZXZp/ZXctcGFnZTAuanBn"
                           alt=""
                           className={Style.img}
                           width={150}
                           height={100}
                        />
                     </div>
                     <div className={Style.artistDetails}>
                        <span>Artist</span>
                        <span>Title</span>
                        <div className={Style.actions}>
                           <span>O</span>
                           <span>O</span>
                           <span>O</span>
                           <span>O</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default Songs;
