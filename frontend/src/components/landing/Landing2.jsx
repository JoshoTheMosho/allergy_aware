import React, { useState } from 'react';

import { ArrowRight, Download, Clock, Search, CheckCircle } from 'lucide-react';
import './Landing.css';
import { Link, useNavigate } from 'react-router-dom';


const Landing = () => {

    const plans = [
      {
        title: "Demo",
        price: "Free",
        features: [
          "View Demo page",
         
        ],
        buttonText: "Try Demo",
        type: "demo"
      },
      {
        title: "Pro",
        price: "$12",
        features: [
          "Unlimited Searches",
          "50 Dishes",
          "Unlimited Ingredients",
          "Unlimited Allergens",
          "Priority support"
        ],
        buttonText: "Choose Pro",
        type: "pro"
      },
      {
        title: "Enterprise",
        price: "Custom",
        features: [
          "Everything In Starter",
          "Unlimited Dishes",
          "Custom Integration",
          "Priority Support",
          "24/7 premium support"
        ],
        buttonText: "Contact Us",
        type: "enterprise"
      }
    ];

    const sellingPoints = [
      "Easy to Use",
      "Increase Backend Efficiency",
      "Organized Menu Storage",
      "Instant Access"
    ];
    
  return (

      <div className="landing">
        <main className="container">
        <section className="hero">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="highlight-gradient">Fewer Disruptions, </span>Faster Service
            </h1>
            <p className="hero-subtitle">
              Empower your staff with quick access to allergen and dietary details, 
              <span className="highlight"> minimizing kitchen interruptions and streamlining service!</span>
            </p>

            {/* Key Selling Points Section */}
            <section className="selling-points">
              {/* <h2 className="selling-points-title">Why Choose AllerGenie?</h2> */}
              <ul className="selling-points-list">
                {sellingPoints.map((point, index) => (
                  <li key={index} className="selling-point">
                    {point}
                  </li>
                ))}
              </ul>
            </section>

            {/* Call-to-Action Buttons */}
            <div className="button-group">
              <Link className="button-36 cta-button" to="/search">
                Start Now
              </Link>
              <Link className="button-36 watch-button" to="/demo">
                Try Demo
              </Link>
            </div>
          </div>
          <div className="image-container">
            <img
              src="https://res.cloudinary.com/djtccyord/image/upload/v1730451227/allergine_search_jd4ch3.png"
              className="responsive-image"
              alt="Allergenie product in action"
            />
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
                        <Search size={48} className="icon blue" />
                        <h3 className="card-title">Instant Search</h3>
                        <ul className="card-description">
                            <li>Access allergen information instantly</li>
                            <li>Reduce kitchen interruptions</li>
                            <li>Quick responses to dietary questions</li>
                        </ul>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <Download size={48} className="icon purple" />
                        <h3 className="card-title">Ingredient Storage</h3>
                        <ul className="card-description">
                            <li>Efficiently store ingredient details</li>
                            <li>Ensure accurate allergen information</li>
                            <li>Support smooth, informed service</li>
                        </ul>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <Clock size={48} className="icon green" />
                        <h3 className="card-title">Time Saving</h3>
                        <ul className="card-description">
                            <li>Reduce disruptions to kitchen staff</li>
                            <li>Access allergen details quickly</li>
                            <li>Speed up service times</li>
                        </ul>
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
                <div className="image-container-2">
                  <img src="https://res.cloudinary.com/djtccyord/image/upload/v1730448100/allergenie_frontend_tqf6xi.png" alt="Chrome Extension in action" className="step-image-2" />
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
                  <img src="https://res.cloudinary.com/djtccyord/image/upload/v1730448100/allergenie_frontend_tqf6xi.png" alt="Dashboard" className="step-image-2" />
                </div>
              </div>
              <div className="step">
                <div className="text-container">
                  <h3 className="step-title">3. Quick Search and Filter</h3>
                  <p className="step-description">Staff can quickly search for dishes by name or filter them by dietary requirements. 
                    Tagged dishes appear with clear allergen and ingredient details, allowing staff to respond confidently to guest inquiries.</p>
                </div>
                <div className="image-container-2">
                  <img src="https://res.cloudinary.com/djtccyord/image/upload/v1730451211/allergine_search_v2_iex6ga.png" alt="Email Templates" className="step-image-2" />
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
            <Link className="button-36 cta-button" to="/search">
              Start Now
            </Link>
          </section>
        </main>
      </div>

  );
};

export default Landing;
