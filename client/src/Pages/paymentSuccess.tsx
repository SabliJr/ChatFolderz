import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { onSuccessCheckingOut } from "../API/endpoints";

import "./Pages.css";

import Logo from "../Assets/La_logo.png";
import Footer from "../Components/Footer/index";

const SubscriptionSuccess = () => {
  const [isEverythingOkay, setIsEverythingOkay] = useState(false);

  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await onSuccessCheckingOut(sessionId as string);
        console.log("res: ", res);

        if (res.status === 200) {
          let { customer_id } = res.data.user;
          if (customer_id) setIsEverythingOkay(true);
        }
      } catch (error) {
        alert(
          "The payment didn't go through, something went wrong please try again!"
        );
      }
    };

    fetchSession();
  }, [sessionId]);

  return (
    <>
      {isEverythingOkay && (
        <>
          <main>
            <div className='_payment_success_container'>
              <img src={Logo} alt='' className='_payment_success_logo' />
              <div className='_payment_success_text'>
                <h3>You’re All Set! 🎉 </h3>
                <p>
                  Congratulations on unlocking your 24-hour free trial! Your AI
                  chats are about to get a whole lot more organized. With
                  folders, bookmarks, search, and more at your fingertips,
                  managing your conversations has never been easier.
                  <br />
                  <br />
                  Take full advantage of everything the extension has to
                  offer—and there’s even more exciting features on the way!
                  <br />
                  <br />
                  We’re constantly improving, so stay tuned for updates that
                  will make your experience even better. Your trial starts now,
                  and we’re thrilled to have you on board! To get started, just
                  head back to ChatGPT and refresh the page. Your new features
                  are ready to go!
                </p>
              </div>
            </div>
            <Footer />
          </main>
        </>
      )}
    </>
  );
};

export default SubscriptionSuccess;
