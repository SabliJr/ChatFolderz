import React, { useState, useContext } from "react";
import "./Header.css";

import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

import Logo from "../../Assets/ChatFolderz.svg";
import { RiMenu4Line } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/globalVariablesTypes";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleTrigger = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { cartItems } = contextValues as iGlobalValues;

  return (
    <header className='Header'>
      <Link to='/' className='_logo'>
        {/* ChatFolderz */}
        <img src={Logo} alt='' />
      </Link>

      {/* <div className='_cart_menu_div'> */}
      {/* <div className={`navStuff ${isOpen ? "navStaff expand" : ""}`}> */}
      {/* <div className='navButtons'> */}
      <nav className='_nav'>
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

        {/* <button onClick={() => navigate("/signUp")}>Try For Free</button> */}
      </nav>
      {/* </div> */}
      {/* </div> */}
      <RiMenu4Line className='menuIcon' onClick={handleTrigger} />
      {/* </div> */}
    </header>
  );
};

export default Index;
