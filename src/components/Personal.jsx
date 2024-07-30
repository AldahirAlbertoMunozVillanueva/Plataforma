import React from 'react';
import SimpleTable from './SimpleTable';
import data from '../assets/MOCK_DATA.json';

export const Personal = () => {
  const columns = [
    {
      header: "Foto",
      accessorKey: "photo",
      footer: "Foto de Personal",
      cell: ({ getValue }) => <img src={getValue()} alt="Personal" className="w-10 h-10 object-cover" />,
    },
    {
      header: "Personal Bibliotecario del estado de Campeche",
      columns: [
        {
          header: "Nombres",
          accessorKey: "first_name",
          footer: "Mi nombre",
        },
        {
          header: "Apellido",
          accessorKey: "last_name",
          footer: "Mi apellido",
        },
      ],
    },
    {
      header: "Cargos",
      accessorKey: "cargo",
      footer: "Mi email",
    },
    {
      header: "Turnos",
      accessorKey: "turno",
      footer: "Mi pais",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Esto es la página Personal</h1>
      <SimpleTable data={data} columns={columns} />
    </div>
  );
};
