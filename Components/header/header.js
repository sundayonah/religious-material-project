'use client';

import React, { useContext, useState } from 'react';
import Style from './Header.module.css';
import Link from 'next/link';
import { StateContext } from '@/Context/ReligiousContext';
import { ethers } from 'ethers';
import axios from 'axios';

const Header = () => {
   const { address, disconnect, connect } = useContext(StateContext);

   // const [message, setMessage] = useState('');
   // const [signature, setSignature] = useState('');
   const [accounts, setAccounts] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   // console.log(address);

   const menuItems = [
      { name: 'Home', url: '/' },
      { name: 'Books', url: '/books' },
      { name: 'Messages', url: '/messages' },
      { name: 'Songs', url: '/songs' },
      { name: 'Download', url: '/download' },
   ];

   const connectWallet = async () => {
      try {
         if (window.ethereum) {
            const accounts = await window.ethereum.request({
               method: 'eth_requestAccounts',
            });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            setIsLoading(true);

            const messageHash = ethers.utils.hashMessage(
               'Sign-in to web3 kigdom-coin e-commerce'
            );
            const signature = await signer.signMessage(messageHash);

            console.log(messageHash);

            // Save the signature in local storage
            localStorage.setItem('userSignature', signature);

            console.log(signature);

            setAccounts(accounts);

            const userSignature = localStorage.getItem('userSignature');

            if (signature) {
               // Make a POST request to authenticate the user
               const res = await axios.post(
                  'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser',
                  {
                     address: accounts[0], // Use the user's address
                     signature: signature, // Use the user's signature
                  },
                  {
                     headers: {
                        'Content-Type': 'application/json',
                     },
                  }
               );

               console.log(res);

               if (res.status === 200) {
                  const responseData = res.data.data;

                  // Store responseData in localStorage
                  localStorage.setItem(
                     'responseData',
                     JSON.stringify(responseData)
                  );

                  // Now you can access it later by parsing it back
                  const storedData = JSON.parse(
                     localStorage.getItem('responseData')
                  );

                  console.log(responseData);

                  // You can use storedData as needed in your application
               } else {
                  console.error(
                     `Authentication request failed with status code ${res.status}`
                  );
                  if (res.status === 401) {
                     console.error(
                        'Unauthorized: Check your authorization token.'
                     );
                  }
               }
            } else {
               console.error('User signature not found in local storage');
            }
            setIsLoading(false);
         } else {
            console.error('MetaMask not installed');
         }
      } catch (error) {
         console.error('Error signing in with message hash:', error);
      }
   };

   // const connectWallet = async () => {
   //    try {
   //       if (window.ethereum) {
   //          const accounts = await window.ethereum.request({
   //             method: 'eth_requestAccounts',
   //          });

   //          const provider = new ethers.providers.Web3Provider(window.ethereum);
   //          const signer = provider.getSigner();

   //          setIsLoading(true);

   //          const messageHash = ethers.utils.hashMessage(
   //             'Sign-in to web3 kigdom-coin e-comerce'
   //          );
   //          const signature = await signer.signMessage(messageHash);

   //          console.log(messageHash);

   //          // Save the signature in local storage
   //          localStorage.setItem('userSignature', signature);

   //          console.log(signature);
   //          console.log(accounts);

   //          // setAccounts(accounts);

   //          const userSignature = localStorage.getItem('userSignature');

   //          if (userSignature) {
   //             // Include the signature in the request header

   //             // Make the API request with the headers
   //             // /api/Account/AuthenticateUser

   //             // 'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks',
   //             const res = await axios.post(
   //                'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser',
   //                {
   //                   address: accounts[0], // Use the user's address
   //                   signature: userSignature, // Use the user's signature
   //                },
   //                {
   //                   headers: {
   //                      'Content-Type': 'application/json',
   //                   },
   //                }
   //             );
   //             // 0x8ad5f5891bd251bb46c8a545a2c032d319858601674d0a44195cedf98203a827357c0723b9056707d8dfb7450e0448fe415b8c5aa6c4cc86d4b623f132c3b6d31b

   //             console.log(res.data);

   //             if (res.status === 200) {
   //                const data = res.data; // Access the response data
   //                console.log(data);
   //             } else {
   //                console.error(
   //                   `API request failed with status code ${res.status}`
   //                );
   //                if (res.status === 401) {
   //                   console.error(
   //                      'Unauthorized: Check your authorization token.'
   //                   );
   //                }
   //             }
   //          } else {
   //             console.error('User signature not found in local storage');
   //          }
   //          setIsLoading(false);

   //          // setSignature(signature);
   //       } else {
   //          console.error('MetaMask not installed');
   //       }
   //    } catch (error) {
   //       console.error('Error signing in with message hash:', error);
   //    }
   // };

   return (
      <main className={Style.header}>
         <div></div>
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
            {accounts ? (
               <button onClick={() => disconnect()}>Disconnect</button>
            ) : (
               <button onClick={() => connectWallet()}>Connect Wallet</button>
            )}

            {/* <div>
               Message to Sign: {message}
               <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
               />
            </div>
            <span>signature :{signature} </span> */}
         </div>
      </main>
   );
};

export default Header;
