// pages/index.js
import Header from '../components/Header';
import ProductCatalog from '../components/ProductCard';

const catalogo = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>CATALOGO</h1>
                <ProductCatalog />
            </main>
        </div>
    );
};

export default catalogo;
