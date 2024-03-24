// import { StateContext } from '@/Context/ReligiousContext';
// import { useContext } from 'react';

import axios from 'axios';
import { ethers } from 'ethers';

// export const ConnectButton = () => {
//    const { connectWallet } = useContext(StateContext);

//    // return <w3m-button balance="hide" />;
//    return <w3m-button balance="hide" onClick={connectWallet} />;
// };

// export const Menu = () => {
//    <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className="w-6 h-6"
//    >
//       <path
//          strokeLinecap="round"
//          strokeLinejoin="round"
//          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//       />
//    </svg>;
// };

// const ConnectWallet = async () => {
//    const provider = await useMetamask();
//    if (provider) {
//       // The wallet is connected, call the original `connectWallet` function
//       const signer = new ethers.providers.Web3Provider(provider).getSigner();
//       // The rest of your code here...
//    }
//    console.log(provider);
//    console.log(signer);

//    // setIsLoading(true);

//    const messageHash = ethers.utils.hashMessage(
//       'Sign-in to web3 kigdom-coin e-comerce'
//    );
//    const signature = await signer.signMessage(messageHash);

//    // Save the signature in local storage
//    localStorage.setItem('userSignature', signature);

//    const userSignature = localStorage.getItem('userSignature');

//    if (userSignature) {
//       // Include the signature in the request header

//       const authURL =
//          'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

//       const res = await axios.post(
//          authURL,
//          {
//             address: accounts[0], // Use the user's address
//             signature: userSignature, // Use the user's signature
//          },
//          {
//             headers: {
//                'Content-Type': 'application/json',
//             },
//          }
//       );
//       console.log(res);

//       if (res.data.statusCode === 200) {
//          // Store responseData in localStorage
//          const responseData = res.data.data;
//          localStorage.setItem('responseData', JSON.stringify(responseData));
//          // Now you can access it later by parsing it back
//          const storedData = JSON.parse(localStorage.getItem('responseData'));
//          console.log(storedData);
//       } else {
//          console.error(`API request failed with status code ${res.status}`);
//          if (res.status === 401) {
//             console.error('Unauthorized: Check your authorization token.');
//          }
//       }
//    } else {
//       console.error('User signature not found in local storage');
//    }
//    // setIsLoading(false);

//    // Your existing code here...
// };
// const [logIn, setLogIn] = useState(false);

export const signIn = async () => {
   // setIsConnected(false);
   try {
      // if (!isConnected) {
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

export const ConnectButton = () => {
   // return <w3m-button balance="hide" />;
   return <w3m-button balance="hide" />;
};
