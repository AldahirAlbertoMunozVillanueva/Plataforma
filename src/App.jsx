import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Se encarga para las rutas de las paginas de Home, DEBP, Cartelera y Personal
import { Header } from './components/Header';
import { Home } from './components/Home';
import { DEBP } from './components/DEBP';
import { Cartelera } from './components/Cartelera';
import { Personal } from './components/Personal';


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
        </Routes>
      
    </Router>
  </main>
  );
}

export default App;