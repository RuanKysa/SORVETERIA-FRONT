import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../styles/ProductCart.module.css";

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        // Aqui, você pode implementar a lógica para adicionar o produto ao carrinho.
        console.log(`Produto adicionado ao carrinho: ${product.name}`);
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Catálogo de Produtos</h1>
            <div className={styles.grid}>
                {products.map((product) => (
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
