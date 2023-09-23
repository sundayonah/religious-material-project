import React from 'react';
import Style from './Header.module.css';
import Link from 'next/link';

const Header = () => {
   //    const menuItems = ['Home', 'Books', 'MP3', 'MP4', 'Song/Ministration'];
   const menuItems = [
      { name: 'Home', url: '/' },
      { name: 'Books', url: '/books' },
      { name: 'Messages', url: '/messages' },
      { name: 'Songs', url: '/songs' },
   ];

   return (
      <main className={Style.header}>
         <div className={Style.logo}>
            <span>LOGO</span>
         </div>

         <div className={Style.menu}>
            {menuItems.map((item, i) => (
               <ul key={i + 1}>
                  {/* <li>{item.name}</li> */}
                  <Link href={item.url}>{item.name}</Link>
               </ul>
            ))}
         </div>
         <div className={Style.connectWallet}>
            <button>Connect Wallet</button>
         </div>
      </main>
   );
};

export default Header;
