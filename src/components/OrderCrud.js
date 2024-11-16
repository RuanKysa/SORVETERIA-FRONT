import React, { useState } from 'react';

function OrderForm() {
    const [userEmail, setUserEmail] = useState('');
    const [items, setItems] = useState([{ productId: '', quantity: 1, price: 0 }]);
    const [address, setAddress] = useState({ street: '', number: '', city: '', state: '', postalCode: '' });

    const handleAddItem = () => {
        setItems([...items, { productId: '', quantity: 1, price: 0 }]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const orderData = { userEmail, items, address };
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Fazer Pedido</h2>
            <input type="email" placeholder="Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
            <div>
                {items.map((item, index) => (
                    <div key={index}>
                        <input type="text" placeholder="Product ID" value={item.productId} onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].productId = e.target.value;
                            setItems(newItems);
                        }} required />
                        <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].quantity = e.target.value;
                            setItems(newItems);
                        }} required />
                        <input type="number" placeholder="Price" value={item.price} onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].price = e.target.value;
                            setItems(newItems);
                        }} required />
                    </div>
                ))}
                <button type="button" onClick={handleAddItem}>Adicionar Item</button>
            </div>
            <input type="text" name="street" placeholder="Rua" value={address.street} onChange={handleChange} required />
            <input type="text" name="number" placeholder="Número" value={address.number} onChange={handleChange} required />
            <input type="text" name="city" placeholder="Cidade" value={address.city} onChange={handleChange} required />
            <input type="text" name="state" placeholder="Estado" value={address.state} onChange={handleChange} required />
            <input type="text" name="postalCode" placeholder="CEP" value={address.postalCode} onChange={handleChange} required />
            <button type="submit">Fazer Pedido</button>
        </form>
    );
}

export default OrderForm;
