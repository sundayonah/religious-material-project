'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { StateContext } from '@/Context/ReligiousContext';
import { ConnectButton, Menu } from './connectWallet';
import { ethers } from 'ethers';
import axios from 'axios';
import logo from '../../public/images/yolva.png';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { CloseIcon, OpenIcon } from './icons';

const Header = () => {
   const {
      // address,
      disconnect,
      connect,
      connectWallet,
      ConnectButton,
      // signIn,
      // isConnected,
      Connect,
   } = useContext(StateContext);
   const router = useRouter();

   const [accounts, setAccounts] = useState('');
   const [isConnected, setIsConnected] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isSignInCompleted, setSignInCompleted] = useState(false);
   const [isInitialLoad, setIsInitialLoad] = useState(false);

   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [walletConnected, setWalletConnected] = useState(false);
   // const [signInCompleted, setSignInCompleted] = useState(false);

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

   const { open } = useWeb3Modal();

   const [logIn, setLogIn] = useState(false);

   const { address, isConnecting, isDisconnected } = useAccount();

   const signIn = useCallback(async () => {
      try {
         // if (isConnected && !isSignInCompleted) {
         // if (!isSignInCompleted) {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         setIsLoading(true);

         const messageHash = ethers.utils.hashMessage(
            'Sign-in to web3 kigdom-coin e-comerce projects'
         );
         const signature = await signer.signMessage(messageHash);

         localStorage.setItem('userSignature', signature);

         const userSignature = localStorage.getItem('userSignature');

         if (userSignature) {
            const authURL =
               'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

            const res = await axios.post(
               authURL,
               {
                  address: signer._address, // Use the user's address from signer
                  signature: userSignature,
               },
               {
                  headers: {
                     'Content-Type': 'application/json',
                  },
               }
            );

            if (res.data.statusCode === 200) {
               const responseData = res.data.data;
               localStorage.setItem(
                  'responseData',
                  JSON.stringify(responseData)
               );
            } else {
               console.error(
                  `API request failed with status code ${res.status}`
               );
               if (res.status === 401) {
                  console.error(
                     'Unauthorized: Check your authorization token.'
                  );
               }
            }
            localStorage.setItem('signInCompleted', 'true');
         } else {
            console.error('User signature not found in local storage');
         }
         setIsLoading(false);
         setSignInCompleted(true);
         // } else {
         //    console.error('MetaMask not installed or user already signed in.');
         // }
      } catch (error) {
         console.error('Error signing in with message hash:', error);
      }
   }, []);

   useEffect(() => {
      const checkWalletConnection = async () => {
         if (address !== undefined) {
            signIn(); // Automatically trigger sign-in when wallet is connected and sign-in is not yet completed
         }
      };

      checkWalletConnection();
   }, [address, signIn]);

   return (
      <>
         {isMenuOpen && (
            <div
               className="fixed inset-0 bg-black opacity-50"
               onClick={toggleMenu}
            ></div>
         )}
         <main
            className="flex justify-between px-6 py-2 items-center fixed left-0 top-0 w-full 
         bg-opacity-10 backdrop-blur-md shadow-md   h-14"
         >
            <div className="">
               <span className="text-white bold">LOGO</span>
            </div>
            <div className="md:hidden ">
               {isMenuOpen ? (
                  ''
               ) : (
                  <button
                     onClick={toggleMenu}
                     className="text-white border rounded-md"
                  >
                     <OpenIcon />
                  </button>
               )}
            </div>
            {/* Menu */}
            <div
               className={`${
                  isMenuOpen
                     ? 'block px-5 py-4 shadow-custom bg-transparent'
                     : 'hidden'
               } md:flex  absolute right-0 justify-center items-center top-0 w-[50%] md:static md:space-x-4  md:w-auto`}
            >
               <div className="flex justify-end">
                  {isMenuOpen && (
                     <button
                        onClick={closeMenu}
                        className="text-white border rounded-md md:hidden"
                     >
                        <CloseIcon />
                     </button>
                  )}
               </div>
               {menuItems.map((menu, i) => (
                  <ul key={i + 1} className={isMenuOpen ? 'pt-3' : ''}>
                     <div
                        className={
                           router.pathname === menu.url
                              ? 'active-link'
                              : 'text-white'
                        }
                     >
                        <Link
                           onClick={closeMenu}
                           href={menu.url}
                           className="pr-5"
                        >
                           {menu.name}
                        </Link>
                     </div>
                  </ul>
               ))}
               <div className="">
                  <w3m-button balance="hide" />
               </div>
            </div>
            <style jsx>{`
               .active-link {
                  color: #bf9221;
               }
            `}</style>
         </main>
      </>
   );
};

export default Header;
