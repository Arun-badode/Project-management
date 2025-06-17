import React, { useState } from "react";    
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ collapsed , menuItemClick}) => {
  const [openSubmenu, setOpenSubmenu] = useState(null); // Tracks the open submenu
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

   // Function to check if a path is active
   const isActive = (path) => {
    return location.pathname === path;
  };

    // Function to check if any of the submenu items are active
    const isSubmenuActive = (paths) => {
      return paths.some((path) => location.pathname.startsWith(path));
    };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar">
        <ul className="menu">
          {/* Dashboard Section */}
          <li className={`menu-item ${isActive("/aaa") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/kkk"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Dashboard</span>
            </div>
          </li>

          {/* Intake Management Section */}
          {/* <li className={`menu-item ${isSubmenuActive(["/intakemanagement", "/intakecateedit"]) ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => toggleSubmenu("intakemanagement")}>
              <i className="fa-solid fa-list-check"></i>
              <span className="menu-text">Intake Management</span>
              <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "intakemanagement" ? "rotated" : ""}`}></i>
            </div>
          </li> */}
          {/* <ul className={`submenu ${openSubmenu === "intakemanagement" ? "expanded" : "collapsed"}`}>
            <li className={`submenu-item ${isActive("/intakemanagement") ? "active" : ""}`}
              onClick={() => {navigate("/intakemanagement");setOpenSubmenu(null);menuItemClick();}}>
              <i className="fa-solid fa-arrow-trend-up"></i> Intake Management Dashboard
            </li>
            <li className={`submenu-item ${isActive("/intakecateedit") ? "active" : ""}`}
              onClick={() => {
                navigate("/intakecateedit");
                setOpenSubmenu(null);menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Edit Category
            </li>
          </ul> */}
          {/* Contract Template Section */}
          {/* <li
            className={`menu-item ${
              isActive("/contracttemplate") ? "active" : ""
            }`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/contracttemplate");menuItemClick();}}>
              <i className="fa-solid fa-file-contract"></i>
              <span className="menu-text">Contract Template</span>
            </div>
          </li> */}

          {/* Cost Saving Opportunities Section */}
          {/* <li className={`menu-item ${isSubmenuActive(["/volumedisc","/suppliercons","/serviceswo","/honoring","/additionalcomp","/pricecomp","/multiyear","/others"]) ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => toggleSubmenu("costSaving")}>
              <i className="fa-solid fa-arrow-trend-up"></i>
              <span className="menu-text">Cost Saving Opportunities</span>
              <i
                className={`fa-solid fa-chevron-down submenu-arrow ${
                  openSubmenu === "costSaving" ? "rotated" : ""
                }`}></i>
            </div>
          </li>
          <ul
            className={`submenu ${
              openSubmenu === "costSaving" ? "expanded" : "collapsed"
            }`}>
            <li
              className={`submenu-item ${
                isActive("/volumedisc") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/volumedisc");
                setOpenSubmenu(null); menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Volume Discounts
            </li>
            <li
              className={`submenu-item ${
                isActive("/suppliercons") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/suppliercons");
                setOpenSubmenu(null); menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Supplier
              Consolidation
            </li>
            <li
              className={`submenu-item ${
                isActive("/serviceswo") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/serviceswo");
                setOpenSubmenu(null); menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Service/SOW
              Consolidation
            </li>
            <li
              className={`submenu-item ${
                isActive("/honoring") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/honoring");
                setOpenSubmenu(null); menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Honoring Old
              Pricing
            </li>
            <li
              className={`submenu-item ${
                isActive("/additionalcomp") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/additionalcomp");
                setOpenSubmenu(null); menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i>{" "}
              Additional/Complementary Service
            </li>
            <li
              className={`submenu-item ${
                isActive("/pricecomp") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/pricecomp");
                setOpenSubmenu(null); menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Price Comparisons
            </li>
            <li
              className={`submenu-item ${
                isActive("/multiyear") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/multiyear");
                setOpenSubmenu(null); menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Multi-Year
              Contracting
            </li>
            <li
              className={`submenu-item ${
                isActive("/others") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/others");
                setOpenSubmenu(null); menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Others
            </li>
          </ul> */}

          {/* Approval Workflow Section */}
          {/* <li
            className={`menu-item ${
              isActive("/approvalworkflow") ? "active" : ""
            }`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/approvalworkflow");menuItemClick();}}>
              <i className="fa-solid fa-check-circle"></i>
              <span className="menu-text">Approval Workflow</span>
            </div>
          </li> */}

          {/* Renewal Notifications Section */}
          {/* <li
            className={`menu-item ${
              isActive("/renewalnotifi") ? "active" : ""
            }`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/renewalnotifi");menuItemClick();}}>
              <i className="fa-regular fa-comment-dots"></i>
              <span className="menu-text">Renewal Notifications</span>
            </div>
          </li> */}

          {/* Renewal management Section */}
          {/* <li
            className={`menu-item ${
              isActive("/renewalmanage") ? "active" : ""
            }`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/renewalmanage");menuItemClick();}}>
              <i className="fa-solid fa-envelope-open-text"></i>
              <span className="menu-text">Renewal Management</span>
            </div>
          </li> */}

          {/* Contract Management Section */}

          {/* <li className={`menu-item ${isSubmenuActive(["/contractmanage","/contractwearhouse","/addnewcontact"]) ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => toggleSubmenu("contractmanage")}>
              <i className="fa-solid fa-file-contract"></i>
              <span className="menu-text">Contract Management</span>
              <i
                className={`fa-solid fa-chevron-down submenu-arrow ${
                  openSubmenu === "contractmanage" ? "rotated" : ""
                }`}></i>
            </div>
          </li>
          <ul
            className={`submenu ${
              openSubmenu === "contractmanage" ? "expanded" : "collapsed"
            }`}>
            <li
              className={`submenu-item ${
                isActive("/contractmanage") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/contractmanage");
                setOpenSubmenu(null);menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Contract Dashbord
            </li>
            <li
              className={`submenu-item ${
                isActive("/contractwearhouse") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/contractwearhouse");
                setOpenSubmenu(null);menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> All Contract /
              Contract warehouse
            </li>
            <li
              className={`submenu-item ${
                isActive("/addnewcontact") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/addnewcontact");
                setOpenSubmenu(null);menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Add Contract
            </li>
          </ul> */}

          {/* Vendor Performance Section */}
          {/* <li className={`menu-item ${isActive("/vendorper") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/vendorper");menuItemClick();}}>
              <i className="fa-solid fa-file-signature"></i>
              <span className="menu-text">Supplier Performance</span>
            </div>
          </li> */}

          {/* Spend Analytics Section */}
          {/* <li
            className={`menu-item ${isActive("/spendanalyt") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/spendanalyt");menuItemClick();}}>
              <i className="fa-solid fa-chart-line"></i>
              <span className="menu-text">Spend Analytics</span>
            </div>
          </li> */}
          {/* Add category and Sub Category */}
          {/* <li className={`menu-item ${isSubmenuActive(["/adddepartment","/addtransaction"]) ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => toggleSubmenu("addcategory")}>
              <i className="fa-solid fa-arrow-trend-up"></i>
              <span className="menu-text">Add Category/Sub Category</span>
              <i
                className={`fa-solid fa-chevron-down submenu-arrow ${
                  openSubmenu === "addcategory" ? "rotated" : ""
                }`}></i>
            </div>
          </li> */}
          {/* <ul
            className={`submenu ${
              openSubmenu === "addcategory" ? "expanded" : "collapsed"
            }`}>
            <li
              className={`submenu-item ${
                isActive("/adddepartment") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/adddepartment");
                setOpenSubmenu(null);menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Add Department
            </li>
            <li
              className={`submenu-item ${
                isActive("/addtransaction") ? "active" : ""
              }`}
              onClick={() => {
                navigate("/addtransaction");
                setOpenSubmenu(null);menuItemClick();
              }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Add Transaction
            </li>
            </ul> */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
