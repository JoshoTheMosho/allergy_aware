import React, { useState } from 'react';

import { ArrowRight, Download, Mail, Search, CheckCircle } from 'lucide-react';
import './Landing.css';
import { Link, useNavigate } from 'react-router-dom';


const Landing = () => {

    const plans = [
      {
        title: "Pro",
        price: "$29",
        features: [
          "2000 verified emails",
          "Unlimited exports",
          "Unlimited active lists",
          "Save Unlimited Leads",
          "24/7 premium support"
        ],
        buttonText: "Choose Pro",
        type: "enterprise"
      },
      {
        title: "Starter",
        price: "$9",
        features: [
          "500 verified emails",
          "Unlimited exports",
          "Unlimited active lists",
          "Save Unlimited Leads",
          "Priority support"
        ],
        buttonText: "Choose Starter",
        type: "pro"
      },
      {
        title: "Pro",
        price: "$29",
        features: [
          "2000 verified emails",
          "Unlimited exports",
          "Unlimited active lists",
          "Save Unlimited Leads",
          "24/7 premium support"
        ],
        buttonText: "Choose Pro",
        type: "enterprise"
      }
    ];
  return (

      <div className="landing">
        <main className="container">
          <section className="hero">
            <div className='hero-text'>
            <h1 className="hero-title">
            <span className="highlight-gradient">Fewer Disruptions, </span>Faster Service
            </h1>
            <p className="hero-subtitle">
            Empower your staff with quick access to allergen and dietary details,<br />
            <span className="highlight">minimizing kitchen interruptions and streamlining service!</span>
            </p>
            <div className="button-group" >
            {/* <Link className="button-36 cta-button" to="/leads">
              Start Free Trial <ArrowRight className="icon" size={55}/>
            </Link> */}
            <Link className="button-36 cta-button" to="/search">
              Start Now
            </Link>
            <Link className="button-36 watch-button" to="/demo">
              Try Demo
            </Link>

            </div>
            </div>
            <div className="image-container">
              <img src="https://res.cloudinary.com/djtccyord/image/upload/v1725743017/Untitled_design_6_ttsgcj.svg" className="responsive-image" alt="Showing chrome extensin exporting leads from linkedin sales navigator" />
            </div>

            </section>

            <div className="catch-phrase-container">
            <p className="catch-phrase">
                  <span className="catch-phrase gradient">Less stress</span> in the kitchen.
            </p>
            <p className="catch-phrase">
                More <span className="catch-phrase gradient">satisfied guests</span>.
            </p>
            </div>

            <section className="features">
                <div className="card">
                    <div className="card-content">
                    <Download size={48} className="icon blue" />
                    <h3 className="card-title">Instant Search</h3>
                    <p className="card-description">
                        Access allergen information instantly, reducing kitchen interruptions and allowing staff to respond quickly to allergen and dietary questions.
                    </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                    <Mail size={48} className="icon purple" />
                    <h3 className="card-title">Ingredient Tracking</h3>
                    <p className="card-description">
                        Store ingredient details efficiently, ensuring accurate allergen information for every dish and smoother service.
                    </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                    <Search size={48} className="icon green" />
                    <h3 className="card-title">Time Saving</h3>
                    <p className="card-description">
                        Reduce kitchen disruptions and speed up service with fast, reliable access to essential allergen details.
                    </p>
                    </div>
                </div>
            </section>


          <section id="features" className="how-it-works">
            <h2 className="section-title">How It Works</h2>
            <div className="steps">
              <div className="step">
                <div className="text-container">
                  <h3 className="step-title">1. Input Your Menu</h3>
                  <p className="step-description">
                    Input your menu and ingredients, with automatic allergen detection. 
                    Each dish or ingredient can be tagged with common allergens or 
                    dietary restrictions, and custom tags can be created for unique needs.
                  </p>
                </div>
                <div className="image-container">
                  <img src="https://res.cloudinary.com/djtccyord/image/upload/v1723334622/Capture_qavgzv.png" alt="Chrome Extension in action" className="step-image" />
                </div>
              </div>
              <div className="step">
                <div className="text-container">
                  <h3 className="step-title">2. Tag Dishes and Ingredients</h3>
                  <p className="step-description">
                  Easily label dishes and specific ingredients with predefined or custom tags for allergens and 
                  dietary requirements. This keeps all relevant information organized and easily accessible.
                  </p>
                </div>
                <div className="image-container-2">
                  <img src="https://imagedelivery.net/Jqcuu6sMLVdLqUIvYQ7lqw/c8ee77f2-1183-41d0-d5b4-a0f0f25f5100/public" alt="Dashboard" className="step-image-2" />
                </div>
              </div>
              <div className="step">
                <div className="text-container">
                  <h3 className="step-title">3. Quick Search and Filter</h3>
                  <p className="step-description">Staff can quickly search for dishes by name or filter them by dietary requirements. 
                    Tagged dishes appear with clear allergen and ingredient details, allowing staff to respond confidently to guest inquiries.</p>
                </div>
                <div className="image-container-2">
                  <img src="https://imagedelivery.net/Jqcuu6sMLVdLqUIvYQ7lqw/87195a64-2df7-4703-fc05-68f71e1d7700/public" alt="Email Templates" className="step-image-2" />
                </div>
              </div>
            </div>
          </section>

    <section id="pricing" className="pricing">
      <h2 className="section-title">Pricing Plans</h2>
      <div className="pricing-cards">
        {plans.map((plan, index) => (
          <div key={index} className={`card ${plan.type}`}>
            <div className="card-content">
              <h3 className="card-title">{plan.title}</h3>
              <p className="price">
                {plan.price}<span>/mo</span>
              </p>
              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircle className="icon green" size="7%" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="button-36 payment">{plan.buttonText}</button>
            </div>
          </div>
        ))}
      </div>
      <h3 className="enterprise-solution">
        Higher Usage?
        <Link 
          className="button-36 enterprise-button" 
          to="mailto:info@leadexportr.com?subject=Enterprise Inquiry"
        >
          Contact Sales
        </Link>
      </h3>
    </section>


          <section className="cta">
            <h2 className="section-title">Ready to Transform Your Restaurant Operations?</h2>
            <Link className="button-36 cta-button" to="/leads">
              Start Now
            </Link>
          </section>
        </main>
      </div>

  );
};

export default Landing;
