import Onboard, { chains } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { useEffect } from 'react';

const injected = injectedModule();

const wallets = [injected];

const INFURA_ID = '8e36cc87e6b2432daab667d3cbcd3734';

const chainsData = [
   {
      id: 1,
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
   },
   {
      id: 42161,
      token: 'ARB-ETH',
      label: 'Arbitrum One',
      rpcUrl: 'https://rpc.ankr.com/arbitrum',
   },
   {
      id: '0xa4ba',
      token: 'ARB',
      label: 'Arbitrum Nova',
      rpcUrl: 'https://nova.arbitrum.io/rpc',
   },
   {
      id: 137,
      token: 'MATIC',
      label: 'Matic Mainnet',
      rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
   },
   {
      id: '0x2105',
      token: 'ETH',
      label: 'Base',
      rpcUrl: 'https://mainnet.base.org',
   },
];

const appMetadata = {
   name: 'My App',
   icon: '<SVG_ICON_STRING>',
   logo: '<SVG_LOGO_STRING>',
   description: 'My app using Onboard',
   recommendedInjectedWallets: [
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
      { name: 'MetaMask', url: 'https://metamask.io' },
   ],
};

// Export a function that initializes and returns the Onboard instance
export function initializeWebOnboard() {
   return Onboard({
      wallets,
      chains: chainsData,
      appMetadata,
   });
}

// import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
// import { WagmiConfig } from 'wagmi';
// import {
//    arbitrum,
//    bsc,
//    bscTestnet,
//    goerli,
//    mainnet,
//    polygon,
//    sepolia,
// } from 'wagmi/chains';

// // 1. Get projectId
// const projectId = 'de7693706b2bb6e9b2e049f09e7ebad1';

// // 2. Create wagmiConfig
// const metadata = {
//    name: 'Minning dApp',
//    description: 'Web3Modal Example',
//    url: 'https://web3modal.com',
//    icons: ['https://avatars.githubusercontent.com/u/37784886'],
// };
// const chains = [mainnet, arbitrum, bsc, bscTestnet, polygon, sepolia, goerli];
// const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// // 3. Create modal
// createWeb3Modal({ wagmiConfig, projectId, chains });

// import Onboard, { chains } from '@web3-onboard/core';
// import injectedModule from '@web3-onboard/injected-wallets';
// import { useEffect } from 'react';

// import { initializeWebOnboard } from '@/Context/Web3OnBoardContext'; // Import the function
