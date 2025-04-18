import React from "react";
import "./Features.css";

import UseChatFolderz from "../../Assets/CF5.jpg";

const Index = () => {
  return (
    <main className='_features_container' id='Features'>
      <div className='_features_imag_container'>
        <img src={UseChatFolderz} alt='' className='_use_chat_folderz_img' />
      </div>
      <div className='_features_copy'>
        <div className='_features_title'>
          <h2>Your Ultimate AI Chat Management Toolkit.</h2>
        </div>
        <p className='_features_text'>
          Easily organize your chats into folders, bookmark important
          discussions, and search across all conversations to find exactly what
          you need—fast.
          <br />
          <br />
          Plus, a high-quality prompt library & prompt manager on the way, along
          with more exciting features to boost your productivity and enhance
          your AI chat experience. Say goodbye to clutter and hello to a
          smarter, more organized workflow!
        </p>
        <button className='_features_btn'>
          <a
            href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
            target='#blank'>
            Add To Browser
          </a>
        </button>
      </div>
    </main>
  );
};

export default Index;
