"use client"

import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Auth.module.css';
import { useRouter } from 'next/router';
import Layout from '@/layout/layout';

const Auth = () => {
  const [formType, setFormType] = useState('login'); // Define o tipo do formulário (login ou registro)

  // States para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // States para registro
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const router = useRouter();

  // Função para login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      // Armazena o token e o email do usuário no localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email); // Salva o email do usuário

      console.log('Login bem-sucedido:', response.data);
      router.push('/'); // Redireciona após o login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  // Função para registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
        cpf,
        phone,
      });

      // Registra o usuário com sucesso e redireciona para a página inicial
      console.log('Registro bem-sucedido:', response.data);
      router.push('/');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setError('Erro ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{formType === 'login' ? 'Login' : 'Registrar'}</h1>

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.toggleButton} ${formType === 'login' ? styles.active : ''}`}
            onClick={() => setFormType('login')}
          >
            Login
          </button>
          <button
            className={`${styles.toggleButton} ${formType === 'register' ? styles.active : ''}`}
            onClick={() => setFormType('register')}
          >
            Registrar
          </button>
        </div>

        {formType === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div>
              <label>Email:</label>
              <input
                className={styles.formInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Senha:</label>
              <input
                className={styles.formInput}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.formButton} disabled={loading}>
              {loading ? 'Carregando...' : 'Login'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div>
              <label>Nome:</label>
              <input
                className={styles.formInput}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                className={styles.formInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Senha:</label>
              <input
                className={styles.formInput}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>CPF:</label>
              <input
                className={styles.formInput}
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Telefone:</label>
              <input
                className={styles.formInput}
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.formButton} disabled={loading}>
              {loading ? 'Carregando...' : 'Registrar'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        )}
      </div>
    </Layout>
  );
};

export default Auth;
