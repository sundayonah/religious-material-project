// import { useAccount, useSignMessage } from 'wagmi';
// import React from 'react';

// const SignInToConnect = () => {
//    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
//       message: 'Sign-in to web3 kigdom-coin e-commerce',
//    });

//    const { address, isConnecting, isDisconnected } = useAccount();

//    // Show nothing if the user is signed in
//    if (address && !isDisconnected) {
//       return null;
//    }
//    console.log(address);

//    return (
//       <div className="text-white mt-28">
//          <button
//             className="text-white"
//             disabled={isLoading || isConnecting}
//             onClick={() => signMessage()}
//          >
//             SignIn
//          </button>
//          {isSuccess && <div className="text-white">Signature: {data}</div>}
//          {isError && <div className="text-white">Error signing message</div>}
//       </div>
//    );
// };

// export default SignInToConnect;
