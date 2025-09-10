import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const hours = [
    { id: 1, day: "Monday", time: "9:00 AM - 11:00 PM" },
    { id: 2, day: "Tuesday", time: "12:00 PM - 12:00 AM" },
    { id: 3, day: "Wednesday", time: "10:00 AM - 10:00 PM" },
    { id: 4, day: "Thursday", time: "9:00 AM - 9:00 PM" },
    { id: 5, day: "Friday", time: "3:00 PM - 9:00 PM" },
    { id: 6, day: "Saturday", time: "9:00 AM - 3:00 PM" },
  ];

  return (
    <footer className="container footer">
      <hr />
      <div className="content flex flex-wrap gap-6">
        
        {/* Logo */}
        <div>
          <img src="../../public/logo.png" alt="logo" className="logo-img" />
        </div>

        {/* Quick Links */}
        <div>
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/appointment">Appointment</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4>Hours</h4>
          <ul className="footer-hours">
            {hours.map((element) => (
              <li key={element.id} className="flex justify-between">
                <span>{element.day}</span>
                <span>{element.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4>Contact</h4>
          <div className="flex items-center gap-2">
            <FaPhone /> <span>7256063776</span>
          </div>
          <div className="flex items-center gap-2">
            <MdEmail /> <span>ms1361277@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <FaLocationArrow /> <span>Gopalganj, Bihar</span>
          </div>

          {/* Social Icons */}
          <div className="social-icons flex gap-3 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ZeeCare Medical Institute. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
