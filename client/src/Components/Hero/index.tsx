import "./Hero.css";

import Line1 from "../../Assets/Line1.svg";
import Line2 from "../../Assets/Line2.svg";
import PromoImg from "../../Assets/ChatFolderz.png";
import GPT from "../../Assets/Gpt.png";

const Index = () => {
  return (
    <section className='hero'>
      <h2>
        <span className='_first_span'>
          <img src={Line2} alt='' className='_hero_line2' />
          Organize
        </span>{" "}
        Your Chats, Boost Your{" "}
        <span className='_second_span'>
          <img src={Line1} alt='' className='_hero_line' />
          Productivity
        </span>
        .
      </h2>
      <p>
        Everything you need to organize your ChatGPT conversations into folders,
        bookmark important chats, quick history search, and manage your prompts
        in one browser extension.
      </p>
      <div className='emailDiv'>
        <button>
          <a
            href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
            target='#blank'>
            Add To Browser
          </a>
        </button>
      </div>
      <div className='_i_img_container'>
        <span className='_best_i'>Best Integrated With:</span>
        <img src={GPT} alt='' className='_i_img' />
      </div>
      <img src={PromoImg} alt='promImg' className='promImg' />
    </section>
  );
};

export default Index;
