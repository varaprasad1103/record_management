import React, { useEffect, useState } from "react";
import "../styles/RiceMills.css";

function RiceMillDetails({ millId, goBack }) {

  const [mill, setMill] = useState(null);
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    date: "",
    vehicleNo: "",
    quantity: "",
    rate: ""
  });

  // Load mill info
  useEffect(() => {
    fetch(`http://localhost:8080/ricemills/${millId}`)
      .then(res => res.json())
      .then(data => setMill(data));
  }, [millId]);

  // Load records
  const loadRecords = () => {
    fetch(`http://localhost:8080/source-dispatch/ricemill/${millId}`)
      .then(res => res.json())
      .then(data => setRecords(data));
  };

  useEffect(() => {
    loadRecords();
  }, [millId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    fetch("http://localhost:8080/source-dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        rate: Number(form.rate),
        riceMill: { id: millId }
      })
    }).then(() => {
      setForm({ date: "", vehicleNo: "", quantity: "", rate: "" });
      loadRecords();
    });
  };

  if (!mill) return null;

  return (
    <div className="ricemill-container">

      <button onClick={goBack} className="cancel-btn">⬅ Back</button>

      <h2>{mill.name}</h2>

      <p><b>Location:</b> {mill.location}</p>
      <p><b>Advance:</b> ₹{mill.advanceAmount}</p>
      <p><b>Balance:</b> ₹{mill.balanceAmount}</p>

      <hr />

      <h2>Add Dispatch Record</h2>

      <form className="ricemill-form" onSubmit={handleSubmit}>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input name="vehicleNo" placeholder="Vehicle No" value={form.vehicleNo} onChange={handleChange} />
        <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <input type="number" name="rate" placeholder="Rate" value={form.rate} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>

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
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.vehicleNo}</td>
              <td>{r.quantity}</td>
              <td>{r.rate}</td>
              <td>₹{r.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default RiceMillDetails;
