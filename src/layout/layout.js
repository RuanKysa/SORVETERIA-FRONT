import styles from '../styles/layout.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

const Layout = ({ children }) => {
  const [cart, setCart] = useState([]); // Estado do carrinho

  return (
    <div className={styles.container}>
      <Header setCart={setCart} cart={cart} /> {/* Passando setCart e cart para o Header */}
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
