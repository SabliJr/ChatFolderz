import React, { useState } from "react";
import "./faqs.css";

import { PiPlusBold } from "react-icons/pi";
import Line3 from "../../Assets/_line3.svg";

const Index = () => {
  const [revealQuestion, setReveal] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const toggleQuestion = (idx: number) => {
    setReveal(revealQuestion.map((item, i) => (i === idx ? !item : false)));
  };

  return (
    <main className='_questions_container' id='faq'>
      <h2>FAQs.</h2>
      <p className='_q_title_text'>All the A's to your Q's.</p>
      <div className='_questions'>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>Is my data safe?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(0)} />
          </div>
          <p
            className={
              revealQuestion[0]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Yes, your data is secure. We only collect basic info like your name
            and email for authentication, and all chats and folders are stored
            locally on your device. Payments are handled securely through
            Stripe, and we prioritize your privacy and data protection at all
            times.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>Which AI platforms does this extension support?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(1)} />
          </div>
          <p
            className={
              revealQuestion[1]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Our extension supports GPT as teh moment allowing you to organize
            and manage all your AI chats seamlessly. However, a Claude version
            is coming soon!
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>How does the free 24-hour trial work?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(2)} />
          </div>
          <p
            className={
              revealQuestion[2]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Once you sign up, you get full access to all features for 24 hours.
            If you’re not satisfied, you can cancel anytime before the trial
            ends with no charge.
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>What’s included in the monthly and yearly plans?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(3)} />
          </div>
          <p
            className={
              revealQuestion[3]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Both plans give you full access to the extension's features,
            including creating folders, bookmarking chats, advanced search, and
            more... The only difference, the yearly plan offers a discounted
            rate at $6.39/month instead of $7.99 (billed annually $76.70).
          </p>
        </div>
        <div className='_questions_div'>
          <div className='_q_div'>
            <h4>Can I cancel my subscription anytime?</h4>
            <PiPlusBold className='_q_icon' onClick={() => toggleQuestion(4)} />
          </div>
          <p
            className={
              revealQuestion[4]
                ? "_questions_div_reveal"
                : "_questions_div_none"
            }>
            Yes! You can cancel your subscription anytime from your account
            settings. Once canceled, you'll continue to have access until the
            end of your billing period.
          </p>
        </div>
      </div>
      <div className='_q_chat_div'>
        <h3 className='_q_chat_title'>
          Do you still have a question?
          <img src={Line3} alt='' className='_footer_line' />
        </h3>
        <p className='_q_chat_text'>
          send us an email on <span>chatfolderz@gmail.com</span> and we will get
          back to you on no time! Otherwise...
        </p>
        <button className='_get_started_btn'>
          <a
            href='https://chromewebstore.google.com/detail/chatfolderz-ai-chat-organ/ibelppoiheipgceppgklepmjcafbdcdm?hl'
            target='#blank'>
            Add To Browser
          </a>
        </button>
      </div>
    </main>
  );
};

export default Index;
