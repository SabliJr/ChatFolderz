import React from "react";
import "./Features.css";

import UseChatFolderz from "../../Assets/pexels-bertellifotografia-16094053.jpg";

const Index = () => {
  return (
    <main className='_features_container'>
      <div className='_features_imag_container'>
        <img src={UseChatFolderz} alt='' className='_use_chat_folderz_img' />
      </div>
      <div className='_features_copy'>
        <div className='_features_title'>
          <h2>Lorem, ipsum dolor.</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore,
            dolorum.
          </p>
        </div>
        <div className='_features_points'>
          <h6>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
            porro maiores voluptatibus. Iste, maiores illum.
          </h6>
          <h6>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
            porro maiores voluptatibus. Iste, maiores illum.
          </h6>
          <h6>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
            porro maiores voluptatibus. Iste, maiores illum.
          </h6>
          <h6>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
            porro maiores voluptatibus. Iste, maiores illum.
          </h6>
          <h6>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
            porro maiores voluptatibus. Iste, maiores illum.
          </h6>
        </div>
        <button className='_features_btn'>Try It For Free</button>
      </div>
    </main>
  );
};

export default Index;
