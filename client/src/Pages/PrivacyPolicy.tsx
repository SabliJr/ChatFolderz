import React from "react";

import Footer from "../Components/Footer/index";
import Header from "../Components/TheHeader/index";

const PrivacyPolicy = () => {
  return (
    <main className='_policy_container'>
      <Header />
      <div className='_Policy_text_container'>
        <div className='_policy_title_div'>
          <h1 className='_policy_title'>Privacy Policy</h1>
          <p>Last updated: 10/10/2024</p>
        </div>
        <div className='_policy_text_div'>
          <p>
            Thank you for choosing to use our extension. We are committed to
            protecting your personal data and respecting your privacy. This
            Privacy Policy explains how we collect, use, and share information
            about you when you use our extension.
          </p>

          <p>
            By using the extension, you agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>

          <div className='_policy_first_section'>
            <p className='_p_num'>1. Information We Collect:</p>
            <div className='_spans_div'>
              <span>
                <p className='_p_l'>
                  a) Personally Identifiable Information (PII) We collect the
                  following personal data through Google OAuth 2.0 for
                  authentication purposes:
                </p>
                <ul>
                  <li>- Name Email address</li>
                  <li>- Google account profile picture</li>
                  <li>
                    - Google user ID, This data is collected only after
                    receiving your consent during the login process.
                  </li>
                </ul>
              </span>
              <span>
                <p className='_p_l'>
                  b) Payment and Financial Data Through our payment processor,
                  Stripe, we collect and store the following information: This
                  data helps us manage your subscription and provide access to
                  premium features.
                </p>
                <ul>
                  <li>- Customer ID</li>
                  <li>- Name</li>
                  <li>- Email address</li>
                  <li>- Subscription status</li>
                  <li>- Country</li>
                  <li>- Subscription creation expiration dates</li>
                </ul>
              </span>
              <span>
                <p className='_p_l'>
                  c) Authentication Data We use Google OAuth 2.0 to authenticate
                  users. During this process, we exchange tokens with Google to
                  verify your identity.
                </p>
              </span>
              <span>
                <p className='_p_l'>
                  d) Cookies We use cookies to manage user sessions and
                  authentication. No user preferences are stored through
                  cookies.
                </p>
              </span>
              <span>
                <p className='_p_l'>
                  e) Local Data Storage All folder names, folder content,
                  bookmarks, and other chat-related data are stored locally on
                  your device. We do not collect or store this data on our
                  servers.
                </p>
              </span>
            </div>
          </div>

          <p className='_p_num'>
            2. How We Use Your Data? We use the data we collect in the following
            ways:
          </p>

          <ul>
            <li>
              - Authentication: To log you into the extension using Google
              OAuth.
            </li>
            <li>
              - Payments: To manage your subscription through Stripe. After a
              24-hour free trial, you will be billed unless you cancel. You can
              cancel anytime.
            </li>
            <li>
              - Local Storage: To persist your folders, bookmarks, and chat
              organization locally on your device.
            </li>
          </ul>

          <p className='_p_num'>
            3. Data Sharing, We may share limited personal information with
            third-party services only in the following cases:
          </p>

          <ul>
            <li>
              - Stripe: For payment processing and subscription management.
            </li>
            <li> - Google: For user authentication via OAuth.</li>
            <li>
              - ChatGPT: The extension interacts with ChatGPT to help organize
              chats, but no chat data is collected or stored on our servers.
            </li>
          </ul>

          <span>We do not sell or share any data for business purposes.</span>

          <p className='_p_num'>
            4. User Rights Given that we do not collect sensitive data beyond
            what’s necessary for authentication and subscription, users cannot
            request access or deletion of their data at this time. All locally
            stored data can be removed by uninstalling the extension.{" "}
          </p>

          <p className='_p_num'>
            5. Security We take the security of your data seriously. The
            personal information we collect is stored securely, and we follow
            best practices to protect your data from unauthorized access.
          </p>

          <p className='_p_num'>
            6. Cookies and Tracking We use cookies solely for authentication
            purposes to manage user sessions. We do not track or collect web
            history or activity.
          </p>

          <p className='_p_num'>
            7. Third-Party Services Our extension interacts with the following
            third-party services:
          </p>

          <ul>
            <li>- Google OAuth: For authentication purposes.</li>
            <li> - Stripe: For payment processing.</li>
            <li>
              - ChatGPT: Our extension enhances your interaction with ChatGPT,
              but it does not collect any chat or conversation data from
              ChatGPT.
            </li>
          </ul>

          <p className='_p_num'>
            8. Changes to This Privacy Policy We do not currently notify users
            when our privacy policy changes. However, we recommend checking this
            page periodically for any updates.
          </p>

          <p className='_p_num'>
            9. Contact Us If you have any questions or concerns about this
            Privacy Policy or your data, you can contact us through our contact
            page, which includes our email and social media links.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PrivacyPolicy;
