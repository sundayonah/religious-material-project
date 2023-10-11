import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

export const StateContext = createContext({});

export const StateContextProvider = ({ children }) => {
   //    const { contract } = useContract(
   //       // '0x29c6Cd6d269F5CB422eB21B8D7b636384Bc66123'
   //       '0x46525740483e6cf321313372F8eCa8bBb625a57B'
   //    );

   // const address = useAddress();
   // const connect = useMetamask();
   // const disconnect = useDisconnect();
   const [accounts, setAccounts] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   // console.log(address);

   // const ConnectButton = () => {
   //    return <w3m-button balance="hide" />;
   // };

   const connectWallet = async () => {
      try {
         if (window.ethereum) {
            // Call the ConnectButton component
            // ConnectButton();

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

   const ConnectButton = () => {
      return (
         <>
            <w3m-button balance="hide" />;{connectWallet}
         </>
      );
   };

   // const connectWallet = async () => {
   //    try {
   //       if (window.ethereum) {
   //          const accounts = await window.ethereum.request({
   //             method: 'eth_requestAccounts',
   //          });

   //          const provider = new ethers.providers.Web3Provider(window.ethereum);
   //          const signer = provider.getSigner();

   //          setIsLoading(true);

   //          const messageHash = ethers.utils.hashMessage(
   //             'Sign-in to web3 kigdom-coin e-commerce'
   //          );
   //          const signature = await signer.signMessage(messageHash);

   //          // Save the signature in local storage
   //          localStorage.setItem('userSignature', signature);

   //          console.log(signature);

   //          const userSignature = localStorage.getItem('userSignature');

   //          console.log(userSignature);

   //          if (userSignature) {
   //             // Make a POST request to authenticate the user
   //             const res = await axios.post(
   //                'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser',
   //                {
   //                   address: accounts[0], // Use the user's address
   //                   signature: userSignature, // Use the user's signature
   //                },
   //                {
   //                   headers: {
   //                      'Content-Type': 'application/json',
   //                   },
   //                }
   //             );

   //             console.log(res);

   //             if (res.status === 200) {
   //                const responseData = res.data.data;

   //                // Store responseData in localStorage
   //                localStorage.setItem(
   //                   'responseData',
   //                   JSON.stringify(responseData)
   //                );

   //                // Now you can access it later by parsing it back
   //                const storedData = JSON.parse(
   //                   localStorage.getItem('responseData')
   //                );

   //                console.log(responseData);

   //                // You can use storedData as needed in your application
   //             } else {
   //                console.error(
   //                   `Authentication request failed with status code ${res.status}`
   //                );
   //                if (res.status === 401) {
   //                   console.error(
   //                      'Unauthorized: Check your authorization token.'
   //                   );
   //                }
   //             }
   //          } else {
   //             console.error('User signature not found in local storage');
   //          }
   //          setIsLoading(false);
   //       } else {
   //          console.error('MetaMask not installed');
   //       }
   //    } catch (error) {
   //       console.error('Error signing in with message hash:', error);
   //    }
   // };

   // const connectWallet = async () => {
   //    try {
   //       if (window.ethereum) {
   //          const accounts = await window.ethereum.request({
   //             method: 'eth_requestAccounts',
   //          });

   //          const provider = new ethers.providers.Web3Provider(window.ethereum);
   //          const signer = provider.getSigner();

   //          setIsLoading(true);

   //          const messageHash = ethers.utils.hashMessage(
   //             'Sign-in to web3 kigdom-coin e-comerce'
   //          );
   //          const signature = await signer.signMessage(messageHash);

   //          // Save the signature in local storage
   //          localStorage.setItem('userSignature', signature);

   //          const userSignature = localStorage.getItem('userSignature');

   //          if (userSignature) {
   //             // Include the signature in the request header

   //             const authURL =
   //                'http://kingdomcoin-001-site1.ctempurl.com/api/Account/AuthenticateUser';

   //             const res = await axios.post(
   //                authURL,
   //                {
   //                   address: accounts[0], // Use the user's address
   //                   signature: userSignature, // Use the user's signature
   //                },
   //                {
   //                   headers: {
   //                      'Content-Type': 'application/json',
   //                   },
   //                }
   //             );

   //             if (res.data.statusCode === 200) {
   //                // Store responseData in localStorage
   //                const responseData = res.data.data;
   //                localStorage.setItem(
   //                   'responseData',
   //                   JSON.stringify(responseData)
   //                );
   //                // Now you can access it later by parsing it back
   //                const storedData = JSON.parse(
   //                   localStorage.getItem('responseData')
   //                );
   //             } else {
   //                console.error(
   //                   `API request failed with status code ${res.status}`
   //                );
   //                if (res.status === 401) {
   //                   console.error(
   //                      'Unauthorized: Check your authorization token.'
   //                   );
   //                }
   //             }
   //          } else {
   //             console.error('User signature not found in local storage');
   //          }
   //          setIsLoading(false);
   //       } else {
   //          console.error('MetaMask not installed');
   //       }
   //    } catch (error) {
   //       console.error('Error signing in with message hash:', error);
   //    }
   // };

   // const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
   // console.log(wallet);
   // if (wallet) {
   //    if (wallet[0]) {
   //       const ethersProvider = new ethers.providers.Web3Provider(
   //          wallet[0].provider,
   //          'any'
   //       );

   //       const signer = ethersProvider.getSigner();

   //       console.log(signer);
   //    } else {
   //       console.log(
   //          "Wallet is not connected yet or doesn't have a selected address."
   //       );
   //    }
   // }

   return (
      <StateContext.Provider
         value={{
            // connectWallet,
            ConnectButton,
         }}
      >
         {children}
      </StateContext.Provider>
   );
};
{
   /* {books.map((book) => {
            const { recId, author, category, description, price, cover } = book;

            return (
               <div key={recId}>
                  <img
                     src={cover}
                     alt={`Cover for ${recId}`}
                     width={150}
                     height={100}
                  />
                  <p>{recId}</p>
                  <p>{author}</p>
                  <p>{description}</p>
                  <p>{price}</p>
                  <p>{category}</p>
               </div>
            );
         })} */
}
