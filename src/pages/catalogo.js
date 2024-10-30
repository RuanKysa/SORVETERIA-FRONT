import ProductCatalog from '../components/ProductCard';
import Layout from '@/layout/layout';

export default function catalogo() {
    return (
        <Layout>
            <div>
                <main>
                    <h1>CATALOGO</h1>
                    <ProductCatalog />
                </main>
            </div>
        </Layout>
    )
}
