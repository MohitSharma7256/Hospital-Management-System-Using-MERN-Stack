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
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>Department Management</h1>
          <button 
            className="btn"
            onClick={() => setShowForm(true)}
            style={{ background: "#271776", color: "white" }}
          >
            Add New Department
          </button>
        </div>

        {showForm && (
          <div style={{ 
            background: "white", 
            padding: "30px", 
            borderRadius: "10px", 
            marginBottom: "30px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h2>{editingDepartment ? "Edit Department" : "Add New Department"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label>Department Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Head of Department</label>
                  <input
                    type="text"
                    name="headOfDepartment"
                    value={formData.headOfDepartment}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>Detailed Information *</label>
                <textarea
                  name="detailedInfo"
                  value={formData.detailedInfo}
                  onChange={handleInputChange}
                  rows="5"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label>Services (comma separated)</label>
                  <textarea
                    name="services"
                    value={formData.services}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Surgery, Consultation, Emergency Care"
                  />
                </div>
                <div>
                  <label>Facilities (comma separated)</label>
                  <textarea
                    name="facilities"
                    value={formData.facilities}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="ICU, Operation Theater, Lab"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Location</label>
                  <input
                    type="text"
                    name="contactInfo.location"
                    value={formData.contactInfo.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label>Weekday Hours</label>
                  <input
                    type="text"
                    name="workingHours.weekdays"
                    value={formData.workingHours.weekdays}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Weekend Hours</label>
                  <input
                    type="text"
                    name="workingHours.weekends"
                    value={formData.workingHours.weekends}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>Department Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Disease Management Section */}
              <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <h3>Common Diseases</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                  <div>
                    <label>Disease Name</label>
                    <input
                      type="text"
                      value={diseaseForm.name}
                      onChange={(e) => setDiseaseForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label>Description</label>
                    <input
                      type="text"
                      value={diseaseForm.description}
                      onChange={(e) => setDiseaseForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                  <div>
                    <label>Symptoms (comma separated)</label>
                    <input
                      type="text"
                      value={diseaseForm.symptoms}
                      onChange={(e) => setDiseaseForm(prev => ({ ...prev, symptoms: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label>Treatments (comma separated)</label>
                    <input
                      type="text"
                      value={diseaseForm.treatments}
                      onChange={(e) => setDiseaseForm(prev => ({ ...prev, treatments: e.target.value }))}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addDisease}
                  style={{ background: "#27ae60", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px" }}
                >
                  Add Disease
                </button>

                {formData.commonDiseases.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <h4>Added Diseases:</h4>
                    {formData.commonDiseases.map((disease, index) => (
                      <div key={index} style={{ 
                        background: "#f9f9f9", 
                        padding: "10px", 
                        margin: "10px 0", 
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div>
                          <strong>{disease.name}</strong>
                          <p style={{ margin: "5px 0", fontSize: "14px" }}>{disease.description}</p>
                          {disease.symptoms.length > 0 && (
                            <p style={{ margin: "2px 0", fontSize: "12px", color: "#666" }}>
                              Symptoms: {disease.symptoms.join(', ')}
                            </p>
                          )}
                          {disease.treatments.length > 0 && (
                            <p style={{ margin: "2px 0", fontSize: "12px", color: "#666" }}>
                              Treatments: {disease.treatments.join(', ')}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDisease(index)}
                          style={{ background: "#e74c3c", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  type="submit" 
                  className="btn"
                  disabled={loading}
                  style={{ background: "#27ae60", color: "white" }}
                >
                  {loading ? "Saving..." : (editingDepartment ? "Update Department" : "Create Department")}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="btn"
                  style={{ background: "#95a5a6", color: "white" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Departments List */}
        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
          <h2>All Departments</h2>
          {loading ? (
            <p>Loading departments...</p>
          ) : departments.length === 0 ? (
            <p>No departments found. Add your first department!</p>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {departments.map((department) => (
                <div key={department._id} style={{ 
                  border: "1px solid #ddd", 
                  borderRadius: "8px", 
                  padding: "20px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "20px",
                  alignItems: "start"
                }}>
                  {department.image && (
                    <img 
                      src={department.image.url} 
                      alt={department.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  )}
                  
                  <div>
                    <h3 style={{ color: "#271776", marginBottom: "10px" }}>{department.name}</h3>
                    <p style={{ marginBottom: "10px" }}>{department.description}</p>
                    
                    {department.headOfDepartment && (
                      <p><strong>Head:</strong> {department.headOfDepartment}</p>
                    )}
                    
                    {department.services && department.services.length > 0 && (
                      <p><strong>Services:</strong> {department.services.join(', ')}</p>
                    )}
                    
                    {department.commonDiseases && department.commonDiseases.length > 0 && (
                      <p><strong>Common Diseases:</strong> {department.commonDiseases.length} diseases covered</p>
                    )}
                    
                    <p><strong>Working Hours:</strong> Weekdays: {department.workingHours?.weekdays}, Weekends: {department.workingHours?.weekends}</p>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button
                      onClick={() => handleEdit(department)}
                      style={{ 
                        background: "#f39c12", 
                        color: "white", 
                        border: "none", 
                        padding: "8px 16px", 
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(department._id)}
                      style={{ 
                        background: "#e74c3c", 
                        color: "white", 
                        border: "none", 
                        padding: "8px 16px", 
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
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
