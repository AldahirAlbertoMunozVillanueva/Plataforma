import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import burgerMenu from '../../assets/icon-menu.svg';
import closeBtn from '../../assets/icon-menu-close.svg';
import supabase from '../client';

export const NavBar = () => {
  const [menuClicked, setMenuClicked] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClick = () => {
    setMenuClicked(prevState => !prevState);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkAuth();
  }, []);

  return (
    <nav className="relative z-50 flex items-center"> {/* Añadido flex y items-center */}
      <ul
        className={`
          ${menuClicked ? 'hidden' : 'fixed'} 
          bg-red-950 
          top-0 
          right-0 
          w-[256px] 
          p-[24px] 
          h-full 
          text-[18px] 
          z-50
          sm:flex 
          sm:items-center 
          sm:w-[438px] 
          sm:place-content-around 
          sm:p-0 
          sm:h-auto 
          sm:relative 
          sm:text-[16px] 
          text-white
          shadow-lg
        `}
      >
        <li className={`${menuClicked ? 'hidden' : ''} cursor-pointer sm:hidden flex place-content-end`}>
          <img 
            className="w-8 h-8 mb-[87px]" 
            src={closeBtn} 
            onClick={handleClick} 
            alt="Cerrar menú" 
          />
        </li>
        <li className="mb-8 sm:mb-0">
          <Link className="hover:text-red-700" to="/">Inicio</Link>
        </li>
        <li className="mb-8 sm:mb-0">
          <Link className="hover:text-red-700" to="/debp">M.I.R.E.B.</Link>
        </li>
        <li className="mb-8 sm:mb-0">
          <Link className="hover:text-red-700" to="/cartelera">Cartelera</Link>
        </li>
        <li className="mb-8 sm:mb-0">
          <Link className="hover:text-red-700" to="/personal">D.R.E.B.</Link>
        </li>
        <li className="mb-8 sm:mb-0">
          <Link className="hover:text-red-700" to="/login">Inicio de sesión</Link>
        </li>
        {isLoggedIn && (
          <li className="mb-8 sm:mb-0">
            <Link className="hover:text-red-700" to="/dashboard">Panel</Link>
          </li>
        )}
      </ul>
      <img
        className={`${menuClicked ? '' : 'hidden'} w-10 h-4 cursor-pointer sm:hidden my-auto`} // Cambiado fixed por my-auto
        src={burgerMenu}
        onClick={handleClick}
        alt="Menú hamburguesa"
      />
    </nav>
  );
};