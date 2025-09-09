import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaUsers, FaUserMd, FaUserShield, FaUserInjured } from "react-icons/fa";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalAdmins: 0,
    recentPatients: 0,
    recentLogins: 0
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/stats",
          { withCredentials: true }
        );
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    
    fetchAppointments();
    fetchStats();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>
                  {admin &&
                    `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
                Assumenda repellendus necessitatibus itaque.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{stats.totalDoctors}</h3>
          </div>
        </div>
        
        {/* Patient Statistics Section */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserInjured style={{ color: '#e74c3c' }} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalPatients}</h3>
              <p>Total Patients</p>
              <span className="recent-count">+{stats.recentPatients} this week</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserMd style={{ color: '#3498db' }} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalDoctors}</h3>
              <p>Total Doctors</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaUserShield style={{ color: '#9b59b6' }} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalAdmins}</h3>
              <p>Total Admins</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers style={{ color: '#27ae60' }} />
            </div>
            <div className="stat-info">
              <h3>{stats.recentLogins}</h3>
              <p>Recent Patient Logins</p>
              <span className="recent-count">Last 24 hours</span>
            </div>
          </div>
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.appointment_date.substring(0, 16)}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <select
                          className={
                            appointment.status === "Pending"
                              ? "value-pending"
                              : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                      <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green"/> : <AiFillCloseCircle className="red"/>}</td>
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>

          {}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
