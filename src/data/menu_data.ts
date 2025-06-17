 


 

 
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
		title2?: string | any;
		btn_title?: string;
		one_page_link?: string | any;
		one_page_title?: string;
		demo_img?: string | any;
    inner_menu?: boolean;   
    inner_menus?: {
       link?: string; title?: string 
    }[];
	}[];
}

// menu data
const menu_data:DataType[] = [
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
		],
	},
	{
		id: 3,
		title: "Events",
		link: "#",
    icon: "fas fa-gift",
		has_dropdown: true,
		sub_menus: [
			{ link: "/event", title: "event" },
			{ link: "/event-details", title: "Event Details" },
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
		title: "Pages",
		link: "#",
    icon: "fas fa-file-alt",
		has_dropdown: true,
		has_dropdown_inner: false,
		sub_menus: [
			{ link: "/about", title: "About" },
			{ link: "/instructor", title: "Instructor" },
			{ link: "/sign-in", title: "Sign In" },
			{ link: "/register", title: "register" },
		],
	},
	{
		id: 6,
		title: "Contact",
		link: "/contact",
    icon: "fas fa-phone-rotary",
		has_dropdown: false,
	},
];
export default menu_data;
