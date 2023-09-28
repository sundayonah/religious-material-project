'use client';

import React, { useContext, useState } from 'react';
import Style from './Header.module.css';
import Link from 'next/link';
import { StateContext } from '@/Context/ReligiousContext';
import { ethers } from 'ethers';
import axios from 'axios';

import { useConnectWallet } from '@web3-onboard/react';

// import { useAccount, useConnect, useDisconnect } from 'wagmi';
// import { InjectedConnector } from 'wagmi/connectors/injected';
// import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react';

const Header = () => {
   // const { address, disconnect, connect, connectWallet } =
   //    useContext(StateContext);

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
   //             'Sign-in to web3 kigdom-coin e-commerce'
   //          );
   //          const signature = await signer.signMessage(messageHash);

   //          // Save the signature in local storage
   //          localStorage.setItem('userSignature', signature);

   //          console.log(signature);

   //          const userSignature = localStorage.getItem('userSignature');

   //          console.log(userSignature);

   //          if (userSignature) {
   //             // Make a POST request to authenticate the user
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

   //             console.log(res);

   //             if (res.status === 200) {
   //                const responseData = res.data.data;

   //                // Store responseData in localStorage
   //                localStorage.setItem(
   //                   'responseData',
   //                   JSON.stringify(responseData)
   //                );

   //                // Now you can access it later by parsing it back
   //                const storedData = JSON.parse(
   //                   localStorage.getItem('responseData')
   //                );

   //                console.log(responseData);

   //                // You can use storedData as needed in your application
   //             } else {
   //                console.error(
   //                   `Authentication request failed with status code ${res.status}`
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
   //       } else {
   //          console.error('MetaMask not installed');
   //       }
   //    } catch (error) {
   //       console.error('Error signing in with message hash:', error);
   //    }
   // };

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

   //          // Save the signature in local storage
   //          localStorage.setItem('userSignature', signature);

   //          const userSignature = localStorage.getItem('userSignature');

   //          if (userSignature) {
   //             // Include the signature in the request header

   //             const authURL =
   //                'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

   //             const res = await axios.post(
   //                authURL,
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

   //             if (res.data.statusCode === 200) {
   //                // Store responseData in localStorage
   //                const responseData = res.data.data;
   //                localStorage.setItem(
   //                   'responseData',
   //                   JSON.stringify(responseData)
   //                );
   //                // Now you can access it later by parsing it back
   //                const storedData = JSON.parse(
   //                   localStorage.getItem('responseData')
   //                );
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
   //       } else {
   //          console.error('MetaMask not installed');
   //       }
   //    } catch (error) {
   //       console.error('Error signing in with message hash:', error);
   //    }
   // };

   const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
   console.log(wallet);
   if (wallet) {
      if (wallet[0]) {
         const ethersProvider = new ethers.providers.Web3Provider(
            wallet[0].provider,
            'any'
         );

         const signer = ethersProvider.getSigner();

         console.log(signer);
      } else {
         console.log(
            "Wallet is not connected yet or doesn't have a selected address."
         );
      }
   }

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
            {/* {address ? (
               <button onClick={() => disconnect()}>Disconnect</button>
            ) : (
               // <button onClick={() => connectWallet()}>Connect Wallet</button>
               <button onClick={() => connect()}>connect</button>
            )} */}
            {/* <button onClick={() => connectWallet()}>connect</button> */}

            <button
               disabled={connecting}
               onClick={() => (wallet ? disconnect(wallet) : connect())}
            >
               {connecting
                  ? 'Connecting'
                  : wallet
                  ? 'Disconnect'
                  : 'Connect Wallet'}
            </button>
         </div>
      </main>
   );
};

export default Header;
