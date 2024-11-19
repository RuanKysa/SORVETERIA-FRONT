import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userRole, setUserRole] = useState(null); 

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
                    setUserRole(response.data.role);
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário:", error);
                    localStorage.removeItem('token');
                    toast.error("Sessão inválida! Faça login novamente.", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            };
            fetchUserData();
        } else {
            console.log("Nenhum token encontrado, usuário não autenticado.");
            toast.info("Por favor, faça login para continuar.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, []);

    const handleLogout = () => {
        console.log("Realizando logout...");
        localStorage.removeItem('token');
        setUserEmail(null);
        setUserName(null);
        setUserRole(null); 
        toast.success("Você saiu com sucesso!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    return (
        <AuthContext.Provider value={{ userEmail, userName, userRole, handleLogout }}>
            <ToastContainer /> 
            {children}
        </AuthContext.Provider>
    );
};
