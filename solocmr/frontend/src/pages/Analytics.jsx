import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Analytics = () => {
  const [clientData, setClientData] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setClientData(data);

        // Prepare chart data
        const serviceMap = {};
        let dueSoon = 0;
        let overdue = 0;
        const today = new Date();

        data.forEach((client) => {
          const due = new Date(client.due_date);
          const diff = (due - today) / (1000 * 60 * 60 * 24);
          if (diff <= 7 && diff >= 0) dueSoon++;
          else if (diff < 0) overdue++;

          if (client.service) {
            serviceMap[client.service] = (serviceMap[client.service] || 0) + 1;
          }
        });

        setServiceDistribution(
          Object.entries(serviceMap).map(([name, value]) => ({ name, value }))
        );

        setChartStats([
          { name: "Due Soon (<= 7 days)", value: dueSoon },
          { name: "Overdue", value: overdue },
        ]);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };

    fetchData();
  }, []);

  const [chartStats, setChartStats] = useState([]);

  return (
    <motion.div
      className="container"
      style={{ maxWidth: "900px", margin: "40px auto" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center mb-4">📈 Analytics & Reports</h2>

      <div className="mb-5">
        <h5 className="mb-3">Client Status Summary</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartStats}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#007bff" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h5 className="mb-3">Service Distribution</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={serviceDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {serviceDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Analytics;
