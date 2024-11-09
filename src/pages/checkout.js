// pages/checkout.js

"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from "@/layout/layout";
import styles from '../styles/Checkout.module.css';

export default function Checkout() {
    const [cart, setCart] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userData, setUserData] = useState(null);

    const [cep, setCep] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');

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

        const fetchUserData = async () => {
            if (userEmail) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:5000/api/users/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserData(response.data);
                    setPostalCode(response.data.address?.postalCode || '');
                } catch (error) {
                    console.error("Erro ao carregar os dados do usuário:", error);
                }
            }
        };

        fetchCart();
        fetchUserData();
    }, [userEmail]);

    // Função para buscar o endereço pelo CEP
    const fetchAddressByCEP = async () => {
        if (cep.length === 8) {  // Verifica se o CEP tem 8 dígitos
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.data.erro) {
                    setStreet(response.data.logradouro);
                    setCity(response.data.localidade);
                    setState(response.data.uf);
                    setPostalCode(cep);
                } else {
                    alert("CEP não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar o endereço pelo CEP:", error);
                alert("Erro ao buscar o endereço. Verifique o CEP e tente novamente.");
            }
        }
    };

    const handleConfirmOrder = async () => {
        if (!userEmail) {
            alert("Erro: Usuário não identificado.");
            return;
        }

        if (!cart || cart.items.length === 0) {
            alert("O carrinho está vazio!");
            return;
        }

        if (!street || !number || !city || !state || !postalCode) {
            alert("Por favor, preencha todos os campos de endereço.");
            return;
        }

        try {
            // Envia o pedido
            const response = await axios.post('http://localhost:5000/api/orders', {
                userEmail,
                items: cart.items,
                address: { street, number, city, state, postalCode },
            });

            // Limpa o carrinho no banco de dados após o pedido ser confirmado
            await axios.delete('http://localhost:5000/api/cart/clear', {
                data: { userEmail }
            });

            // Limpar o carrinho no localStorage também
            localStorage.removeItem('cart');

            alert("Pedido confirmado com sucesso!");
            window.location.href = '/';
        } catch (error) {
            console.error("Erro ao confirmar o pedido:", error);
            alert("Erro ao confirmar o pedido. Tente novamente.");
        }
    };

    return (
        <Layout>
            <div className={styles.checkoutContainer}>
                <h1>Confirmação de Pedido</h1>
                {cart ? (
                    cart.items.length > 0 ? (
                        <div>
                            <h2>Produtos</h2>
                            {cart.items.map((item) => (
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
                            ))}
                        </div>
                    ) : (
                        <p>O carrinho está vazio.</p>
                    )
                ) : (
                    <p>Carregando carrinho...</p>
                )}

                <div className={styles.addressContainer}>
                    <h2>Endereço de Entrega</h2>
                    <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        onBlur={fetchAddressByCEP}
                        placeholder="CEP"
                    />
                    <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Rua"
                    />
                    <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Número"
                    />
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Cidade"
                    />
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Estado"
                    />
                </div>

                <button onClick={handleConfirmOrder} className={styles.confirmOrderButton}>
                    Confirmar Pedido
                </button>
            </div>
        </Layout>
    );
}
