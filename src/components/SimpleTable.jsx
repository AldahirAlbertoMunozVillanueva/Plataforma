import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

function SimpleTable({ data, columns }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div>
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
        placeholder="Buscar..."
      />
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-800 text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-4 cursor-pointer"
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: '⬆️',
                        desc: '⬇️',
                      }[header.column.getIsSorted() ?? null]}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="even:bg-gray-200">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4 border border-gray-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-800 text-white">
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((footer) => (
                <th key={footer.id} className="p-4">
                  {flexRender(
                    footer.column.columnDef.footer,
                    footer.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => table.setPageIndex(0)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Primer Pagina
        </button>
        <button
          onClick={() => table.previousPage()}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Pagina Anterior
        </button>
        <button
          onClick={() => table.nextPage()}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Pagina Siguiente
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Ultima Pagina
        </button>
      </div>
    </div>
  );
}

export default SimpleTable;
