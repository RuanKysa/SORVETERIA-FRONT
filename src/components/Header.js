import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faBook, faShoppingCart, faUser, faPencilAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import styles from '../styles/Header.module.css';

const Header = ({ setCart }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setUserEmail(response.data.email);
                    setUserName(response.data.name);
                })
                .catch(error => console.error("Erro ao buscar dados do usuário:", error));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserEmail(null);
        setUserName(null);
        setCart([]);
    };

    const toggleNav = () => setIsNavOpen(!isNavOpen);

    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

    return (
        <header className={styles.header}>
            <h1 className={styles.headerTitle}>Sorveteria</h1>
            <FontAwesomeIcon icon={faBars} onClick={toggleNav} className={styles.hamburgerIcon} />

            <nav className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}>
                <ul className={styles.navUl}>
                    <li><Link href="/" className={styles.navLink}><FontAwesomeIcon icon={faHome} /> Home</Link></li>
                    <li><Link href="/catalogo" className={styles.navLink}><FontAwesomeIcon icon={faBook} /> Catálogo</Link></li>
                    <li><Link href="/carrinho" className={styles.navLink}><FontAwesomeIcon icon={faShoppingCart} /> Carrinho</Link></li>
                    <li><Link href="/admin" className={styles.navLink}><FontAwesomeIcon icon={faPencilAlt} /> Área Admin</Link></li>

                    {userEmail ? (
                        <li className={styles.profileLink} onClick={toggleProfileMenu}>
                            <FontAwesomeIcon icon={faUserCircle} /> Perfil
                            {isProfileMenuOpen && (
                                <ul className={styles.profileMenu}>
                                    <li className={styles.profileItem}>{userName}</li>
                                    <li className={styles.profileItem}>{userEmail}</li>
                                    <li>
                                        <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
                                    </li>
                                </ul>
                            )}
                        </li>
                    ) : (
                        <li><Link href="/login" className={styles.navLink}><FontAwesomeIcon icon={faUser} /> Login</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
