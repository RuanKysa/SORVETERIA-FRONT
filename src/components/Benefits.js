import styles from "@/styles/Benefits.module.css";

export default function Benefits() {
    const benefits = [
        {
            id: 1,
            icon: "fa-truck",
            title: "FRETE GRÁTIS",
            description: "Em pedidos acima de $ 150",
        },
        {
            id: 2,
            icon: "fa-wallet",
            title: "DINHEIRO NA ENTREGA",
            description: "Garantia de devolução de 100% do dinheiro",
        },
        {
            id: 3,
            icon: "fa-gift",
            title: "CARTÃO PRESENTE ESPECIAL",
            description: "Ofereça bônus especiais com presente",
        },
        {
            id: 4,
            icon: "fa-headset",
            title: "ATENDIMENTO AO CLIENTE 24/7",
            description: "Ligue para nós 42 999999-9999",
        },
    ];

    return (
        <div className={styles.benefitsContainer}>
            {benefits.map((benefit) => (
                <div key={benefit.id} className={styles.benefit}>
                    <i className={`fa ${benefit.icon} ${styles.icon}`}></i>
                    <h3 className={styles.title}>{benefit.title}</h3>
                    <p className={styles.description}>{benefit.description}</p>
                </div>
            ))}
        </div>
    );
}
