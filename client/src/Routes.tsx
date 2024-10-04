import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import NotFound from "./Pages/NotFound";
import Contact from "./Pages/Contact";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import AccountSettings from "./Pages/AccountSettings";
import ProtectedRoute from "./ProtectedRoutes";

const RoutesFile = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/terms-of-service' element={<TermsOfService />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/account-settings' element={<AccountSettings />} />
        </Route>

        <Route path='/*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RoutesFile;
