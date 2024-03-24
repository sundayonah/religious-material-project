import React, { useEffect, useState } from 'react';
import { useSignMessage, useAccount } from 'wagmi';
import axios from 'axios';
import { ethers } from 'ethers';

//   {
//     address: undefined,
//     isConnecting: false,
//     isDisconnected: true,
//     isReconnected: undefined,
//     isReconnecting: false
//   }

const SignaturePopup = () => {
   const {
      address,
      isConnecting,
      isDisconnected,
      isConnected,
      isReconnecting,
   } = useAccount();

   //    console.log(isReconnecting, address);

   //    const sendDataToEndpoint = async (address, signedMessage) => {
   //       console.log('Request payload:', {
   //          address: address,
   //          signature: signedMessage,
   //       });

   //       try {
   //          const response = await axios.post(
   //             'https://hokoshokos-001-site1.etempurl.com/api/Account/AuthenticateUser',
   //             {
   //                address: address,
   //                signature: signedMessage,
   //             }
   //          );

   //          console.log('Authentication successful:', response.data);
   //          // Handle success, e.g., update UI or navigate to another page
   //       } catch (error) {
   //          console.error('Error authenticating user:', error);
   //          // Handle error, e.g., show an error message to the user
   //       }
   //    };

   const sendDataToEndpoint = async () => {
      try {
         //  console.log('Request payload:', {
         //     address: address,
         //     signature: signedMessage,
         //  });

         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         // const userAddress = await signer.getAddress();

         const messageHash = ethers.utils.hashMessage(
            'Sign-in to web3 kigdom-coin e-comerce'
         );
         const signature = await signer.signMessage(messageHash);
         console.log(signature);

         const response = await axios.post(
            'https://kinccoin.bsite.net/api/Account/AuthenticateUser',
            {
               address: address,
               signature: signature,
            }
         );
         console.log('Request payload:', {
            address: address,
            signature: signature,
         });

         console.log('Authentication successful:', response);
         // Handle success, e.g., update UI or navigate to another page
      } catch (error) {
         console.error('Error authenticating user:', error);
         console.error('Error response:', error.response);
      }
   };

   const { data, isError, isLoading, isSuccess, variables, signMessage } =
      useSignMessage({
         message: 'Sign-in to web3 kigdom-coin e-commerce',
      });

   //    console.log(variables?.message);
   //    console.log(data);

   //    console.log({
   //       address,
   //       isConnecting,
   //       isDisconnected,
   //       isConnected,
   //       isReconnecting,
   //    });

   //    useEffect(() => {
   //       (async () => {
   //          if (isReconnecting && address && isConnected) {
   //             console.log('YEAH');
   //             sendDataToEndpoint();
   //          } else {
   //             console.log('Error sending data to endpoint:');
   //          }
   //       })();
   //    }, [address, isReconnecting, isConnected]);

   // Log signature from useSignMessae
   useEffect(() => {
      if (variables?.message && data) {
         (async () => {
            const response = await axios.post(
               'https://kinccoin.bsite.net/api/Account/AuthenticateUser',
               {
                  address: address,
                  //   message: variables?.message,
                  //   signature: data,
                  signature:
                     '0x09c38e70af291a48b5b4767152302b6ff5166f4d0626db81296a772755dc39c26b48009975ca52cfa412f335dc9fb113850b718a52eb75112a9a0376b871a2111c',
               }
            );
            // console.log('Signature from useSignMessage:', { address, data })
            console.log('Response from wagmi', response);
         })();
      }
   }, [data, address, variables?.message]);

   return (
      <div className="mt-28 flex flex-col">
         <button
            className="text-white bg-black"
            disabled={isLoading}
            onClick={() => sendDataToEndpoint()}
         >
            Sign Ethers message
         </button>
         <button
            className="text-white bg-black"
            disabled={isLoading}
            onClick={() => signMessage()}
         >
            Sign Wagmi message
         </button>
         <div className="text-white">Signature: {data}</div>
         {isError && <div className="text-white">Error signing message</div>}

         {isSuccess && (
            <button
               className="text-white"
               disabled={isLoading}
               onClick={() => sendDataToEndpoint(address, data)}
            >
               Send Data to Endpoint
            </button>
         )}
      </div>
   );
};

export default SignaturePopup;

/////////////////////////////////////////////////////////

//    const sendDataToEndpoint = async () => {
//       try {
//          //  console.log('Request payload:', {
//          //     address: address,
//          //     signature: signedMessage,
//          //  });

//          const provider = new ethers.providers.Web3Provider(window.ethereum);
//          const signer = provider.getSigner();

//          // const userAddress = await signer.getAddress();

//          const messageHash = ethers.utils.hashMessage(
//             'Sign-in to web3 kigdom-coin e-comerce'
//          );
//          const signature = await signer.signMessage(messageHash);
//          console.log(signature);

//          const response = await axios.post(
//             'https://hokoshokos-001-site1.etempurl.com/api/Account/AuthenticateUser',
//             {
//                address: address,
//                signature: signature,
//             }
//          );

//          console.log('Response', { address: address, signature: signature });

//          console.log('Authentication successful:', response.data);
//          // Handle success, e.g., update UI or navigate to another page
//       } catch (error) {
//          console.error('Error authenticating user:', error);
//          console.error('Error response:', error.response); // Handle error, e.g., show
//       }
//    };
