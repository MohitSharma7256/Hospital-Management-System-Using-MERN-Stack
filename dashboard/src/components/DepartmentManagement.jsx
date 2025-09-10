import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../api";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    detailedInfo: "",
    services: "",
    headOfDepartment: "",
    contactInfo: {
      phone: "",
      email: "",
      location: ""
    },
    facilities: "",
    workingHours: {
      weekdays: "9:00 AM - 5:00 PM",
      weekends: "9:00 AM - 1:00 PM"
    },
    commonDiseases: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [diseaseForm, setDiseaseForm] = useState({
    name: "",
    description: "",
    symptoms: "",
    treatments: ""
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/v1/department/all");
      setDepartments(response.data.departments);
    } catch (error) {
      toast.error("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const addDisease = () => {
    if (!diseaseForm.name || !diseaseForm.description) {
      toast.error("Please fill disease name and description");
      return;
    }

    const newDisease = {
      name: diseaseForm.name,
      description: diseaseForm.description,
      symptoms: diseaseForm.symptoms.split(',').map(s => s.trim()).filter(s => s),
      treatments: diseaseForm.treatments.split(',').map(t => t.trim()).filter(t => t)
    };

    setFormData(prev => ({
      ...prev,
      commonDiseases: [...prev.commonDiseases, newDisease]
    }));

    setDiseaseForm({
      name: "",
      description: "",
      symptoms: "",
      treatments: ""
    });
  };

  const removeDisease = (index) => {
    setFormData(prev => ({
      ...prev,
      commonDiseases: prev.commonDiseases.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.detailedInfo) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      
      // Add basic fields
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('detailedInfo', formData.detailedInfo);
      submitData.append('services', formData.services);
      submitData.append('headOfDepartment', formData.headOfDepartment);
      submitData.append('facilities', formData.facilities);
      
      // Add complex objects as JSON strings
      submitData.append('contactInfo', JSON.stringify(formData.contactInfo));
      submitData.append('workingHours', JSON.stringify(formData.workingHours));
      submitData.append('commonDiseases', JSON.stringify(formData.commonDiseases));
      
      // Add image if selected
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      let response;
      if (editingDepartment) {
        response = await API.put(`/api/v1/department/update/${editingDepartment._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await API.post('/api/v1/department/create', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success(response.data.message);
      fetchDepartments();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      detailedInfo: department.detailedInfo,
      services: department.services?.join(', ') || "",
      headOfDepartment: department.headOfDepartment || "",
      contactInfo: department.contactInfo || {
        phone: "",
        email: "",
        location: ""
      },
      facilities: department.facilities?.join(', ') || "",
      workingHours: department.workingHours || {
        weekdays: "9:00 AM - 5:00 PM",
        weekends: "9:00 AM - 1:00 PM"
      },
      commonDiseases: department.commonDiseases || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      setLoading(true);
      await API.delete(`/api/v1/department/delete/${id}`);
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      detailedInfo: "",
      services: "",
      headOfDepartment: "",
      contactInfo: {
        phone: "",
        email: "",
        location: ""
      },
      facilities: "",
      workingHours: {
        weekdays: "9:00 AM - 5:00 PM",
        weekends: "9:00 AM - 1:00 PM"
      },
      commonDiseases: []
    });
    setImageFile(null);
    setEditingDepartment(null);
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="department-management">
        {/* Header Section */}
        <div className="department-header">
          <div className="header-content">
            <h1>Department Management</h1>
            <p>Manage hospital departments, services, and medical specialties</p>
          </div>
          <button 
            className="add-department-btn"
            onClick={() => setShowForm(true)}
          >
            <span className="btn-icon">+</span>
            Add New Department
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="form-modal-overlay">
            <div className="form-modal">
              <div className="modal-header">
                <h2>{editingDepartment ? "Edit Department" : "Add New Department"}</h2>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="department-form">
                {/* Basic Information */}
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Department Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Head of Department</label>
                      <input
                        type="text"
                        name="headOfDepartment"
                        value={formData.headOfDepartment}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label>Detailed Information *</label>
                    <textarea
                      name="detailedInfo"
                      value={formData.detailedInfo}
                      onChange={handleInputChange}
                      rows="5"
                      required
                      className="form-textarea"
                    />
                  </div>
                </div>

                {/* Services & Facilities */}
                <div className="form-section">
                  <h3>Services & Facilities</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Services (comma separated)</label>
                      <textarea
                        name="services"
                        value={formData.services}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Surgery, Consultation, Emergency Care"
                        className="form-textarea"
                      />
                    </div>
                    <div className="form-group">
                      <label>Facilities (comma separated)</label>
                      <textarea
                        name="facilities"
                        value={formData.facilities}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="ICU, Operation Theater, Lab"
                        className="form-textarea"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="form-section">
                  <h3>Contact Information</h3>
                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="contactInfo.phone"
                        value={formData.contactInfo.phone}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="contactInfo.email"
                        value={formData.contactInfo.email}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="contactInfo.location"
                        value={formData.contactInfo.location}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="form-section">
                  <h3>Working Hours</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Weekday Hours</label>
                      <input
                        type="text"
                        name="workingHours.weekdays"
                        value={formData.workingHours.weekdays}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Weekend Hours</label>
                      <input
                        type="text"
                        name="workingHours.weekends"
                        value={formData.workingHours.weekends}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="form-section">
                  <h3>Department Image</h3>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      id="department-image"
                    />
                    <label htmlFor="department-image" className="file-label">
                      Choose Image
                    </label>
                  </div>
                </div>

                {/* Disease Management */}
                <div className="form-section disease-section">
                  <h3>Common Diseases</h3>
                  
                  <div className="disease-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Disease Name</label>
                        <input
                          type="text"
                          value={diseaseForm.name}
                          onChange={(e) => setDiseaseForm(prev => ({ ...prev, name: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <input
                          type="text"
                          value={diseaseForm.description}
                          onChange={(e) => setDiseaseForm(prev => ({ ...prev, description: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Symptoms (comma separated)</label>
                        <input
                          type="text"
                          value={diseaseForm.symptoms}
                          onChange={(e) => setDiseaseForm(prev => ({ ...prev, symptoms: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Treatments (comma separated)</label>
                        <input
                          type="text"
                          value={diseaseForm.treatments}
                          onChange={(e) => setDiseaseForm(prev => ({ ...prev, treatments: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <button type="button" onClick={addDisease} className="add-disease-btn">
                      Add Disease
                    </button>
                  </div>

                  {formData.commonDiseases.length > 0 && (
                    <div className="diseases-list">
                      <h4>Added Diseases:</h4>
                      {formData.commonDiseases.map((disease, index) => (
                        <div key={index} className="disease-card">
                          <div className="disease-info">
                            <h5>{disease.name}</h5>
                            <p>{disease.description}</p>
                            {disease.symptoms.length > 0 && (
                              <div className="disease-details">
                                <strong>Symptoms:</strong> {disease.symptoms.join(', ')}
                              </div>
                            )}
                            {disease.treatments.length > 0 && (
                              <div className="disease-details">
                                <strong>Treatments:</strong> {disease.treatments.join(', ')}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDisease(index)}
                            className="remove-disease-btn"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : (editingDepartment ? "Update Department" : "Create Department")}
                  </button>
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Departments List */}
        <div className="departments-container">
          <div className="departments-header">
            <h2>All Departments</h2>
            <div className="departments-count">
              {departments.length} {departments.length === 1 ? 'Department' : 'Departments'}
            </div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏥</div>
              <h3>No departments found</h3>
              <p>Add your first department to get started!</p>
            </div>
          ) : (
            <div className="departments-grid">
              {departments.map((department) => (
                <div key={department._id} className="department-card">
                  {department.image && (
                    <div className="department-image">
                      <img 
                        src={department.image.url} 
                        alt={department.name}
                      />
                    </div>
                  )}
                  
                  <div className="department-content">
                    <div className="department-header-info">
                      <h3>{department.name}</h3>
                      {department.headOfDepartment && (
                        <div className="department-head">
                          <strong>Head:</strong> {department.headOfDepartment}
                        </div>
                      )}
                    </div>
                    
                    <p className="department-description">{department.description}</p>
                    
                    <div className="department-details">
                      {department.services && department.services.length > 0 && (
                        <div className="detail-item">
                          <strong>Services:</strong>
                          <div className="services-tags">
                            {department.services.slice(0, 3).map((service, idx) => (
                              <span key={idx} className="service-tag">{service}</span>
                            ))}
                            {department.services.length > 3 && (
                              <span className="service-tag more">+{department.services.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {department.commonDiseases && department.commonDiseases.length > 0 && (
                        <div className="detail-item">
                          <strong>Diseases Covered:</strong> {department.commonDiseases.length}
                        </div>
                      )}
                      
                      <div className="detail-item">
                        <strong>Working Hours:</strong>
                        <div className="working-hours">
                          <div>Weekdays: {department.workingHours?.weekdays}</div>
                          <div>Weekends: {department.workingHours?.weekends}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="department-actions">
                    <button
                      onClick={() => handleEdit(department)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(department._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
