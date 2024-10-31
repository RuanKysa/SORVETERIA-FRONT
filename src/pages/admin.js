import ProductCRUD from '../components/ProductCRUD'
import UserCRUD from '../components/UserCRUD'
import Layout from '@/layout/layout'

export default function Admin() {
    return (
        <Layout>
            <>
                <h1>Admin Dashboard</h1>
                <section>
                    <ProductCRUD />
                </section>
                <section>
                    <UserCRUD />
                </section>
            </>
        </Layout>
    )
}