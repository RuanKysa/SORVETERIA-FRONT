import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <h1>Sorveteria</h1>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/catalogo">Catálogo</Link>
                    </li>
                    <li>
                        <Link href="/carrinho">Carrinho</Link>
                    </li>
                    <li>
                        <Link href="/login">Login</Link>
                    </li>
                    <li>
                        <Link href="/admin">Área Admin</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
