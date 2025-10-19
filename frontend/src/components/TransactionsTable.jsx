import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

// TODO: Add sorting, pagination and filtering features
// TODO: Add horizontal and vertical scroll bars

function TransactionsTable({ data = [], direction = 'out' }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'blockNum',
        header: 'Block Number',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'uniqueId',
        header: 'Unique Id',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'hash',
        header: 'Hash',
        cell: (info) => {
          const hash = info.getValue();
          return hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : '-';
        },
      },
      {
        accessorKey: 'from',
        header: 'From',
        cell: (info) => {
          const address = info.getValue();
          return address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '-';
        },
      },
      {
        accessorKey: 'to',
        header: 'To',
        cell: (info) => {
          const address = info.getValue();
          return address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '-';
        },
      },
      {
        accessorKey: 'direction',
        header: 'In/Out',
        cell: () => {         
          return (
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                direction === 'in'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {direction === 'in' ? 'In' : 'Out'}
            </span>
          );
        },
      },
      {
        accessorKey: 'value',
        header: 'Amount',
        cell: (info) => {
          const value = info.getValue();
          return value ? parseFloat(value).toFixed(6) : '0';
        },
      },
      {
        accessorKey: 'asset',
        header: 'Asset',
        cell: (info) => info.getValue() || 'ETH',
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500 last:border-r-0"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, index) => (
            <tr 
              key={row.id} 
              className={`
                ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}
                hover:bg-blue-50 transition-colors duration-150
              `}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 last:border-r-0"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-gray-50">
          <p className="text-lg font-medium">No transactions found</p>
        </div>
      )}
    </div>
  );
}

export default TransactionsTable;
