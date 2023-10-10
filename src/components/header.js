'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { StateContext } from '@/Context/ReligiousContext';
import { ConnectButton, Menu } from './connectWallet';
import { ethers } from 'ethers';
import axios from 'axios';

const Header = () => {
   const { address, disconnect, connect, connectWallet, ConnectButton } =
      useContext(StateContext);

   const [accounts, setAccounts] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu visibility

   // console.log(address);

   const menuItems = [
      { name: 'Home', url: '/' },
      { name: 'Books', url: '/books' },
      { name: 'Messages', url: '/messages' },
      { name: 'Songs', url: '/songs' },
      { name: 'Download', url: '/download' },
   ];

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
   };

   const closeMenu = () => {
      setIsMenuOpen(false);
   };

   return (
      <>
         {isMenuOpen && (
            <div
               className="fixed inset-0 bg-black opacity-50"
               onClick={toggleMenu}
            ></div>
         )}
         <main className="flex justify-between px-6  items-center fixed left-0 top-0 w-full bg-opacity-10 backdrop-blur-md shadow-md h-16">
            <div className="">
               <span className="text-white bold">LOGO</span>
            </div>
            {/* <div className="flex">
               {menuItems.map((item, i) => (
                  <ul key={i + 1}>
                     <Link className="pr-5 text-white" href={item.url}>
                        {item.name}
                     </Link>
                  </ul>
               ))}
            </div>

            <button onClick={() => connectWallet()}>connect</button>

            <ConnectButton />
            <div>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white "
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
               </svg>
            </div> */}{' '}
            {/* Hide on screens larger than 'md' */}
            <div className="md:hidden ">
               {isMenuOpen ? (
                  ''
               ) : (
                  // <div className="md:hidden">
                  //    <button onClick={toggleMenu} className="text-white">
                  //       <svg
                  //          xmlns="http://www.w3.org/2000/svg"
                  //          fill="none"
                  //          viewBox="0 0 24 24"
                  //          strokeWidth={1.5}
                  //          stroke="currentColor"
                  //          className="w-6 h-6"
                  //       >
                  //          <path
                  //             strokeLinecap="round"
                  //             strokeLinejoin="round"
                  //             d="M6 18L18 6M6 6l12 12"
                  //          />
                  //       </svg>
                  //    </button>
                  // </div>
                  <button onClick={toggleMenu} className="text-white">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                     </svg>
                  </button>
               )}
            </div>
            {/* Menu */}
            <div
               className={`${
                  isMenuOpen ? 'block px-5 py-4 shadow-custom' : 'hidden'
               } md:flex  absolute right-0  justify-center items-center top-0 w-[50%] md:static md:space-x-4 md:bg-transparent md:w-auto`}
            >
               <div className="flex justify-end">
                  {isMenuOpen && (
                     <button
                        onClick={closeMenu}
                        className="text-white md:hidden"
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-6 h-6"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                           />
                        </svg>
                     </button>
                  )}
               </div>
               {menuItems.map((item, i) => (
                  <ul key={i + 1} className={isMenuOpen ? 'pt-3' : ''}>
                     <Link
                        onClick={closeMenu}
                        className="pr-5 text-white"
                        href={item.url}
                     >
                        {item.name}
                     </Link>
                  </ul>
               ))}
               {/* 
               <div>
                  {ConnectButton()}

                  <button onClick={connectWallet}>Connect Wallet</button>

               </div> */}

               {/* <button onClick={() => connectWallet()}>connect</button>
                */}
               <ConnectButton />
            </div>
         </main>
      </>
   );
};

export default Header;
