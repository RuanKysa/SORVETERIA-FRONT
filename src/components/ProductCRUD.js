// components/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/ProductCRUD.module.css'; // Importando o CSS

const ProductCRUD = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', price: '', description: '' });
    const [editingProductId, setEditingProductId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products'); // Ajuste a URL conforme necessário
            setProducts(response.data);
        } catch (err) {
            setError('Erro ao buscar produtos.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProductId) {
                const updatedProduct = await axios.put(`http://localhost:5000/api/products/${editingProductId}`, formData); // Atualiza o produto
                setProducts(products.map(product => 
                    product._id === editingProductId ? updatedProduct.data : product
                ));
            } else {
                const newProduct = await axios.post('http://localhost:5000/api/products', formData); // Adiciona um novo produto
                setProducts([...products, newProduct.data]); // Adiciona o novo produto à lista
            }
            setFormData({ name: '', price: '', description: '' });
            setEditingProductId(null);
        } catch (err) {
            setError('Erro ao salvar produto.');
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
        });
        setEditingProductId(product._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Você realmente deseja deletar este produto?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                setProducts(products.filter(product => product._id !== id)); // Remove o produto da lista local
            } catch (err) {
                setError('Erro ao deletar produto.');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Lista de Produtos</h2>

            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    className={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nome do Produto"
                    required
                />
                <input
                    type="number"
                    name="price"
                    className={styles.input}
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Preço"
                    required
                />
                <textarea
                    name="description"
                    className={styles.textarea}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descrição"
                    required
                />
                <button type="submit" className={styles.button}>{editingProductId ? 'Editar Produto' : 'Adicionar Produto'}</button>
            </form>

            <ul className={styles.ul}>
                {products.map(product => (
                    <li key={product._id} className={styles.li}>
                        <div className={styles.productInfo}>
                            <h3>{product.name}</h3>
                            <p>Preço: R${product.price}</p>
                            <p>{product.description}</p>
                        </div>
                        <div className={styles.productActions}>
                            <button className={styles.button} onClick={() => handleEdit(product)}>Editar</button>
                            <button className={styles.button} onClick={() => handleDelete(product._id)}>Excluir</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductCRUD;
