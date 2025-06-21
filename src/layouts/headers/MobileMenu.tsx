/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import menu_data from "../../data/menu_data";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isTokenValid } from "../../utils/ProtectedRoutes";
const MobileMenu = () => {
  const [navTitle, setNavTitle] = useState("");
  const { user } = useAuth();
  //openMobileMenu
  const openMobileMenu = (menu: string) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };
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
      <div className="mean-bar">
        <a href="#nav" className="meanmenu-reveal">
          <span>
            <span>
              <span></span>
            </span>
          </span>
        </a>
        <nav className="mean-nav">
          <ul>
            {filterMainMenus(menu_data).map((item, i) => (
              <li key={i} className={item.has_dropdown ? "has-dropdown" : ""}>
                <Link to={item.link}>{item.title}</Link>
                <ul
                  className="submenu"
                  style={{
                    display: navTitle === item.title ? "block" : "none",
                  }}
                >
                  {filterSubMenus(item?.sub_menus)?.map((inner_item, index) => (
                    <React.Fragment key={index}>
                      {inner_item.title && (
                        <>
                          <li>
                            <Link to={inner_item.link ?? ""} style={inner_item.title === "Logout" ? { color: 'red' } : {}}>
                              {inner_item.title}
                            </Link>
                          </li>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
                {item.has_dropdown || item.img_dropdown ? (
                  <a
                    className={`mean-expand ${
                      item?.title === navTitle ? "mean-clicked" : ""
                    }`}
                    href="#"
                    onClick={() => openMobileMenu(item?.title ?? "")}
                  >
                    <i className="far fa-plus"></i>
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
