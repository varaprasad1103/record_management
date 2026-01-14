import React, { useEffect, useState } from "react";
import "../styles/RiceMills.css";

function RiceMills({ openMill }) {
  const [mills, setMills] = useState([]);

  const [form, setForm] = useState({
    name: "",
    location: ""
  });

  const loadMills = () => {
    fetch("http://localhost:8080/ricemills")
      .then(res => res.json())
      .then(data => setMills(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadMills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/ricemills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        location: form.location,
        advanceAmount: 0,
        balanceAmount: 0
      })
    }).then(() => {
      loadMills();
      setForm({ name: "", location: "" });
    });
  };

  return (
    <div className="ricemill-container">

      <h2>Create Rice Mill</h2>

      <form className="ricemill-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Rice Mill Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <button type="submit">Create RiceMill</button>
      </form>

      <h2>Rice Mills List</h2>

      <table className="ricemill-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Open</th>
          </tr>
        </thead>

        <tbody>
          {mills.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.location}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => openMill(m.id)}
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default RiceMills;