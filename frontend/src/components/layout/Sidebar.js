import React, { useState, useEffect } from 'react';
import '../css/layout/Sidebar.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Sidebar = ({ isSidebarOpen }) => {
  const [activeMenu, setActiveMenu] = useState('');
  const [menuData, setMenuData] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({}); // Track expanded submenus

  const handleMenuClick = (currentCode, parentCode) => {
    setActiveMenu(currentCode); // Set the active menu state
    toggleMenu(currentCode, parentCode); // Toggle the menu (expand/collapse)
  };

  // Fetch menu data from the backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const userType = 'Admin'; // Replace with the actual UserType
        const response = await axios.post(`${API_BASE_URL}/menu?UserType=${userType}`);
        const builtMenu = buildMenuHierarchy(response.data);
        setMenuData(builtMenu);

        // Load the saved expanded menu state from localStorage
        const savedExpandedMenus = JSON.parse(localStorage.getItem('expandedMenus')) || {};
        setExpandedMenus(savedExpandedMenus); // Load saved state
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenu();
  }, []); // Empty dependency array to run this effect only once when the component mounts

  // Function to build the menu hierarchy
  const buildMenuHierarchy = (menuItems) => {
    const menuMap = {};
    menuItems.forEach((item) => {
      menuMap[item.MenuCode] = { ...item, children: item.children || [] }; // Ensure children is always an array
    });

    const rootMenu = [];
    menuItems.forEach((item) => {
      if (item.ParentCode === 0) {
        rootMenu.push(menuMap[item.MenuCode]);
      } else if (menuMap[item.ParentCode]) {
        menuMap[item.ParentCode].children.push(menuMap[item.MenuCode]);
      }
    });
    return rootMenu;
  };

  // Toggle submenu visibility and update localStorage
  const toggleMenu = (menuCode, parentCode) => {
    setExpandedMenus((prevState) => {
      const newExpandedMenus = { ...prevState };

      // Collapse all sibling menus under the same parent, except the clicked menu
      Object.keys(newExpandedMenus).forEach((key) => {
        if (key.startsWith(`${parentCode}_`) && key !== menuCode) {
          newExpandedMenus[key] = false; // Collapse siblings
        }
      });

      // Toggle the clicked menu
      newExpandedMenus[menuCode] = !prevState[menuCode];

      // Save updated expandedMenus to localStorage
      localStorage.setItem('expandedMenus', JSON.stringify(newExpandedMenus));

      return newExpandedMenus; // Return the updated state
    });
  };

  // Recursive function to render menu items
  const renderMenu = (items, parentCode = '') =>
    items.map((item) => {
      const currentCode = `${parentCode}_${item.MenuCode}`;

      return (
        <li key={item.MenuCode}>
          <div
            className={`menu-item ${activeMenu === currentCode ? 'active' : ''}`}
            onClick={() => handleMenuClick(currentCode, parentCode)}
          >
            <a
              href={item.WebForm || '#'}
              onClick={(e) => {
                if (item.children && item.children.length > 0) {
                  e.preventDefault();
                }
              }}
            >
              <i className={item.WebIcon}></i>
              {isSidebarOpen && <span className="menu-name">{item.MenuName}</span>}
            </a>
            {item.children && item.children.length > 0 && isSidebarOpen && (
              <span
                className={`arrow ${expandedMenus[currentCode] ? 'open' : ''}`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the parent menu from being clicked
                  toggleMenu(currentCode, parentCode);
                }}
              >
                <i style={{ fontSize: '12px' }} className={`fa ${expandedMenus[currentCode] ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </span>
            )}
          </div>
          {item.children && item.children.length > 0 && expandedMenus[currentCode] && isSidebarOpen && (
            <ul>{renderMenu(item.children, currentCode)}</ul>
          )}
        </li>
      );
    });

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <ul>{renderMenu(menuData)}</ul>
    </div>
  );
};

export default Sidebar;
