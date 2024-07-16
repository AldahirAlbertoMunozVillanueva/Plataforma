import logo from '../assets/logo.svg';
import { NavBar } from './NavBar';

export const Header = () => {
  return (
    <header className="bg-green-500 flex place-content-between items-center mb-14">
      <img src={logo} alt="Logo" />
      <h1>Esto es el header debe de ir un logo</h1>
      <NavBar />
    </header>
  );
};
