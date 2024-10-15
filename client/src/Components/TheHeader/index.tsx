import React, { useState, useEffect } from "react";
import "./Header.css";

import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import Logo from "../../Assets/La_logo.png";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className='Header'>
      <Link to='/'>
        <img src={Logo} alt='' className='_logo' />
      </Link>

      <nav className={scrolled ? "_nav_scrolled  _nav" : "_nav"}>
        <li>
          <ScrollLink
            className='_login_text'
            to='Features'
            spy={true}
            smooth={true}
            offset={-100}
            duration={500}>
            Features
          </ScrollLink>
        </li>
        <li>
          <ScrollLink
            to='pricing_scroll'
            className='_login_text'
            spy={true}
            smooth={true}
            offset={-100}
            duration={500}>
            Pricing
          </ScrollLink>
        </li>
        <li>
          <ScrollLink
            className='_login_text'
            to='faq'
            spy={true}
            smooth={true}
            offset={-100}
            duration={500}>
            FAQ
          </ScrollLink>
        </li>

        {scrolled && (
          <button className='_header_btn'>
            <a href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'>
              Download
            </a>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Index;
