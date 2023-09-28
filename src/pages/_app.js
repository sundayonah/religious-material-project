import '@/styles/globals.css';
import Header from '@/components/header';
import { StateContextProvider } from '@/Context/ReligiousContext';

import { Web3OnboardProvider, init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
export default function App({ Component, pageProps }) {
   const INFURA_KEY = '8e36cc87e6b2432daab667d3cbcd3734';

   const ethereumRopsten = {
      id: '0x3',
      token: 'rETH',
      label: 'Ethereum Ropsten',
      rpcUrl: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
   };

   const polygonMainnet = {
      id: '0x89',
      token: 'MATIC',
      label: 'Polygon',
      rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
   };
   const baseMainnet = {
      id: '0x2105',
      token: 'ETH',
      label: 'Base',
      rpcUrl: 'https://mainnet.base.org',
   };

   // const chains = [ethereumRopsten, polygonMainnet, baseMainnet];
   const chains = [
      {
         id: 1,
         token: 'ETH',
         label: 'Ethereum Mainnet',
         rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      },
      {
         id: '0x89',
         token: 'MATIC',
         label: 'Polygon',
         rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
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

   const wallets = [injectedModule()];

   const web3Onboard = init({
      wallets,
      chains,
      appMetadata: {
         name: 'Religious Material',
         icon: '<svg>My App Icon</svg>',
         description: 'Religious Material.',
      },
   });
   web3Onboard.state.actions.updateAccountCenter({
      position: 'topRight',
      enabled: true,
      minimal: false,
   });

   return (
      // <WagmiConfig config={wagmiConfig}>

      <>
         <Web3OnboardProvider web3Onboard={web3Onboard}>
            <StateContextProvider>
               <Header />
               <Component {...pageProps} />
            </StateContextProvider>
         </Web3OnboardProvider>
      </>
      // </WagmiConfig>
   );
}
