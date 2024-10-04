import React from "react";

import SignUp from "../Components/Register/gAuth";
import Skeleton from "../utils/Skeleton";

const SignUpPage = () => {
  return (
    <Skeleton>
      <div className='signUpPage'>
        <SignUp />
      </div>
    </Skeleton>
  );
};

export default SignUpPage;
