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
          <p>Create folders</p>
        </li>
        <li>
          <span>
            <PiSealCheckLight />
          </span>
          <p>Bookmark important chats</p>
        </li>
        <li>
          <span>
            <PiSealCheckLight />
          </span>
          <p>Search via all your conversations</p>
        </li>
        <li>
          <span>
            <PiSealCheckLight />
          </span>
          <p>Tag and categorize conversations</p>
        </li>
        <li>
          <span>
            <PiSealCheckLight />
          </span>
          <p>
            General prompt library <span>coming soon</span>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default BrandFeaturs;
