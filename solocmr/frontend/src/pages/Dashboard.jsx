// src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useTheme from "../hooks/useTheme";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../components/Sidebar";
import "../assets/Dashboard.css";

const Dashboard = () => {
  const { theme } = useTheme();
  const [clients, setClients] = useState([]);
  const [chartData, setChartData] = useState([]);
  const fullRef = useRef();
  const tableRef = useRef();

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem("clients")) || [];
    setClients(storedClients);

    const serviceCount = storedClients.reduce((acc, client) => {
      acc[client.service] = (acc[client.service] || 0) + 1;
      return acc;
    }, {});

    const formatted = Object.entries(serviceCount).map(([name, count]) => ({ name, count }));
    setChartData(formatted);
  }, []);

  const exportToPDF = async (targetRef) => {
    const canvas = await html2canvas(targetRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("dashboard.pdf");
  };

  return (
    <div className={`dashboard-wrapper ${theme}`}>
      <Sidebar />
      <div className="dashboard-content">
        <h2 className="dashboard-title">📊 Dashboard Overview</h2>

        <div className="pdf-buttons mb-3">
          <button className="btn btn-primary me-2" onClick={() => exportToPDF(fullRef)}>Export Full Dashboard to PDF</button>
          <button className="btn btn-secondary" onClick={() => exportToPDF(tableRef)}>Export Only Clients Table</button>
        </div>

        <div ref={fullRef} className="dashboard-section">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <div ref={tableRef} className="clients-table mt-4">
            <h4>Client List</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, idx) => (
                  <tr key={idx}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.service}</td>
                    <td>{client.due_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
