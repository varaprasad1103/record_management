import React, { useEffect, useState } from "react";
import "../styles/RiceMills.css";

function DestinationCompanyDetails({ companyId, goBack }) {
  const API = "http://localhost:8080";

  const [company, setCompany] = useState(null);
  const [records, setRecords] = useState([]);
  const [sourceDispatches, setSourceDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    sourceDispatchId: "",
    date: "",
    vehicleNo: "",
    quantity: "",
    rate: "",
    poNumber: "",
  });

  const loadCompany = async () => {
    const res = await fetch(`${API}/destination-companies/${companyId}`);
    setCompany(await res.json());
  };

  const loadRecords = async () => {
    const res = await fetch(`${API}/destination-dispatch/company/${companyId}`);
    setRecords(await res.json());
  };

  const loadSourceDispatches = async () => {
    const res = await fetch(`${API}/source-dispatch`);
    setSourceDispatches(await res.json());
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadCompany(), loadRecords(), loadSourceDispatches()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ AUTO-FILL: When source dispatch changes, auto-fill vehicle and quantity
    if (name === "sourceDispatchId") {
      const selectedSource = sourceDispatches.find(
        (s) => s.id === parseInt(value)
      );

      if (selectedSource) {
        setForm((prev) => ({
          ...prev,
          sourceDispatchId: value,
          vehicleNo: selectedSource.vehicleNo || "",
          quantity: selectedSource.quantity || "",
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          sourceDispatchId: value,
          vehicleNo: "",
          quantity: "",
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${API}/destination-dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceDispatch: { id: Number(form.sourceDispatchId) },
          destinationCompany: { id: companyId },
          date: form.date,
          vehicleNo: form.vehicleNo,
          quantity: Number(form.quantity),
          rate: Number(form.rate),
          poNumber: form.poNumber,
        }),
      });

      setForm({
        sourceDispatchId: "",
        date: "",
        vehicleNo: "",
        quantity: "",
        rate: "",
        poNumber: "",
      });

      loadAll();
      alert("Dispatch record saved successfully!");
    } catch (error) {
      console.error("Error saving dispatch:", error);
      alert("Error saving dispatch: " + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!company) return null;

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  // Get selected source for display
  const selectedSource = sourceDispatches.find(
    (s) => s.id === parseInt(form.sourceDispatchId)
  );

  return (
    <div className="ricemill-container">
      <button onClick={goBack} className="cancel-btn">
        ⬅ Back
      </button>

      <h2>{company.name}</h2>
      <p>
        <b>Location:</b> {company.location}
      </p>

      <hr />

      <h2>Add Dispatch Record</h2>

      <form className="ricemill-form" onSubmit={handleSubmit}>
        <select
          name="sourceDispatchId"
          value={form.sourceDispatchId}
          onChange={handleChange}
          required
        >
          <option value="">Select Source Dispatch</option>
          {sourceDispatches.map((sd) => (
            <option key={sd.id} value={sd.id}>
              #{sd.id} - {sd.vehicleNo} - {formatDate(sd.date)} - ₹
              {sd.totalAmount?.toFixed(2)}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          name="vehicleNo"
          placeholder="Vehicle No"
          value={form.vehicleNo}
          onChange={handleChange}
          readOnly
          required
          style={{
            backgroundColor: "#f0f0f0",
            cursor: "not-allowed",
          }}
          title="Auto-filled from source dispatch"
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          readOnly
          required
          style={{
            backgroundColor: "#f0f0f0",
            cursor: "not-allowed",
          }}
          title="Auto-filled from source dispatch"
        />

        <input
          type="number"
          name="rate"
          placeholder="Rate"
          value={form.rate}
          onChange={handleChange}
          required
        />

        <input
          name="poNumber"
          placeholder="PO Number"
          value={form.poNumber}
          onChange={handleChange}
        />

        <button type="submit">Save</button>
      </form>

      {/* ✅ Show selected source info */}
      {selectedSource && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#e3f2fd",
            borderRadius: "5px",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        >
          <strong>Selected Source:</strong> #{selectedSource.id} | Vehicle:{" "}
          {selectedSource.vehicleNo} | Quantity: {selectedSource.quantity} kg |
          Rate: ₹{selectedSource.rate}
        </div>
      )}

      <h2>Records for {company.name}</h2>

      <table className="ricemill-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Vehicle</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
            <th>PO Number</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No dispatch records found
              </td>
            </tr>
          )}

          {records.map((r) => (
            <tr key={r.id}>
              <td>{formatDate(r.date)}</td>
              <td>{r.vehicleNo}</td>
              <td>{r.quantity}</td>
              <td>{r.rate}</td>
              <td>₹{r.totalAmount?.toFixed(2)}</td>
              <td>{r.poNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DestinationCompanyDetails;