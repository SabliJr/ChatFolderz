import React, { useState } from "react";
import "./faqs.css";

import { useNavigate } from "react-router-dom";
import { PiPlusBold } from "react-icons/pi";
// import ChatLogo from "../../Assets/chat.png";
import { useAuth } from "../../Context/AuthProvider";
import Line3 from "../../Assets/_line3.svg";

const Index = () => {
  const [revealQuestion, setReveal] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const { state } = useAuth();
  const toggleQuestion = (idx: number) => {
    setReveal(revealQuestion.map((item, i) => (i === idx ? !item : false)));
  };

  const navigate = useNavigate();
  // const handleAccess = () => {
  //   state.isAuthenticated && state.accessToken
  //     ? navigate(`/dashboard/${state.customer_id}`)
  //     : navigate("/signUp");
  // };

  return (
    <main className='_questions_container' id='faq'>
      <h2>FAQs.</h2>
      <p className='_q_title_text'>All the A's to your Q's.</p>
      <div className='_questions'>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>How rapidly can I discover a suitable sponsor?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(0)} />
          </div>
          <p
            className={
              revealQuestion[0]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            In no time at all! While your niche and audience preferences play a
            role, Sponsorwave lets you uncover potential sponsors in minutes.
            Our platform equips you with strategic tools, designed to help you
            target your search based on your niche and audience interests.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>
              What subscriber threshold do I need to start seeing results?
            </h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(1)} />
          </div>
          <p
            className={
              revealQuestion[1]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            You can leverage the service once you start receiving direct sponsor
            inquiries. Typically, it depends to your niche, channel language,
            dimorphic, etc... That being said, you would be better off if you
            have above 50k.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>Can I get a free trial?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(2)} />
          </div>
          <p
            className={
              revealQuestion[2]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            No. We do not provide a free trial. However, our comprehensive guide
            will show you how the platform works.{" "}
            <span
              className='_q_click_here'
              onClick={() => navigate("/how-it-works")}>
              Click here!
            </span>
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>What type of sponsors can I get ?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(3)} />
          </div>
          <p
            className={
              revealQuestion[3]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            You can connect with a wide range of sponsors actively engaged in
            the YouTube ecosystem. We provide detailed insights into each
            sponsor’s activity, including the types of YouTubers they typically
            collaborate with, their sponsorship frequency, and their current
            sponsorship status.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>How simple is it to use the tool?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(4)} />
          </div>
          <p
            className={
              revealQuestion[4]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            It’s very straightforward. Just enter a brand, YouTuber, or niche
            into the search bar and see instant results. You can also use, save,
            and explore tags, track trends, set filters, and bookmark favorites.
            Direct links make it easy to contact sponsors immediately.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>Will I get the sponsors’ contact info?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(5)} />
          </div>
          <p
            className={
              revealQuestion[5]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Unfortunately, at the moment we don’t provide the sponsors’ contact
            info. The reason is that the information is private and difficult to
            verify. Our team is working on this, and we are trying to find a way
            to not only offer you potential sponsors but also provide legitimate
            contact information to facilitate the connection even more.
          </p>
        </div>
      </div>
      <div className='_q_chat_div'>
        {/* <img src={ChatLogo} alt='chat logo' className='q_chat_logo' /> */}
        <h3 className='_q_chat_title'>
          Do you still have a question? {/* <span> */}
          <img src={Line3} alt='' className='_footer_line' />
          {/* </span> */}
        </h3>
        <p className='_q_chat_text'>
          send us an email on <span>info.sponsorwave@gmail.com</span> and we
          will get back to you on no time! Otherwise...
        </p>
        <button className='_get_started_btn'>Add To Browser</button>
      </div>
    </main>
  );
};

export default Index;
