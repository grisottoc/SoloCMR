// src/pages/NotificationSettings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState({
    daysBeforeDue: 2,
    snoozedAlerts: [],
    completedAlerts: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:5000/api/notification-settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPreferences(res.data);
      } catch (err) {
        console.error("Failed to fetch preferences", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: parseInt(e.target.value),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://127.0.0.1:5000/api/notification-settings", preferences, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Preferences updated successfully!");
    } catch (err) {
      console.error("Error saving preferences", err);
      setMessage("Failed to update preferences.");
    }
  };

  if (loading) return <p className="text-center py-4">Loading settings...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}
    >
      <h2 className="text-center mb-4">Notification Settings</h2>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>
          Notify me before due date (in days):
          <input
            type="number"
            name="daysBeforeDue"
            value={preferences.daysBeforeDue}
            onChange={handleChange}
            min="1"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        {/* Future: add UI for snoozed/completed alert controls here */}

        <button type="submit" style={{ padding: "10px", backgroundColor: "#4caf50", color: "#fff", border: "none" }}>
          Save Preferences
        </button>
        {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
      </form>
    </motion.div>
  );
};

export default NotificationSettings;
