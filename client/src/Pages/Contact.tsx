import React from "react";
import "./Pages.css";
import Skeleton from "../utils/Skeleton";

import { GrLinkedinOption } from "react-icons/gr";
import { RiTwitterXLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";

const Contact = () => {
  return (
    <Skeleton>
      <div className='_contact_help'>
        <div>
          <h3 className='_contact_title'>Contact us.</h3>
          <p className='_contact_p'>
            We are here to help you with any questions you may have. Please feel
            free to contact us.
          </p>
        </div>

        <ul className='_contact_list'>
          <li>
            <a href='mailto:info.chatfolderz@gmail.com'>
              <span>
                <MdEmail />
              </span>
              info.chatfolderz@gmail.com
            </a>
          </li>{" "}
          <li>
            <a
              href='https://www.linkedin.com/in/sablijr/'
              target='_blank'
              rel='noopener noreferrer'>
              <span>
                <GrLinkedinOption />
              </span>
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href='https://twitter.com/sablijr'
              target='_blank'
              rel='noopener noreferrer'>
              <span>
                <RiTwitterXLine />
              </span>
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </Skeleton>
  );
};

export default Contact;
