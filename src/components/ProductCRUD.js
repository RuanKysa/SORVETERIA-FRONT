import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/ProductCRUD.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const ProductCRUD = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ 
        name: '', 
        price: '', 
        description: '', 
        image: null, 
        category: '' 
    });
    const [editingProductId, setEditingProductId] = useState(null);
    const [activeCategory, setActiveCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); 

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (err) {
            setError('Erro ao buscar produtos.');
            toast.error('Erro ao buscar produtos.'); 
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', formData.category); 
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingProductId) {
                await axios.put(`http://localhost:5000/api/products/${editingProductId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                fetchProducts();
                toast.success('Produto editado com sucesso!'); 
            } else {
                const response = await axios.post('http://localhost:5000/api/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setProducts([...products, response.data]);
                toast.success('Produto adicionado com sucesso!'); 
            }
            resetForm();
        } catch (err) {
            setError('Erro ao salvar produto.');
            toast.error('Erro ao salvar produto.'); 
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            image: null,
            category: product.category 
        });
        setEditingProductId(product._id);
        setIsModalOpen(true); 
    };

    const handleDelete = async (id) => {
        if (window.confirm('Você realmente deseja deletar este produto?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                setProducts(products.filter(product => product._id !== id));
                toast.success('Produto excluído com sucesso!'); 
            } catch (err) {
                setError('Erro ao deletar produto.');
                toast.error('Erro ao deletar produto.'); 
            }
        }
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const handleCloseCategory = () => {
        setActiveCategory('');
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', description: '', image: null, category: '' });
        setEditingProductId(null);
        setIsModalOpen(false); 
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const filteredProducts = activeCategory 
        ? products.filter(product => product.category === activeCategory)
        : [];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Lista de Produtos</h2>

            <div className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                <i className="fas fa-plus" /> Adicionar Produto
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={resetForm}>&times;</span>
                        <h3>{editingProductId ? 'Editar Produto' : 'Adicionar Produto'}</h3>
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
                            <select
                                name="category"
                                className={styles.select}
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione uma Categoria</option>
                                <option value="PICOLES DE FRUTA">PICOLES DE FRUTA</option>
                                <option value="PICOLES DE CREME">PICOLES DE CREME</option> 
                                <option value="POTES">POTES</option>
                            </select>
                            <input
                                type="file"
                                name="image"
                                className={styles.input}
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <button type="submit" className={styles.button}>
                                {editingProductId ? 'Editar Produto' : 'Adicionar Produto'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.categoryButtons}>
                <button className={styles.button} onClick={() => handleCategoryClick('PICOLES DE FRUTA')}>PICOLES DE FRUTA</button>
                <button className={styles.button} onClick={() => handleCategoryClick('PICOLES DE CREME')}>PICOLES DE CREME</button>
                <button className={styles.button} onClick={() => handleCategoryClick('POTES')}>POTES</button>
                {activeCategory && (
                    <button className={styles.buttonn} onClick={handleCloseCategory}>
                        <i className="fas fa-times" /> Fechar
                    </button>
                )}
            </div>

            {activeCategory && (
                <ul className={styles.ul}>
                    {filteredProducts.map(product => (
                        <li key={product._id} className={styles.li}>
                            <div className={styles.productInfo}>
                                <h3>{product.name}</h3>
                                <p>Preço: R${product.price}</p>
                                <p>Categoria: {product.category}</p>
                                <p>{product.description}</p>
                                {product.image && (
                                    <img
                                        src={`http://localhost:5000${product.image}`}
                                        alt={product.name}
                                        className={styles.image}
                                    />
                                )}
                            </div>
                            <div className={styles.productActions}>
                                <button className={styles.button} onClick={() => handleEdit(product)}>Editar</button>
                                <button className={styles.button} onClick={() => handleDelete(product._id)}>Excluir</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductCRUD;
