import { Link } from 'react-router-dom';
import burguerMenu from '../assets/icon-menu.svg';

export const NavBar = () => {
  return (
    <div>
      <ul className="bg-blue-400 hidden sm:flex text-[18] sm:w-[438px] sm:place-content-around sm:text-[16px] sm:items-center">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/debp">DEBP</Link></li>
        <li><Link to="/cartelera">Cartelera</Link></li>
        <li><Link to="/personal">Personal</Link></li>
      </ul>
      <img className='w-10 h-4 cursor-pointer sm:hidden' src={burguerMenu} alt="Menu hamburgesa" />
    </div>
  );
};
