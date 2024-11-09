"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Layout from "@/layout/layout";

export default function MonitorarPedido() {
    const [orderId, setOrderId] = useState('');
    const [orderStatus, setOrderStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrackOrder = async () => {
        const email = localStorage.getItem('userEmail');  // Obtendo o email do localStorage ou do estado
    
        if (!email) {
            console.error('Email não encontrado!');
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/status/${email}`);
            setOrderStatus(response.data.status); // Atualiza o status do pedido com a resposta
        } catch (error) {
            console.error("Erro ao buscar o status do pedido:", error);
            setError("Não foi possível encontrar o pedido. Verifique o email e tente novamente.");
        }
    };
    

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <h1>Monitorar Pedido</h1>
                <input
                    type="text"
                    placeholder="Digite o ID do pedido"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    style={{ padding: '10px', width: '300px', marginRight: '10px' }}
                />
                <button onClick={handleTrackOrder} style={{ padding: '10px' }}>
                    Monitorar Pedido
                </button>

                {loading && <p>Carregando status do pedido...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {orderStatus && (
                    <div style={{ marginTop: '20px' }}>
                        <h2>Status do Pedido</h2>
                        <p>{orderStatus}</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
