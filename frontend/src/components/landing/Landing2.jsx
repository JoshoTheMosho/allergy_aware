import React, { useState } from 'react';

import { ArrowRight, Download, Clock, Search, CheckCircle } from 'lucide-react';
import './Landing.css';
import { Link, useNavigate } from 'react-router-dom';
import HowItWorks from './Carousel';

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
              src="https://res.cloudinary.com/djtccyord/image/upload/v1732651804/allergenie_search_w1oynk.webp"
              className="responsive-image"
              alt="Allergenie product in action"
            />
          </div>
          
        </section>


            <div className="catch-phrase-container">
            <p className="catch-phrase">
                  <span className="catch-phrase gradient">Less risk</span> in the kitchen.
            </p>
            <p className="catch-phrase">
                More <span className="catch-phrase gradient">satisfied guests</span>.
            </p>
            </div>

            <section className="allergy-risks">
              <h2 className="section-title">The High Stakes of Allergy Management</h2>
              <div className="risk-content">
                <div className="risk-statistic">
                  <h3>Critical Numbers</h3>
                  <ul>
                    <li><strong>30,000+</strong> ER Visits Annually</li>
                    <li><strong>200+</strong> Fatalities per Year</li>
                    <li><strong>$500,000</strong> Avg. Lawsuit Settlement</li>
                  </ul>
                </div>
                <div className="risk-description">
                  <p>One mistake can cost everything. Accidental allergen exposure threatens your restaurant's reputation, finances, and future.</p>
                  <p className="highlight">Protect your business with comprehensive allergy management.</p>
                </div>
              </div>
            </section>

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
                <HowItWorks/>
    </section>

    <div className="catch-phrase-container">
            <p className="catch-phrase catch-smaller" >
                 We grant your<span className="catch-phrase gradient catch-smaller"> Wishes </span>
            
                for your<span className="catch-phrase gradient catch-smaller"> Dishes</span>
            </p>
      </div>

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
