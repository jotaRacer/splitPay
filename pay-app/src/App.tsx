import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/setup" element={<div className="p-8 text-center"><h1>Setup Page</h1><p>Coming soon...</p></div>} />
          <Route path="/contribute" element={<div className="p-8 text-center"><h1>Contribute Page</h1><p>Coming soon...</p></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
