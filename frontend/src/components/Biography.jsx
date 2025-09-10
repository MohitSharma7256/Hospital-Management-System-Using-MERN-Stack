import React from "react";

const Biography = ({ imageUrl, name }) => {
  return (
    <div className="container biography">
      <div className="banner">
        <img src={imageUrl} alt="who-we-are" />
      </div>
      <div className="banner">
        <p>Biography</p>
        <h3>Who We Are</h3>
        <p>
          {name} is a super multi-specialist hospital committed to providing
          world-class healthcare services. Our team of dedicated professionals
          ensures personalized care tailored to each patient, prioritizing
          well-being, comfort, and advanced medical solutions.
        </p>
        <p>Founded in 2024, {name} is driven by innovation and excellence.</p>
        <p>
          We specialize in modern medical treatments and are continuously
          working on advanced healthcare solutions, including MERN stack
          projects for hospital management and patient care optimization.
        </p>
        <p>
          Our goal is to combine technology, compassion, and expertise to
          provide the best medical experience for every patient.
        </p>
        <p>At {name}, we believe in health, innovation, and care for all!</p>
      </div>
    </div>
  );
};

export default Biography;
