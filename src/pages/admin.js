"use client"

import ProductCRUD from '../components/ProductCRUD'
import Layout from '@/layout/layout'
import OrderManagement from '@/components/OrderManagement'
export default function Admin() {
    return (
        <Layout>
            <>
                <h1>Admin Dashboard</h1>
                <section>
                    <ProductCRUD />
                </section>
                <section>
                    <OrderManagement />
                </section>

               
            </>
        </Layout>
    )
}