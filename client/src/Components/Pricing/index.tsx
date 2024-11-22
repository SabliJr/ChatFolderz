import "./pricing.css";

import { PiSealCheckLight } from "react-icons/pi";
import BrandFeaturs from "./BrandFeaturs";

const Index = () => {
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
