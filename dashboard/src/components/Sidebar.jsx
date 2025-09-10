import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill, RiDashboardFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor, FaUserInjured, FaUserPlus, FaHospital, FaNewspaper } from "react-icons/fa6";
import { MdAddModerator, MdDashboard } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    try {
      const res = await API.get("/user/admin/logout");
      toast.success(res.data.message);
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const navigateTo = useNavigate();

  const navigationItems = [
    {
      id: 1,
      label: "Dashboard",
      icon: <MdDashboard />,
      path: "/",
      onClick: () => { navigateTo("/"); setShow(false); }
    },
    {
      id: 2,
      label: "Doctors",
      icon: <FaUserDoctor />,
      path: "/doctors",
      onClick: () => { navigateTo("/doctors"); setShow(false); }
    },
    {
      id: 3,
      label: "Patients",
      icon: <FaUserInjured />,
      path: "/patients",
      onClick: () => { navigateTo("/patients"); setShow(false); }
    },
    {
      id: 4,
      label: "Departments",
      icon: <FaHospital />,
      path: "/departments",
      onClick: () => { navigateTo("/departments"); setShow(false); }
    },
    {
      id: 5,
      label: "News",
      icon: <FaNewspaper />,
      path: "/news",
      onClick: () => { navigateTo("/news"); setShow(false); }
    },
    {
      id: 6,
      label: "Add Doctor",
      icon: <FaUserPlus />,
      path: "/doctor/addnew",
      onClick: () => { navigateTo("/doctor/addnew"); setShow(false); }
    },
    {
      id: 7,
      label: "Add Admin",
      icon: <MdAddModerator />,
      path: "/admin/addnew",
      onClick: () => { navigateTo("/admin/addnew"); setShow(false); }
    },
    {
      id: 8,
      label: "Messages",
      icon: <AiFillMessage />,
      path: "/messages",
      onClick: () => { navigateTo("/messages"); setShow(false); }
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "modern-sidebar show" : "modern-sidebar"}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="hospital-logo">
            <img src="/logo.png" alt="Shaan Hospital" className="sidebar-logo-img" />
            <div className="hospital-info">
              <h3>Shaan Hospital</h3>
              <p>Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Main</span>
            {navigationItems.slice(0, 5).map((item) => (
              <div 
                key={item.id}
                className={`nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
                onClick={item.onClick}
              >
                <div className="nav-icon">{item.icon}</div>
                <span className="nav-label">{item.label}</span>
                {isActiveRoute(item.path) && <div className="active-indicator"></div>}
              </div>
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Management</span>
            {navigationItems.slice(5).map((item) => (
              <div 
                key={item.id}
                className={`nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
                onClick={item.onClick}
              >
                <div className="nav-icon">{item.icon}</div>
                <span className="nav-label">{item.label}</span>
                {isActiveRoute(item.path) && <div className="active-indicator"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="nav-item logout-btn" onClick={handleLogout}>
            <div className="nav-icon">
              <RiLogoutBoxFill />
            </div>
            <span className="nav-label">Logout</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <div
        className="mobile-menu-toggle"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <button className="hamburger-btn" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </button>
      </div>

      {/* Overlay for mobile */}
      {show && (
        <div className="sidebar-overlay" onClick={() => setShow(false)}></div>
      )}
    </>
  );
};

export default Sidebar;
