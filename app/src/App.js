import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import ATrack from './components/atrack/atrack';
import MTrack from './components/mtrack/mtrack';
import Other from './components/other/other';
import Header from './components/header/header';
import './App.css';

function App() {
  return (
    <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/atrack" element={<ATrack />} />
          <Route path="/mtrack" element={<MTrack />} />
          <Route path="/other" element={<Other />} />
        </Routes>
    </HashRouter>
  );
}

export default App;
