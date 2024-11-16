import styles from '../styles/Email.module.css';

export default function Newsletter() {
  return (
    <section className={styles.newsletterSection}>
      <div className={styles.content}>
        <div className={styles.imageLeft}>
        </div>
        <div className={styles.newsletter}>
          <h2>
            <span role="img" aria-label="ice-cream">
              🍦
            </span>{' '}
            Junte-se ao nosso boletim informativo
          </h2>
          <p>
            Cadastre-se hoje mesmo e tenha acesso a ofertas exclusivas e
            cupons de desconto!.
          </p>
          <form className={styles.form}>
            <input
              type="email"
              placeholder="Digite seu e-mail.."
              className={styles.emailInput}
            />
            <button type="submit" className={styles.subscribeButton}>
              Enviar
            </button>
          </form>
        </div>
        <div className={styles.imageRight}>
        </div>
      </div>
    </section>
  );
}
