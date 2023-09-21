import Image from 'next/image';
import styles from './page.module.css';
import Header from '@/Components/header/Header';
import Books from '@/Components/Books/Books';
import SingleBook from '@/Components/singleBook/singleBook';

export default function Home() {
   return (
      <main className={styles.main}>
         <Header />
         <hr />
         {/* <Books /> */}
         <SingleBook />
      </main>
   );
}
