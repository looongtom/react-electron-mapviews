import React from 'react';
import { Link } from "react-router-dom"
import './App.css';
import 'leaflet/dist/leaflet.css'
import SimpleMap from './pages/SimpleMap';


function App() {
  return (
    <div className="App">
      <header className="app-header">
        <nav className="navigation">
          <Link className="nav-button" to="/">Màn hình chính</Link>
          <Link className="nav-button" to="/about">Thiết lập nhiệm vụ</Link>
          <Link className="nav-button" to="/management">Quản lý thông tin</Link>
        </nav>
      </header>
      <main className="main-content">
        <SimpleMap />
      </main>
    </div>
  );
}

export default App;
