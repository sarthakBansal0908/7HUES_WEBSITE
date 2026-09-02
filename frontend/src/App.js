import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import './App.css';
import { api } from './lib/api';
import useLenis from './hooks/useLenis';
import Home from './pages/Home';
import Book from './pages/Book';
import Placeholder from './pages/Placeholder';
import InfoFAQ from './pages/InfoFAQ';
import Admin from './pages/Admin';
import AuthCallback from './pages/AuthCallback';

function SiteShell() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get('/content').then((res) => setContent(res.data)).catch(() => {});
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen bg-charcoal grid place-items-center">
        <div className="font-display tracking-[0.4em] text-sand/70 animate-pulse text-sm">7HUES</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home content={content} />} />
      <Route path="/book" element={<Book content={content} />} />
      <Route path="/expeditions" element={<Placeholder title="Expeditions" content={content} />} />
      <Route path="/destinations" element={<Placeholder title="Destinations" content={content} />} />
      <Route path="/experiences" element={<Placeholder title="Experiences" content={content} />} />
      <Route path="/info" element={<InfoFAQ content={content} />} />
      <Route path="/journal" element={<Placeholder title="Journal" content={content} />} />
      <Route path="/journal/:slug" element={<Placeholder title="Journal" content={content} />} />
      <Route path="/community" element={<Placeholder title="Our People" content={content} />} />
      <Route path="/privacy" element={<Placeholder title="Privacy Policy" content={content} />} />
      <Route path="/terms" element={<Placeholder title="Terms" content={content} />} />
      <Route path="*" element={<Placeholder title="Not Found" content={content} />} />
    </Routes>
  );
}

function App() {
  const location = useLocation();
  useLenis();

  // OAuth callback: process session_id BEFORE any auth-gated rendering
  if (location.hash && location.hash.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="App">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/*" element={<SiteShell />} />
        </Routes>
      </div>
    </MotionConfig>
  );
}

export default App;
