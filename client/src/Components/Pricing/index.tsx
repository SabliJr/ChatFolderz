import React, { useState, useRef } from "react";
import "./pricing.css";

import BrandFeaturs from "./BrandFeaturs";
import { IoCloseOutline } from "react-icons/io5";
import { PiSealCheckLight } from "react-icons/pi";

const Index = () => {
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
          <div>
            <h4>Super Plan</h4>
            <h2>$349.99</h2>
          </div>
          <ul>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              Lorem ipsum dolor sit amet.
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              Lorem ipsum dolor sit amet.
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              Lorem ipsum dolor sit amet.
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              Lorem ipsum dolor sit amet.
            </li>
            <li>
              <span>
                <IoCloseOutline />
              </span>
              Lorem ipsum dolor sit amet.
            </li>
            <li>
              <span>
                <IoCloseOutline />
              </span>
              Lorem ipsum dolor sit amet.
            </li>
          </ul>
          <button>Try It for free</button>
        </div> */}
        {whoIsThis === "Monthly" ? (
          <div className='_pricing_divs'>
            <div className='pricing_item2'>
              <div className='_p_sub_title'>
                <h4>Monthly Plan</h4>
                {/* <p>
                  Upgrade your AI chat experience. Organize, and optimize your
                  workflow seamlessly.
                </p> */}
              </div>
              <h2 className='_price'>
                $7.99 <span>/month</span>
              </h2>
              <BrandFeaturs />
              <button>
                <a
                  href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
                  target='#blank'>
                  Try It for free
                </a>
              </button>
            </div>
          </div>
        ) : (
          <div className='_pricing_divs'>
            <div className='pricing_item2'>
              <div className='_p_sub_title'>
                <h4>Yearly Plan</h4>
                {/* <p>
                  Upgrade your AI chat experience. Organize, and optimize your
                  workflow seamlessly.
                </p> */}
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
              <button>
                <a
                  href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
                  target='#blank'>
                  Try It for free
                </a>
              </button>
            </div>
          </div>
        )}
        {/* <div className='pricing_item3'>
          <div>
            <h4>Free</h4>
          </div>
          <ul>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              1 Folder
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              3 Key chats bookmarked
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              Sync folders across unlimited devices
            </li>
            <li>
              <span>
                <IoCloseOutline />
              </span>
              Lorem ipsum dolor sit amet.
            </li>
            <li>
              <span>
                <IoCloseOutline />
              </span>
              Lorem ipsum dolor sit amet.
            </li>
            <li>
              <span>
                <IoCloseOutline />
              </span>
              Lorem ipsum dolor sit amet.
            </li>
          </ul>
          <button>Add To Browser</button>
        </div> */}
      </div>
    </main>
  );
};

export default Index;
