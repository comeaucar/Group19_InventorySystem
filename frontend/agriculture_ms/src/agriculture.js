import React from 'react';
import './App.css';

const AgricultureInventory = () => {
    const agricultureInventoryData = [
      { id: 1, name: 'Wheat', quantity: 100, description: 'High-quality wheat grains' },
      { id: 2, name: 'Corn', quantity: 75, description: 'Yellow corn kernels' },
      { id: 3, name: 'Rice', quantity: 120, description: 'Long-grain white rice' },
    ];
  
    return (
      <div>
        <h2>Agriculture Inventory</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {agricultureInventoryData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default AgricultureInventory;