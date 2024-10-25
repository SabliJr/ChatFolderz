import "./Hero.css";

import Line1 from "../../Assets/Line1.svg";
import Line2 from "../../Assets/Line2.svg";
import PromoImg from "../../Assets/ChatFolderz.png";
import GPT from "../../Assets/Gpt.png";
// import Claude from "../../Assets/Claude_Ai.png";

const Index = () => {
  return (
    <section className='hero'>
      <h2>
        <span className='_first_span'>
          <img src={Line2} alt='' className='_hero_line2' />
          Organize
        </span>{" "}
        ChatGPT & stay{" "}
        <span className='_second_span'>
          <img src={Line1} alt='' className='_hero_line' />
          productive
        </span>{" "}
        .
      </h2>
      {/* <h2>
        Boost{" "}
        <span className='_first_span'>
          <img src={Line2} alt='' className='_hero_line2' />
          productivity
        </span>{" "}
        & stay{" "}
        <span className='_second_span'>
          <img src={Line1} alt='' className='_hero_line' />
          organized
        </span>{" "}
        in ChatGPT.
      </h2> */}
      {/* <h2>
        Unleash the Full Power of AI,{" "}
        <span className='_first_span'>
          <img src={Line2} alt='' className='_hero_line2' />
          Organized
        </span>{" "}
        &{" "}
        <span className='_second_span'>
          <img src={Line1} alt='' className='_hero_line' />
          Optimized
        </span>
        .
      </h2> */}
      <p>
        Everything you need to organize your AI chats into folders, bookmark
        important chats, quick history search, and manage your prompts in one
        browser extension.
      </p>
      {/* <p>
        Easily organize and manage all your AI conversations in one place.
        Create folders, bookmark important chats, and search through your
        history effortlessly.
      </p> */}
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
        {/* <div className='_logos_div'> */}
        <img src={GPT} alt='' className='_i_img' />
        {/* <span className='_claude_container'>
          <img src={Claude} alt='' className='_i_img' />
          <p id='_claude_coming_soon'>Coming Soon</p>
        </span> */}
        {/* </div> */}
      </div>
      <img src={PromoImg} alt='promImg' className='promImg' />
    </section>
  );
};

export default Index;
