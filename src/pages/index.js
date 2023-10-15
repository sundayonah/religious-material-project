import Image from 'next/image';
import Header from '@/components/header';
import React, { useContext, useEffect, useState } from 'react';
import Style from '@/styles/home.module.css';
import axios from 'axios';
import { StateContext } from '@/Context/ReligiousContext';

import { ethers } from 'ethers';
import PerkImage from '@/components/images';

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

   // p {
   //    margin-bottom: 1.5rem;
   //    max-width: 35em;
   // }

   return (
      <div className="mt-14 p-4 m-6">
         <div className=" flex w-full flex-col md:flex-row space-x-6 justify-evenly items-center ">
            <div className="">
               <h3 className="text-[#DAA851] mb-5 text-3xl capitalize">
                  Explore a Word of Christian <br /> Literature and Oratory
               </h3>
               <p className=" mb-6 max-w-lg text-[#fff]">
                  Dive into our vast collection of Faith-based literature, fuel
                  your spirit with enlightening sermons and music and make
                  seamless downloads using E-Wallet{' '}
               </p>
               <div className="flex w-[90%] text-[#fff] justify-center items-center  p-1 m-auto rounded-sm bg-[#DAA851] mb-7 cursor-pointer ">
                  <button>Get Stared</button>
               </div>
            </div>
            <div className=" m-auto">
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
