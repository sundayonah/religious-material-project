'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { StateContext } from '@/Context/ReligiousContext';
import { ConnectButton, Menu } from './connectWallet';
import { ethers } from 'ethers';
import axios from 'axios';
import logo from '../../public/images/yolva.png';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useSignMessage } from 'wagmi';
import { useRouter } from 'next/router';
import { CloseIcon, OpenIcon } from './icons';
import SignInToConnect from './signInMessage';
import Image from 'next/image';

const Header = () => {
   const {
      // address,
      disconnect,
      connect,
      connectWallet,
      // ConnectButton,
      // signIn,
      // isConnected,
      Connect,
   } = useContext(StateContext);
   const router = useRouter();

   const [accounts, setAccounts] = useState('');
   const [isConnected, setIsConnected] = useState(false);
   // const [isLoading, setIsLoading] = useState(false);
   const [isSignInCompleted, setSignInCompleted] = useState(false);
   const [isInitialLoad, setIsInitialLoad] = useState(false);

   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [walletConnected, setWalletConnected] = useState(false);
   const [isComponentMounted, setComponentMounted] = useState(false);

   const [account, setAccount] = useState('');

   // console.log(address);

   const menuItems = [
      { name: 'Home', url: '/' },
      { name: 'Books', url: '/books' },
      { name: 'Messages', url: '/messages' },
      { name: 'Songs', url: '/songs' },
      { name: 'Download', url: '/productsDownload' },
   ];

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
   };

   const closeMenu = () => {
      setIsMenuOpen(false);
   };

   const { open } = useWeb3Modal();

   // const [signIn, setSignIn] = useState(false);

   const { address, isConnecting, isDisconnected } = useAccount();

   const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
      message: 'Sign-in to web3 kigdom-coin e-commerce',
   });
   // const handleAuthenticate = async () => {
   //    try {
   //       if (address && data) {
   //          const res = await axios.post(
   //             authURL,
   //             {
   //                address: address,
   //                signature: data,
   //             },
   //             {
   //                headers: {
   //                   'Content-Type': 'application/json',
   //                },
   //             }
   //          );
   //          // Handle the response from the authentication API
   //          console.log('Authentication response:', res.data);
   //       }
   //    } catch (error) {
   //       // Handle any errors during the authentication process
   //       console.error('Error during authentication:', error);
   //    }
   // };

   // useEffect(() => {
   //    setComponentMounted(true);
   //    // Cleanup function to set isComponentMounted to false on component unmount
   //    return () => setComponentMounted(false);
   // }, []);

   // useEffect(() => {
   //    // Check if the component is mounted and there is an address
   //    if (isComponentMounted && address && !isDisconnected) {
   //       signMessage();
   //    }
   // }, [isComponentMounted, address, isDisconnected, signMessage]);

   // console.log({ address, data });

   const signIn = useCallback(async () => {
      try {
         // if (isConnected && !isSignInCompleted) {
         if (!isSignInCompleted) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // const userAddress = await signer.getAddress();

            const messageHash = ethers.utils.hashMessage(
               'Sign-in to web3 kigdom-coin e-comerce'
            );
            const signature = await signer.signMessage(messageHash);
            console.log(signature);

            if (signature) {
               const authURL =
                  'http://hokoshokos-001-site1.etempurl.com/api/Account/AuthenticateUser';

               const res = await axios.post(
                  authURL,
                  {
                     address: address,
                     signature: signature,
                  },
                  {
                     headers: {
                        'Content-Type': 'application/json',
                     },
                  }
               );
               console.log(res);
               // Log the entire response
               if (res.data) {
                  console.log('Response Data:', res.data);
               } else {
                  console.log('Response Data is null');
               }

               // Check if the status indicates success (status code 200)

               if (res.status === 200 && res.data?.data) {
                  const {
                     token,
                     refreshToken,
                     tokenExpirationDate,
                     userId,
                     address,
                  } = res.data.data;

                  // Now you can use these values as needed
                  console.log('token:', token);
                  console.log('refreshToken:', refreshToken);
                  console.log('tokenExpirationDate:', tokenExpirationDate);
                  console.log('userId:', userId);
                  console.log('address:', address);
               } else {
                  console.error(
                     'Authentication failed:',
                     res.data?.message || 'Unknown error'
                  );
               }

               if (res.data?.statusCode === 200) {
                  const responseData = res.data.data;
                  console.log(responseData);
                  localStorage.setItem(
                     'responseData',
                     JSON.stringify(responseData)
                  );
                  setSignInCompleted(true);
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
         } else {
            console.error('MetaMask not installed or user already signed in.');
         }
      } catch (error) {
         console.error('Error signing in with message hash:', error);
      }
   }, [isSignInCompleted, address]);

   // console.log(isDisconnected);

   // useEffect(() => {
   //    const checkWalletConnection = async () => {
   //       if (address && !isDisconnected) {
   //          signIn();
   //       }
   //    };

   //    checkWalletConnection();
   // }, [address, signIn, isDisconnected]);

   // const signTx = useCallback(async () => {
   //    try {
   //       // eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9
   //       //    .eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMWVkN2UwZTctNDgwYS00OWVkLWE5ZDYtM2QyYjNlZjY2ZjNkIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIweDAxQjk0RDU1MERDNDY4YTU2MTMyRmJhOUY5MjQ4ZTM0NmM1QmE1NGMiLCJleHAiOjE3MDE0MzYxMzUsImlzcyI6Imh0dHA6Ly9yb2Fkc3Rhci5jb20iLCJhdWQiOiJodHRwOi8vcm9hZHN0YXIuY29tIn0
   //       //    .UsyZKfaT -
   //       //    k9AA5b626QBefq8y_rFgI9 -
   //       //    Aag -
   //       //    H_UbjZE;
   //       // Initialize provider and signer
   //       const provider = new ethers.providers.Web3Provider(window.ethereum);
   //       const signer = provider.getSigner();

   //       // Prepare message
   //       // const message = 'Sign-in to web3 kigdom-coin e-comerce KC';
   //       const message = 'My Text';

   //       // Sign message
   //       const signature = await signer.signMessage(message);
   //       console.log('Signature:', signature);

   //       // Verify signature
   //       const signAddress = ethers.utils.verifyMessage(message, signature);
   //       console.log('Sign Address:', signAddress);

   //       // Check if the signed address matches the expected address
   //       if (signAddress !== address) {
   //          console.error('Address mismatch. Aborting authentication.');
   //          return;
   //       }

   //       // Server authentication
   //       const authURL =
   //          'http://hokoshokos-001-site1.etempurl.com/api/Account/AuthenticateUser';
   //       const response = await axios.post(
   //          authURL,
   //          {
   //             address: address,
   //             signature: signature,
   //          },
   //          {
   //             headers: {
   //                'Content-Type': 'application/json',
   //             },
   //          }
   //       );
   //       setSignIn(false);

   //       console.log('Server Response:', response.data);
   //    } catch (error) {
   //       console.error('Error during authentication:', error);
   //    }
   // }, [address]);

   // useEffect(() => {
   //    if (address) {
   //       signTx();
   //    }
   // }, [address, signIn, signTx]);
   return (
      <>
         {isMenuOpen && (
            <div
               className="fixed inset-0 bg-black opacity-50"
               onClick={toggleMenu}
            ></div>
         )}
         <main className="flex justify-between px-6 py-2 items-center fixed left-0 top-0 w-full bg-opacity-10 backdrop-blur-md shadow-md h-14 z-20">
            <div className="">
               {/* <span className="text-white bold">LOGO</span> */}
               <Link href="/">
                  <Image
                     alt="logo"
                     src="/images/logo.png"
                     className=""
                     width={40}
                     height={40}
                  />
               </Link>
            </div>

            {/* <SignInToConnect /> */}

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
                     ? 'block px-5 py-4 shadow-2xl bg-[#342b1c]'
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
                  <ul key={i + 1} className={isMenuOpen ? 'pt-3 mb-2' : ''}>
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
               {/* <div className="">
                  <w3m-button balance="hide" />
               </div> */}

               <ConnectButton />
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
