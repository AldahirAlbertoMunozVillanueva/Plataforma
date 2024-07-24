import { useState } from 'react';
import { Link } from 'react-router-dom';

import burgerMenu from '../assets/icon-menu.svg';
import closeBtn from '../assets/icon-menu-close.svg';

export const NavBar = () => {
  const [menuClicked, setMenuClicked] = useState(true);

  const handleClick = () => {
    setMenuClicked(prevState => !prevState);
  }

  return (
    <>
      <ul className={`${menuClicked ? 'hidden' : ''} absolute bg-white top-0 right-0 w-[256px] p-[24px] h-full text-[18px] sm:flex sm:items-center sm:w-[438px] sm:place-content-around sm:p-0 sm:h-auto sm:relative sm:text-[16px]`}>
        <li className={`${menuClicked ? 'hidden' : ''} cursor-pointer sm:hidden flex place-content-end`}>
          <img className='w-8 h-8 mb-[87px]' src={closeBtn} onClick={handleClick} alt="Cerrar menú" />
        </li>
        <li className='mb-8 sm:mb-0'><Link className='hover:text-SoftRed' to="/">Inicio</Link></li>
        <li className='mb-8 sm:mb-0'><Link className='hover:text-SoftRed' to="/debp">DEBP</Link></li>
        <li className='mb-8 sm:mb-0'><Link className='hover:text-SoftRed' to="/cartelera">Cartelera</Link></li>
        <li className='mb-8 sm:mb-0'><Link className='hover:text-SoftRed' to="/Personal Bibliotecario">Personal Bibliotecario</Link></li>
      </ul>
      <img className={`${menuClicked ? '' : 'hidden'} w-10 h-4 cursor-pointer sm:hidden`} src={burgerMenu} onClick={handleClick} alt="Menú hamburguesa" />
    </>
  );
};
