import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Add this at the very top of App.js or Dashboard.js `
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;