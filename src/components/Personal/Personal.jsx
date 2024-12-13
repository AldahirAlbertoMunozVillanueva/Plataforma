import React from 'react';
import ExcelTable from './ExcelTable';

const Personal = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Directorio de la Red Estatal de las Bibliotecas</h1>
      <ExcelTable />
    </div>
  );
};

export default Personal;


