"use client";

import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Auth.module.css';
import { useRouter } from 'next/router';
import Layout from '@/layout/layout';

const Auth = () => {
  const [formType, setFormType] = useState('login');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    name: '',
    cpf: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Formatação automática do CPF
  const formatCpf = (cpf) => {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // Formata
  };

  // Formatação automática do telefone
  const formatPhone = (phone) => {
    phone = phone.replace(/\D/g, ''); // Remove caracteres não numéricos
    return phone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4'); // Formata
  };

  // Atualização dos campos com formatação de CPF e Telefone
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setCredentials((prev) => ({ ...prev, cpf: formatCpf(value) }));
    } else if (name === 'phone') {
      setCredentials((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else {
      setCredentials((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validação dos campos
  const validateFields = () => {
    const newErrors = {};

    if (!credentials.email) {
      newErrors.email = 'Email é obrigatório.';
    } else if (!/\S+@(gmail\.com|outlook\.com|yahoo\.com)$/.test(credentials.email)) {
      newErrors.email = 'O email deve ser @gmail.com, @outlook.com ou @yahoo.com.';
    }

    if (!credentials.password) {
      newErrors.password = 'Senha é obrigatória.';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres.';
    }

    if (formType === 'register') {
      if (!credentials.name) newErrors.name = 'Nome é obrigatório.';
      
      if (!credentials.cpf) {
        newErrors.cpf = 'CPF é obrigatório.';
      } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(credentials.cpf)) {
        newErrors.cpf = 'CPF inválido.';
      }

      if (!credentials.phone) {
        newErrors.phone = 'Telefone é obrigatório.';
      } else if (!/^\(\d{2}\) \d{1} \d{4}-\d{4}$/.test(credentials.phone)) {
        newErrors.phone = 'Telefone inválido.';
      }
    }

    setErrors(newErrors);
    
    // Remove as mensagens de erro após 3 segundos
    setTimeout(() => setErrors({}), 3000);

    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: credentials.email,
        password: credentials.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', credentials.email);
      localStorage.setItem('userRole', response.data.role);
      router.push('/catalogo');
    } catch (error) {
      setErrors({ general: 'Erro ao fazer login. Verifique suas credenciais.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        cpf: credentials.cpf,
        phone: credentials.phone,
      });

      router.push('/login');
    } catch (error) {
      setErrors({ general: 'Erro ao registrar. Tente novamente.' });
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

        <form onSubmit={formType === 'login' ? handleLoginSubmit : handleRegisterSubmit}>
          {formType === 'register' && (
            <>
              <div>
                <label>Nome:</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="name"
                  value={credentials.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>
              <div>
                <label>CPF:</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="cpf"
                  value={credentials.cpf}
                  onChange={handleChange}
                  required
                />
                {errors.cpf && <p className={styles.error}>{errors.cpf}</p>}
              </div>
              <div>
                <label>Telefone:</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="phone"
                  value={credentials.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
              </div>
            </>
          )}
          <div>
            <label>Email:</label>
            <input
              className={styles.formInput}
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>
          <div>
            <label>Senha:</label>
            <input
              className={styles.formInput}
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>
          <button type="submit" className={styles.formButton} disabled={loading}>
            {loading ? 'Carregando...' : formType === 'login' ? 'Login' : 'Registrar'}
          </button>
          {errors.general && <p className={styles.error}>{errors.general}</p>}
        </form>
      </div>
    </Layout>
  );
};

export default Auth;
