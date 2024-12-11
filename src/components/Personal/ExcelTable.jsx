import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import * as XLSX from 'xlsx';
import supabase from '../client';
import { useAuth } from '../AuthContext';

const ExcelTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { isAdmin, session } = useAuth(); // Make sure to include session

  // Cargar datos al inicio
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: personalData, error } = await supabase
          .from('personal')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const parsedData = personalData.map(item => 
          item.datos_excel ? JSON.parse(item.datos_excel).datos : item
        ).flat();

        if (parsedData.length > 0) {
          const headers = Object.keys(parsedData[0]);
          const formattedColumns = headers.map(header => ({
            Header: header,
            accessor: header.toLowerCase().replace(/\s+/g, '_'),
            Cell: ({ value, row, column }) => {
              return isAdmin ? (
                <input
                  className="w-full border-none bg-transparent"
                  type="text"
                  defaultValue={value}
                  onBlur={(e) => updateData(row.index, column.id, e.target.value)}
                />
              ) : (
                value
              );
            }
          }));
          setColumns(formattedColumns);
          setData(parsedData);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Función para actualizar datos
  const updateData = (rowIndex, columnId, value) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value
          };
        }
        return row;
      })
    );
  };

  // Manejar carga de archivo
  const handleFileUpload = (e) => {
    if (!isAdmin) {
      alert('Solo los administradores pueden cargar archivos');
      return;
    }

    const file = e.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      const headers = jsonData[0];
      const formattedColumns = headers.map(header => ({
        Header: header,
        accessor: header.toLowerCase().replace(/\s+/g, '_'),
        Cell: ({ value, row, column }) => {
          return isAdmin ? (
            <input
              className="w-full border-none bg-transparent"
              type="text"
              defaultValue={value}
              onBlur={(e) => updateData(row.index, column.id, e.target.value)}
            />
          ) : (
            value
          );
        }
      }));
      
      const formattedData = jsonData.slice(1).map(row => 
        Object.fromEntries(
          headers.map((header, index) => [
            header.toLowerCase().replace(/\s+/g, '_'), 
            row[index]
          ])
        )
      );

      setColumns(formattedColumns);
      setData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  // Guardar datos en Supabase
  const saveToSupabase = async () => {
    if (!isAdmin) {
      alert('Solo los administradores pueden guardar datos');
      return;
    }

    setLoading(true);

    try {
      // Ensure we're using the authenticated user's ID
      const { error } = await supabase
        .from('personal')
        .insert({
          datos_excel: JSON.stringify({
            nombre_archivo: fileName,
            datos: data
          })
        });

      if (error) throw error;

      alert('Datos guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    
    const fileName = `Datos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Configuración de react-table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data
  });

  return (
    <div className="container mx-auto p-4">
      {isAdmin && (
        <div className="flex space-x-4 mb-4">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileUpload}
            className="p-2 border rounded flex-grow" 
          />
          {data.length > 0 && (
            <>
              <button 
                onClick={saveToSupabase}
                disabled={loading}
                className={`p-2 rounded ${
                  !loading 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Guardando...' : 'Guardar en Base de Datos'}
              </button>
              <button 
                onClick={exportToExcel}
                className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
              >
                Exportar Excel
              </button>
            </>
          )}
        </div>
      )}

      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="w-full border-collapse">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr 
                  key={headerGroup.getHeaderGroupProps().key}
                  {...headerGroup.getHeaderGroupProps()} 
                  className="bg-gray-200"
                >
                  {headerGroup.headers.map((column) => (
                    <th 
                      key={column.getHeaderProps().key}
                      {...column.getHeaderProps()} 
                      className="border p-2 text-left"
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr 
                    key={row.getRowProps().key}
                    {...row.getRowProps()} 
                    className="hover:bg-gray-100"
                  >
                    {row.cells.map((cell) => (
                      <td
                        key={cell.getCellProps().key}
                        {...cell.getCellProps()}
                        className="border p-2"
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No hay datos disponibles
        </div>
      )}
    </div>
  );
};

export default ExcelTable;