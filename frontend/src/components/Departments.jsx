import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import API from "../api";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await API.get("/api/v1/department/all");
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      // Fallback to static departments if API fails
      setDepartments([
        { name: "Pediatrics", image: { url: "/departments/pedia.jpg" } },
        { name: "Orthopedics", image: { url: "/departments/ortho.jpg" } },
        { name: "Cardiology", image: { url: "/departments/cardio.jpg" } },
        { name: "Neurology", image: { url: "/departments/neuro.jpg" } },
        { name: "Oncology", image: { url: "/departments/onco.jpg" } },
        { name: "Radiology", image: { url: "/departments/radio.jpg" } },
        { name: "Physical Therapy", image: { url: "/departments/therapy.jpg" } },
        { name: "Dermatology", image: { url: "/departments/derma.jpg" } },
        { name: "ENT", image: { url: "/departments/ent.jpg" } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentClick = (departmentName) => {
    const slug = departmentName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/department/${slug}`);
  };

  const responsive = {
    extraLarge: {
      breakpoint: { max: 3000, min: 1324 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    medium: {
      breakpoint: { max: 1005, min: 700 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    small: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  if (loading) {
    return (
      <div className="container departments">
        <h2>Departments</h2>
        <p>Loading departments...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container departments">
        <h2>Departments</h2>
        <Carousel
          responsive={responsive}
          removeArrowOnDeviceType={[
            "superLargeDesktop",
            "desktop",
            "tablet",
            "mobile",
          ]}
        >
          {departments.map((department, index) => {
            return (
              <div 
                key={index} 
                className="card"
                onClick={() => handleDepartmentClick(department.name)}
                style={{ cursor: "pointer" }}
              >
                <div className="depart-name">{department.name}</div>
                <img 
                  src={department.image?.url || "/departments/default.jpg"} 
                  alt={department.name}
                  onError={(e) => {
                    e.target.src = "/departments/default.jpg";
                  }}
                />
                <div className="department-overlay">
                  <p>Click to learn more</p>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
    </>
  );
};

export default Departments;
