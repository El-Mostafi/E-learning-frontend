import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Wrapper from "./layouts/Wrapper";
import { AuthProvider } from "./context/AuthContext";

import HomeOne from "./components/homes/home";
import Courses from "./components/courses";
import CoursesGrid from "./components/courses-grid";
import CoursesDetails from "./components/courses-details";
import ShopCart from "./components/shop-cart";
import Checkout from "./components/checkout";
import About from "./components/about";
import Instructor from "./components/instructor";
import InstructorDetails from "./components/instructor-details";
import Faq from "./components/faq";
import SignIn from "./components/sign-in";
import Register from "./components/register";
import NotFound from "./components/Error";
import Contact from "./components/contact";
import Verification from "./components/verification-code";
import ForgotPassword from "./components/forgot-password";
import ResetPassword from "./components/reset-password";
import Profile from "./components/profile";
import MyCourses from "./components/my-cours";
import StudentsdRoutes from "./utils/StuendtsRouters";
import StudentsdInstructorsRoutes from './utils/StuendtsInstructorsRouters';

const router = createBrowserRouter([
  { path: "/", element: <HomeOne /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/register", element: <Register /> },
  { path: "/verification", element: <Verification /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/contact", element: <Contact /> },
  { path: "/instructor", element: <Instructor /> },
  { path: "/instructor-details", element: <InstructorDetails /> },
  { path: "/courses", element: <Courses /> },
  { path: "/courses-grid", element: <CoursesGrid /> },
  { path: "/course-details", element: <CoursesDetails /> },
  { path: "/about", element: <About /> },
  { path: "/faq", element: <Faq /> },
  { path: "/not-found", element: <NotFound /> },
  { path: "*", element: <NotFound /> },

  // Protected Routes
  {
    element: <ProtectedRoutes />, // Wrap all protected routes
    children: [
      { path: "/profile", element: <Profile /> },
    ],
  },
  //Students Routes
  {
    element: <StudentsdRoutes />, 
    children: [
      { path: "/shop-cart", element: <ShopCart /> },
      { path: "/checkout", element: <Checkout /> },
    ],
  },
  //Students and Instructors Routes
  {
    element: <StudentsdInstructorsRoutes />, 
    children: [
      { path: "/my-courses", element: <MyCourses /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <Wrapper>
        <RouterProvider router={router} />
      </Wrapper>
    </AuthProvider>
  );
}

export default App;
