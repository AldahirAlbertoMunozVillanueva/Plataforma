import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import  supabase  from './supabaseClient';

function Autenticacion() {
  const [authState, setAuthState] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthState('home');
      } else {
        setAuthState('login');
      }
    });
  }, []);

  return (
    <div>
      {authState === 'login' && <Login setAuthState={setAuthState} />}
      {authState === 'register' && <Register setAuthState={setAuthState} />}
    </div>
  );
}

export default Autenticacion;
