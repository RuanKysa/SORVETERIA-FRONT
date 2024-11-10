import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from "@/layout/layout";
import styles from '../styles/Checkout.module.css';

export default function Checkout() {
    const [cart, setCart] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userData, setUserData] = useState(null);
    const [address, setAddress] = useState({ cep: '', street: '', number: '', city: '', state: '', postalCode: '' });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        setUserEmail(email || null);
    }, []);

    useEffect(() => {
        if (userEmail) {
            setLoading(true);
            fetchCart();
            fetchUserData();
        }
    }, [userEmail]);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/${userEmail}`);
            setCart(response.data);
        } catch (error) {
            console.error("Erro ao carregar o carrinho:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(response.data);
            setAddress({
                ...address,
                postalCode: response.data.address?.postalCode || '',
                street: response.data.address?.street || '',
                city: response.data.address?.city || '',
                state: response.data.address?.state || '',
            });
        } catch (error) {
            console.error("Erro ao carregar os dados do usuário:", error);
        }
    };

    const fetchAddressByCEP = async () => {
        if (address.cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${address.cep}/json/`);
                if (!response.data.erro) {
                    setAddress(prev => ({
                        ...prev,
                        street: response.data.logradouro,
                        city: response.data.localidade,
                        state: response.data.uf,
                        postalCode: address.cep,
                    }));
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

        const { street, number, city, state, postalCode } = address;
        if (!street || !number || !city || !state || !postalCode) {
            alert("Por favor, preencha todos os campos de endereço.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/orders', {
                userEmail,
                items: cart.items,
                address: { street, number, city, state, postalCode },
            });

            await axios.delete('http://localhost:5000/api/cart/clear', { data: { userEmail } });
            localStorage.removeItem('cart');
            alert("Pedido confirmado com sucesso!");

            router.push('/thankyou');
        } catch (error) {
            console.error("Erro ao confirmar o pedido:", error);
            alert("Erro ao confirmar o pedido. Tente novamente.");
        }
    };

    const handleChange = (field, value) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Layout>
            <div className={styles.checkoutContainer}>
                <h1 className={styles.title}>Confirmação de Pedido</h1>
                {loading ? (
                    <p className={styles.loadingMessage}>Carregando...</p>
                ) : (
                    cart && cart.items.length > 0 ? (
                        <div className={styles.productsContainer}>
                            <h2 className={styles.sectionTitle}>Produtos</h2>
                            {cart.items.map((item) => (
                                <div key={item.productId._id} className={styles.cartItem}>
                                    <img
                                        src={`http://localhost:5000${item.productId.image}`}
                                        alt={item.productId.name}
                                        className={styles.productImage}
                                    />
                                    <h3 className={styles.productName}>{item.productId.name}</h3>
                                    <p className={styles.productQuantity}>Quantidade: {item.quantity}</p>
                                    <p className={styles.productPrice}>Preço: R${item.productId.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyCartMessage}>O carrinho está vazio.</p>
                    )
                )}

                <div className={styles.addressContainer}>
                    <h2 className={styles.sectionTitle}>Endereço de Entrega</h2>
                    <input
                        type="text"
                        value={address.cep}
                        onChange={(e) => handleChange('cep', e.target.value)}
                        onBlur={fetchAddressByCEP}
                        placeholder="CEP"
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={address.street}
                        onChange={(e) => handleChange('street', e.target.value)}
                        placeholder="Rua"
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={address.number}
                        onChange={(e) => handleChange('number', e.target.value)}
                        placeholder="Número"
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Cidade"
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={address.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="Estado"
                        className={styles.inputField}
                    />
                </div>

                <button onClick={handleConfirmOrder} className={styles.confirmOrderButton}>Confirmar Pedido</button>
            </div>
        </Layout>
    );
}
