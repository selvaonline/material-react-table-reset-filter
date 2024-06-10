import data from "./data.json";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
//import {EditAutocomplete} from './EditAutocomplete'

export function App() {
  const [tableData, setTableData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
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
        /** Actual API call goes here */

        // Simulate fetching data with setTimeout
        setTimeout(() => {
          // Simulated response data

          setTableData(data);
        }, 1000); // Simulate a delay of 1 second (1000 milliseconds)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function immediately inside useEffect

    // Since there's no cleanup needed, return an empty function
    return () => {};
  }, []);

  const onRowUpdate = async ({ row, values, table }) => {
    console.log("row", row, "values", values);

    // setTableData(tableData.map((d, i) => row.index === i ? {...values}: d))

    // table.setEditingRow(null);

    /** API call for updating the data */
    try {
      const response = await axios.put(`your_api_endpoint/${row.id}`, values);
      setTableData(
        tableData.map((d) => (d.id === row.id ? { ...response.data } : d))
      );
      table.setEditingRow(null);
    } catch (error) {
      console.error("Error updating row:", error);
    }
  };

  console.log("columnFilters", columnFilters);
  console.log("globalFilter", globalFilter);

  return (
    <div>
      <button onClick={resetFilters}>Reset Filters</button>
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
      />
    </div>
  );
}
