import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from "@/layout/layout";
import styles from '../styles/Checkout.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

export default function Checkout() {
    const [cart, setCart] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userData, setUserData] = useState(null);
    const [address, setAddress] = useState({ cep: '', street: '', number: '', city: '', state: '', postalCode: '' });
    const [loading, setLoading] = useState(true);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        setUserEmail(email || null);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (userEmail && token) {
            setLoading(true);
            fetchCart();
            fetchUserData(token);
        }
    }, [userEmail]);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/${userEmail}`);
            setCart(response.data);
        } catch (error) {
            console.error("Erro ao carregar o carrinho:", error);
            toast.error("Não foi possível carregar o carrinho. Por favor, tente novamente."); 
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async (token) => {
        try {
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
            toast.error("Não foi possível carregar os dados do usuário. Verifique sua conexão e tente novamente."); 
        }
    };

    const fetchAddressByCEP = async () => {
        const sanitizedCEP = address.cep.replace(/\D/g, ''); 
        if (/^\d{8}$/.test(sanitizedCEP)) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${sanitizedCEP}/json/`);
                if (!response.data.erro) {
                    setAddress(prev => ({
                        ...prev,
                        street: response.data.logradouro,
                        city: response.data.localidade,
                        state: response.data.uf,
                        postalCode: sanitizedCEP,
                    }));
                } else {
                    toast.warning("CEP não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar o endereço pelo CEP:", error);
                toast.error("Erro ao buscar o endereço. Verifique o CEP e tente novamente."); 
            }
        }
    };

    const handleConfirmOrder = async () => {
        if (!userEmail) {
            toast.error("Erro: Usuário não identificado.");
            return;
        }
    
        if (!cart || cart.items.length === 0) {
            toast.warning("O carrinho está vazio!"); 
            return;
        }
    
        const { street, number, city, state, postalCode } = address;
        if (!street || !number || !city || !state || !postalCode) {
            toast.warning("Por favor, preencha todos os campos de endereço.");
            return;
        }
    
        setIsProcessingOrder(true);
        try {
            console.log("Dados do pedido:", {
                userEmail,
                items: cart.items,
                address: { street, number, city, state, postalCode }
            });
    
            const orderResponse = await axios.post('http://localhost:5000/api/orders', {
                userEmail,
                items: cart.items,
                address: { street, number, city, state, postalCode },
            });
            console.log("Resposta do pedido:", orderResponse.data);
    
            const clearCartResponse = await axios.delete('http://localhost:5000/api/cart/clear', { data: { userEmail } });
            console.log("Resposta ao limpar o carrinho:", clearCartResponse.data);
    
            localStorage.removeItem('cart');
            toast.success("Pedido confirmado com sucesso!"); 
    
            router.push('/thankyou');
        } catch (error) {
            console.error("Erro ao confirmar o pedido:", error);
            toast.error("Erro ao confirmar o pedido. Tente novamente."); 
        } finally {
            setIsProcessingOrder(false);
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
                                        aria-label={`Imagem de ${item.productId.name}`}
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
                        aria-label="CEP"
                    />
                    <input
                        type="text"
                        value={address.street}
                        onChange={(e) => handleChange('street', e.target.value)}
                        placeholder="Rua"
                        className={styles.inputField}
                        aria-label="Rua"
                    />
                    <input
                        type="text"
                        value={address.number}
                        onChange={(e) => handleChange('number', e.target.value)}
                        placeholder="Número"
                        className={styles.inputField}
                        aria-label="Número"
                    />
                    <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Cidade"
                        className={styles.inputField}
                        aria-label="Cidade"
                    />
                    <input
                        type="text"
                        value={address.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="Estado"
                        className={styles.inputField}
                        aria-label="Estado"
                    />
                </div>

                <button
                    onClick={handleConfirmOrder}
                    className={styles.confirmOrderButton}
                    disabled={isProcessingOrder}
                    aria-busy={isProcessingOrder}
                    aria-label="Botão para confirmar pedido"
                >
                    {isProcessingOrder ? 'Processando...' : 'Confirmar Pedido'}
                </button>
            </div>

            <ToastContainer position="top-center" autoClose={3000} /> 
        </Layout>
    );
}
