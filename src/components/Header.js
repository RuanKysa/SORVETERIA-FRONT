"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { default as jwt_decode } from 'jwt-decode';
console.log(jwt_decode);  



const Header = () => {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Token:", token);  
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                console.log("Decoded Token:", decodedToken);  
                setUserEmail(decodedToken.email);
                console.log("Email do Usuário:", decodedToken.email);
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserEmail(null);
        
    };

    return (
        <header className={styles.header}>
            <h1>Sorveteria</h1>
            <nav className={styles.nav}>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/catalogo">Catálogo</Link></li>
                    <li><Link href="/carrinho">Carrinho</Link></li>
                    <li><Link href="/admin">Área Admin</Link></li>
                    {userEmail ? (
                        <>
                            <li className={styles.userEmail}>{userEmail}</li>
                            <li>
                                <button onClick={handleLogout} className={styles.logoutButton}>
                                    Sair
                                </button>
                            </li>
                        </>
                    ) : (
                        <li><Link href="/login">Login</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
