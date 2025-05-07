import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Analytics from "./pages/Analytics"; 

// Components
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./pages/CalendarView";
import NotificationSettings from "./pages/NotificationSettings";
// import NotFound from "./pages/NotFound"; // Optional 404 page

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/notifications" element={<NotificationSettings />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
