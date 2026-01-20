import React, { useEffect, useState } from "react";
import "../styles/RiceMills.css";

function RiceMillDetails({ millId, goBack }) {

  const API = "http://localhost:8080";

  const [mill, setMill] = useState(null);
  const [records, setRecords] = useState([]);
  const [advances, setAdvances] = useState([]);

  const [advanceInput, setAdvanceInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [advanceTotal, setAdvanceTotal] = useState(0);

  const [form, setForm] = useState({
    date: "",
    vehicleNo: "",
    quantity: "",
    rate: ""
  });

  // ---------------- LOADERS ----------------

  const reloadMill = async () => {
    const res = await fetch(`${API}/ricemills/${millId}`);
    setMill(await res.json());
  };

  const loadRecords = async () => {
    const res = await fetch(`${API}/source-dispatch/ricemill/${millId}`);
    setRecords(await res.json());
  };

  const loadAdvances = async () => {
  const res = await fetch(`${API}/ricemills/${millId}/advances`);
  const data = await res.json();

  console.log("ADVANCES FROM API:", data);

  setAdvances(data);

  const total = data.reduce((sum, a) => sum + Number(a.amount || 0), 0);
  setAdvanceTotal(total);
};


  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      reloadMill(),
      loadRecords(),
      loadAdvances()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [millId]);

  // ---------------- HANDLERS ----------------

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ADD ADVANCE
  const handleAdvanceSubmit = async e => {
    e.preventDefault();

    await fetch(`${API}/ricemills/${millId}/advance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(advanceInput),
        date: new Date().toISOString().slice(0, 10)
      })
    });

    setAdvanceInput("");
    loadAdvances();
  };

  // ADD DISPATCH
  const handleSubmit = async e => {
    e.preventDefault();

    await fetch(`${API}/source-dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        rate: Number(form.rate),
        riceMill: { id: millId }
      })
    });

    setForm({ date: "", vehicleNo: "", quantity: "", rate: "" });
    loadRecords();
  };

  if (loading) return <p>Loading...</p>;
  if (!mill) return null;

  const totalDispatch = records.reduce(
    (sum, r) => sum + (r.totalAmount || r.quantity * r.rate || 0),
    0
  );

  const balance = totalDispatch - advanceTotal;

  const formatDate = d => new Date(d).toLocaleDateString();

  return (
    <div className="ricemill-container">

      <button onClick={goBack} className="cancel-btn">⬅ Back</button>

      <h2>{mill.name}</h2>

      <p><b>Location:</b> {mill.location}</p>

      <p><b>Total Dispatch:</b> ₹{totalDispatch.toFixed(2)}</p>

      <p><b>Advance:</b> ₹{advanceTotal.toFixed(2)}</p>

      <p>
        <b>
          Balance:
          {balance >= 0
            ? ` ₹${balance.toFixed(2)}`
            : ` ₹${Math.abs(balance).toFixed(2)} (Due)`
          }
        </b>
      </p>

      <hr />

      {/* ADVANCE FORM */}
      <h2>Add Advance</h2>

      <form className="ricemill-form" onSubmit={handleAdvanceSubmit}>
        <input
          type="number"
          placeholder="Advance Amount"
          value={advanceInput}
          onChange={e => setAdvanceInput(e.target.value)}
          required
        />
        <button type="submit">Add Advance</button>
      </form>

      {/* ADVANCE TABLE */}
      <h2>Advance Records</h2>

      <table className="ricemill-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>

          {advances.length === 0 && (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No advances found
              </td>
            </tr>
          )}

          {advances.map(a => (
            <tr key={a.id}>
              <td>{formatDate(a.date)}</td>
              <td>₹{a.amount.toFixed(2)}</td>
            </tr>
          ))}

        </tbody>
      </table>

      <hr />

      {/* DISPATCH FORM */}
      <h2>Add Dispatch Record</h2>

      <form className="ricemill-form" onSubmit={handleSubmit}>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input name="vehicleNo" placeholder="Vehicle No" value={form.vehicleNo} onChange={handleChange} />
        <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <input type="number" name="rate" placeholder="Rate" value={form.rate} onChange={handleChange} required />
        <button type="submit">Save</button>
      </form>

      {/* DISPATCH TABLE */}
      <h2>Records for {mill.name}</h2>

      <table className="ricemill-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Vehicle</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>

          {records.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No dispatch records found
              </td>
            </tr>
          )}

          {records.map(r => (
            <tr key={r.id}>
              <td>{formatDate(r.date)}</td>
              <td>{r.vehicleNo}</td>
              <td>{r.quantity}</td>
              <td>{r.rate}</td>
              <td>₹{(r.totalAmount || r.quantity * r.rate).toFixed(2)}</td>
            </tr>
          ))}

        </tbody>
      </table>

    </div>
  );
}

export default RiceMillDetails;
