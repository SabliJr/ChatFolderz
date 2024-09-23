import React from "react";
import "./footer.css";

import FooterLogo from "../../Assets/ChatFolderz.svg";
import { useNavigate } from "react-router-dom";

import { RiTwitterXLine } from "react-icons/ri";
import { GrLinkedinOption } from "react-icons/gr";

const Index = () => {
  const laDate = new Date().getFullYear();
  let navigate = useNavigate();

  return (
    <footer className='Footer'>
      <main className='footerMain'>
        {/* <div className='logoAndSM'> */}
        <img src={FooterLogo} alt='' className='footerLogo' />
        {/* <div className='SocialIcons'>
            <a
              href='https://www.instagram.com/wishties_/'
              target='_blank'
              rel='noopener noreferrer'>
              <BsInstagram />
            </a>
           
          </div> */}
        {/* </div> */}
        <div className='footerLinks'>
          <p onClick={() => navigate("/terms-of-service")}>Terms of Service</p>
          <p onClick={() => navigate("/privacy-policy")}> Privacy Policy</p>
          <p onClick={() => navigate("/contact")}>Contact</p>
        </div>
        <div className='_links'>
          <a
            href='https://twitter.com/sablijr'
            target='_blank'
            rel='noopener noreferrer'>
            <RiTwitterXLine />
          </a>
          <a
            href='https://www.linkedin.com/in/sablijr/'
            target='_blank'
            rel='noopener noreferrer'>
            <GrLinkedinOption />
          </a>
        </div>
      </main>
      <div className='copy'>
        <p>ChatFolderz &copy;{laDate}</p>
      </div>
    </footer>
  );
};

export default Index;
