import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { DEBP } from './components/DEBP';
import { Cartelera } from './components/Cartelera';
import { Personal } from './components/Personal';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import UserUpdates from './components/UserUpdates';

function App() {
  return (
    <main className="px-4 pt-6">
      <Router>
        <Header /> {/* Aquí ya se incluye el NavBar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/debp" element={<DEBP />} />
          <Route path="/cartelera" element={<Cartelera />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/userupdates" element={<UserUpdates />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
