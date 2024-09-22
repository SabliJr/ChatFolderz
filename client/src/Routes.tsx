import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import NotFound from "./Pages/NotFound";
import WishList from "./Pages/WishList";
import Verify from "./Pages/VerificationPage";
import CheckEmail from "./Pages/CheckEmail";
import VerifyEmail from "./Components/Verification/verifyEmail";
import Contact from "./Pages/Contact";
import Help from "./Pages/Help";
import About from "./Pages/About";
import HowItWorks from "./Pages/HowItWorks";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import AccountSettings from "./Pages/AccountSettings";
import ProtectedRoute from "./ProtectedRoutes";
import CreatorWishlist from "./Pages/CreatorWishlist";

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
        <Route path='/how-it-works' element={<HowItWorks />} />
        <Route path='/help' element={<Help />} />
        <Route path='/about' element={<About />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/check-email' element={<CheckEmail />} />
        <Route path='/:username' element={<CreatorWishlist />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/account-settings' element={<AccountSettings />} />
          <Route path='/edit-profile/:username' element={<WishList />} />
        </Route>

        <Route path='/*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RoutesFile;
