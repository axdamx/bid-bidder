import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-sm">
            Welcome to Renown Enterprise. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our auction e-commerce platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              Personal identification information (Name, email address, phone
              number)
            </li>
            <li>Billing and payment information</li>
            <li>Bidding and transaction history</li>
            <li>Device and usage information</li>
            <li>Communication records between users and our platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>To facilitate and process transactions</li>
            <li>To provide and maintain our auction services</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To detect and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Information Sharing and Disclosure
          </h2>
          <p className="text-sm">We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Other users (as necessary for auction transactions)</li>
            <li>Service providers and business partners</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
          <p className="text-sm">
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the Internet is
            100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-sm">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
          <p className="text-sm">
            If you have questions about this Privacy Policy, please contact us
            at:
          </p>
          <p className="text-sm">
            Renown Enterprise
            <br />
            Email: renownmy@gmail.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            8. Updates to This Policy
          </h2>
          <p className="text-sm">
            We may update this Privacy Policy from time to time. The updated
            version will be indicated by an updated "Last Updated" date and the
            updated version will be effective as soon as it is accessible.
          </p>
          <p className="mt-4 text-sm">Last Updated: February 10, 2025</p>
        </section>
      </div>
    </div>
  );
}
