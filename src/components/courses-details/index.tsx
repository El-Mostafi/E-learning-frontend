import { useState } from "react";
import BreadcrumbCoursesDetails from "../../common/breadcrumb/BreadcrumbCoursesDetails";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import CoursesDetailsArea from "./CoursesDetailsArea";

import RelatedCourses from "./RelatedCourses";
import { courseData } from "../../services/coursService";
import { useAuth } from "../../context/AuthContext";
import FooterTwo from "../../layouts/footers/FooterTwo";

const CoursesDetails = () => {
  const {user} = useAuth();
  const [breadcrumbData, setBreadcrumbData] =
    useState<courseData | null>(null);
  return (
    <>
      <Preloader />
      <HeaderOne />
      <BreadcrumbCoursesDetails data={breadcrumbData!} />
      <CoursesDetailsArea setBreadcrumbData={setBreadcrumbData} />
      <RelatedCourses />
      <MarqueeOne style_2={true} />
      {user ? <FooterOne user={user} /> : <FooterTwo />}
      <ScrollTop />
    </>
  );
};

export default CoursesDetails;
