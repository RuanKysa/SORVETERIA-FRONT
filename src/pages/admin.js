import ProductCRUD from '../components/ProductCRUD'
import UserCRUD from '../components/UserCRUD'

export default function Admin() {
    return (
        <>
            <h1>Admin Dashboard</h1>
            <section>
                <ProductCRUD />
            </section>
            <section>
                <UserCRUD />
            </section>

        </>
    )
}