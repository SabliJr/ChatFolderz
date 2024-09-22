import React, { useState, useRef } from "react";
import "./pricing.css";

// import Fatures from "./features";
import BrandFeaturs from "./BrandFeaturs";
// import { onCheckingOut } from "../../API/leApi";

const Index = () => {
  // const [active, setActive] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [whoIsThis, setWhoIsThis] = useState("Yearly");
  let checkRef = useRef<HTMLInputElement | null>(null);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Checkbox state:", e.target.checked);
    if (e.target.checked) {
      setWhoIsThis("Yearly");
    } else {
      setWhoIsThis("Monthly");
    }
  };

  // const handleCheckOut = async (price: string) => {
  //   setIsLoading(true);

  //   try {
  //     let res = await onCheckingOut(price);
  //     if (res.status === 200) window.location = res.data.url;
  //   } catch (error) {
  //     alert("Something went wrong please try again!");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // let path = window.location.pathname.split("/")[1];
  // if (isLoading && path !== "chose-plan") {
  //   return <Loader />;
  // }

  const handleSpanClick = () => {
    if (checkRef?.current) {
      checkRef?.current?.click();
    }
  };

  return (
    <main className='pricing' id='pricing_scroll'>
      <div className='_pricing_title'>
        <h1>Pricing</h1>
        <p>
          Try it free for 24 hours—if it’s not for you, cancel anytime. No
          commitment, just smarter AI chat management.
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
        {/* <div className='pricing_btns_div'>
          <button
            onClick={handleActive}
            className={active ? "pice_btns" : "pice_btns pice_btns_active"}>
            Monthly
          </button>
          <button
            onClick={handleActive}
            className={active ? "pice_btns pice_btns_active" : "pice_btns"}>
            Yearly
          </button>
        </div> */}
      </div>
      {whoIsThis === "Monthly" ? (
        // <div className='_pricing_container'>
        <div className='_princing_divs'>
          <div className='pricing_item2'>
            <div className='_p_sub_title'>
              <h4>Power Plan</h4>
              <p>
                Unlock a network of sponsors waiting to collaborate with
                creators like you.
              </p>
            </div>
            <h2 className='_price'>
              $9.99 <span>/month</span>
            </h2>
            <BrandFeaturs />
            <button>Try It for free</button>
          </div>
        </div>
      ) : (
        <div className='_princing_divs'>
          <div className='pricing_item2'>
            <div className='_p_sub_title'>
              <h4>Power Plan</h4>
              <p>
                Unlock a network of sponsors waiting to collaborate with
                creators like you.
              </p>
            </div>
            <div className='_price_div'>
              <p>
                <span id='original_price'>$119.99</span>{" "}
                <span className='dis_price'> save 20%</span>
                <br />
              </p>
              <h2 className='_price'>
                $7.99 <span>/year</span>
              </h2>
              <span>Billed annually: $95.99</span>
            </div>
            <BrandFeaturs />
            <button>Try It for free</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Index;
