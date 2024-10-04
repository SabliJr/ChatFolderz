import React, { useState } from "react";
import "./Register.css";

import UserImg from "./UserImg";
import { useNavigate } from "react-router-dom";
import { onSignUpWithGoogle } from "../../API/authApi";
import Loader from "../../utils/Loader";

import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

const SignUp: React.FC = () => {
  const [gLoginLoading, setGLoginLoading] = useState(false);

  const navigate = useNavigate();

  const signIn = useGoogleLogin({
    onSuccess: (tokenResponse: any) => handleCredentialResponse(tokenResponse),
    ux_mode: "popup",
    select_account: false,
    scope: "profile email openid",
    flow: "auth-code",
  }) as any;

  const handleCredentialResponse = async (response: any) => {
    setGLoginLoading(true);

    try {
      const gVerifyCode = response.code; // Access the ID token directly from the response object

      const res = await onSignUpWithGoogle(gVerifyCode);
      if (res?.status === 201 || res?.status === 202) {
        navigate(`/edit-profile/${res?.data?.user?.username}`);
      }
    } catch (error: any) {
      if (error.response) {
        alert(error?.response?.data?.error);
      }
    } finally {
      setGLoginLoading(false);
    }
  };

  if (gLoginLoading) {
    return <Loader />;
  }

  return (
    <>
      <section className='signSection'>
        <UserImg />
        <div className='signup'>
          <div className='FormsDiv'>
            <div className='_signUp_text'>
              <h3 className='signUpTitle'>Hello!</h3>
              <p className='loginTitle'>
                Sign up today and get you wishes fulfilled.
              </p>
            </div>
            <div>
              <div className='SignUp_icon_div' onClick={() => signIn()}>
                <FcGoogle className='loginIcons' />
                <p>Sign Up With google</p>
              </div>
              <h3 className='or'>Or </h3>
            </div>
            <p className='logText'>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
