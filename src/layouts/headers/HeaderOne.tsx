import NavMenu from "./NavMenu";
import { useState } from "react";
import { Link } from "react-router-dom";
import UseSticky from "../../hooks/UseSticky";
import OffCanvas from "../../common/OffCanvas";
import MarqueeOne from "../../common/MarqueeOne";
import { useAuth } from "../../context/AuthContext";

const HeaderOne = () => {
  const { user } = useAuth();

  const { sticky } = UseSticky();

  const [openCanvas, setOpenCanvas] = useState(false);

  return (
    <>
    <style>
    {`
          .icon-items {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .icon-items i {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            background-color: #C3F499;
            font-size: 14px;
          }
          .icon-items h6 a {
            color: var(--header);
            text-decoration: none;
          }
            .icon-items i img {
              border-radius: 50%;
            }
        `}
    </style>
      <MarqueeOne />
      <header
        id="header-sticky"
        className={`header-1 ${sticky ? "sticky" : ""}`}
      >
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <div className="logo">
                  <Link to="/" className="header-logo">
                    <img src="/assets/img/logo/black-logo.svg" alt="logo-img" />
                  </Link>
                </div>
                
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="mean__menu-wrapper">
                  <div className="main-menu">
                    <nav id="mobile-menu">
                      <NavMenu />
                    </nav>
                  </div>
                </div>
                  {user ? (
                    <div className="icon-items">
                    <i className="" ><img src={user.profileImg || "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"} alt="" /></i>
                    <h6><Link to="/profile">{user.userName.replace("|"," ")}</Link></h6>
                </div>
                  ) : (
                <div className="header-button">

                    <Link to="/register" className="theme-btn yellow-btn">
                      Enroll Now
                    </Link>
                </div>

                  )}
                <div className="header__hamburger d-xl-none my-auto">
                  <div className="sidebar__toggle">
                    <div
                      className="header-bar"
                      onClick={() => setOpenCanvas(!openCanvas)}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <OffCanvas openCanvas={openCanvas} setOpenCanvas={setOpenCanvas} />
    </>
  );
};

export default HeaderOne;
