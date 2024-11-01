import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/UserCRUD.module.css';

const UserCRUD = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
        } catch (err) {
            setError('Erro ao buscar usuários.');
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
            if (editingUserId) {
                const updatedUser = await axios.put(`http://localhost:5000/api/users/${editingUserId}`, formData);
                setUsers(users.map(user => user._id === editingUserId ? updatedUser.data : user));
            } else {
                const newUser = await axios.post('http://localhost:5000/api/users/register', formData);
                setUsers([...users, { ...newUser.data.user, password: undefined }]);
            }
            setFormData({ name: '', email: '', password: '' });
            setEditingUserId(null);
        } catch (err) {
            setError('Erro ao salvar usuário.');
        }
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
        });
        setEditingUserId(user._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Você realmente deseja deletar este usuário?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                setError('Erro ao deletar usuário.');
            }
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Lista de Usuários</h2>

            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    className={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nome do Usuário"
                    required
                />
                <input
                    type="email"
                    name="email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    className={styles.input}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Senha"
                    required={!editingUserId}
                />
                <button type="submit" className={styles.button}>
                    {editingUserId ? 'Editar Usuário' : 'Adicionar Usuário'}
                </button>
            </form>

            <ul className={styles.ul}>
                {users.map(user => (
                    <li key={user._id} className={styles.li}>
                        <div className={styles.userInfo}>
                            <h3>{user.name}</h3>
                            <p>Email: {user.email}</p>
                        </div>
                        <div className={styles.userActions}>
                            <button className={styles.button} onClick={() => handleEdit(user)}>Editar</button>
                            <button className={styles.button} onClick={() => handleDelete(user._id)}>Excluir</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserCRUD;
