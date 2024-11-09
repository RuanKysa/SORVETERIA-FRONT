"use client"

import ProductCRUD from '../components/ProductCRUD'
import Layout from '@/layout/layout'

export default function Admin() {
    return (
        <Layout>
            <>
                <h1>Admin Dashboard</h1>
                <section>
                    <ProductCRUD />
                </section>
            </>
        </Layout>
    )
}