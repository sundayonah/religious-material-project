import React from 'react';
import Style from './Header.module.css';

const Header = () => {
   //    const menuItems = ['Home', 'Books', 'MP3', 'MP4', 'Song/Ministration'];
   const menuItems = [
      { name: 'Home', url: '../../app/home.js' },
      { name: 'Books', url: './Home.js' },
      { name: 'Messages', url: './Home.js' },
      { name: 'Songs', url: './Home.js' },
   ];

   return (
      <main className={Style.header}>
         <div>
            <h1>RM</h1>
         </div>

         <div className={Style.menu}>
            {menuItems.map((item, i) => (
               <ul key={i + 1}>
                  <li>{item.name}</li>
                  <a href={item.url} target="_blank"></a>
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
