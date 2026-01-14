import React, { useEffect, useState } from "react";
import "../styles/VehicleRecords.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


function VehicleRecords() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [filters, setFilters] = useState({
    date: "",
    vehicleNo: "",
    customerName: ""
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    fetch("http://localhost:8080/vehicle-records")
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setFiltered(data);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let temp = records;

    if (newFilters.date) {
      temp = temp.filter(r => r.date === newFilters.date);
    }

    if (newFilters.vehicleNo) {
      temp = temp.filter(r =>
        r.vehicleNo.toLowerCase().includes(newFilters.vehicleNo.toLowerCase())
      );
    }

    if (newFilters.customerName) {
      temp = temp.filter(r =>
        r.customerName.toLowerCase().includes(newFilters.customerName.toLowerCase())
      );
    }

    setFiltered(temp);
  };
  const exportToExcel = () => {
  const dataWithTotal = [
    ...filtered,
    {
      id: "",
      date: "",
      vehicleNo: "",
      customerName: "TOTAL",
      poNumber: "",
      sourceAmount: "",
      destinationAmount: totalDestination,
      profit: totalProfit
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(dataWithTotal);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "VehicleRecords");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const fileData = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
  });

  saveAs(fileData, "VehicleRecords.xlsx");
};


  const exportToPDF = () => {
  const doc = new jsPDF();

  doc.text("Vehicle Records Report", 14, 10);

  const tableColumn = [
    "ID",
    "Date",
    "Vehicle",
    "Customer",
    "PO No",
    "Source Amt",
    "Dest Amt",
    "Profit"
  ];

  const tableRows = filtered.map(r => [
    r.id,
    r.date,
    r.vehicleNo,
    r.customerName,
    r.poNumber,
    r.sourceAmount,
    r.destinationAmount,
    r.profit
  ]);

  // ➕ ADD TOTAL ROW
  tableRows.push([
    "",
    "",
    "",
    "TOTAL",
    "",
    "",
    totalDestination,
    totalProfit
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20
  });

  doc.save("VehicleRecords.pdf");
};
  

  const totalDestination = filtered.reduce(
    (sum, r) => sum + Number(r.destinationAmount || 0),
    0
  );

  const totalProfit = filtered.reduce(
    (sum, r) => sum + Number(r.profit || 0),
    0
  );


  return (
    <div className="vehicle-container">
      <h2>Vehicle Records</h2>

      {/* 🔹 Filters */}
      <div className="filter-bar">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />

        <input
          name="vehicleNo"
          placeholder="Vehicle No"
          value={filters.vehicleNo}
          onChange={handleFilterChange}
        />

        <input
          name="customerName"
          placeholder="Customer"
          value={filters.customerName}
          onChange={handleFilterChange}
        />
      </div>
      <button className="export-btn" onClick={exportToExcel}>
        Export Excel
      </button>
      <button className="export-btn pdf-btn" onClick={exportToPDF}>
        Export PDF
      </button>



      <table className="vehicle-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Vehicle</th>
            <th>Customer</th>
            <th>PO</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Profit</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.date}</td>
              <td>{r.vehicleNo}</td>
              <td>{r.customerName}</td>
              <td>{r.poNumber}</td>
              <td>₹{r.sourceAmount}</td>
              <td>₹{r.destinationAmount}</td>
              <td
                style={{
                  color: r.profit >= 0 ? "green" : "red",
                  fontWeight: "bold"
                }}
              >
                ₹{r.profit}
              </td>
            </tr>
          ))}
        </tbody>
        <tr style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
          <td colSpan="6" style={{ textAlign: "right" }}>
            TOTAL
          </td>
          <td>₹{totalDestination}</td>
          <td
            style={{
              color: totalProfit >= 0 ? "green" : "red"
            }}
          >
            ₹{totalProfit}
          </td>
        </tr>

      </table>
    </div>
  );
}

export default VehicleRecords;
