import React from "react";
import { Search, Download, Clock } from "lucide-react";
import "./Features.css";

const FeaturesSection = () => {
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
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-card-content">
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
