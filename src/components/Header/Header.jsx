import logo from '../../assets/logo.svg';
import { NavBar } from './NavBar';

export const Header = () => {
  return (
    <header className=" flex place-content-between items-center mb-14 bg-red-950">
      <img src={logo} alt="Logo" />
      
      <NavBar />
    </header>
  );
};