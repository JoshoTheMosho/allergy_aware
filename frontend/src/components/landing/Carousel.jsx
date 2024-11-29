import React, { useState } from 'react';
import './Carousel.css';

export default function HowItWorks() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section id="features" className="how-it-works">
      <h2 className="section-title">How It Works</h2>
      <div className="steps">
        <div 
          className="steps-carousel" 
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)` 
          }}
        >
          <div className="step">
            <div className="text-container">
              <h3 className="step-title">1. Capture Your Menu</h3>
              <p className="step-description">
                Snap a photo of your menu. Our AI instantly digitizes your dishes, making menu management effortless.
              </p>
            </div>
            <div className="image-container-2">
              <img 
                src="https://res.cloudinary.com/djtccyord/image/upload/v1730485883/Edit_dish_y4yn2g.png" 
                alt="Menu Photo Capture" 
                className="step-image-2" 
              />
            </div>
          </div>
          <div className="step">
            <div className="text-container">
              <h3 className="step-title">2. Tag Allergens</h3>
              <p className="step-description">
                Quickly tag dishes with allergen information. Identify potential risks with a simple touch.
              </p>
            </div>
            <div className="image-container-2">
              <img 
                src="https://res.cloudinary.com/djtccyord/image/upload/v1730485883/allergens_iza2zy.png" 
                alt="Allergen Tagging" 
                className="step-image-2" 
              />
            </div>
          </div>
          <div className="step">
            <div className="text-container">
              <h3 className="step-title">3. Search & Verify</h3>
              <p className="step-description">
                Instantly search and filter dishes by allergens. Ensure guest safety with comprehensive menu insights.
              </p>
            </div>
            <div className="image-container-2">
              <img 
                src="https://res.cloudinary.com/djtccyord/image/upload/v1732651804/allergenie_search_w1oynk.webp" 
                alt="Menu Search" 
                className="step-image-2" 
              />
            </div>
          </div>
        </div>
        <div className="carousel-controls">
          <button className="carousel-btn prev-btn" onClick={handlePrev}>
            &#10094;
          </button>
          <button className="carousel-btn next-btn" onClick={handleNext}>
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}