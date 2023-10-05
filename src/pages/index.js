import Image from 'next/image';
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import React, { useContext, useEffect, useState } from 'react';
import Style from '@/styles/home.module.css';
import axios from 'axios';
import { StateContext } from '@/Context/ReligiousContext';

import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';
import { useWeb3Onboard } from '@/Context/Web3OnBoardContext'; // Import the hook
import PerkImage from '@/components/images';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
   // const onboard = useWeb3Onboard(); // Access the onboard instance
   // // console.log(onboard.connectWallet());
   // //    const wallets = await onboard.connectWallet();
   // const connectWallets = async () => {
   //    await onboard.connectWallet();
   // };

   ////////////////////////////////
   // const MAINNET_RPC_URL =
   //    'https://mainnet.infura.io/v3/8e36cc87e6b2432daab667d3cbcd3734';

   // const injected = injectedModule();

   // const onboard = Onboard({
   //    wallets: [injected],
   //    chains: [
   //       {
   //          id: '0x1',
   //          token: 'ETH',
   //          label: 'Ethereum Mainnet',
   //          rpcUrl: MAINNET_RPC_URL,
   //       },
   //       {
   //          id: 42161,
   //          token: 'ARB-ETH',
   //          label: 'Arbitrum One',
   //          rpcUrl: 'https://rpc.ankr.com/arbitrum',
   //       },
   //       {
   //          id: '0xa4ba',
   //          token: 'ARB',
   //          label: 'Arbitrum Nova',
   //          rpcUrl: 'https://nova.arbitrum.io/rpc',
   //       },
   //       {
   //          id: '0x2105',
   //          token: 'ETH',
   //          label: 'Base',
   //          rpcUrl: 'https://mainnet.base.org',
   //       },
   //    ],
   // });

   // const web3Board = async () => {
   //    const wallets = await onboard.connectWallet();

   //    console.log(wallets);

   //    if (wallets[0]) {
   //       // create an ethers provider with the last connected wallet provider
   //       // if using ethers v6 this is:
   //       // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
   //       const ethersProvider = new ethers.providers.Web3Provider(
   //          wallets[0].provider,
   //          'any'
   //       );

   //       const signer = ethersProvider.getSigner();

   //       // send a transaction with the ethers provider
   //       const txn = await signer.sendTransaction({
   //          to: '0x',
   //          value: 100000000000000,
   //       });

   //       const receipt = await txn.wait();
   //       console.log(receipt);
   //    }
   // };

   // // web3Board();

   ////////////////////////////////////////////////////////////////
   const { address, disconnect, connect } = useContext(StateContext);

   const [books, setBooks] = useState([]);

   const booksURL =
      'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks';

   // Function to fetch books using the stored token
   const fetchBooks = async () => {
      try {
         // Get the stored token from local storage
         const storedData = JSON.parse(localStorage.getItem('responseData'));
         const token = storedData.token;
         // console.log(token);

         if (token) {
            // Make a GET request to the books endpoint with the token in the Authorization header
            const res = await axios.get(booksURL, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            // console.log(res.data.data);

            if (res.data.statusCode === 200) {
               const booksData = res.data; // Access the res data

               setBooks(booksData.data);
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
         } else {
            console.error('Token not found in local storage');
         }
      } catch (error) {
         console.error('Error fetching books:', error);
      }
   };

   // Now you can call fetchBooks whenever you need to fetch books

   useEffect(() => {
      fetchBooks();
   }, []);
   /*
 data: [
      {
        recId: '1',
        cover: ' ... (length: 59455)',
        name: ' ... (length: 17)',
        author: ' ... (length: 13)',
        category: ' ... (length: 7)',
        description: ' ... (length: 37)',
        price: 1.5,
        bookFile: ' ... (length: 25)'
      },
    */

   return (
      <div className={Style.main}>
         <div className=" flex w-full flex-col md:flex-row space-x-6 justify-evenly items-center m-4">
            <div className="">
               <h3 className="text-[#DAA851]">
                  Explore a Word of Christian <br /> Literature and Oratory
               </h3>
               <p className=" text-[#fff]">
                  Dive into our vast collection of Faith-based literature, fuel
                  your spirit with enlightening sermons and music and make
                  seamless downloads using E-Wallet{' '}
               </p>
               <div className="flex w-[85%] text-[#fff] justify-center items-center  p-1 rounded-sm bg-[#DAA851] mb-7 ">
                  <button>Get Stared</button>
               </div>
            </div>
            <div className="">
               <Image
                  src="/images/explore2.jpg"
                  width={400}
                  height={200}
                  alt="hero-image"
               />
            </div>
         </div>
         <PerkImage />
      </div>
   );
}
