// pages/register.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Auth.module.css';
import { useRouter } from 'next/router'; // Importando useRouter

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Inicializando o useRouter

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                name,
                email,
                password,
            });
            console.log('Registro bem-sucedido:', response.data);
            // Redirecionar para a página inicial após o registro
            router.push('/'); // Mudar a rota para a página inicial
        } catch (error) {
            console.error('Erro ao registrar:', error);
            setError('Erro ao registrar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Registro</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Carregando...' : 'Registrar'}
                </button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default Register;
