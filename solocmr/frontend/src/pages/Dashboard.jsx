import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [editingClientId, setEditingClientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [dueDateFilter, setDueDateFilter] = useState("all");

  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    service: "",
    notes: "",
    due_date: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://127.0.0.1:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClients(res.data))
      .catch((err) => {
        setError("Failed to fetch clients. Please log in again.");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/client",
        newClient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setClients((prev) => [
        ...prev,
        { ...newClient, id: res.data.id || Date.now() },
      ]);
      setNewClient({
        name: "",
        email: "",
        service: "",
        notes: "",
        due_date: "",
      });
    } catch (err) {
      setError("Failed to add client.");
    }
  };

  const startEditing = (client) => {
    setEditingClientId(client.id);
    setNewClient({ ...client });
  };

  const handleUpdateClient = async (e, id) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://127.0.0.1:5000/api/client/${id}`, newClient, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...newClient, id } : c))
      );
      setEditingClientId(null);
      setNewClient({
        name: "",
        email: "",
        service: "",
        notes: "",
        due_date: "",
      });
    } catch (err) {
      setError("Failed to update client.");
    }
  };

  const handleDeleteClient = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://127.0.0.1:5000/api/client/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError("Failed to delete client.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}
    >
      <h2
        style={{
          background: "linear-gradient(to right, #ff7e5f, #feb47b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Your Clients
      </h2>

      <input
        type="text"
        placeholder="Search clients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {["all", "today", "overdue", "upcoming"].map((type) => (
          <button
            key={type}
            onClick={() => setDueDateFilter(type)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: dueDateFilter === type ? "#feb47b" : "#f0f0f0",
              color: dueDateFilter === type ? "white" : "#333",
              cursor: "pointer",
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <motion.form
        onSubmit={handleAddClient}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "grid",
          gap: "10px",
          marginBottom: "30px",
          border: "1px solid #eee",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Client Name"
          value={newClient.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Client Email"
          value={newClient.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="service"
          placeholder="Service Type"
          value={newClient.service}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={newClient.notes}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="due_date"
          value={newClient.due_date}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Client</button>
      </motion.form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {clients.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          No clients found.
        </motion.p>
      ) : (
        <div>
          {clients
            .filter((client) => {
              const query = searchTerm.toLowerCase();
              return (
                client.name.toLowerCase().includes(query) ||
                client.email.toLowerCase().includes(query) ||
                client.service.toLowerCase().includes(query)
              );
            })
            .filter((client) => {
              if (dueDateFilter === "all") return true;
              const today = new Date().toISOString().split("T")[0];
              const due = client.due_date;
              if (dueDateFilter === "today") return due === today;
              if (dueDateFilter === "overdue") return due < today;
              if (dueDateFilter === "upcoming") return due > today;
              return true;
            })
            .map((client, index) => {
              const today = new Date().toISOString().split("T")[0];
              const due = client.due_date;
              let bgColor = "#fff";
              if (due < today) bgColor = "#ffe5e5";
              else if (due === today) bgColor = "#fff3cd";
              else bgColor = "#e2f7e2";

              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    backgroundColor: bgColor,
                    border: "1px solid #feb47b",
                    borderRadius: "12px",
                    padding: "15px",
                    marginBottom: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  {editingClientId === client.id ? (
                    <form onSubmit={(e) => handleUpdateClient(e, client.id)}>
                      <input
                        type="text"
                        name="name"
                        value={newClient.name}
                        onChange={handleInputChange}
                      />
                      <input
                        type="email"
                        name="email"
                        value={newClient.email}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="service"
                        value={newClient.service}
                        onChange={handleInputChange}
                      />
                      <textarea
                        name="notes"
                        value={newClient.notes}
                        onChange={handleInputChange}
                      />
                      <input
                        type="date"
                        name="due_date"
                        value={newClient.due_date}
                        onChange={handleInputChange}
                      />
                      <button type="submit">Save</button>
                      <button
                        type="button"
                        onClick={() => setEditingClientId(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <h4>{client.name}</h4>
                      <p>{client.email}</p>
                      <p>
                        <strong>{client.service}</strong> — {client.notes}
                      </p>
                      <p>Due: {client.due_date}</p>
                      <button onClick={() => startEditing(client)}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteClient(client.id)}>
                        🗑 Delete
                      </button>
                      <button
                        onClick={() => navigate("/notification-settings")}
                        className="btn btn-outline-primary"
                      >
                        Email Notification Settings
                      </button>
                    </>
                  )}
                </motion.div>
              );
            })}
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
