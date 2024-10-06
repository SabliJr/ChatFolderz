import React from "react";
import "./Pages.css";

import NotFoundSvg from "../utils/404_svg";

import Footer from "../Components/Footer/index";
import Header from "../Components/TheHeader/index";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className='_404_page_container'>
        <div className='_404_svg'>
          <NotFoundSvg />
        </div>
        <h2 className='_not_found_title'>Not Found!</h2>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
