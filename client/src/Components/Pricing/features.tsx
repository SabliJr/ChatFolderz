import React from "react";

import { PiSealCheckLight } from "react-icons/pi";
import { MdClose } from "react-icons/md";

const features = () => {
  return (
    <div>
      <ul className='_pricing_list'>
        <li>
          <span>
            <PiSealCheckLight />
          </span>
          <p>curated list of potential sponsors.</p>
        </li>
        <li>
          <span>
            <PiSealCheckLight />
          </span>
          <p>List of sponsored Creators</p>
        </li>
        <li>
          <span>
            <PiSealCheckLight />
          </span>
          <p>Find Similar Sponsors</p>
        </li>
        <li>
          <span>
            <MdClose />
          </span>
          <p>Niche-Based Searches</p>
        </li>
        <li>
          <span>
            <MdClose />
          </span>
          <p>
            Smart Media Kit. <span>coming soon</span>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default features;
