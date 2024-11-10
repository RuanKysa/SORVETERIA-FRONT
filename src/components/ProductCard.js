import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from "../styles/ProductCart.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faEye, faCartPlus } from '@fortawesome/free-solid-svg-icons';

// Definindo a lista de categorias
const categories = [
    "PICOLES DE FRUTA",
    "PICOLES DE CREME",
    "POTES",
    "Todos"
];

// Configuração global do Axios para evitar repetição da URL base
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api'
});

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [modalProduct, setModalProduct] = useState(null);
    const [quantity, setQuantity] = useState(1); // Estado para quantidade
    const [message, setMessage] = useState("");

    // Fetch de produtos
    const fetchProducts = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/products');
            setProducts(response.data);
        } catch (err) {
            setError('Erro ao carregar produtos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const openModal = useCallback((product) => {
        setModalProduct(product);
        setQuantity(1); // Resetar a quantidade quando abrir o modal
    }, []);

    const closeModal = useCallback(() => {
        setModalProduct(null);
    }, []);

    const addToCart = useCallback(async (product) => {
        const userEmail = localStorage.getItem('userEmail');
    
        if (!userEmail) {
            setMessage("Por favor, faça login para adicionar itens ao carrinho.");
            return;
        }
    
        try {
            await axiosInstance.post('/cart/add', {
                userEmail: userEmail,
                productId: product._id,
                quantity: quantity,
            });
    
            setMessage("Produto adicionado ao carrinho com sucesso!");
            setTimeout(() => setMessage(""), 3000);
    
            // Fechar o modal após adicionar ao carrinho
            closeModal();
        } catch (error) {
            setMessage("Erro ao adicionar produto ao carrinho.");
            console.error(error);
        }
    }, [quantity, closeModal]);

    const filteredProducts = selectedCategory === "Todos"
        ? products
        : products.filter(product => product.category === selectedCategory);

    if (loading) return <div className={styles.loading}>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Catálogo de Produtos</h1>

            {message && <div className={styles.message}>{message}</div>}

            <nav className={styles.buttonGroup}>
                {categories.map(category => (
                    <button
                        key={category}
                        className={`${styles.button} ${selectedCategory === category ? styles.active : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </nav>

            <div className={styles.productGrid}>
                {filteredProducts.map((product) => (
                    <div key={product._id} className={styles.productCard}>
                        <div className={styles.imageContainer}>
                            <img
                                src={`http://localhost:5000${product.image}`}
                                alt={product.name}
                                className={styles.productImage}
                            />
                            <div className={styles.iconOverlay}>
                                <button className={styles.iconButton} onClick={() => addToCart(product)}>
                                    <FontAwesomeIcon icon={faCartPlus} /> {/* Ícone do carrinho */}
                                </button>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => openModal(product)} >
                                    <FontAwesomeIcon icon={faEye} /> {/* Ícone de visualização */}
                                </button>
                            </div>
                        </div>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productPrice}>R${product.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>

            {modalProduct && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={closeModal}>×</button>
                        <img
                            src={`http://localhost:5000${modalProduct.image}`}
                            alt={modalProduct.name}
                            className={styles.modalImage}
                        />
                        <h3>{modalProduct.name}</h3>
                        <p>{modalProduct.description}</p>
                        <p><strong>Preço: </strong>R${modalProduct.price.toFixed(2)}</p>

                        <div className={styles.quantityControl}>
                            <button 
                                className={styles.quantityButton} 
                                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                            >
                                -
                            </button>
                            <span className={styles.quantity}>{quantity}</span>
                            <button 
                                className={styles.quantityButton} 
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>

                        <button className={styles.button} onClick={() => addToCart(modalProduct)}>
                            <FontAwesomeIcon icon={faCartPlus} /> Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
