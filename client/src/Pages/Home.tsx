import React from "react";
import "../App.css";

import Header from "../Components/TheHeader/index";
import Hero from "../Components/Hero/index";
import Features from "../Components/Features/index";
import Pricing from "../Components/Pricing/index";
import FAQ from "../Components/FAQ/index";
import Footer from "../Components/Footer/index";

const Home = () => {
  return (
    <>
      <Header />
      <div className='Home'>
        <Hero />
        <Features />
        <Pricing />
        <FAQ />
      </div>
      <Footer />
    </>
  );
};

export default Home;
