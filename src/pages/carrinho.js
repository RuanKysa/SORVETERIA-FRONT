// Carrinho.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from "@/layout/layout";
import styles from '../styles/Carrinho.module.css';

export default function Carrinho() {
    const [cart, setCart] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            setUserEmail(email);
        }
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            if (userEmail) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/cart/${userEmail}`);
                    setCart(response.data);
                } catch (error) {
                    console.error("Erro ao carregar o carrinho:", error);
                }
            }
        };

        fetchCart();
    }, [userEmail]);

    const handleCheckout = () => {
        // Redireciona para a página de confirmação do pedido
        window.location.href = '/checkout';
    };

    return (
        <Layout>
            <div className={styles.cartContainer}>
                <h1>Carrinho</h1>
                {cart ? (
                    cart.items.length > 0 ? (
                        cart.items.map(item => (
                            <div key={item.productId._id} className={styles.cartItem}>
                                <img
                                    src={`http://localhost:5000${item.productId.image}`}
                                    alt={item.productId.name}
                                    className={styles.productImage}
                                />
                                <h3>{item.productId.name}</h3>
                                <p>Quantidade: {item.quantity}</p>
                                <p>Preço: R${item.productId.price.toFixed(2)}</p>
                            </div>
                        ))
                    ) : (
                        <p>O carrinho está vazio.</p>
                    )
                ) : (
                    <p>Carregando carrinho...</p>
                )}

                <button onClick={handleCheckout} className={styles.checkoutButton}>Finalizar Pedido</button>
            </div>
        </Layout>
    );
}
