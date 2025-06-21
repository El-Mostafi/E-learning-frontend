interface DataType {
  id: number;
  title?: string;
  link: string;
  icon: string;
  img_dropdown?: boolean;
  has_dropdown?: boolean;
  has_dropdown_inner?: boolean;
  sub_menus?: {
    link?: string;
    title?: string;
    btn_title?: string;
    one_page_title?: string;
    inner_menu?: boolean;
    inner_menus?: {
      link?: string;
      title?: string;
    }[];
  }[];
}

// menu data
const menu_data: DataType[] = [
  {
    id: 1,
    title: "Home",
    link: "/",
    icon: "fas fa-home-lg",
    img_dropdown: false,
  },
  {
    id: 2,
    title: "Courses",
    link: "#",
    icon: "fas fa-book",
    has_dropdown: true,
    sub_menus: [
      { link: "/courses", title: "Courses" },
      { link: "/courses-grid", title: "Courses Grid" },
      { link: "/my-courses", title: "My Courses" },
    ],
  },
  {
    id: 3,
    title: "Instructors",
    link: "#",
    icon: "fas fa-chalkboard-teacher",
    has_dropdown: true,
    sub_menus: [
      { link: "/instructor", title: "Our Instructors" },
    ],
  },
  {
    id: 4,
    title: "Shop",
    link: "#",
    icon: "fas fa-shopping-bag",
    has_dropdown: true,
    sub_menus: [
      { link: "/shop-cart", title: "Shop Cart" },
      { link: "/checkout", title: "Checkout" },
    ],
  },
  {
    id: 5,
    title: "About Us",
    link: "/about",
    icon: "fas fa-info-circle",
    has_dropdown: false,
    img_dropdown: false,
  },
  {
    id: 6,
    title: "Contact",
    link: "/contact",
    icon: "fas fa-phone-rotary",
    has_dropdown: false,
  },
  {
    id: 7,
    title: "Account",
    link: "#",
    icon: "fas fa-user",
    has_dropdown: true,
    sub_menus: [
      { link: "/sign-in", title: "Sign In" },
      { link: "/register", title: "Register" },
      { link: "/forgot-password", title: "Forgot Password" },
      { link: "/sign-in", title: "Logout" }, // Logout should be dynamic
    ],
  },
];

export default menu_data;
