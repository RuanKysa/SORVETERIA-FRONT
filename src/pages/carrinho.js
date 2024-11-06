import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from "@/layout/layout";

export default function Carrinho() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cart');
                setCart(response.data.cart);
            } catch (error) {
                console.error("Erro ao carregar o carrinho:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    if (loading) return <div>Carregando...</div>;

    return (
        <Layout>
            <div>
                <h1>Carrinho</h1>
                <div className="carrinho">
                    {cart.length === 0 ? (
                        <p>O carrinho está vazio.</p>
                    ) : (
                        <ul>
                            {cart.map(item => (
                                <li key={item.productId}>
                                    <span>Produto ID: {item.productId}</span> -
                                    <span>Quantidade: {item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
}
