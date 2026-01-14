import React, { useEffect, useState } from "react";
import "../styles/RiceMills.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function RiceMills() {
    const [mills, setMills] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        location: "",
        advanceAmount: "",
        balanceAmount: ""
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

    const handleEdit = (m) => {
        setEditingId(m.id);
        setForm({
            name: m.name,
            location: m.location,
            advanceAmount: m.advanceAmount,
            balanceAmount: m.balanceAmount
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({
            name: "",
            location: "",
            advanceAmount: "",
            balanceAmount: ""
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = editingId
            ? `http://localhost:8080/ricemills/${editingId}`
            : "http://localhost:8080/ricemills";

        const method = editingId ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                advanceAmount: Number(form.advanceAmount),
                balanceAmount: Number(form.balanceAmount)
            })
        })
            .then(() => {
                loadMills();
                handleCancel();
            })
            .catch(err => console.error(err));
    };

    const exportRiceMillExcel = () => {
        const data = mills.map(m => ({
            id: m.id,
            name: m.name,
            location: m.location,
            advanceAmount: m.advanceAmount,
            balanceAmount: m.balanceAmount,
            total: Number(m.advanceAmount || 0) + Number(m.balanceAmount || 0)
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "RiceMills");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf]), "RiceMills.xlsx");
    };

    const exportRiceMillPDF = () => {
        const doc = new jsPDF();

        const rows = mills.map(m => [
            m.id,
            m.name,
            m.location,
            m.advanceAmount,
            m.balanceAmount,
            Number(m.advanceAmount || 0) + Number(m.balanceAmount || 0)
        ]);

        autoTable(doc, {
            head: [["ID", "Name", "Location", "Advance", "Balance", "Total"]],
            body: rows
        });

        doc.save("RiceMills.pdf");
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:8080/ricemills/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Cannot delete RiceMill with transactions");
                }
                loadMills();
            })
            .catch(err => alert(err.message));
    };

    return (
        <div className="ricemill-container">
            <h2>Rice Mills</h2>

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

                <input
                    type="number"
                    name="advanceAmount"
                    placeholder="Advance Amount"
                    value={form.advanceAmount}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="balanceAmount"
                    placeholder="Balance Amount"
                    value={form.balanceAmount}
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

            <button className="export-btn" onClick={exportRiceMillExcel}>Excel</button>
            <button className="export-btn pdf-btn" onClick={exportRiceMillPDF}>PDF</button>

            <table className="ricemill-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Advance</th>
                        <th>Balance</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {mills.map(m => (
                        <tr key={m.id}>
                            <td>{m.id}</td>
                            <td>{m.name}</td>
                            <td>{m.location}</td>
                            <td>₹{m.advanceAmount}</td>
                            <td>₹{m.balanceAmount}</td>
                            <td>
                                ₹{Number(m.advanceAmount || 0) + Number(m.balanceAmount || 0)}
                            </td>
                            <td>
                                <button
                                    className="action-btn edit-btn"
                                    onClick={() => handleEdit(m)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(m.id)}
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

export default RiceMills;
