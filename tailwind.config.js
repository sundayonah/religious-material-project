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
         },
         // boxShadow: {
         //    custom: '0.4rem 0.4rem 1rem #111, -0.4rem -0.4rem 1rem #333',
         // },
         //  screens: {
         //     '2xl': { max: '1535px' },
         //     // => @media (max-width: 1535px) { ... }

         //     xl: { max: '1279px' },
         //     // => @media (max-width: 1279px) { ... }

         //     lg: { max: '1023px' },
         //     // => @media (max-width: 1023px) { ... }

         //     md: { max: '767px' },
         //     // => @media (max-width: 767px) { ... }

         //     sm: { max: '639px' },
         //     // => @media (max-width: 639px) { ... }
         //  },
      },
   },
   plugins: [],
};
