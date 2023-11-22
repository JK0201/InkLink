import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Lobby from './pages/lobby/Lobby';
import Login from './pages/login/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/lobby" element={<Lobby />} />
    </Routes>
  );
}

export default App;
