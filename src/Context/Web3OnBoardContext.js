// import Onboard, { chains } from '@web3-onboard/core';
// import injectedModule from '@web3-onboard/injected-wallets';
// import { useEffect } from 'react';

// const injected = injectedModule();

// const wallets = [injected];

// const INFURA_ID = '8e36cc87e6b2432daab667d3cbcd3734';

// const chainsData = [
//    {
//       id: 1,
//       token: 'ETH',
//       label: 'Ethereum Mainnet',
//       rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
//    },
//    {
//       id: 42161,
//       token: 'ARB-ETH',
//       label: 'Arbitrum One',
//       rpcUrl: 'https://rpc.ankr.com/arbitrum',
//    },
//    {
//       id: '0xa4ba',
//       token: 'ARB',
//       label: 'Arbitrum Nova',
//       rpcUrl: 'https://nova.arbitrum.io/rpc',
//    },
//    {
//       id: 137,
//       token: 'MATIC',
//       label: 'Matic Mainnet',
//       rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
//    },
//    {
//       id: '0x2105',
//       token: 'ETH',
//       label: 'Base',
//       rpcUrl: 'https://mainnet.base.org',
//    },
// ];

// const appMetadata = {
//    name: 'My App',
//    icon: '<SVG_ICON_STRING>',
//    logo: '<SVG_LOGO_STRING>',
//    description: 'My app using Onboard',
//    recommendedInjectedWallets: [
//       { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
//       { name: 'MetaMask', url: 'https://metamask.io' },
//    ],
// };

// // Export a function that initializes and returns the Onboard instance
// export function initializeWebOnboard() {
//    return Onboard({
//       wallets,
//       chains: chainsData,
//       appMetadata,
//    });
// }

// // import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
// // import { WagmiConfig } from 'wagmi';
// // import {
// //    arbitrum,
// //    bsc,
// //    bscTestnet,
// //    goerli,
// //    mainnet,
// //    polygon,
// //    sepolia,
// // } from 'wagmi/chains';

// // // 1. Get projectId
// // const projectId = 'de7693706b2bb6e9b2e049f09e7ebad1';

// // // 2. Create wagmiConfig
// // const metadata = {
// //    name: 'Minning dApp',
// //    description: 'Web3Modal Example',
// //    url: 'https://web3modal.com',
// //    icons: ['https://avatars.githubusercontent.com/u/37784886'],
// // };
// // const chains = [mainnet, arbitrum, bsc, bscTestnet, polygon, sepolia, goerli];
// // const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// // // 3. Create modal
// // createWeb3Modal({ wagmiConfig, projectId, chains });

// // import Onboard, { chains } from '@web3-onboard/core';
// // import injectedModule from '@web3-onboard/injected-wallets';
// // import { useEffect } from 'react';

// // import { initializeWebOnboard } from '@/Context/Web3OnBoardContext'; // Import the function

// upload image
const handleSubmit = async (e) => {
   e.preventDefault();
   setCloseForm(false);
   setLoading(true);
   if (file) {
      try {
         const formData = new FormData();
         formData.append('file', file);

         const res = await axios({
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
            data: formData,
            headers: {
               pinata_api_key: `5215a74e525dd12d8c6b`,
               pinata_secret_api_key: `3d90e51f58691609de847f314ef402705e2a6851474817089ea9dcb2862a90b`,
               'Content-Type': 'multipart/form-data',
            },
         });
         console.log(res, 'response');
         const image = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
         await UploadImage({
            ...imageInfo,
            image: image,
            category: category,
         });
         console.log(image);
         setFile(null);
      } catch (error) {
         console.log(error);
      }
   }
   setFile(null);
   setLoading(false);
};

const retrieveFile = (e) => {
   const data = e.target.files[0];
   const reader = new window.FileReader();
   reader.readAsArrayBuffer(data);
   reader.onloadend = () => {
      setFile(e.target.files[0]);
   };
   e.preventDefault();
};

// display image to ui
const onImageChange = (event) => {
   if (event.target.files && event.target.files[0]) {
      setDisplay(URL.createObjectURL(event.target.files[0]));
   }
};

const signIn = async () => {
   try {
      if (window.ethereum) {
         // // Call the ConnectButton component
         // // ConnectButton();

         const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
         });

         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         setIsLoading(true);

         const messageHash = ethers.utils.hashMessage(
            'Sign-in to web3 kigdom-coin e-comerce'
         );
         const signature = await signer.signMessage(messageHash);

         // Save the signature in local storage
         localStorage.setItem('userSignature', signature);

         const userSignature = localStorage.getItem('userSignature');

         if (userSignature) {
            // Include the signature in the request header

            const authURL =
               'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

            const res = await axios.post(
               authURL,
               {
                  address: accounts[0], // Use the user's address
                  signature: userSignature, // Use the user's signature
               },
               {
                  headers: {
                     'Content-Type': 'application/json',
                  },
               }
            );
            console.log(res);

            if (res.data.statusCode === 200) {
               // Store responseData in localStorage
               const responseData = res.data.data;
               localStorage.setItem(
                  'responseData',
                  JSON.stringify(responseData)
               );
               // Now you can access it later by parsing it back
               const storedData = JSON.parse(
                  localStorage.getItem('responseData')
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
