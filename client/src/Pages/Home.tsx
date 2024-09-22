import React from "react";
import "../App.css";

import Hero from "../Components/Hero/index";
// import Middle from "../Components/Middle/index";
import Features from "../Components/Features/index";
// import BeforeTheFooter from "../Components/BeforeTheFooter/index";
import Skeleton from "../utils/Skeleton";
import Pricing from "../Components/Pricing/index";
import FAQ from "../Components/FAQ/index";

const Home = () => {
  return (
    <Skeleton>
      <div className='Home'>
        <Hero />
        {/* <Middle /> */}
        <Features />
        <Pricing />
        <FAQ />
        {/* <BeforeTheFooter /> */}
      </div>
    </Skeleton>
  );
};

export default Home;
