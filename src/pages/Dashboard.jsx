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

      {/* Debug Information */}
      <div style={{ 
        padding: '10px', 
        marginBottom: '20px', 
        background: '#f0f0f0', 
        borderRadius: '5px',
        fontSize: '13px',
        fontFamily: 'monospace'
      }}>
        <strong>Debug Info:</strong> {debugInfo}
        <br />
        <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        <br />
        <strong>Error:</strong> {error || 'None'}
        <br />
        <strong>Records Count:</strong> {records.length}
      </div>

      {loading && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading vehicle records...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          color: 'red', 
          padding: '20px', 
          background: '#fee', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p><strong>Error:</strong> {error}</p>
          <div style={{ marginTop: '15px' }}>
            <p><strong>Quick Checks:</strong></p>
            <ol style={{ textAlign: 'left', fontSize: '14px' }}>
              <li>Is Spring Boot running? Check your IDE/terminal</li>
              <li>Try this link: <a href="http://localhost:8080/vehicle-records" target="_blank" rel="noopener noreferrer">http://localhost:8080/vehicle-records</a></li>
              <li>Check if port 8080 is in use by another app</li>
            </ol>
          </div>
        </div>
      )}

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