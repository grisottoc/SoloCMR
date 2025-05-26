import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import CalendarView from "./pages/CalendarView";
import NotificationSettings from "./pages/NotificationSettings";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Components
import Sidebar from "./components/Sidebar";

// Layout wrapper with Sidebar
const AppLayout = () => (
  <div className="d-flex">
    <Sidebar />
    <div className="flex-grow-1 p-4">
      <Outlet /> {/* This will render child routes */}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
