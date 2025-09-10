import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube, FaHeart } from "react-icons/fa";
import { MdEmail, MdAccessTime, MdLocalHospital } from "react-icons/md";
import { BiPhone } from "react-icons/bi";

const Footer = () => {
  const hours = [
    { id: 1, day: "Monday", time: "8:00 AM - 10:00 PM" },
    { id: 2, day: "Tuesday", time: "8:00 AM - 10:00 PM" },
    { id: 3, day: "Wednesday", time: "8:00 AM - 10:00 PM" },
    { id: 4, day: "Thursday", time: "8:00 AM - 10:00 PM" },
    { id: 5, day: "Friday", time: "8:00 AM - 8:00 PM" },
    { id: 6, day: "Saturday", time: "9:00 AM - 6:00 PM" },
    { id: 7, day: "Sunday", time: "Emergency Only" },
  ];

  const services = [
    "Emergency Care",
    "Cardiology", 
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Radiology"
  ];

  return (
    <footer className="modern-footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-main">
          {/* Hospital Info Section */}
          <div className="footer-section hospital-info">
            <div className="footer-logo">
              <img src="/logo.png" alt="Shaan Hospital Logo" className="footer-logo-img" />
              <div className="hospital-details">
                <h3>Shaan Hospital</h3>
                <p>Your Trusted Healthcare Provider</p>
              </div>
            </div>
            <p className="hospital-description">
              Shaan Hospital is a state-of-the-art multi-specialist hospital committed to providing 
              world-class healthcare services with compassion and expertise.
            </p>
            <div className="certifications">
              <span className="cert-badge">ISO Certified</span>
              <span className="cert-badge">NABH Accredited</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4><MdLocalHospital /> Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/appointment">Book Appointment</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/account">Patient Portal</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Our Services</h4>
            <ul className="footer-links services-list">
              {services.map((service, index) => (
                <li key={index}><span>{service}</span></li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div className="footer-section">
            <h4><MdAccessTime /> Working Hours</h4>
            <ul className="footer-hours">
              {hours.map((element) => (
                <li key={element.id}>
                  <span className="day">{element.day}</span>
                  <span className="time">{element.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section contact-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <BiPhone className="contact-icon" />
                <div>
                  <span className="contact-label">Emergency</span>
                  <span className="contact-value">+91 7256063776</span>
                </div>
              </div>
              <div className="contact-item">
                <MdEmail className="contact-icon" />
                <div>
                  <span className="contact-label">Email</span>
                  <span className="contact-value">info@shaanhospital.com</span>
                </div>
              </div>
              <div className="contact-item">
                <FaLocationArrow className="contact-icon" />
                <div>
                  <span className="contact-label">Address</span>
                  <span className="contact-value">Gopalganj, Bihar, India</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-section">
              <h5>Follow Us</h5>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link facebook">
                  <FaFacebookF />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link instagram">
                  <FaInstagram />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link twitter">
                  <FaTwitter />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link linkedin">
                  <FaLinkedinIn />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-link youtube">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>
                &copy; {new Date().getFullYear()} Shaan Hospital. All rights reserved.
                <span className="made-with">
                  Made with <FaHeart className="heart-icon" /> for better healthcare
                </span>
              </p>
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/careers">Careers</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
