import React, { useState } from "react";
import { Search, Download, Clock } from "lucide-react";
import "./Features.css";

const FeaturesSection = () => {
  const [flippedCards, setFlippedCards] = useState([]);

  const toggleFlip = (index) => {
    setFlippedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const features = [
    {
      icon: Search,
      color: "blue",
      title: "Instant Allergen Lookup",
      description: [
        "Rapid digital search of allergen information",
        "Minimize kitchen workflow interruptions",
        "Instant answers to dietary queries",
      ],
      moreInfo:
        "Our Instant Allergen Lookup allows your staff to quickly find allergen information, ensuring customer safety and satisfaction without delaying service.",
    },
    {
      icon: Download,
      color: "purple",
      title: "Comprehensive Ingredient Database",
      description: [
        "Digital tracking of ingredient details",
        "Centralized allergen information management",
        "Empower informed food service decisions",
      ],
      moreInfo:
        "Manage all your ingredient details in one place, making it easy to update and maintain accurate allergen information across your menu.",
    },
    {
      icon: Clock,
      color: "green",
      title: "Streamlined Service",
      description: [
        "Reduce staff consultation time",
        "Quick access to critical dietary information",
        "Accelerate customer service response",
      ],
      moreInfo:
        "Enhance your service speed by providing instant access to dietary information, allowing your staff to serve customers more efficiently.",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`feature-card ${
              flippedCards.includes(index) ? "flipped" : ""
            }`}
            onClick={() => toggleFlip(index)}
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleFlip(index);
              }
            }}
            aria-expanded={flippedCards.includes(index)}
            role="button"
          >
            {/* Front Face */}
            <div className="feature-card-front">
              <div className={`feature-icon ${feature.color}`}>
                <feature.icon size={48} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <ul className="feature-description">
                {feature.description.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Back Face */}
            <div className="feature-card-back">
              <h3 className="feature-title">More Info</h3>
              <p className="feature-back-description">{feature.moreInfo}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
