import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
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

    const [paymentMethod, setPaymentMethod] = useState('');
    const [pixCode, setPixCode] = useState(null);
    const [creditCardData, setCreditCardData] = useState({ number: '', expiration: '', cvv: '' });
    const [showCreditCardModal, setShowCreditCardModal] = useState(false);

    const router = useRouter();

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

    const fetchAddressByCEP = async () => {
        if (cep.length === 8) {
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

    const generatePixCode = () => {
        const code = Math.random().toString(36).substring(2, 15);
        setPixCode(code);
    };

    const generateBoleto = () => {
        alert('Boleto gerado com sucesso. Por favor, imprima o boleto e realize o pagamento.');
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

        if (!paymentMethod) {
            alert("Por favor, selecione um método de pagamento.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/orders', {
                userEmail,
                items: cart.items,
                address: { street, number, city, state, postalCode },
            });

            await axios.delete('http://localhost:5000/api/cart/clear', { data: { userEmail } });

            localStorage.removeItem('cart');

            alert("Pedido confirmado com sucesso!");

            if (paymentMethod === 'pix') {
                generatePixCode();
            } else if (paymentMethod === 'creditCard') {
                alert('Por favor, preencha os dados do cartão de crédito.');
            } else if (paymentMethod === 'boleto') {
                generateBoleto();
            }

            router.push('/thankyou');

        } catch (error) {
            console.error("Erro ao confirmar o pedido:", error);
            alert("Erro ao confirmar o pedido. Tente novamente.");
        }
    };

    return (
        <Layout>
            <div className={styles.checkoutContainer}>
                <h1 className={styles.title}>Confirmação de Pedido</h1>
                {cart ? (
                    cart.items.length > 0 ? (
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
                ) : (
                    <p className={styles.loadingMessage}>Carregando carrinho...</p>
                )}

                <div className={styles.addressContainer}>
                    <h2 className={styles.sectionTitle}>Endereço de Entrega</h2>
                    <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        onBlur={fetchAddressByCEP}
                        placeholder="CEP"
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Rua"
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Número"
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Cidade"
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Estado"
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.paymentContainer}>
                    <h2 className={styles.sectionTitle}>Escolha a forma de pagamento</h2>
                    <select onChange={(e) => setPaymentMethod(e.target.value)} className={styles.selectField}>
                        <option value="">Selecione</option>
                        <option value="pix">Pix</option>
                        <option value="creditCard">Cartão de Crédito/Débito</option>
                        <option value="boleto">Boleto</option>
                    </select>

                    {paymentMethod === 'pix' && pixCode && <p className={styles.pixCode}>Código Pix: {pixCode}</p>}
                    {paymentMethod === 'creditCard' && (
                        <div>
                            <button onClick={() => setShowCreditCardModal(true)} className={styles.creditCardButton}>Informar Cartão</button>
                            {showCreditCardModal && (
                                <div className={styles.creditCardModal}>
                                    <h3 className={styles.modalTitle}>Informar Dados do Cartão</h3>
                                    <input
                                        type="text"
                                        placeholder="Número do Cartão"
                                        value={creditCardData.number}
                                        onChange={(e) =>
                                            setCreditCardData({ ...creditCardData, number: e.target.value })
                                        }
                                        className={styles.modalInput}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Validade"
                                        value={creditCardData.expiration}
                                        onChange={(e) =>
                                            setCreditCardData({ ...creditCardData, expiration: e.target.value })
                                        }
                                        className={styles.modalInput}
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        value={creditCardData.cvv}
                                        onChange={(e) =>
                                            setCreditCardData({ ...creditCardData, cvv: e.target.value })
                                        }
                                        className={styles.modalInput}
                                    />
                                    <button
                                        onClick={() => setShowCreditCardModal(false)}
                                        className={styles.closeModalButton}
                                    >
                                        Fechar
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button onClick={handleConfirmOrder} className={styles.confirmOrderButton}>Confirmar Pedido</button>
            </div>
        </Layout>
    );
}
