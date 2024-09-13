import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Component/Dashboard';
import ImageComponent from './Component/ImageComponent';
import Sidebar from './Component/SideBar';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/image" element={<ImageComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;