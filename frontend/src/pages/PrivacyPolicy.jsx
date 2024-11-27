import React from 'react';
import './pages.css';

const PrivacyPolicy = () => (
    <div className="privacy-policy">
        <h1>Privacy Policy</h1>
        <p>Effective Date: November 26, 2024</p>

        <h2>1. Introduction</h2>
        <p>
            Welcome to AllerGenie. This Privacy Policy describes how we collect,
            use, and disclose information when you use our services.
        </p>
        <p>
            <strong>Important Notice:</strong> AllerGenie is provided on an "as is" and "as available" basis and is in early development. The app may have bugs and inaccuracies with information that is uploaded, saved, edited, stored, and searched for. We are not liable for any issues arising from inaccuracies in the information provided or entered by users, including but not limited to cases where such information is used as fact and results in allergic reactions or other health issues.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We currently collect the following information:</p>
        <ul>
            <li>Email address</li>
            <li>Restaurant name</li>
            <li>Dishes, Ingredients, Allergens</li>
            <li>
                In the future, we may collect restaurant locations and related
                information.
            </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
            <li>Provide and maintain our services</li>
            <li>Send notifications and updates</li>
            <li>Improve user experience</li>
        </ul>

        <h2>4. Data Sharing and Disclosure</h2>
        <p>
            We do not share your personal information with third parties.
        </p>

        <h2>5. Data Storage and Security</h2>
        <p>
            Your data is securely stored in our databases, currently utilizing
            Supabase, which implements its own security measures to protect
            data such as the information we collect.
        </p>
        <p>
            Please note that despite our efforts, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security of your data.
        </p>

        <h2>6. User Rights</h2>
        <p>
            You may have rights under applicable privacy laws to access, correct, or
            delete your personal information. Please contact us to exercise these
            rights.
        </p>

        <h2>7. Cookies and Tracking Technologies</h2>
        <p>
            We may use cookies and similar tracking technologies to enhance your
            experience on our platform.
        </p>

        <h2>8. International Users</h2>
        <p>
            Our services are available to users worldwide. By using our services,
            you consent to the processing of your information in accordance with
            this Privacy Policy.
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
            Our services are intended for use by restaurant staff. We do not
            knowingly collect personal information from individuals under the
            working age in their respective countries. If you believe we have
            collected information from a minor, please contact us.
        </p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>
            We may update our Privacy Policy from time to time. We will notify you
            of any changes by email and update the effective date at the top of this
            policy. Continued use of the app constitutes acceptance of the new policy.
        </p>

        <h2>11. Contact Us</h2>
        <p>
            If you have any questions or concerns about this Privacy Policy, please
            contact us at [TBD].
        </p>
    </div>
);

export default PrivacyPolicy;
