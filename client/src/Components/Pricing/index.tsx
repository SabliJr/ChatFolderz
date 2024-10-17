import React, { useState, useRef } from "react";
import "./pricing.css";

import { PiSealCheckLight } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";

import BrandFeaturs from "./BrandFeaturs";
import { onCheckingOut } from "../../API/endpoints";
import Loader from "../../utils/Loader";

const Index = () => {
  const [whoIsThis, setWhoIsThis] = useState("Yearly");
  let checkRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayNotice, setDisplayNotice] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  let monthlyPriceId =
    process.env?.NODE_ENV === "production"
      ? "price_1Q8i7yDuxNnSWA1yhv1Vn8UN"
      : "price_1Q7umiDuxNnSWA1yOR9XCzOz";

  let yearlyPriceId =
    process.env?.NODE_ENV === "production"
      ? "price_1Q8i7tDuxNnSWA1yrIYPqFbl"
      : "price_1Q7unWDuxNnSWA1yxvQ2N4Rv";
  // let lifeTimeDeal = "price_1QACaODuxNnSWA1yy7ssX7uL";

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setWhoIsThis("Yearly");
    } else {
      setWhoIsThis("Monthly");
    }
  };

  const handleSpanClick = () => {
    if (checkRef?.current) {
      checkRef?.current?.click();
    }
  };

  let onCheckOut = async (price_id: string) => {
    setIsLoading(true);

    try {
      // let res =
      //   price_id === monthlyPriceId || price_id === yearlyPriceId
      //     ? await onCheckingOut(price_id)
      //     : await onCheckOutOneTime(price_id);

      let res = await onCheckingOut(price_id);
      console.log(res);
      if (res.status === 200) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      alert("Something went wrong please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const handleCloseNotice = () => {
    setDisplayNotice(false);
    if (selectedPriceId) {
      // onCheckOut(selectedPriceId);
      setSelectedPriceId(null); // Reset the selected price ID
    }
  };

  return (
    <main className='pricing' id='pricing_scroll'>
      {/* {displayNotice && (
        <div className='_notice_container'>
          <div className='_notice_text_div'>
            <IoMdClose onClick={handleCloseNotice} className='_notice_close' />
            <h2 className='_notice_title'>Important Notice...</h2>
            <p className='_notice_text'>
              To ensure a seamless experience, please use the same email address
              that you used to create your account when making your payment on
              Stripe or when creating your account if you already didn't!
              <br />
              <br />
              This will help us link your payment to your account, giving you
              uninterrupted access to our services.
            </p>
          </div>
        </div>
      )} */}
      <div className='_pricing_title'>
        <h1>Pricing</h1>
        <p>
          Upgrade your AI chat experience. Organize, and optimize your workflow
          seamlessly. Try it free for 24 hours—if it’s not for you, cancel
          anytime. No commitment, just smarter AI chat management.
        </p>
        <label htmlFor='' className='_switcher'>
          <input
            type='checkbox'
            onChange={(e) => handleToggle(e)}
            checked={whoIsThis === "Yearly"}
            ref={checkRef}
          />
          <span className='_slider' onClick={handleSpanClick}></span>
        </label>
      </div>
      <div className='_prices_container'>
        {/* <div className='pricing_item0'>
          <div className='_p_sub_title'>
            <h4>Super Plan</h4>
          </div>
          <h2 className='_price'>
            $349.99 <span>/One time</span>
          </h2>
          <ul className='_pricing_list'>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>Create folders</p>
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>Bookmark important chats</p>
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>Search via all your conversations</p>
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>Best for teams & organizations</p>
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>Priority 1 to 1 Support</p>
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>
                General prompt library <span>coming soon</span>
              </p>
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>
                Link up to 15 ChatGPT accounts <span>coming soon</span>
              </p>
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>
                Sync folders across unlimited devices <span>coming soon</span>
              </p>
            </li>
          </ul>
          <button onClick={() => onCheckOut(lifeTimeDeal)}>
            Try It for free
          </button>
        </div> */}
        {whoIsThis === "Monthly" ? (
          // <div className='_pricing_divs'>
          <div className='pricing_item1'>
            <div className='_p_sub_title'>
              <h4>Monthly Plan</h4>
            </div>
            <h2 className='_price'>
              $7.99 <span>/month</span>
            </h2>
            <BrandFeaturs />
            {/* <button
              onClick={() => {
                setDisplayNotice(true);
                setSelectedPriceId(monthlyPriceId);
              }}>
              Try It for free
            </button> */}
            <button>
              <a
                className='_free_link'
                href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
                target='#blank'>
                Try It For Free
              </a>
            </button>
          </div>
        ) : (
          // </div>
          // <div className='_pricing_divs'>
          <div className='pricing_item1'>
            <div className='_p_sub_title'>
              <h4>Yearly Plan</h4>
            </div>
            <div className='_price_div'>
              <p>
                <span id='original_price'>$95.88</span>{" "}
                <span className='dis_price'> save 20%</span>
                <br />
              </p>
              <h2 className='_price'>
                $76.70 <span>/year</span>
              </h2>
              <span className='_monthly_yearly_price'>6.39 /month</span>
            </div>
            <BrandFeaturs />
            {/* <button
              onClick={() => {
                setDisplayNotice(true);
                setSelectedPriceId(yearlyPriceId);
              }}>
              Try It for free
            </button> */}
            <button>
              <a
                className='_free_link'
                href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
                target='#blank'>
                Try It For Free
              </a>
            </button>
          </div>
          // </div>
        )}
        <div className='pricing_item2'>
          <div className='_p_sub_title'>
            <h4>Free</h4>
            <ul className='_pricing_list'>
              <li>
                <span>
                  <PiSealCheckLight />
                </span>
                <p>Create up to 2 folders</p>
              </li>
              <li>
                <span>
                  <PiSealCheckLight />
                </span>
                <p>Bookmark up to 3 key chats</p>
              </li>
              <li>
                <span>
                  <PiSealCheckLight />
                </span>
                <p>
                  Sync the folder across unlimited devices{" "}
                  <span>coming soon</span>
                </p>
              </li>
            </ul>
          </div>

          <button>
            <a
              className='_free_link'
              href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
              target='#blank'>
              Add To Browser
            </a>
          </button>
        </div>
      </div>
    </main>
  );
};

export default Index;
