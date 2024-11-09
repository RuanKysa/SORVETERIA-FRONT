// ProductCatalog.js

import React, { useEffect, useState } from 'react';
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

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [modalProduct, setModalProduct] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                setError('Erro ao carregar produtos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const openModal = (product) => {
        setModalProduct(product);
    };

    const closeModal = () => {
        setModalProduct(null);
    };

    const addToCart = async (product) => {
        const userEmail = localStorage.getItem('userEmail');

        if (!userEmail) {
            setMessage("Por favor, faça login para adicionar itens ao carrinho.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/cart/add', {
                userEmail: userEmail,
                productId: product._id,
                quantity: 1,
            });

            setMessage("Produto adicionado ao carrinho com sucesso!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Erro ao adicionar produto ao carrinho.");
            console.error(error);
        }
    };
    
    const filteredProducts = selectedCategory === "Todos"
        ? products
        : products.filter(product => product.category === selectedCategory);

    if (loading) return <div>Carregando...</div>;
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
