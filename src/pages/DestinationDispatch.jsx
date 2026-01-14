import React, { useEffect, useState } from "react";
import "../styles/DestinationDispatch.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


function DestinationDispatch() {
    const [sources, setSources] = useState([]);
    const [destinations, setDestinations] = useState([]);


    const [form, setForm] = useState({
        sourceDispatchId: "",
        date: "",
        destinationName: "",
        vehicleNo: "",
        quantity: "",
        rate: "",
        poNumber: ""
    });

    useEffect(() => {
        fetch("http://localhost:8080/source-dispatch")
            .then(res => res.json())
            .then(data => setSources(data));

        loadDestinations();
    }, []);

    const loadDestinations = () => {
        fetch("http://localhost:8080/destination-dispatch")
            .then(res => res.json())
            .then(data => setDestinations(data));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8080/destination-dispatch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sourceDispatch: { id: form.sourceDispatchId },
                date: form.date,
                destinationName: form.destinationName,
                vehicleNo: form.vehicleNo,
                quantity: Number(form.quantity),
                rate: Number(form.rate),
                poNumber: form.poNumber
            })
        })
            .then(() => {
                loadDestinations();
                setForm({
                    sourceDispatchId: "",
                    date: "",
                    destinationName: "",
                    vehicleNo: "",
                    quantity: "",
                    rate: "",
                    poNumber: ""
                });
            });
    };
    const exportDestinationExcel = () => {
        const data = [...destinations, { destinationName: "TOTAL", totalAmount: totalDestination }];
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DestinationDispatch");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf]), "DestinationDispatch.xlsx");
    };
    const exportDestinationPDF = () => {
        const doc = new jsPDF();
        const rows = destinations.map(d => [
            d.id, d.destinationName, d.vehicleNo, d.quantity, d.rate, d.totalAmount
        ]);
        rows.push(["", "TOTAL", "", "", "", totalDestination]);
        autoTable(doc, { head: [["ID", "Destination", "Vehicle", "Qty", "Rate", "Total"]], body: rows });
        doc.save("DestinationDispatch.pdf");
    };

    const totalDestination = destinations.reduce(
        (s, d) => s + Number(d.totalAmount || 0),
        0
    );




    return (
        <div className="destination-container">
            <h2>Destination Dispatch</h2>

            <form className="destination-form" onSubmit={handleSubmit}>
                <select
                    name="sourceDispatchId"
                    value={form.sourceDispatchId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Source Dispatch</option>
                    {sources.map(s => (
                        <option key={s.id} value={s.id}>
                            #{s.id} - {s.vehicleNo}
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
                    name="destinationName"
                    placeholder="Destination Name"
                    value={form.destinationName}
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

                <input
                    name="poNumber"
                    placeholder="PO Number"
                    value={form.poNumber}
                    onChange={handleChange}
                />

                <button type="submit">Save</button>
            </form>
            <button className="export-btn" onClick={exportDestinationExcel}>Excel</button>
            <button className="export-btn pdf-btn" onClick={exportDestinationPDF}>PDF</button>

            <table className="destination-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Source ID</th>
                        <th>Date</th>
                        <th>Destination</th>
                        <th>Vehicle</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Total</th>
                        <th>PO Number</th>
                    </tr>
                </thead>

                <tbody>
                    {destinations.map(d => (
                        <tr key={d.id}>
                            <td>{d.id}</td>
                            <td>{d.sourceDispatch?.id}</td>
                            <td>{d.date}</td>
                            <td>{d.destinationName}</td>
                            <td>{d.vehicleNo}</td>
                            <td>{d.quantity}</td>
                            <td>{d.rate}</td>
                            <td>₹{d.totalAmount}</td>
                            <td>{d.poNumber}</td>
                        </tr>
                    ))}
                    <tr style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                        <td colSpan="7" style={{ textAlign: "right" }}>
                            TOTAL
                        </td>
                        <td>₹{totalDestination}</td>
                    </tr>

                </tbody>
            </table>
        </div>
    );
}

export default DestinationDispatch;
