import { useState } from "react";
import BreadcrumbCoursesDetails from "../../common/breadcrumb/BreadcrumbCoursesDetails";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import CoursesDetailsArea from "./CoursesDetailsArea";

import RelatedCourses from "./RelatedCourses";
import { courseData, courseDataDetails } from "../../services/coursService";

const CoursesDetails = () => {
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
      <FooterOne />
      <ScrollTop />
    </>
  );
};

export default CoursesDetails;
