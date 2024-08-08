import React from 'react';

export const ArticleDEBP = ({ selectedLocation }) => {
  const renderContent = () => {
    switch (selectedLocation) {
      case 1:
        return (
          <div>
            <h2 className='text-[40px] leading-none font-bold sm:text-[58px]'>Biblioteca 1</h2>
            <p>debe de mostrar los datos de la biblioteca 1</p>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className='text-[40px] leading-none font-bold sm:text-[58px]'>Visión</h2>
            <p>debe de mostrar los datos de visión</p>
          </div>
        );
      default:
        return (
          <div>
            <h2 className='text-[40px] leading-none font-bold sm:text-[58px]'>Visitanos en redes sociales</h2>
            <p>debe de mostrar los datos de cómo visitar en redes sociales</p>
          </div>
        );
    }
  };

  return (
    <section>
      {renderContent()}
    </section>
  );
};
