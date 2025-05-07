// src/pages/Analytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Analytics = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Error loading clients", err));
  }, []);

  const serviceData = {};
  clients.forEach((client) => {
    serviceData[client.service] = (serviceData[client.service] || 0) + 1;
  });

  const pieData = Object.keys(serviceData).map((service) => ({
    name: service,
    value: serviceData[service],
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  return (
    <div className="container fade-in">
      <h2>📊 Analytics & Reports</h2>

      <h4 className="mt-4">Services Distribution</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h4 className="mt-4">Client Count</h4>
      <p>Total Clients: {clients.length}</p>
    </div>
  );
};

export default Analytics;
