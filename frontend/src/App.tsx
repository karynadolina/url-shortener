import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UrlShortener from './components/UrlShortener';
import RedirectComponent from './components/RedirectComponent';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortener />} />

        <Route path="/:shortId" element={<RedirectComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
