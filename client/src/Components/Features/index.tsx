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
        <ul className='_features_points'>
          <li>Organize chats into custom folders for easy access.</li>
          <li>
            Search through all conversations instantly with advanced search
            tools.
          </li>
          <li>Bookmark important chats to find them quickly later.</li>
          <li>
            Effortlessly navigate through your chat history with intuitive
            tools.
          </li>
          {/* <li>Tag and categorize conversations for better organization.</li> */}
          <li>
            Create and manage a personalized prompt library for quick use.{" "}
            <span className='_features_coming_soon'>coming soon</span>
          </li>
        </ul>
        <button className='_features_btn'>Try It For Free</button>
      </div>
    </main>
  );
};

export default Index;
