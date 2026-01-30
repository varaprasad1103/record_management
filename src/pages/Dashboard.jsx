import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const testEndpoint = async () => {
      setDebugInfo("Starting fetch...");
      
      try {
        const response = await fetch("http://localhost:8080/vehicle-records", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        setDebugInfo(`Response received. Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setDebugInfo(`Data received. Type: ${Array.isArray(data) ? 'Array' : typeof data}, Length: ${data?.length || 0}`);
        
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
        
      } catch (err) {
        setDebugInfo(`Error: ${err.name} - ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    };

    testEndpoint();
  }, []);

  const totalTrips = records.length;

  const totalDestination = records.reduce(
    (sum, record) => sum + (Number(record.destinationAmount) || 0),
    0
  );

  const totalProfit = records.reduce(
    (sum, record) => sum + (Number(record.profit) || 0),
    0
  );

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyProfit = records
    .filter(record => {
      if (!record.date) return false;
      const dateStr = Array.isArray(record.date) 
        ? `${record.date[0]}-${String(record.date[1]).padStart(2, '0')}`
        : record.date.toString().slice(0, 7);
      return dateStr === currentMonth;
    })
    .reduce((sum, record) => sum + (Number(record.profit) || 0), 0);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>


      {!loading && !error && (
        <div className="card-grid">
          <div className="card">
            <h3>Total Trips</h3>
            <p>{totalTrips}</p>
          </div>

          <div className="card">
            <h3>Total Destination</h3>
            <p>₹{totalDestination.toFixed(2)}</p>
          </div>

          <div className="card">
            <h3>Total Profit</h3>
            <p style={{ color: totalProfit >= 0 ? "green" : "red" }}>
              ₹{totalProfit.toFixed(2)}
            </p>
          </div>

          <div className="card">
            <h3>This Month Profit</h3>
            <p style={{ color: monthlyProfit >= 0 ? "green" : "red" }}>
              ₹{monthlyProfit.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;