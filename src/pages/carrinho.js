import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from "@/layout/layout";
import styles from '../styles/Carrinho.module.css';
import { useRouter } from 'next/router';

const CartItem = ({ item }) => (
    <div className={styles.cartItem}>
        <img
            src={`http://localhost:5000${item.productId.image}`}
            alt={item.productId.name}
            className={styles.productImage}
        />
        <h3>{item.productId.name}</h3>
        <p>Quantidade: {item.quantity}</p>
        <p>Preço: R${item.productId.price.toFixed(2)}</p>
    </div>
);

export default function Carrinho() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCart = async () => {
            const email = localStorage.getItem('userEmail');
            if (email) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/cart/${email}`);
                    setCart(response.data);
                } catch (error) {
                    console.error("Erro ao carregar o carrinho:", error);
                    setError("Erro ao carregar o carrinho. Tente novamente.");
                } finally {
                    setLoading(false);
                }
            } else {
                setError("Usuário não autenticado.");
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const calculateTotal = () => {
        return cart?.items.reduce(
            (totals, item) => ({
                totalQuantity: totals.totalQuantity + item.quantity,
                totalPrice: totals.totalPrice + item.quantity * item.productId.price,
            }),
            { totalQuantity: 0, totalPrice: 0 }
        );
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    const totals = calculateTotal();

    return (
        <Layout>
            <div className={styles.cartContainer}>
                <h1>Carrinho</h1>
                {loading ? (
                    <p>Carregando carrinho...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : cart && cart.items.length > 0 ? (
                    <>
                        {cart.items.map(item => (
                            <CartItem key={item.productId._id} item={item} />
                        ))}
                        <div className={styles.cartSummary}>
                            <p><strong>Total de Itens:</strong> {totals.totalQuantity}</p>
                            <p><strong>Valor Total:</strong> R${totals.totalPrice.toFixed(2)}</p>
                        </div>
                        <button onClick={handleCheckout} className={styles.checkoutButton}>
                            Finalizar Pedido
                        </button>
                    </>
                ) : (
                    <p>O carrinho está vazio.</p>
                )}
            </div>
        </Layout>
    );
}
