import Image from 'next/image';
import styles from './page.module.css';
import Header from '@/Components/header/header';
import HomePage from '@/pages/home';

export default function Home() {
   return (
      <main className={styles.main}>
         <Header />
         <HomePage />
      </main>
   );
}

// import Header from '@/Components/header'; // Check if the import path is correct

// export default function Home() {
//    return (
//       <main className={styles.main}>
//          <Header />
//          {/* Rest of your content */}
//       </main>
//    );
// }
