import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header';
import Home from './components/Header/Home';
import { DEBP } from './components/Header/DEBP';
import { Cartelera } from './components/Header/Cartelera';
import Personal from './components/Personal/Personal';
import Login from './components/InicioSecion/Login';
import Dashboard from './components/InicioSecion/Dashboard';
import AdminPanel from './components/InicioSecion/AdminPanel';
import UserUpdates from './components/InicioSecion/UserUpdates';
import { AuthProvider } from './components/AuthContext';  // Importa el AuthProvider
import MainArticle from './components/Inicio/MainArticle'; // Importa MainArticle si aún no lo has hecho
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <main className="px-4 pt-6 bg-amber-50">
      <AuthProvider>  {/* Envuelve todo en AuthProvider */}
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
            <Route path="/mainarticle" element={<MainArticle />} />  {/* Añade la ruta a MainArticle */}
          </Routes>
        </Router>
      </AuthProvider>
    </main>
  );
}

export default App;