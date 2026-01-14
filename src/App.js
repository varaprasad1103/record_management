import { useState } from "react";
import {
  FaBars,
  FaHome,
  FaIndustry,
  FaTruck,
  FaMapMarkedAlt,
  FaCar,
  FaUserCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun
} from "react-icons/fa";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RiceMill from "./pages/RiceMills";
import SourceDispatch from "./pages/SourceDispatch";
import DestinationDispatch from "./pages/DestinationDispatch";
import VehicleRecords from "./pages/VehicleRecords";

import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }


  return (
    <div className={dark ? "app-layout dark" : "app-layout"}>
      {/* SIDEBAR */}
      <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
        <div className="top-bar">
          <FaBars onClick={() => setCollapsed(!collapsed)} />
        </div>

        <div className="profile">
          <FaUserCircle size={40} />
          {!collapsed && <span>Admin</span>}
        </div>

        <div className="menu" onClick={() => setPage("dashboard")}>
          <FaHome /> {!collapsed && "Dashboard"}
        </div>

        <div className="menu" onClick={() => setPage("ricemill")}>
          <FaIndustry /> {!collapsed && "Rice Mills"}
        </div>

        <div className="menu" onClick={() => setPage("source")}>
          <FaTruck /> {!collapsed && "Source Dispatch"}
        </div>

        <div className="menu" onClick={() => setPage("destination")}>
          <FaMapMarkedAlt /> {!collapsed && "Destination"}
        </div>

        <div className="menu" onClick={() => setPage("vehicle")}>
          <FaCar /> {!collapsed && "Vehicle Records"}
        </div>

        <div className="bottom-menu">
          <div className="menu" onClick={() => setDark(!dark)}>
            {dark ? <FaSun /> : <FaMoon />}
            {!collapsed && (dark ? "Light Mode" : "Dark Mode")}
          </div>

          <div className="menu logout" onClick={() => {
            localStorage.clear();
            setLoggedIn(false);
          }}>
  Logout
</div>


        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {page === "dashboard" && <Dashboard />}
        {page === "ricemill" && <RiceMill />}
        {page === "source" && <SourceDispatch />}
        {page === "destination" && <DestinationDispatch />}
        {page === "vehicle" && <VehicleRecords />}
      </div>
    </div>
  );
}

export default App;
