import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../styles/ProductCart.module.css";

const categories = [
    "PICOLES DE FRUTA",
    "PICOLES DE CREME",
    "BOLOS DE SORVETE",
    "POTES",
    "POTINHOS",
    "Todos"
];

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("Todos");

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

    const addToCart = (product) => {
        console.log(`Produto adicionado ao carrinho: ${product.name}`);
    };

    const filteredProducts = selectedCategory === "Todos" 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Catálogo de Produtos</h1>

            <nav className={styles.nav}>
                {categories.map(category => (
                    <button
                        key={category}
                        className={`${styles.navButton} ${selectedCategory === category ? styles.active : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </nav>

            <div className={styles.grid}>
                {filteredProducts.map((product) => (
                    <div key={product._id} className={styles.card}>
                        <img 
                            src={`http://localhost:5000${product.image}`} 
                            alt={product.name} 
                            className={styles.image} 
                        />
                        <h2 className={styles.productName}>{product.name}</h2>
                        <p className={styles.description}>{product.description}</p>
                        <p className={styles.price}>Preço: R${product.price.toFixed(2)}</p>
                        <button 
                            className={styles.addButton} 
                            onClick={() => addToCart(product)}
                        >
                            Adicionar ao Carrinho
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCatalog;
