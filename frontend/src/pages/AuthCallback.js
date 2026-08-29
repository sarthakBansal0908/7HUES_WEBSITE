import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const processed = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const hash = location.hash || window.location.hash;
    const match = hash.match(/session_id=([^&]+)/);
    const sessionId = match ? decodeURIComponent(match[1]) : null;
    if (!sessionId) {
      navigate('/admin', { replace: true });
      return;
    }
    (async () => {
      try {
        const res = await api.post('/auth/session', { session_id: sessionId });
        // clear the hash so it isn't reused
        window.history.replaceState(null, '', '/admin');
        navigate('/admin', { replace: true, state: { user: res.data } });
      } catch (e) {
        setError('Sign-in failed. Please try again.');
        setTimeout(() => navigate('/admin', { replace: true }), 1500);
      }
    })();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-charcoal grid place-items-center text-sand">
      <div className="font-display tracking-[0.4em] text-sm animate-pulse">
        {error || 'SIGNING YOU IN…'}
      </div>
    </div>
  );
}
