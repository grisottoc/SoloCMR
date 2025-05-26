import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/calendar", label: "Calendar", icon: "📅" },
    { path: "/notifications", label: "Notifications", icon: "🔔" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>SoloCMR</h3>
      </div>
      <ul className="sidebar-nav">
        {links.map((link) => (
          <li
            key={link.path}
            className={location.pathname === link.path ? "active" : ""}
          >
            <Link to={link.path}>
              <span className="icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className="btn btn-link text-start w-100 ps-3"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <span className="icon">🚪</span>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
