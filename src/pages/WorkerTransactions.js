import React, { useEffect, useState } from "react";
import "../styles/WorkerTransactions.css";

function WorkerTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState("");

  const [form, setForm] = useState({
    workerName: "",
    date: "",
    workerType: "",
    type: "",
    amount: "",
    description: ""
  });

  const loadTransactions = () => {
    fetch("http://localhost:8080/worker-transactions")
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm({
      workerName: t.workerName,
      date: t.date,
      workerType: t.workerType,
      type: t.type,
      amount: t.amount,
      description: t.description
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      workerName: "",
      date: "",
      workerType: "",
      type: "",
      amount: "",
      description: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:8080/worker-transactions/${editingId}`
      : "http://localhost:8080/worker-transactions";

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount)
      })
    })
      .then(() => {
        loadTransactions();
        handleCancel();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/worker-transactions/${id}`, {
      method: "DELETE"
    })
      .then(() => loadTransactions())
      .catch(err => console.error(err));
  };

  // ✅ INLINE SUMMARY CALCULATION
  const calculateSummary = (workerName) => {
    const workerTx = transactions.filter(
      t => t.workerName === workerName
    );

    let earned = 0;
    let deducted = 0;

    workerTx.forEach(t => {
      if (t.type === "EARNING" || t.type === "ADJUSTMENT") {
        earned += Number(t.amount);
      } else {
        deducted += Number(t.amount);
      }
    });

    return {
      earned,
      deducted,
      balance: earned - deducted
    };
  };

  const summary = selectedWorker
    ? calculateSummary(selectedWorker)
    : null;

  return (
    <div className="worker-container">
      <h2>Worker Transactions</h2>

      {/* 🔹 Worker Summary */}
      {summary && (
        <div style={{ marginBottom: 20 }}>
          <strong>Summary for {selectedWorker}</strong>
          <div>Total Earned: ₹{summary.earned}</div>
          <div>Total Deducted: ₹{summary.deducted}</div>
          <div>
            Balance: ₹{summary.balance}{" "}
            {summary.balance > 0
              ? "(Pay Worker)"
              : summary.balance < 0
              ? "(Worker Owes)"
              : "(Settled)"}
          </div>
        </div>
      )}

      <form className="worker-form" onSubmit={handleSubmit}>
        <input
          name="workerName"
          placeholder="Worker Name"
          value={form.workerName}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <select
          name="workerType"
          value={form.workerType}
          onChange={handleChange}
          required
        >
          <option value="">Worker Type</option>
          <option value="Driver">Driver</option>
          <option value="Labour">Labour</option>
          <option value="Loader Driver">Loader Driver</option>
        </select>

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value="">Transaction Type</option>
          <option value="EARNING">Daily Work / Earning</option>
          <option value="ADVANCE">Advance Given</option>
          <option value="SALARY_PAID">Salary Paid</option>
          <option value="ADJUSTMENT">Adjustment</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update" : "Save"}
        </button>

        {editingId && (
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <table className="worker-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Worker</th>
            <th>Date</th>
            <th>Worker Type</th>
            <th>Txn Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(t => (
            <tr
              key={t.id}
              onClick={() => setSelectedWorker(t.workerName)}
              style={{ cursor: "pointer" }}
            >
              <td>{t.id}</td>
              <td>{t.workerName}</td>
              <td>{t.date}</td>
              <td>{t.workerType}</td>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>{t.description}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(t)}
                >
                  Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(t.id)}
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

export default WorkerTransactions;
