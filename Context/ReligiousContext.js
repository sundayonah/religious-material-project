import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import {
   useAddress,
   useContract,
   useMetamask,
   useDisconnect,
   useSigner,
} from '@thirdweb-dev/react';

export const StateContext = createContext({});

export const StateContextProvider = ({ children }) => {
   //    const { contract } = useContract(
   //       // '0x29c6Cd6d269F5CB422eB21B8D7b636384Bc66123'
   //       '0x46525740483e6cf321313372F8eCa8bBb625a57B'
   //    );

   const address = useAddress();
   const connect = useMetamask();
   const disconnect = useDisconnect();

   console.log(address);

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
               'Sign-in to web3 kigdom-coin e-comerce'
            );
            const signature = await signer.signMessage(messageHash);

            console.log(messageHash);

            // Save the signature in local storage
            localStorage.setItem('userSignature', signature);

            console.log(signature);

            // setAccounts(accounts);

            const userSignature = localStorage.getItem('userSignature');

            if (userSignature) {
               // Include the signature in the request header

               // Make the API request with the headers
               const res = await axios(
                  'http://kingdomcoin-001-site1.ctempurl.com/api/Book/GetAllBooks',
                  {
                     method: 'GET',
                     headers: {
                        Authorization: `Bearer ${userSignature}`,
                        Accept: 'application/json, text/plain, */*',
                     },
                  }
               );

               if (res.status === 200) {
                  const data = res.data; // Access the response data
                  console.log(data);
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

            // setSignature(signature);
         } else {
            console.error('MetaMask not installed');
         }
      } catch (error) {
         console.error('Error signing in with message hash:', error);
      }
   };

   return (
      <StateContext.Provider
         value={{
            address,
            connect,
            disconnect,
            connectWallet,
         }}
      >
         {children}
      </StateContext.Provider>
   );
};
