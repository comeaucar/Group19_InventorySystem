import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Link } from 'react-router-dom';
import AgricultureInventory from './agriculture';
import MachineryInventory from './machinery';

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