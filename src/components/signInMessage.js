import { useSignMessage } from 'wagmi';

import React from 'react';

const SignInToConnect = () => {
   const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
      message: 'Sign-in to web3 kigdom-coin e-comerce',
   });

   // console.log({ data, isError, isLoading, isSuccess, signMessage });

   return (
      <div className="text-white mt-28">
         <button
            className="text-white"
            disabled={isLoading}
            onClick={() => signMessage()}
         >
            SignIn
         </button>
         {isSuccess && <div className="text-white">Signature: {data}</div>}
         {isError && <div className="text-white">Error signing message</div>}
      </div>
   );
};

export default SignInToConnect;
