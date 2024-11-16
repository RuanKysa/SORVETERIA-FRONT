import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Token encontrado:", token); 

        if (token) {
            const fetchUserData = async () => {
                try {
                    console.log("Buscando dados do usuário com o token:", token);  
                    const response = await axios.get('http://localhost:5000/api/users/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    console.log("Dados do usuário recebidos:", response.data);  
                    setUserEmail(response.data.email);
                    setUserName(response.data.name);
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário:", error);
                }
            };
            fetchUserData();
        } else {
            console.log("Nenhum token encontrado, usuário não autenticado.");
        }
    }, []);

    const handleLogout = () => {
        console.log("Realizando logout...");
        localStorage.removeItem('token');
        setUserEmail(null);
        setUserName(null);
        console.log("Token removido.");
    };

    return (
        <AuthContext.Provider value={{ userEmail, userName, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
