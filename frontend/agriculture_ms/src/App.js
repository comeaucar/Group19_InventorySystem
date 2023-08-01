import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Link } from 'react-router-dom';

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

const App = () => {
  return (
    <div className="app">
      <header className="header">
        <h1>Agriculture Management System</h1>
      </header>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/agriculture">Agriculture Inventory</Link>
          </li>
          <li>
            <Link to="/machinery">Machinery Inventory</Link>
          </li>
        </ul>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/" element={<h2>Welcome to the Agriculture Management System</h2>} />
          <Route path="/agriculture" element={<AgricultureInventory />} />
          <Route path="/machinery" element={<MachineryInventory />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;