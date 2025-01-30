import { Link } from "react-router-dom";
import NiceSelect from "../../ui/NiceSelect";

 

const ShopGridArea = () => {
  const selectHandler = (_e: any) => { };

  return (
    <>
      <section className="shop-section section-padding">
            <div className="container">
                <div className="shop-wrapper">
                    <div className="coureses-notices-wrapper mb-4">
                        <div className="courses-showing">
                            <div className="icon-items">
                                <Link to="/shop-grid"><i className="fas fa-th"></i></Link>
                                <Link to="/shop-list"><i className="fas fa-bars"></i></Link>
                            </div>
                            <h5>Showing <span>1-9</span> Of <span>62</span> Results</h5>
                        </div>
                        <div className="form-clt"> 
                             <NiceSelect
                                className="category"
                                options={[
                                    { value: "01", text: "Sort by : Default" },
                                    { value: "02", text: "Sort by popularity" },
                                    { value: "03", text: "Sort by average rating" },
                                    { value: "04", text: "Sort by latest" }, 
                                ]}
                                defaultCurrent={0}
                                onChange={selectHandler}
                                name=""
                                placeholder="" />
                         </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/01.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">A Prayer for Owen Meany</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/02.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">All the Light We Cannot See</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/03.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">Don’t forget the girl</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/04.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">Love in the Time of Cholera</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/05.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">Memoirs of a Geisha</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/06.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">Pride and Prejudice</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/07.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">The Catcher in the Rye</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/08.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">The House of the Spirits</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/09.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">The Old Man and the Sea</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/10.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">The House of the Spirits</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/11.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">The Curious Incident of the</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6">
                            <div className="shop-box-items">
                                <div className="book-thumb center">
                                    <Link to="/shop-details"><img src="assets/img/shop/12.jpg" alt="img" /></Link>
                                    <ul className="shop-icon d-grid justify-content-center align-items-center">
                                        <li>
                                            <Link to="/shop-cart"><i className="far fa-heart"></i></Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-cart">
                                                <i className="far fa-bookmark"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shop-details"><i className="far fa-eye"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="shop-content">
                                    <h3><Link to="/shop-details">The Elegance of the Hedgehog</Link></h3>
                                    <ul className="price-list">
                                        <li>$39.00</li>
                                        <li>
                                            <i className="fas fa-star"></i>
                                            3.4 (25)
                                        </li>
                                    </ul>
                                    <div className="shop-button">
                                        <Link to="/shop-details" className="theme-btn"><i className="far fa-shopping-basket"></i> Add To Cart</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="page-nav-wrap text-center pt-5">
                        <ul>
                            <li><a className="page-numbers" href="#">1</a></li>
                            <li><a className="page-numbers" href="#">2</a></li>
                            <li><a className="page-numbers" href="#">3</a></li>
                            <li><a className="page-numbers" href="#">4</a></li>
                            <li><a className="page-numbers" href="#"><i className="far fa-arrow-right"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </>
  );
};

export default ShopGridArea;