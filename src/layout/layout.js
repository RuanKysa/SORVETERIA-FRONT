import styles from '../styles/layout.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

const Layout = ({ children }) => {
  const [cart, setCart] = useState([]);

  return (
    <div className={styles.container}>
      <Header setCart={setCart} cart={cart} /> 
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
