"use client"

import Layout from "@/layout/layout";
import Email from "@/components/email"
import Benefits from "@/components/Benefits";
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout>
      <div className={styles.homePage}>
        
        {/* Seção sobre o sistema de revenda */}
        <section className={styles.resaleSystem}>
          <h2>Sistema de Revenda de Sorvetes</h2>
          <p>Nosso sistema de revenda é voltado para oferecer aos nossos parceiros uma linha completa de sorvetes e picolés de alta qualidade. Oferecemos condições exclusivas para revendedores, com suporte total para que você possa ter sucesso no seu negócio.</p>
          <p>Com opções de pedidos personalizáveis e suporte dedicado, garantimos que nossos produtos cheguem até você de maneira prática e eficiente, prontos para satisfazer seus clientes.</p>
        </section>

        {/* Seção com mapa e informações de contato */}
        <section className={styles.contactInfo}>
          <div className={styles.contactColumns}>
            
            {/* Coluna do mapa */}
            <div className={styles.mapColumn}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d891.0087895059953!2d-52.40273112901056!3d-25.404414342341532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94efcafe49f16053%3A0x53f55397db04feac!2sLic%20Sorveteria%20Q-Delicia%20Coca%20Q!5e0!3m2!1spt-BR!2sbr!4v1731179440291!5m2!1spt-BR!2sbr"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>

            <div className={styles.infoColumn}>
              <h3>Localização e Contato</h3>
              <p>Endereço: <a href="https://maps.app.goo.gl/cCe7vVr4Bs1nSqMV9" target="_blank" rel="noopener noreferrer">
              Rua Doutor Carmosino Vieira Branco, 
              123 - Bairro Cristo Rei, 
              Laranjeiras do Sul, PR</a>
              </p>
              <p>Telefone: (42) 99932-1125</p>
              <p>Email: contato@sorvetesqdelicia.com.br</p>
              <p>Horário de Atendimento: Segunda a Sexta, das 9h às 18h</p>
            </div>
            
          </div>
        </section>

      </div>
      <Benefits />
      <Email />
    </Layout>
  )
}
