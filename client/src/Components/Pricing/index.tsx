// import React, { useState, useRef } from "react";
import "./pricing.css";

import { PiSealCheckLight } from "react-icons/pi";
import BrandFeaturs from "./BrandFeaturs";

const Index = () => {
  // const [whoIsThis, setWhoIsThis] = useState("Yearly");
  // let checkRef = useRef<HTMLInputElement | null>(null);

  // const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.checked) {
  //     setWhoIsThis("Yearly");
  //   } else {
  //     setWhoIsThis("Monthly");
  //   }
  // };

  // const handleSpanClick = () => {
  //   if (checkRef?.current) {
  //     checkRef?.current?.click();
  //   }
  // };

  return (
    <main className='pricing' id='pricing_scroll'>
      <div className='_pricing_title'>
        <h1>Pricing</h1>
        <p>
          Your AI chats will be more than just conversations—they’ll become an
          organized, easy-to-access knowledge base.
        </p>
      </div>
      <div className='_prices_container'>
        {/* <div className='pricing_item0'>
          <div className='_p_sub_title'>
            <h4>
              Super Plan <span>— unlimited</span>
            </h4>
          </div>
          <h2 className='_price'>
            $299.99 <span>/One time</span>
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
              <p>Sync folders across unlimited devices</p>
            </li>
            <li>
              <span>
                <PiSealCheckLight />
              </span>
              <p>Add unlimited chats across unlimited folders.</p>
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
                General prompt library <span>coming soon</span>
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
            <button>Add To Browser</button>
          </a>
        </div> */}
        {/* {whoIsThis === "Monthly" ? ( */}
        {/* ) : ( */}
        <div className='pricing_item1'>
          <div className='_p_sub_title'>
            <h4>Power Plan</h4>
          </div>
          <div className='_price_div'>
            <h2 className='_price'>
              $99.99 <span>/One time</span>
            </h2>
            <h2 className='_price'>
              $59.99 <span>/year</span>
            </h2>
          </div>
          <BrandFeaturs />
          <a
            className='_free_link'
            href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
            target='#blank'>
            <button>Add To Browser</button>
          </a>
        </div>
        <div className='pricing_item1'>
          <div className='_p_sub_title'>
            <h4>Monthly Plan</h4>
          </div>
          <h2 className='_price'>
            $5.99 <span>/month</span>
          </h2>
          <BrandFeaturs />
          <a
            className='_free_link'
            href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
            target='#blank'>
            <button>Add To Browser</button>
          </a>
        </div>
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
                <p>Add up to 5 chats across 2 folders.</p>
              </li>
              <li>
                <span>
                  <PiSealCheckLight />
                </span>
                <p>Bookmark 1 key chat</p>
              </li>
              <li>
                <span>
                  <PiSealCheckLight />
                </span>
                <p>Sync folder across all your devices</p>
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
