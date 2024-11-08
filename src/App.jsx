import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { DEBP } from './components/DEBP';
import { Cartelera } from './components/Cartelera';
import { Personal } from './components/Personal';
import Login from './components/Login'; // Importa el componente Login
import Register from './components/Register'; // Importa el componente Register


function App() {
  return (
    <main className="px-4 pt-6">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/debp" element={<DEBP />} />
          <Route path="/cartelera" element={<Cartelera />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          
        </Routes>
      </Router>
    </main>
  );
}

export default App;
