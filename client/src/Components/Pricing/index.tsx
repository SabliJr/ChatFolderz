import React, { useState, useRef } from "react";
import "./pricing.css";

import { PiSealCheckLight } from "react-icons/pi";
import BrandFeaturs from "./BrandFeaturs";

const Index = () => {
  const [whoIsThis, setWhoIsThis] = useState("Yearly");
  let checkRef = useRef<HTMLInputElement | null>(null);

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
        <div className='pricing_item0'>
          <div className='_p_sub_title'>
            <h4>
              Super Plan <span>— unlimited</span>
            </h4>
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
                Link unlimited ChatGPT accounts <span>coming soon</span>
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
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>
                Manage your prompts <span>coming soon</span>
              </p>
            </li>
          </ul>
          <a
            className='_free_link'
            href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
            target='#blank'>
            <button>Try It for free</button>
          </a>
        </div>
        {whoIsThis === "Monthly" ? (
          <div className='pricing_item1'>
            <div className='_p_sub_title'>
              <h4>Monthly Plan</h4>
            </div>
            <h2 className='_price'>
              $7.99 <span>/month</span>
            </h2>
            <BrandFeaturs />
            <a
              className='_free_link'
              href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
              target='#blank'>
              <button>Try It for free</button>
            </a>
          </div>
        ) : (
          <div className='pricing_item1'>
            <div className='_p_sub_title'>
              <h4>Power Plan</h4>
            </div>
            <div className='_price_div'>
              <h2 className='_price'>
                $129.99 <span>/One time</span>
              </h2>
              <h2 className='_price'>
                $76.70 <span>/year</span>
              </h2>
            </div>
            <BrandFeaturs />
            <a
              className='_free_link'
              href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
              target='#blank'>
              <button>Try It for free</button>
            </a>
          </div>
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

          <a
            className='_free_link'
            href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
            target='#blank'>
            <button>Add To Browser</button>
          </a>
        </div>
      </div>
    </main>
  );
};

export default Index;
