import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom"
import './App.css';
import 'leaflet/dist/leaflet.css'
import SimpleMap from './pages/SimpleMap';
import UserTable from './pages/Management/User';
import AreaTable from './pages/Management/Area';


function App() {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  const [selectedTable, setSelectedTable] = useState<'user' | 'area'>('user');

  const tabs: ('user' | 'area')[] = ['user', 'area'];

  const handlePreviousTab = () => {
    const currentIndex = tabs.indexOf(selectedTable);
    const previousIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setSelectedTable(tabs[previousIndex]);
  };

  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(selectedTable);
    const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    setSelectedTable(tabs[nextIndex]);
  };

  return (
    <div className="App">
      <header className="app-header">
        <nav className="navigation">
          <Link className="nav-button" to="/">Màn hình chính</Link>
          <Link className="nav-button" to="/about">Thiết lập</Link>
          <Link className="nav-button" to="/management">Quản lý thông tin</Link>
        </nav>
      </header>
      <main className="main-content">
        {isAboutPage ? (
          <div className="split-view">
            <div className="split-panel map-panel">
              <SimpleMap />
            </div>
            <div className="split-panel table-panel">
              <div className="button-group">
                <button 
                  className={`action-button ${selectedTable === 'user' ? 'active' : ''}`}
                  onClick={() => setSelectedTable('user')}
                >
                  User
                </button>
                <button 
                  className={`action-button ${selectedTable === 'area' ? 'active' : ''}`}
                  onClick={() => setSelectedTable('area')}
                >
                  Area
                </button>
                <button className="action-button">Button 3</button>
                <button className="action-button">Button 4</button>
                <button 
                  className="action-button nav-arrow-button"
                  onClick={handlePreviousTab}
                  title="Previous tab"
                >
                  &lt;
                </button>
                <button 
                  className="action-button nav-arrow-button"
                  onClick={handleNextTab}
                  title="Next tab"
                >
                  &gt;
                </button>
              </div>
              {selectedTable === 'user' ? <UserTable /> : <AreaTable />}
            </div>
          </div>
        ) : (
          <SimpleMap />
        )}
      </main>
    </div>
  );
}

export default App;
