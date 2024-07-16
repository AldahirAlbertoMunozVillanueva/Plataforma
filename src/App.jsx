import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { DEBP } from './components/DEBP';
import { Cartelera } from './components/Cartelera';
import { Personal } from './components/Personal';

function App() {
  return (
    <Router>
      <Header />
      <main className="px-4 pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/debp" element={<DEBP />} />
          <Route path="/cartelera" element={<Cartelera />} />
          <Route path="/personal" element={<Personal />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;