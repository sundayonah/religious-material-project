import Image from 'next/image';
import styles from './page.module.css';
import Header from '@/Components/header';
import HomePage from '@/pages/home';

export default function Home() {
   return (
      <main className={styles.main}>
         <Header />
         <hr />
         <HomePage />
      </main>
   );
}
