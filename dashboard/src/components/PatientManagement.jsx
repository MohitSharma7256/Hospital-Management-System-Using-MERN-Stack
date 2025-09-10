import React, { useState, useEffect, useContext } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "./PatientManagement.css";
import API from "../api";

const PatientManagement = () => {
  const { isAuthenticated } = useContext(Context);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await API.get("/user/patients");
      setPatients(data.patients);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch patients");
      setLoading(false);
    }
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient({ ...patient });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await API.delete(`/user/user/${patientId}`);
        toast.success("Patient deleted successfully");
        fetchPatients();
      } catch (error) {
        toast.error("Failed to delete patient");
      }
    }
  };

  const handleSave = async () => {
    try {
      await API.put(`/user/user/${selectedPatient._id}`, selectedPatient);
      toast.success("Patient updated successfully");
      setShowModal(false);
      fetchPatients();
    } catch (error) {
      toast.error("Failed to update patient");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <section className="page">
      <div className="patient-management">
        <h1 className="form-title">PATIENT MANAGEMENT - SHAAN HOSPITAL</h1>

        {/* Stats Section */}
        <div className="stats-summary">
          <div className="stat-item">
            <h3>{patients.length}</h3>
            <p>Total Patients</p>
          </div>
          <div className="stat-item">
            <h3>
              {
                patients.filter((p) => {
                  const lastLogin = new Date(p.lastLogin);
                  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                  return lastLogin > oneDayAgo;
                }).length
              }
            </h3>
            <p>Recent Logins (24h)</p>
          </div>
          <div className="stat-item">
            <h3>
              {
                patients.filter((p) => {
                  const createdAt = new Date(p.createdAt);
                  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return createdAt > sevenDaysAgo;
                }).length
              }
            </h3>
            <p>New This Week</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Registration Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{`${patient.firstName} ${patient.lastName}`}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.gender}</td>
                  <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(patient.lastLogin).toLocaleString()}</td>
                  <td className="actions">
                    <button onClick={() => handleView(patient)} title="View">
                      <FaEye />
                    </button>
                    <button onClick={() => handleEdit(patient)} title="Edit">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(patient._id)}
                      title="Delete"
                      className="delete-btn"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Section */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editMode ? "Edit Patient" : "Patient Details"}</h2>
                <button onClick={() => setShowModal(false)}>&times;</button>
              </div>

              <div className="modal-body">
                {editMode ? (
                  <div className="edit-form">
                    <div className="form-row">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={selectedPatient?.firstName || ""}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={selectedPatient?.lastName || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={selectedPatient?.email || ""}
                        onChange={handleInputChange}
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={selectedPatient?.phone || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <select
                        name="gender"
                        value={selectedPatient?.gender || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                      </select>
                      <input
                        type="date"
                        name="dob"
                        value={
                          selectedPatient?.dob
                            ? new Date(selectedPatient.dob).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                    <input
                      type="text"
                      name="aadhar"
                      placeholder="Aadhar Number"
                      value={selectedPatient?.aadhar || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="patient-details">
                    <div className="detail-row">
                      <strong>Name:</strong> {selectedPatient?.firstName}{" "}
                      {selectedPatient?.lastName}
                    </div>
                    <div className="detail-row">
                      <strong>Email:</strong> {selectedPatient?.email}
                    </div>
                    <div className="detail-row">
                      <strong>Phone:</strong> {selectedPatient?.phone}
                    </div>
                    <div className="detail-row">
                      <strong>Gender:</strong> {selectedPatient?.gender}
                    </div>
                    <div className="detail-row">
                      <strong>Date of Birth:</strong>{" "}
                      {new Date(selectedPatient?.dob).toLocaleDateString()}
                    </div>
                    <div className="detail-row">
                      <strong>Aadhar:</strong> {selectedPatient?.aadhar}
                    </div>
                    <div className="detail-row">
                      <strong>Registration Date:</strong>{" "}
                      {new Date(selectedPatient?.createdAt).toLocaleString()}
                    </div>
                    <div className="detail-row">
                      <strong>Last Login:</strong>{" "}
                      {new Date(selectedPatient?.lastLogin).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {editMode ? (
                  <>
                    <button onClick={handleSave} className="save-btn">
                      Save Changes
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowModal(false)}
                    className="close-btn"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PatientManagement;
