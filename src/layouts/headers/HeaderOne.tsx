import NavMenu from "./NavMenu";
import { useState } from "react";
import { Link } from "react-router-dom";
import Search from "../../common/Search";
import UseSticky from "../../hooks/UseSticky";
import NiceSelect from "../../ui/NiceSelect";
import OffCanvas from "../../common/OffCanvas";
import MarqueeOne from "../../common/MarqueeOne";

 
const HeaderOne = () => {

  const selectHandler = (_e: any) => { };
  const { sticky } = UseSticky()


  const [open, setOpen] = useState(false)
  const [openCanvas, setOpenCanvas] = useState(false)


  return (
    <>
    <MarqueeOne />
     <header id="header-sticky" className={`header-1 ${sticky ? "sticky" : ""}`}>
            <div className="container-fluid">
                <div className="mega-menu-wrapper">
                    <div className="header-main">
                        <div className="header-left">
                            <div className="logo">
                                <Link to="/" className="header-logo">
                                    <img src="assets/img/logo/black-logo.svg" alt="logo-img" />
                                </Link>
                            </div>
                            <div className="category-oneadjust">
                               <div className="dot">
                                    <img src="assets/img/logo/dot.png" alt="img" />
                               </div> 

                                <NiceSelect
                                  className="category"
                                  options={[
                                    { value: "01", text: "Category" },
                                    { value: "02", text: "Web Design" },
                                    { value: "03", text: "Web Development" },
                                    { value: "04", text: "Graphic Design" },
                                    { value: "05", text: "Software Eng" },
                                  ]}
                                  defaultCurrent={0}
                                  onChange={selectHandler}
                                  name=""
                                  placeholder="" />

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
                            <div className="header-search">
                                <button 
                                onClick={ () => setOpen(!open)}
                                className="d-flex align-items-center search-toggle"><i className="fas fa-search"></i></button>
                            </div>
                            <div className="header-button">
                                <Link to="/sign-in" className="theme-btn style-2"><i className="far fa-user"></i> Admin</Link>
                                <Link to="/register" className="theme-btn yellow-btn">Enroll Now</Link>
                            </div>
                            <div className="header__hamburger d-xl-none my-auto">
                                <div className="sidebar__toggle">
                                    <div className="header-bar" onClick={ () => setOpenCanvas(!openCanvas)}>
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

        <Search open={open} setOpen={setOpen} />
        <OffCanvas openCanvas={openCanvas} setOpenCanvas={setOpenCanvas} />
      
    </>
  );
};

export default HeaderOne;