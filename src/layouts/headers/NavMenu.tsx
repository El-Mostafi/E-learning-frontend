/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import menu_data from "../../data/menu_data";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { isTokenValid } from "../../utils/ProtectedRoutes";

const NavMenu = () => {
  const { user } = useAuth();
  
  const filterMainMenus = (menuItems: any[]) => {
    return menuItems.filter(item => {
      if (item.title === "Shop") {
        return user && user.role === "student";
      }
      return true;
    });
  };
  
  const filterSubMenus = (subMenus: any[]) => {
    if (!subMenus) return [];
    
    return subMenus.filter(subMenu => {
      if (subMenu.link === "/my-courses") {
        return user && (user.role === "student" || user.role === "instructor");
      }
      if (subMenu.title === "Logout") {
        return user; // Only show logout if user is authenticated
      }
      if (subMenu.title === "Sign In" || subMenu.title === "Register" || subMenu.title === "Forgot Password") {
        return !user || !isTokenValid(); // Only show these if user is not authenticated
      }
      return true;
    });
  };

  return (
    <>
      <ul>
        {filterMainMenus(menu_data).map((item, i) => (
          <li className="has-dropdown menu-thumb" key={i}>
            <Link to={item.link}>
              <span className="head-icon"><i className={item.icon}></i></span>
              {item.title}
              {item.img_dropdown || item.has_dropdown ? <i className="fas fa-chevron-down"></i> : null}
            </Link>
            {item.has_dropdown && 
              <ul className="submenu">
                {filterSubMenus(item.sub_menus)?.map((sub_item, sub_index) => (
                  <React.Fragment key={sub_index}> 
                    {sub_item?.link && (
                      <li>
                        <Link 
                          to={sub_item.link}
                          style={sub_item.title === "Logout" ? { color: 'red' } : {}}
                        >
                          {sub_item.title}
                        </Link>
                      </li>
                    )}
                  </React.Fragment>
                ))} 
              </ul>
            }
          </li>
        ))} 
      </ul>
    </>
  );
};

export default NavMenu;