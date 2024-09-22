import React from "react";

import { PiSealCheckLight } from "react-icons/pi";

const BrandFeaturs = () => {
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
            <PiSealCheckLight />
          </span>
          <p>Niche-Based Searches</p>
        </li>
        <li>
          <span>
            <PiSealCheckLight />
          </span>
          <p>
            Smart Media Kit. <span>coming soon</span>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default BrandFeaturs;
