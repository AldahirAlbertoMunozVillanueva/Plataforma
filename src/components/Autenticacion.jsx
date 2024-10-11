import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function App() {
  const [authState, setAuthState] = useState('login'); // 'login' or 'register'

  return (
    <div>
      {authState === 'login' && <Login setAuthState={setAuthState} />}
      {authState === 'register' && <Register setAuthState={setAuthState} />}
    </div>
  );
}

export default App;
