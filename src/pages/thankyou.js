import React from 'react';
import { useRouter } from 'next/router';
import Layout from "@/layout/layout";
import styles from '../styles/ThankYou.module.css';

const ThankYou = () => {
    const router = useRouter();

    const handleHomeRedirect = () => {
        router.push('/');  // Usando o Next.js para navegação
    };

    return (
        <Layout>
            <div className={styles.thankYouContainer}>
                <div className={styles.messageBox}>
                    <h1 className={styles.title}>Pagamento Realizado com Sucesso!</h1>
                    <p className={styles.message}>
                        Obrigado por sua compra! Seu pedido está sendo processado e será enviado em breve.
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
