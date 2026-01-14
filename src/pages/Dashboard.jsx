import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/vehicle-records")
      .then(res => res.json())
      .then(data => setRecords(data));
  }, []);

  const totalTrips = records.length;

  const totalDestination = records.reduce(
    (s, r) => s + Number(r.destinationAmount || 0),
    0
  );

  const totalProfit = records.reduce(
    (s, r) => s + Number(r.profit || 0),
    0
  );

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyProfit = records
    .filter(r => r.date?.startsWith(currentMonth))
    .reduce((s, r) => s + Number(r.profit || 0), 0);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="card-grid">
        <div className="card">
          <h3>Total Trips</h3>
          <p>{totalTrips}</p>
        </div>

        <div className="card">
          <h3>Total Destination</h3>
          <p>₹{totalDestination}</p>
        </div>

        <div className="card">
          <h3>Total Profit</h3>
          <p style={{ color: totalProfit >= 0 ? "green" : "red" }}>
            ₹{totalProfit}
          </p>
        </div>

        <div className="card">
          <h3>This Month Profit</h3>
          <p style={{ color: monthlyProfit >= 0 ? "green" : "red" }}>
            ₹{monthlyProfit}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
    