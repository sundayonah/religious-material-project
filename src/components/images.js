import React from 'react';
import Style from '../styles/home.module.css';
import Image from 'next/image';

const thePerks = [
   { name: 'Convinience', src: '/images/convinient.jpg' },
   { name: 'Spiritual-growth', src: '/images/spiritual-growth.jpg' },
   { name: 'Music', src: '/images/secure-paymants.jpg' },
   { name: 'Offline', src: '/images/offline-Access.jpg' },
];

const whatWeOffer = [
   { name: 'Literature', src: '/images/literature.jpg' },
   { name: 'Word', src: '/images/the-word.jpg' },
   { name: 'Music', src: '/images/music.jpg' },
];

const PerkImage = () => {
   return (
      <>
         <h3 className="flex text-white justify-center items-center mb-4">
            What we offer
         </h3>
         <div className="flex flex-col md:flex-row w-full justify-center items-center space-x-6 space-y-3">
            {whatWeOffer.slice(0, 2).map((offer, i) => (
               <div className="" key={i}>
                  <Image
                     src={offer.src}
                     width={350}
                     height={150}
                     alt={offer.name}
                  />
               </div>
            ))}
         </div>

         <div className="flex w-full justify-center items-center space-x-6 space-y-3 mt-6 ">
            <Image
               className=""
               src={whatWeOffer[2].src}
               width={350}
               height={150}
               alt={whatWeOffer[2].name}
            />
         </div>
         <h3 className="flex text-white justify-center items-center mt-5">
            The Perks
         </h3>
         <div className="flex justify-center items-center flex-wrap space-x-8 mb-3">
            {thePerks.map((perk, i) => (
               <div className="m-3" key={i}>
                  <Image
                     src={perk.src}
                     width={200}
                     height={150}
                     alt={perk.name}
                  />
               </div>
            ))}
         </div>
      </>
   );
};

export default PerkImage;
