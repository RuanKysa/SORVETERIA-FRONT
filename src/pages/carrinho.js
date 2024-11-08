"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from "@/layout/layout";
import styles from '../styles/Carrinho.module.css'; // Adicione um arquivo CSS para o layout

export default function Carrinho() {
    const [cart, setCart] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    // Usando useEffect para acessar o localStorage apenas no cliente
    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            setUserEmail(email); // Armazena o email do usuário no estado
        }
    }, []);

    // Efeito para buscar o carrinho quando o email estiver disponível
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

    return (
        <Layout>
            <div className={styles.cartContainer}>
                <h1>Carrinho</h1>
                {cart ? (
                    cart.items.length > 0 ? (
                        cart.items.map(item => (
                            <div key={item.productId._id} className={styles.cartItem}>
                                <img
                                    src={`http://localhost:5000${item.productId.image}`} // Acesse a imagem através de item.productId.image
                                    alt={item.productId.name} // Acesse o nome do produto através de item.productId.name
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
            </div>
        </Layout>
    );
}
