import React from 'react';
import Style from './Header.module.css';

const Header = () => {
   //    const menuItems = ['Home', 'Books', 'MP3', 'MP4', 'Song/Ministration'];
   const menuItems = [
      { name: 'Home', url: '/home' },
      { name: 'Books', url: '#' },
      { name: 'Messages', url: '#' },
      { name: 'Songs', url: '#' },
   ];

   return (
      <main className={Style.header}>
         <div>
            <h1>RM</h1>
         </div>

         <div className={Style.menu}>
            {menuItems.map((item, i) => (
               <ul key={i + 1}>
                  {/* <li>{item.name}</li> */}
                  <a href={item.url}>{item.name}</a>
               </ul>
            ))}
         </div>
         <div>
            <span>Connect</span>
         </div>
      </main>
   );
};

export default Header;
