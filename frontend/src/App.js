import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { api } from './lib/api';
import useLenis from './hooks/useLenis';
import Home from './pages/Home';
import Book from './pages/Book';
import Placeholder from './pages/Placeholder';

function App() {
  useLenis();
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get('/content').then((res) => setContent(res.data)).catch(() => {});
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen bg-charcoal grid place-items-center">
        <div className="font-display tracking-[0.4em] text-sand/70 animate-pulse text-sm">
          7HUES
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home content={content} />} />
        <Route path="/book" element={<Book content={content} />} />
        <Route path="/expeditions" element={<Placeholder title="Expeditions" content={content} />} />
        <Route path="/destinations" element={<Placeholder title="Destinations" content={content} />} />
        <Route path="/experiences" element={<Placeholder title="Experiences" content={content} />} />
        <Route path="/info" element={<Placeholder title="Info & FAQ" content={content} />} />
        <Route path="/journal" element={<Placeholder title="Journal" content={content} />} />
        <Route path="/journal/:slug" element={<Placeholder title="Journal" content={content} />} />
        <Route path="/community" element={<Placeholder title="Our People" content={content} />} />
        <Route path="/privacy" element={<Placeholder title="Privacy Policy" content={content} />} />
        <Route path="/terms" element={<Placeholder title="Terms" content={content} />} />
        <Route path="*" element={<Placeholder title="Not Found" content={content} />} />
      </Routes>
    </div>
  );
}

export default App;
