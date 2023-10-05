import '@/styles/globals.css';
import Header from '@/components/header';
import { StateContextProvider } from '@/Context/ReligiousContext';

import { Web3OnboardProvider, init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';

import infinityWalletModule from '@web3-onboard/infinity-wallet';
import fortmaticModule from '@web3-onboard/fortmatic';
import safeModule from '@web3-onboard/gnosis';
import keepkeyModule from '@web3-onboard/keepkey';
import keystoneModule from '@web3-onboard/keystone';
import ledgerModule from '@web3-onboard/ledger';
import portisModule from '@web3-onboard/portis';
import trezorModule from '@web3-onboard/trezor';
import walletConnectModule from '@web3-onboard/walletconnect';
import coinbaseModule from '@web3-onboard/coinbase';
import magicModule from '@web3-onboard/magic';
import dcentModule from '@web3-onboard/dcent';
import sequenceModule from '@web3-onboard/sequence';
import tahoModule from '@web3-onboard/taho';
import trustModule from '@web3-onboard/trust';
import frontierModule from '@web3-onboard/frontier';

export default function App({ Component, pageProps }) {
   const INFURA_KEY = process.env.NEXT_INFURA_KEY;
   const PROJECTS_ID = process.env.NEXT_PROJECTS_ID;

   // const INFURA_KEY = '8768y898uhkl';
   // const PROJECTS_ID = '8768y898uhkl';

   // const ethereumRopsten = {
   //    id: '0x3',
   //    token: 'rETH',
   //    label: 'Ethereum Ropsten',
   //    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
   // };

   // const polygonMainnet = {
   //    id: '0x89',
   //    token: 'MATIC',
   //    label: 'Polygon',
   //    rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
   // };
   // const baseMainnet = {
   //    id: '0x2105',
   //    token: 'ETH',
   //    label: 'Base',
   //    rpcUrl: 'https://mainnet.base.org',
   // };
   // const magic = magicModule({
   //    apiKey: INFURA_KEY,
   // });

   // const injected = injectedModule();
   // const coinbase = coinbaseModule();
   // const dcent = dcentModule();
   // const infinityWallet = infinityWalletModule();
   // const keystone = keystoneModule();
   // const keepkey = keepkeyModule();
   // const safe = safeModule();
   // const sequence = sequenceModule();
   // const taho = tahoModule(); // Previously named Tally Ho wallet
   // const trust = trustModule();
   // const frontier = frontierModule();
   // const trezor = trezorModule();
   // // const ledger = ledgerModule({
   // //    apiKey: PROJECTS_ID,
   // // });
   // const portis = portisModule({
   //    apiKey: INFURA_KEY,
   // });

   // const fortmatic = fortmaticModule({
   //    apiKey: INFURA_KEY,
   // });

   // const wcV2InitOptions = {
   //    projectId: PROJECTS_ID,

   //    requiredChains: [1, 56],
   //    dappUrl: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
   // };
   // const walletConnect = walletConnectModule(wcV2InitOptions);

   // const chains = [ethereumRopsten, polygonMainnet, baseMainnet];
   // // const chains = [
   // //    {
   // //       id: 1,
   // //       token: 'ETH',
   // //       label: 'Ethereum Mainnet',
   // //       rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
   // //    },
   // //    {
   // //       id: '0x89',
   // //       token: 'MATIC',
   // //       label: 'Polygon',
   // //       rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
   // //    },
   // //    {
   // //       id: 42161,
   // //       token: 'ARB-ETH',
   // //       label: 'Arbitrum One',
   // //       rpcUrl: 'https://rpc.ankr.com/arbitrum',
   // //    },
   // //    {
   // //       id: '0xa4ba',
   // //       token: 'ARB',
   // //       label: 'Arbitrum Nova',
   // //       rpcUrl: 'https://nova.arbitrum.io/rpc',
   // //    },
   // //    {
   // //       id: 137,
   // //       token: 'MATIC',
   // //       label: 'Matic Mainnet',
   // //       rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
   // //    },
   // //    {
   // //       id: '0x2105',
   // //       token: 'ETH',
   // //       label: 'Base',
   // //       rpcUrl: 'https://mainnet.base.org',
   // //    },
   // //    {
   // //       id: '0xA',
   // //       token: 'OETH',
   // //       label: 'Optimism',
   // //       rpcUrl: 'https://mainnet.optimism.io',
   // //    },
   // // ];

   // // npm install @web3-onboard/react @web3-onboard/injected-wallets @web3-onboard/infinity-wallet @web3-onboard/fortmatic @web3-onboard/gnosis @web3-onboard/keepkey @web3-onboard/keystone @web3-onboard/ledger @web3-onboard/portis @web3-onboard/trezor @web3-onboard/walletconnect @web3-onboard/coinbase @web3-onboard/magic @web3-onboard/dcent @web3-onboard/sequence @web3-onboard/taho @web3-onboard/trust @web3-onboard/frontier

   // // const wallets = [injectedModule()];
   // const wallets = [
   //    walletConnect,
   //    injected,
   //    infinityWallet,
   //    keepkey,
   //    sequence,
   //    injectedModule(),
   //    trust,
   //    frontier,
   //    taho,
   //    // ledger,
   //    coinbase,
   //    dcent,
   //    // trezor,
   //    safe,
   //    magic,
   //    fortmatic,
   //    keystone,
   //    portis,
   // ];
   // const web3Onboard = init({
   //    wallets,
   //    chains,
   //    appMetadata: {
   //       name: 'Religious Material',
   //       icon: '<svg>My App Icon</svg>',
   //       description: 'Religious Material.',
   //       recommendedInjectedWallets: [
   //          { name: 'MetaMask', url: 'https://metamask.io' },
   //          { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
   //       ],
   //    },
   // });
   // web3Onboard.state.actions.updateAccountCenter({
   //    position: 'topRight',
   //    enabled: true,
   //    minimal: true,
   // });

   return (
      // <WagmiConfig config={wagmiConfig}>

      <>
         {/* <Web3OnboardProvider web3Onboard={web3Onboard}> */}
         <StateContextProvider>
            <Header />
            <Component {...pageProps} />
         </StateContextProvider>
         {/* </Web3OnboardProvider> */}
      </>
      // </WagmiConfig>
   );
}
