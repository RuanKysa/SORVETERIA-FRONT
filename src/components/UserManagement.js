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
  const [editUser, setEditUser] = useState(null); // Estado para edição de usuário
  const [showUsers, setShowUsers] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função para capturar os usuários do backend
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

  // Função para criar um novo usuário
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

  // Função para editar um usuário
  const handleEditUser = (user) => {
    setEditUser(user); // Preenche o estado com os dados do usuário para edição
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


  // Alternar a exibição da lista de usuários
  const toggleUserList = () => {
    setShowUsers(!showUsers);
  };

  // Lidar com a mudança de inputs do formulário
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

  // Carregar usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestão de Usuários</h1>

      {/* Formulário para criação de usuário */}
      <form onSubmit={handleCreateUser} className={styles.form}>
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleChange}
          placeholder="Nome"
          className={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          placeholder="Email"
          className={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
          placeholder="Senha"
          className={styles.input}
          required
        />
        <input
          type="text"
          name="cpf"
          value={newUser.cpf}
          onChange={handleChange}
          placeholder="CPF"
          className={styles.input}
          required
        />
        <input
          type="text"
          name="phone"
          value={newUser.phone}
          onChange={handleChange}
          placeholder="Telefone"
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Criando usuário...' : 'Criar Usuário'}
        </button>
      </form>

      {/* Formulário de edição de usuário */}
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

      {/* Botão para alternar a exibição da lista de usuários */}
      <button onClick={toggleUserList} className={styles.addButton}>
        {showUsers ? 'Ocultar usuários' : 'Mostrar usuários'}
      </button>

      {/* Exibir lista de usuários com carregamento */}
      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        showUsers && (
          <ul className={styles.ul}>
            {users.map((user) => (
              <li key={user._id} className={styles.li}>
                <div className={styles.productInfo}>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p>{user.phone}</p>
                </div>
                <div className={styles.productActions}>
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
