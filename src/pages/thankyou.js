import React from 'react';
import { useRouter } from 'next/router';
import Layout from "@/layout/layout";
import styles from '../styles/ThankYou.module.css';

const ThankYou = () => {
    const router = useRouter();

    const handleHomeRedirect = () => {
        router.push('/'); 
    };

    return (
        <Layout>
            <div className={styles.thankYouContainer}>
                <div className={styles.messageBox}>
                    <h1 className={styles.title}>Pedido Realizado com Sucesso!</h1>
                    <p className={styles.message}>
                        Muito obrigado! Seu pedido foi realizado com sucesso. Em breve, um dos nossos colaboradores entrará em contato para negociar o pagamento.
                    </p>
                    <button className={styles.homeButton} onClick={handleHomeRedirect}>
                        Voltar para a página inicial
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ThankYou;
