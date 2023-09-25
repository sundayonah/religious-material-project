import React from 'react';

const newBook = () => {
   const URL = 'http://kingdomcoin-001-site1.ctempurl.com/swagger/index.html';

   const fetchBooks = async () => {
      try {
         const res = await fetch(URL);
         console.log(res);
         const data = await res.json();
         return data;
      } catch (error) {
         productsDOM.innerHTML = `<p class="error">There was an error</p>`;
      }
   };

   fetchBooks();

   return <div>newBook</div>;
};

export default newBook;
