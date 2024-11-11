import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/OrderDetails.module.css';
import { useRouter } from 'next/router';

export default function OrderDetails() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Para capturar erros
    const router = useRouter();
    const { orderId } = router.query;

    useEffect(() => {
        if (orderId) {
            console.log("Order ID recebido:", orderId); // Log para verificar o orderId
            fetchOrderDetails(orderId);
        }
    }, [orderId]);

    const fetchOrderDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error("Erro ao carregar detalhes do pedido:", error);
            setError("Erro ao carregar os detalhes do pedido. Verifique sua conexão ou tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Carregando detalhes do pedido...</p>;
    }

    if (error) {
        return <p>{error}</p>; // Exibe uma mensagem de erro, se houver
    }

    return (
        <div className={styles.orderDetailsContainer}>
            {order ? (
                <div>
                    <h1 className={styles.title}>Detalhes do Pedido #{order._id}</h1>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Data do Pedido:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

                    <div className={styles.address}>
                        <h2>Endereço de Entrega</h2>
                        <p>{order.address.street}, {order.address.number}</p>
                        <p>{order.address.city}, {order.address.state}</p>
                        <p>CEP: {order.address.postalCode}</p>
                    </div>

                    <div className={styles.itemsList}>
                        <h2>Itens do Pedido</h2>
                        {order.items.map(item => (
                            <div key={item.productId._id} className={styles.item}>
                                <p><strong>{item.productId.name}</strong></p>
                                <p>Quantidade: {item.quantity}</p>
                                <p>Preço: R${item.productId.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Pedido não encontrado.</p>
            )}
        </div>
    );
}
