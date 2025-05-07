import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/css/Sidebar.css";



const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/calendar", label: "Calendar", icon: "📅" },
    { path: "/notifications", label: "Notifications", icon: "🔔" },
    { path: "/logout", label: "Logout", icon: "🚪" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>⚙️ SoloCMR</h3>
      </div>
      <ul className="sidebar-nav">
        {links.map((link) => (
          <li
            key={link.path}
            className={location.pathname === link.path ? "active" : ""}
          >
            <Link to={link.path}>
              <span className="icon">{link.icon}</span>
              <span className="label">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
