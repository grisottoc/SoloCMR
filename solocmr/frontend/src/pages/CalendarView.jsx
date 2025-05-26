import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { motion } from "framer-motion";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parseISO, format } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: () => new Date(),
  getDay: (date) => date.getDay(),
  locales,
});

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // Replace with actual API call later
    const mockEvents = [
      {
        title: "Client: AC Repair",
        start: new Date(),
        end: new Date(),
      },
      {
        title: "Follow-up Inspection",
        start: new Date(new Date().getTime() + 86400000),
        end: new Date(new Date().getTime() + 86400000),
      },
    ];
    setEvents(mockEvents);
  }, [navigate]);

  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter event title:");
    if (title) {
      const newEvent = { title, start, end };
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  return (
    <motion.div
      className="container"
      style={{ maxWidth: "1000px", margin: "40px auto" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center mb-4">📅 Calendar View</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 600 }}
      />
    </motion.div>
  );
};

export default CalendarView;
