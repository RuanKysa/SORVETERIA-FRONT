import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Auth.module.css';
import { useRouter } from 'next/router';
import Layout from '@/layout/layout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/users/login',
        {
          email,
          password,
        });

      // Armazenar o token de autenticação
      localStorage.setItem('token', response.data.token);
      console.log('Login bem-sucedido:', response.data);

      // Redirecionar para a página inicial após o login
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
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
            {/* {!user && (
            <button className={styles.googleButton} onClick={handleGoogleLogin}>
              Login com Google
            </button>
          )} */}
            {loading ? 'Carregando...' : 'Login'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </Layout>
  );
};

export default Login;
