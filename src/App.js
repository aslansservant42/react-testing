import React, { useState } from "react";
import styled from "styled-components";
import { useTable } from "react-table";

import makeData from "./makeData";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, tableData }) {
  // Use the state and functions returned from useTable to build your UI
  const data = React.useMemo(() => tableData, [tableData]);

  //const data = React.useMemo(() => makeData(5), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName"
          },
          {
            Header: "Last Name",
            accessor: "lastName"
          }
        ]
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age"
          },
          {
            Header: "Visits",
            accessor: "visits"
          },
          {
            Header: "Status",
            accessor: "status"
          },
          {
            Header: "Profile Progress",
            accessor: "progress"
          }
        ]
      },
      {
        Header: "Result",
        accessor: "result"
      }
    ],
    []
  );

  const [tableData, setTableData] = useState(makeData(5));
  const [curRecordToUpdate, setCurRecordToUpdate] = useState(0);

  //const data = React.useMemo(() => makeData(5), []);
  //const delay = time => new Promise(res=>setTimeout(()=>res(),time));

  const reloadHandler = (e) => {
    e.preventDefault();
    console.log("tableata" + JSON.stringify(tableData, null, 1));
    console.log("curRecordToUpdate " + curRecordToUpdate);
    const newData = tableData.map((item, index) => {
      let calculation = item.result;
      if (index === curRecordToUpdate) {
        //await delay(500);
        calculation = calculation === undefined ? 0 : calculation + index;
      }
      //console.log('calculation: ' + calculation);
      return { ...item, result: calculation };
    });
    //console.log('newData' + JSON.stringify(newData, null, 1));
    setCurRecordToUpdate((curVal) =>
      curVal === tableData.length ? 0 : curRecordToUpdate + 1
    );
    setTableData(newData);
    //setTableData(makeData(6));
  };

  return (
    <Styles>
      <Table columns={columns} tableData={tableData} />
      <button onClick={reloadHandler}>Reload</button>
    </Styles>
  );
}

export default App;
