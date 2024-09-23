import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import NotFound from "./Pages/NotFound";
import Verify from "./Pages/VerificationPage";
import CheckEmail from "./Pages/CheckEmail";
import VerifyEmail from "./Components/Verification/verifyEmail";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import AccountSettings from "./Pages/AccountSettings";
import ProtectedRoute from "./ProtectedRoutes";

const RoutesFile = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/verify-email/:token' element={<VerifyEmail />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/terms-of-service' element={<TermsOfService />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/about' element={<About />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/check-email' element={<CheckEmail />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/account-settings' element={<AccountSettings />} />
        </Route>

        <Route path='/*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RoutesFile;
