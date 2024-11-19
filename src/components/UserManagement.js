import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/UserManagement.module.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: ''
  });
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null); 
  const [showUsers, setShowUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/register', newUser);
      alert('Usuário criado com sucesso!');
      setNewUser({
        name: '',
        email: '',
        password: '',
        cpf: '',
        phone: ''
      });
      fetchUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setViewUser(null); 
  };

  const handleViewUser = (user) => {
    setViewUser(user); 
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/users/users/${editUser._id}`, editUser);
      alert('Usuário atualizado com sucesso!');
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserList = () => {
    setShowUsers(!showUsers);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSearchEmail = (e) => {
    setSearchEmail(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const closeModal = () => {
    setViewUser(null); 
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestão de Usuários</h1>

      <div className={styles.searchContainer}>
        <input
          type="email"
          value={searchEmail}
          onChange={handleSearchEmail}
          placeholder="Pesquisar por email"
          className={styles.input}
        />
      </div>


      {editUser && (
        <form onSubmit={handleUpdateUser} className={styles.form}>
          <input
            type="text"
            name="name"
            value={editUser.name}
            onChange={handleEditChange}
            placeholder="Nome"
            className={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            value={editUser.email}
            onChange={handleEditChange}
            placeholder="Email"
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            value={editUser.password}
            onChange={handleEditChange}
            placeholder="Senha"
            className={styles.input}
            required
          />
          <input
            type="text"
            name="cpf"
            value={editUser.cpf}
            onChange={handleEditChange}
            placeholder="CPF"
            className={styles.input}
            required
          />
          <input
            type="text"
            name="phone"
            value={editUser.phone}
            onChange={handleEditChange}
            placeholder="Telefone"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Atualizando usuário...' : 'Atualizar Usuário'}
          </button>
        </form>
      )}

      {viewUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>×</span>
            <h2>Detalhes do Usuário</h2>
            <p><strong>Nome:</strong> {viewUser.name}</p>
            <p><strong>Email:</strong> {viewUser.email}</p>
            <p><strong>Telefone:</strong> {viewUser.phone}</p>
            <p><strong>CPF:</strong> {viewUser.cpf}</p>
            <p><strong>Data de criação:</strong> {new Date(viewUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      <button onClick={toggleUserList} className={styles.button}>
        {showUsers ? 'Ocultar usuários' : 'Mostrar usuários'}
      </button>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        showUsers && (
          <ul className={styles.ul}>
            {filteredUsers.map((user) => (
              <li key={user._id} className={styles.li}>
                <div className={styles.productInfo}>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p>{user.phone}</p>
                </div>
                <div className={styles.productActions}>
                  <button onClick={() => handleViewUser(user)} className={styles.button}>
                    Visualizar
                  </button>
                  <button onClick={() => handleEditUser(user)} className={styles.button}>
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default UserManagement;
