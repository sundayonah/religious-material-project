import '@/styles/globals.css';
import Header from '@/components/header';
import { StateContextProvider } from '@/Context/ReligiousContext';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';

import { WagmiConfig } from 'wagmi';
import {
   arbitrum,
   bsc,
   bscTestnet,
   goerli,
   mainnet,
   polygon,
   sepolia,
} from 'wagmi/chains';
import { Provider } from 'react-redux';
import store from '../reduxToolkit/store';

// 1. Get projectId
const projectId = 'de7693706b2bb6e9b2e049f09e7ebad1';

// 2. Create wagmiConfig
const metadata = {
   name: 'Religious Materials',
   description: 'Web3Modal Example',
   url: 'Web3Modal Example',
   icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, arbitrum, bsc, bscTestnet, polygon, sepolia, goerli];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export default function App({ Component, pageProps }) {
   return (
      <>
         <WagmiConfig config={wagmiConfig}>
            <Provider store={store}>
               <StateContextProvider>
                  <Header />
                  <Component {...pageProps} />
               </StateContextProvider>
            </Provider>
         </WagmiConfig>
      </>
   );
}
