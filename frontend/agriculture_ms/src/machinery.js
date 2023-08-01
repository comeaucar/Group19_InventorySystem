import React from 'react';
import './App.css';

const MachineryInventory = () => {
    const machineryInventoryData = [
      { id: 1, name: 'Tractor', quantity: 5, description: 'Heavy-duty tractor' },
      { id: 2, name: 'Harvester', quantity: 3, description: 'Harvesting machine' },
      { id: 3, name: 'Seeder', quantity: 10, description: 'Precision seeder' },
    ];
  
    return (
      <div>
        <h2>Machinery Inventory</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {machineryInventoryData.map((item) => (
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

  export default MachineryInventory;