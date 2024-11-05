import ProductCatalog from '../components/ProductCard';
import Layout from '@/layout/layout';

export default function catalogo() {
    return (
        <Layout>
            <div>
                <main>
                    <ProductCatalog />
                </main>
            </div>
        </Layout>
    )
}
