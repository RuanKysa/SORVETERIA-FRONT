import React from 'react';
import Layout from "@/layout/layout";
import styles from '../styles/ThankYou.module.css';

const ThankYou = () => {
    return (
        <Layout>
            <div className={styles.thankYouContainer}>
                <h1 className={styles.title}>Pagamento Realizado com Sucesso!</h1>
                <p className={styles.message}>Obrigado por sua compra! Seu pedido está sendo processado e será enviado em breve.</p>
                <button className={styles.homeButton} onClick={() => window.location.href = '/'}>Voltar para a página inicial</button>
            </div>
        </Layout>
    );
};

export default ThankYou;
