import React, { useEffect, useState } from "react";
import "../styles/RiceMills.css";

function DestinationCompanies({ openCompany }) {
  const API = "http://localhost:8080";

  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: "", location: "" });

  const loadCompanies = async () => {
    const res = await fetch(`${API}/destination-companies`);
    setCompanies(await res.json());
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API}/destination-companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", location: "" });
    loadCompanies();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this company?")) {
      await fetch(`${API}/destination-companies/${id}`, { method: "DELETE" });
      loadCompanies();
    }
  };

  return (
    <div className="ricemill-container">
      <h2>Create Destination Company</h2>

      <form className="ricemill-form" onSubmit={handleSubmit}>
        <input
          placeholder="Company Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <button type="submit">Create Company</button>
      </form>

      <h2>Destination Companies List</h2>

      <table className="ricemill-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No companies found
              </td>
            </tr>
          )}

          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.location}</td>
              <td>
                <button
                  className="open-btn"
                  onClick={() => openCompany(c.id)}
                >
                  Open
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DestinationCompanies;