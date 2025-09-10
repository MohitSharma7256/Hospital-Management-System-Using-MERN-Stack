import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import API from "../api";

const Account = () => {
  const { isAuthenticated, user, setUser } = useContext(Context);
  
  // User profile states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setDob(user.dob ? user.dob.split('T')[0] : "");
    }
  }, [user]);

  // Fetch user appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await API.get("/api/v1/appointment/getall");
        // Filter appointments for current user
        const userAppointments = response.data.appointments.filter(
          appointment => appointment.patientId === user._id
        );
        setAppointments(userAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && activeTab === "appointments") {
      fetchAppointments();
    }
  }, [user, activeTab]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        firstName,
        lastName,
        phone,
        dob
      };

      const response = await API.put(`/api/v1/user/update/${user._id}`, updateData);
      
      toast.success("Profile updated successfully!");
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    try {
      await API.put(`/api/v1/user/change-password/${user._id}`, {
        currentPassword,
        newPassword
      });
      
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f39c12';
      case 'accepted': return '#27ae60';
      case 'rejected': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container" style={{ marginTop: "100px", marginBottom: "50px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#271776" }}>
          My Account
        </h2>

        {/* Tab Navigation */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: "30px",
          borderBottom: "2px solid #f0f0f0"
        }}>
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              padding: "10px 30px",
              border: "none",
              background: activeTab === "profile" ? "#271776" : "transparent",
              color: activeTab === "profile" ? "white" : "#271776",
              cursor: "pointer",
              borderRadius: "5px 5px 0 0",
              marginRight: "10px",
              fontWeight: "bold"
            }}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            style={{
              padding: "10px 30px",
              border: "none",
              background: activeTab === "appointments" ? "#271776" : "transparent",
              color: activeTab === "appointments" ? "white" : "#271776",
              cursor: "pointer",
              borderRadius: "5px 5px 0 0",
              fontWeight: "bold"
            }}
          >
            My Appointments
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div style={{ 
            background: "white", 
            padding: "30px", 
            borderRadius: "10px", 
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)" 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: "#271776", margin: 0 }}>Personal Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  padding: "8px 16px",
                  background: isEditing ? "#e74c3c" : "#271776",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      background: isEditing ? "white" : "#f9f9f9"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      background: isEditing ? "white" : "#f9f9f9"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      background: "#f9f9f9",
                      color: "#666"
                    }}
                  />
                  <small style={{ color: "#666" }}>Email cannot be changed</small>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      background: isEditing ? "white" : "#f9f9f9"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      background: isEditing ? "white" : "#f9f9f9"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Gender</label>
                  <input
                    type="text"
                    value={user?.gender || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      background: "#f9f9f9",
                      color: "#666"
                    }}
                  />
                  <small style={{ color: "#666" }}>Gender cannot be changed</small>
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  style={{
                    padding: "12px 30px",
                    background: "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Save Changes
                </button>
              )}
            </form>

            {/* Password Change Section */}
            <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
              <h3 style={{ color: "#271776", marginBottom: "20px" }}>Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px", maxWidth: "400px" }}>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{ width: "100%", padding: "10px", paddingRight: "40px", border: "1px solid #ddd", borderRadius: "5px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ width: "100%", padding: "10px", paddingRight: "40px", border: "1px solid #ddd", borderRadius: "5px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      {showNewPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ width: "100%", padding: "10px", paddingRight: "40px", border: "1px solid #ddd", borderRadius: "5px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  style={{
                    marginTop: "15px",
                    padding: "10px 25px",
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div style={{ 
            background: "white", 
            padding: "30px", 
            borderRadius: "10px", 
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)" 
          }}>
            <h3 style={{ color: "#271776", marginBottom: "20px" }}>My Appointments</h3>
            
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                <p>No appointments found.</p>
                <p>Book your first appointment to see it here!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {appointments.map((appointment, index) => (
                  <div
                    key={appointment._id || index}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "20px",
                      background: "#f9f9f9"
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                      <div>
                        <strong style={{ color: "#271776" }}>Doctor:</strong>
                        <p style={{ margin: "5px 0" }}>
                          Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                        </p>
                        <small style={{ color: "#666" }}>
                          {appointment.department}
                        </small>
                      </div>
                      
                      <div>
                        <strong style={{ color: "#271776" }}>Date & Time:</strong>
                        <p style={{ margin: "5px 0" }}>
                          {formatDate(appointment.appointment_date)}
                        </p>
                        <small style={{ color: "#666" }}>
                          {appointment.appointment_time}
                        </small>
                      </div>
                      
                      <div>
                        <strong style={{ color: "#271776" }}>Status:</strong>
                        <p style={{ 
                          margin: "5px 0",
                          color: getStatusColor(appointment.status),
                          fontWeight: "bold",
                          textTransform: "capitalize"
                        }}>
                          {appointment.status}
                        </p>
                      </div>
                    </div>
                    
                    {appointment.address && (
                      <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #ddd" }}>
                        <strong style={{ color: "#271776" }}>Address:</strong>
                        <p style={{ margin: "5px 0", color: "#666" }}>
                          {appointment.address}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
