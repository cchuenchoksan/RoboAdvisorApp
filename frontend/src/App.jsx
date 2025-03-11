import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar.jsx';
import HomePage from './pages/HomePage.jsx';
import ExploreFundsPage from './pages/ExploreFundsPage.jsx';
import OptimisePortPage from './pages/OptimisePortPage.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/ExploreFundsPage" element={<ExploreFundsPage />} />
        <Route path="/OptimisePortPage" element={<OptimisePortPage />} />
      </Routes>
    </Router>
  );
}

export default App;