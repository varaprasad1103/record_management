import React, { useEffect, useState } from "react";
import "../styles/SourceDispatch.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function SourceDispatch() {
    const [mills, setMills] = useState([]);
    const [dispatches, setDispatches] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        riceMillId: "",
        date: "",
        vehicleNo: "",
        quantity: "",
        rate: ""
    });

    useEffect(() => {
        fetch("http://localhost:8080/ricemills")
            .then(res => res.json())
            .then(data => setMills(data));

        loadDispatches();
    }, []);

    const loadDispatches = () => {
        fetch("http://localhost:8080/source-dispatch")
            .then(res => res.json())
            .then(data => setDispatches(data));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // ✅ EDIT
    const handleEdit = (d) => {
        setEditingId(d.id);
        setForm({
            riceMillId: d.riceMill?.id || "",
            date: d.date,
            vehicleNo: d.vehicleNo,
            quantity: d.quantity,
            rate: d.rate
        });
    };

    // ✅ CANCEL
    const handleCancel = () => {
        setEditingId(null);
        setForm({
            riceMillId: "",
            date: "",
            vehicleNo: "",
            quantity: "",
            rate: ""
        });
    };

    // ✅ SAVE / UPDATE
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = editingId
            ? `http://localhost:8080/source-dispatch/${editingId}`
            : "http://localhost:8080/source-dispatch";

        const method = editingId ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                riceMill: { id: form.riceMillId },
                date: form.date,
                vehicleNo: form.vehicleNo,
                quantity: Number(form.quantity),
                rate: Number(form.rate)
            })
        })
            .then(() => {
                loadDispatches();
                handleCancel();
            });
    };
    const exportSourceExcel = () => {
        const data = [...dispatches, { vehicleNo: "TOTAL", totalAmount: totalSource }];
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SourceDispatch");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf]), "SourceDispatch.xlsx");
    };
    const exportSourcePDF = () => {
        const doc = new jsPDF();
        const rows = dispatches.map(d => [
            d.id, d.vehicleNo, d.quantity, d.rate, d.totalAmount
        ]);
        rows.push(["", "TOTAL", "", "", totalSource]);
        autoTable(doc, { head: [["ID", "Vehicle", "Qty", "Rate", "Total"]], body: rows });
        doc.save("SourceDispatch.pdf");
    };


    // ✅ DELETE
    const handleDelete = (id) => {
        if (!window.confirm("Delete this dispatch?")) return;

        fetch(`http://localhost:8080/source-dispatch/${id}`, {
            method: "DELETE"
        }).then(() => loadDispatches());
    };

    const totalSource = dispatches.reduce(
        (sum, d) => sum + Number(d.totalAmount || 0),
        0
    );


    return (
        <div className="source-container">
            <h2>Source Dispatch</h2>

            <form className="source-form" onSubmit={handleSubmit}>
                <select
                    name="riceMillId"
                    value={form.riceMillId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Rice Mill</option>
                    {mills.map(m => (
                        <option key={m.id} value={m.id}>
                            {m.name}
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
                    required
                />

                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="rate"
                    placeholder="Rate"
                    value={form.rate}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {editingId ? "Update" : "Save"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                )}
            </form>
            <button className="export-btn" onClick={exportSourceExcel}>Excel</button>
            <button className="export-btn pdf-btn" onClick={exportSourcePDF}>PDF</button>

            <table className="source-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Rice Mill</th>
                        <th>Date</th>
                        <th>Vehicle</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {dispatches.map(d => (
                        <tr key={d.id}>
                            <td>{d.id}</td>
                            <td>{d.riceMill?.name}</td>
                            <td>{d.date}</td>
                            <td>{d.vehicleNo}</td>
                            <td>{d.quantity}</td>
                            <td>{d.rate}</td>
                            <td>₹{d.totalAmount}</td>
                            <td>
                                <button
                                    className="action-btn edit-btn"
                                    onClick={() => handleEdit(d)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(d.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                        <td colSpan="6" style={{ textAlign: "right" }}>
                            TOTAL
                        </td>
                        <td>₹{totalSource}</td>
                    </tr>

                </tbody>


            </table>
        </div>
    );
}

export default SourceDispatch;
