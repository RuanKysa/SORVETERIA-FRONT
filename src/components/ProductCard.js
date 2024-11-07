import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../styles/ProductCart.module.css";

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
                                <button className={styles.iconButton}>
                                    <i className="fa fa-shopping-bag"></i>
                                </button>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => openModal(product)} >
                                    <i className="fa fa-eye"></i>
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
                        <button className={styles.button}>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
