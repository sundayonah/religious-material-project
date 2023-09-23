import Header from '@/Components/header';
import React from 'react';
import Style from '@/style/songs.module.css';
import '../app/globals.css';

const Songs = () => {
   return (
      <>
         <Header />
         <div className={Style.main}>
            <h1>Songs Page</h1>
         </div>
      </>
   );
};

export default Songs;
