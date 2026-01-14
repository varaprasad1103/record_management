/* import React, { useEffect, useState } from "react";
import "../styles/VehicleRecords.css";

function VehicleRecords() {
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    date: "",
    tokenNo: "",
    vehicleNo: "",
    rate: "",
    quantity: "",
    customerName: "",
    notes: ""
  });

  const loadRecords = () => {
    fetch("http://localhost:8080/vehicle-records")
      .then(res => res.json())
      .then(setRecords);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setForm({
      date: r.date || "",
      tokenNo: r.tokenNo || "",
      vehicleNo: r.vehicleNo || "",
      rate: r.rate || "",
      quantity: r.quantity || "",
      customerName: r.customerName || "",
      notes: r.notes || ""
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/vehicle-records/${id}`, {
      method: "DELETE"
    }).then(loadRecords);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      date: "",
      tokenNo: "",
      vehicleNo: "",
      rate: "",
      quantity: "",
      customerName: "",
      notes: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:8080/vehicle-records/${editingId}`
      : `http://localhost:8080/vehicle-records`;

    fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => {
      loadRecords();
      handleCancel();
    });
  };

  const totalPreview =
    form.rate && form.quantity ? Number(form.rate) * Number(form.quantity) : "";

  return (
    <div className="vehicle-container">
      <h2>Vehicle Records</h2>

      <form onSubmit={handleSubmit} className="vehicle-form">
        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <input name="tokenNo" placeholder="Token No" value={form.tokenNo} onChange={handleChange} />
        <input name="vehicleNo" placeholder="Vehicle No" value={form.vehicleNo} onChange={handleChange} />
        <input name="rate" placeholder="Rate" value={form.rate} onChange={handleChange} />
        <input name="quantity" placeholder="Qty" value={form.quantity} onChange={handleChange} />

        
        <input
          placeholder="Total"
          value={totalPreview}
          readOnly
        />

        <input name="customerName" placeholder="Customer Name" value={form.customerName} onChange={handleChange} />
        <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />

        <button type="submit">
          {editingId ? "Update" : "Save"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <table className="vehicle-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Token</th>
            <th>Vehicle</th>
            <th>Rate</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Customer</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.date}</td>
              <td>{r.tokenNo}</td>
              <td>{r.vehicleNo}</td>
              <td>{r.rate}</td>
              <td>{r.quantity}</td>
              <td>{r.total}</td>
              <td>{r.customerName}</td>
              <td>{r.notes}</td>
              <td>
                <button onClick={() => handleEdit(r)}>Edit</button>
                <button onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleRecords;
 */