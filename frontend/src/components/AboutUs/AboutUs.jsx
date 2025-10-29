import React from 'react';
import './AboutUs.css';
import { assets } from '../../assets/assets';

const AboutUs = () => {
  return (
    <div className='about-us container' id='about-us'>
      <div className="about-us-header">
        <h1>About Us</h1>
        <p className='header-text'>The story behind every delicious meal</p>
      </div>
      <div className="about-us-content">
        <div className="about-us-image">
          <img src={assets.about_us_image} alt="Our Team" />
        </div>
        <div className="about-us-text">
          <h2>Welcome to Tomato</h2>
          <p>
            At Tomato, we believe that the best meals come from the freshest ingredients and a burning passion for food. Our mission is to bring you unforgettable culinary experiences, combining traditional flavors with a modern twist.
          </p>
          <p>
            Founded in 2024, Tomato started from a small kitchen with a dream of sharing the love of food with everyone. Every dish on our menu is meticulously prepared, from selecting clean ingredients from reputable local suppliers to the elaborate cooking process by our talented team of chefs.
          </p>
          <h3>Our Core Values</h3>
          <ul>
            <li><strong>Quality:</strong> We never compromise on quality. From farm to table, every ingredient is carefully vetted.</li>
            <li><strong>Creativity:</strong> Our menu is an intersection of traditional cuisine and new ideas, always bringing delightful surprises to our customers.</li>
            <li><strong>Community:</strong> We are committed to supporting local farmers and building a sustainable community around the love of food.</li>
          </ul>
          <h3>Our Vision</h3>
          <p>
            To become the most beloved food delivery service, where people can find joy and connection through quality meals. We are constantly striving to expand our menu, improve our service, and bring "Tomato" closer to every home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;