import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", service: "", notes: "", due_date: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (err) {
      console.error("Error loading clients:", err);
      setError("Failed to load clients.");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:5000/api/client/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://127.0.0.1:5000/api/client", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", email: "", service: "", notes: "", due_date: "" });
      setEditingId(null);
      fetchClients();
    } catch (err) {
      console.error("Error saving client:", err);
      setError("Failed to save client.");
    }
  };

  const handleEdit = (client) => {
    setForm(client);
    setEditingId(client.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/client/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClients();
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">📋 Dashboard</h2>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input name="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input name="service" className="form-control" placeholder="Service" value={form.service} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <input type="date" name="due_date" className="form-control" value={form.due_date} onChange={handleChange} />
          </div>
          <div className="col-12">
            <textarea name="notes" className="form-control" placeholder="Notes" value={form.notes} onChange={handleChange}></textarea>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editingId ? "Update Client" : "Add Client"}
        </button>
      </form>

      <ul className="list-group">
        {clients.map((client) => (
          <li key={client.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{client.name}</strong> — {client.service} <br />
              Due: {client.due_date || "N/A"} | Email: {client.email}
            </div>
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(client)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(client.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
