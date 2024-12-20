import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/OrderManagement.module.css';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
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

    const updateOrderStatus = async (orderId, newStatus) => {
        setUpdatingStatus(true);
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            alert("Status atualizado com sucesso.");
        } catch (error) {
            console.error("Erro ao atualizar status do pedido:", error);
            alert("Erro ao atualizar status. Tente novamente.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const calculateTotalPrice = (items) => {
        return items.reduce((total, item) => total + item.quantity * item.productId.price, 0).toFixed(2);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Pendente":
                return styles.statusPendente;
            case "Processando":
                return styles.statusProcessando;
            case "Enviado":
                return styles.statusEnviado;
            case "Concluído":
                return styles.statusConcluido;
            default:
                return '';
        }
    };

    const toggleOrdersVisibility = () => {
        setShowOrders(!showOrders); 
    };

    return (
        <div className={styles.orderManagementContainer}>
            <h1 className={styles.title}>Gerenciamento de Pedidos</h1>
            
            <button className={styles.toggleButton} onClick={toggleOrdersVisibility}>
                {showOrders ? 'Esconder Pedidos' : 'Mostrar Pedidos'}
            </button>

            {loading ? (
                <p>Carregando pedidos...</p>
            ) : (
                showOrders && orders.map(order => (
                    <div key={order._id} className={styles.orderItem}>
                        <h2>Pedido #{order._id}</h2>
                        <p>Email do Usuário: {order.userEmail}</p>
                        <p className={getStatusClass(order.status)}>
                            Status Atual: {order.status}
                        </p>
                        <div className={styles.itemsList}>
                            <h3>Itens do Pedido:</h3>
                            {order.items.map(item => (
                                <div key={item.productId._id} className={styles.item}>
                                    <p>
                                        {item.productId.name} - 
                                        Quantidade: {item.quantity} - 
                                        Preço Unitário: R${item.productId.price.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className={styles.totalPrice}>
                            <strong>Preço Total:</strong> R${calculateTotalPrice(order.items)}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}
