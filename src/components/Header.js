"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from '../styles/Home.module.css';

const Header = ({ setCart }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Token:", token);  // Verifique se o token está presente

        if (token) {
            // Requisição para o backend para buscar os dados do usuário
            axios.get('http://localhost:5000/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}` // Passando o token JWT no cabeçalho
                }
            })
                .then(response => {
                    console.log("Dados do usuário:", response.data); // Exibir os dados do usuário
                    setUserEmail(response.data.email); // Definir o email do usuário
                    setUserName(response.data.name); // Definir o nome do usuário
                })
                .catch(error => {
                    console.error("Erro ao buscar dados do usuário:", error);
                });
        }
    }, []);

    const handleLogout = async () => {
        // Remove o token e os dados do usuário do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');

        // Limpa os dados do usuário no estado
        setUserEmail(null);
        setUserName(null);

        // Limpa o carrinho no estado do front-end
        setCart([]);  // Limpa apenas o carrinho no front-end
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
                            <li className={styles.userEmail}>{userName} ({userEmail})</li>
                            <li>
                                <Link href="/monitorar-pedido">Monitorar Pedidos</Link> {/* Link para monitorar pedidos */}
                            </li>
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
