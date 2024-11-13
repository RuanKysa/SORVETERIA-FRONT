import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/OrderManagement.module.css';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOrders, setShowOrders] = useState(false); 

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
            alert("Erro ao carregar pedidos. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    const toggleOrdersVisibility = () => {
        setShowOrders(!showOrders); 
    };

    return (
        <div className={styles.orderManagementContainer}>
            <h1 className={styles.title}>Meus Pedidos</h1>
            
            <button className={styles.toggleButton} onClick={toggleOrdersVisibility}>
                {showOrders ? 'Esconder Pedidos' : 'Mostrar Pedidos'}
            </button>

            {loading ? (
                <p>Carregando pedidos...</p>
            ) : (
                showOrders && orders.map(order => (
                    <div key={order._id} className={styles.orderItem}>
                        <h2>Pedido #{order._id}</h2>
                        <p className={getStatusClass(order.status)}>
                            Status Atual: {order.status}
                        </p>
                        <div className={styles.itemsList}>
                            <h3>Itens do Pedido:</h3>
                            {order.items.map(item => (
                                <div key={item.productId._id} className={styles.item}>
                                    <p>{item.productId.name} - Quantidade: {item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
