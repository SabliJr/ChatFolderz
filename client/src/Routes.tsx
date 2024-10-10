import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Contact from "./Pages/Contact";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
// import TermsOfService from "./Pages/TermsOfService";
import SubscriptionSuccess from "./Pages/paymentSuccess";

const RoutesFile = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        {/* <Route path='/terms-of-service' element={<TermsOfService />} /> */}
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/success' element={<SubscriptionSuccess />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RoutesFile;
