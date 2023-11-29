/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   theme: {
      extend: {
         backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic':
               'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
         },
         boxShadow: {
            custom: '0.4rem 0.4rem 1rem #111, -0.4rem -0.4rem 1rem #333',
            'custom-inset':
               '0.4rem 0.4rem 1rem #111 inset, -0.4rem -0.4rem 1rem #333 inset',
            newCustom: '10px 15px 20px rgba(0, 0, 0, 1)',
            generate: '0px 5px 22px -5px rgba(9,8,8,1) inset',
         },
         textColor: {
            likeColor: '#DAA851',
         },
      },
   },
   plugins: [],
};
