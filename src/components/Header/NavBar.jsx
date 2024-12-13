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

  // Verifica si hay un usuario autenticado
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user); // Actualiza el estado según si hay un usuario autenticado
    };

    checkAuth();
  }, []);

  return (
    <>
      <ul
        className={`${menuClicked ? 'hidden' : ''} absolute bg-red-950 top-0 right-0 w-[256px] p-[24px] h-full text-[18px] sm:flex sm:items-center sm:w-[438px] sm:place-content-around sm:p-0 sm:h-auto sm:relative sm:text-[16px] text-white`}
      >
        <li className={`${menuClicked ? 'hidden' : ''} cursor-pointer sm:hidden flex place-content-end`}>
          <img className="w-8 h-8 mb-[87px]" src={closeBtn} onClick={handleClick} alt="Cerrar menú" />
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
          <Link className="hover:text-red-700" to="/login">Inicio de sesión y registro</Link>
        </li>
        {/* Muestra el enlace al Dashboard solo si el usuario ha iniciado sesión */}
        {isLoggedIn && (
          <li className="mb-8 sm:mb-0">
            <Link className="hover:text-red-700" to="/dashboard">Panel</Link>
          </li>
        )}
      </ul>
      <img
        className={`${menuClicked ? '' : 'hidden'} w-10 h-4 cursor-pointer sm:hidden`}
        src={burgerMenu}
        onClick={handleClick}
        alt="Menú hamburguesa"
      />
    </>
  );
};