import data from "./data.json";
import { useState, useMemo, useEffect, useRef } from "react";
import { MaterialReactTable } from "material-react-table";

export function App() {
  const [tableData, setTableData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [resetKey, setResetKey] = useState(0); // Key for forced re-render
  const tableRef = useRef(null);

  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
    setSorting([]);
    setResetKey((prevKey) => prevKey + 1); // Trigger re-render
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Id",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "age",
        header: "Age",
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setTableData(data);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    return () => {}; // Cleanup (not needed here)
  }, []);

  const onRowUpdate = async ({ row, values, table }) => {
    try {
      const response = await fetch(`http://localhost:3000/data/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const updatedData = await response.json();

      // Update tableData state based on response from server
      setTableData((prevTableData) =>
        prevTableData.map((d) => (d.id === row.id ? updatedData : d))
      );

      table.setEditingRow(null);
    } catch (error) {
      console.error("Error updating row:", error);
    }
  };

  return (
    <div>
      <button onClick={resetFilters}>Reset Filters & Sorting</button>
      <MaterialReactTable
        columns={columns}
        data={tableData}
        getRowId={(row) => row.id}
        enableEditing
        onEditingRowSave={onRowUpdate}
        autoResetAll={false}
        editDisplayMode="row"
        enableColumnFilters
        enableGlobalFilter
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        columnFilters={columnFilters}
        globalFilter={globalFilter}
        state={{ sorting }} // Connect sorting state
        onSortingChange={setSorting} // Update sorting state
        key={resetKey} // Force re-render on reset
        ref={tableRef}
      />
    </div>
  );
}
