import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../styles/ProductCart.module.css"

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

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.container}>
            <h1>Catálogo de Produtos</h1>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <img src={product.image} alt={product.name} />
                        <div>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>Preço: R${product.price.toFixed(2)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductCatalog;
