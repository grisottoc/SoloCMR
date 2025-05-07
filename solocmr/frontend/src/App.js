import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
