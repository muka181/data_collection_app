import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [columns, setColumns] = useState(['Column 1', 'Column 2', 'Column 3']);
  const [columnValues, setColumnValues] = useState(['', '', '']);
  const [rows, setRows] = useState([]);

  return (
    <DataContext.Provider value={{
      columns, setColumns,
      columnValues, setColumnValues,
      rows, setRows,
    }}>
      {children}
    </DataContext.Provider>
  );
};
