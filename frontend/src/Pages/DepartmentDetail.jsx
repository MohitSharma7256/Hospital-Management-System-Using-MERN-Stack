import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";

const DepartmentDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentDetails();
  }, [slug]);

  const fetchDepartmentDetails = async () => {
    try {
      setLoading(true);
      // Convert slug back to department name for API call
      const departmentName = slug.replace(/-/g, ' ');
      const response = await API.get(`/api/v1/department/name/${departmentName}`);
      setDepartment(response.data.department);
    } catch (error) {
      console.error("Error fetching department details:", error);
      toast.error("Department not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: "100px", textAlign: "center" }}>
        <h2>Loading department details...</h2>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="container" style={{ marginTop: "100px", textAlign: "center" }}>
        <h2>Department not found</h2>
        <button onClick={() => navigate("/")} className="btn">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "100px", marginBottom: "50px" }}>
      {/* Header Section */}
      <div style={{ 
        background: "linear-gradient(135deg, #271776 0%, #3939d9 100%)",
        color: "white",
        padding: "40px",
        borderRadius: "15px",
        marginBottom: "30px",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{department.name}</h1>
        <p style={{ fontSize: "1.2rem", opacity: "0.9" }}>{department.description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "30px" }}>
        {/* Main Content */}
        <div>
          {/* Department Image */}
          {department.image && (
            <div style={{ marginBottom: "30px" }}>
              <img 
                src={department.image.url} 
                alt={department.name}
                style={{ 
                  width: "100%", 
                  height: "300px", 
                  objectFit: "cover", 
                  borderRadius: "10px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}
              />
            </div>
          )}

          {/* Detailed Information */}
          <div style={{ 
            background: "white", 
            padding: "30px", 
            borderRadius: "10px", 
            marginBottom: "30px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ color: "#271776", marginBottom: "20px" }}>About This Department</h2>
            <div style={{ 
              fontSize: "1.1rem", 
              lineHeight: "1.8", 
              color: "#333",
              whiteSpace: "pre-line"
            }}>
              {department.detailedInfo}
            </div>
          </div>

          {/* Services Section */}
          {department.services && department.services.length > 0 && (
            <div style={{ 
              background: "white", 
              padding: "30px", 
              borderRadius: "10px", 
              marginBottom: "30px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ color: "#271776", marginBottom: "20px" }}>Our Services</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                {department.services.map((service, index) => (
                  <div key={index} style={{
                    background: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #271776"
                  }}>
                    <span style={{ fontWeight: "500" }}>✓ {service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities Section */}
          {department.facilities && department.facilities.length > 0 && (
            <div style={{ 
              background: "white", 
              padding: "30px", 
              borderRadius: "10px", 
              marginBottom: "30px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ color: "#271776", marginBottom: "20px" }}>Facilities Available</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                {department.facilities.map((facility, index) => (
                  <div key={index} style={{
                    background: "#e8f5e8",
                    padding: "12px",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontWeight: "500",
                    color: "#2d5a2d"
                  }}>
                    🏥 {facility}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Diseases Section */}
          {department.commonDiseases && department.commonDiseases.length > 0 && (
            <div style={{ 
              background: "white", 
              padding: "30px", 
              borderRadius: "10px", 
              marginBottom: "30px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ color: "#271776", marginBottom: "20px" }}>Common Conditions We Treat</h2>
              <div style={{ display: "grid", gap: "20px" }}>
                {department.commonDiseases.map((disease, index) => (
                  <div key={index} style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "10px",
                    padding: "20px",
                    background: "#fafafa"
                  }}>
                    <h3 style={{ color: "#271776", marginBottom: "10px" }}>{disease.name}</h3>
                    <p style={{ marginBottom: "15px", color: "#555" }}>{disease.description}</p>
                    
                    {disease.symptoms && disease.symptoms.length > 0 && (
                      <div style={{ marginBottom: "15px" }}>
                        <h4 style={{ color: "#e74c3c", marginBottom: "8px" }}>Symptoms:</h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {disease.symptoms.map((symptom, idx) => (
                            <span key={idx} style={{
                              background: "#ffe6e6",
                              color: "#c0392b",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "0.9rem"
                            }}>
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {disease.treatments && disease.treatments.length > 0 && (
                      <div>
                        <h4 style={{ color: "#27ae60", marginBottom: "8px" }}>Treatments:</h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {disease.treatments.map((treatment, idx) => (
                            <span key={idx} style={{
                              background: "#e8f5e8",
                              color: "#2d5a2d",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "0.9rem"
                            }}>
                              {treatment}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Contact Information */}
          <div style={{ 
            background: "white", 
            padding: "25px", 
            borderRadius: "10px", 
            marginBottom: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#271776", marginBottom: "20px" }}>Contact Information</h3>
            
            {department.headOfDepartment && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "#555" }}>Head of Department:</strong>
                <p style={{ margin: "5px 0", color: "#333" }}>{department.headOfDepartment}</p>
              </div>
            )}
            
            {department.contactInfo?.phone && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "#555" }}>Phone:</strong>
                <p style={{ margin: "5px 0", color: "#333" }}>{department.contactInfo.phone}</p>
              </div>
            )}
            
            {department.contactInfo?.email && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "#555" }}>Email:</strong>
                <p style={{ margin: "5px 0", color: "#333" }}>{department.contactInfo.email}</p>
              </div>
            )}
            
            {department.contactInfo?.location && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "#555" }}>Location:</strong>
                <p style={{ margin: "5px 0", color: "#333" }}>{department.contactInfo.location}</p>
              </div>
            )}
          </div>

          {/* Working Hours */}
          <div style={{ 
            background: "white", 
            padding: "25px", 
            borderRadius: "10px", 
            marginBottom: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#271776", marginBottom: "20px" }}>Working Hours</h3>
            
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#555" }}>Weekdays:</strong>
              <p style={{ margin: "5px 0", color: "#333" }}>{department.workingHours?.weekdays || "9:00 AM - 5:00 PM"}</p>
            </div>
            
            <div>
              <strong style={{ color: "#555" }}>Weekends:</strong>
              <p style={{ margin: "5px 0", color: "#333" }}>{department.workingHours?.weekends || "9:00 AM - 1:00 PM"}</p>
            </div>
          </div>

          {/* Book Appointment Button */}
          <div style={{ 
            background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)", 
            padding: "25px", 
            borderRadius: "10px", 
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "white", marginBottom: "15px" }}>Ready to Book?</h3>
            <button 
              onClick={() => navigate("/appointment")}
              style={{
                background: "white",
                color: "#27ae60",
                border: "none",
                padding: "12px 25px",
                borderRadius: "25px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button 
          onClick={() => navigate("/")}
          style={{
            background: "#95a5a6",
            color: "white",
            border: "none",
            padding: "12px 30px",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default DepartmentDetail;
