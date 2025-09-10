import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../main';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoCheckCircleFill } from 'react-icons/go';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FaEdit, FaTrash, FaEye, FaPlus, FaTags, FaCalendarAlt } from 'react-icons/fa';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  
  const { isAuthenticated, admin } = useContext(Context);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'Hospital Updates',
    author: '',
    tags: '',
    priority: 'Medium',
    isPublished: false,
    publishDate: '',
    expiryDate: '',
    image: null
  });

  const categories = [
    'Health Tips',
    'Hospital Updates', 
    'Medical Research',
    'Events',
    'Announcements',
    'Emergency Alerts'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    fetchNews();
    fetchStats();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/v1/news/admin/all",
        { withCredentials: true }
      );
      setNews(response.data.news);
    } catch (error) {
      toast.error("Failed to fetch news");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/news/admin/stats",
        { withCredentials: true }
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.summary || !formData.author) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (key !== 'image') {
          submitData.append(key, formData[key]);
        }
      });

      const url = editingNews 
        ? `http://localhost:4000/api/v1/news/update/${editingNews._id}`
        : "http://localhost:4000/api/v1/news/create";
      
      const method = editingNews ? 'put' : 'post';
      
      const response = await axios[method](url, submitData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(response.data.message);
      resetForm();
      fetchNews();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      summary: newsItem.summary,
      category: newsItem.category,
      author: newsItem.author,
      tags: newsItem.tags.join(', '),
      priority: newsItem.priority,
      isPublished: newsItem.isPublished,
      publishDate: newsItem.publishDate ? new Date(newsItem.publishDate).toISOString().split('T')[0] : '',
      expiryDate: newsItem.expiryDate ? new Date(newsItem.expiryDate).toISOString().split('T')[0] : '',
      image: null
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      try {
        await axios.delete(`http://localhost:4000/api/v1/news/delete/${id}`, {
          withCredentials: true
        });
        toast.success("News article deleted successfully");
        fetchNews();
        fetchStats();
      } catch (error) {
        toast.error("Failed to delete news article");
      }
    }
  };

  const togglePublishStatus = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/v1/news/toggle-publish/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message);
      fetchNews();
      fetchStats();
    } catch (error) {
      toast.error("Failed to update publish status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'Hospital Updates',
      author: '',
      tags: '',
      priority: 'Medium',
      isPublished: false,
      publishDate: '',
      expiryDate: '',
      image: null
    });
    setEditingNews(null);
    setShowModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (!isAuthenticated || admin.role !== "Admin") {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container form-component">
        <div className="banner">
          <h1 className="form-title">NEWS MANAGEMENT</h1>
          
          {/* Stats Cards */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="stat-card" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', margin: '0 0 0.5rem 0' }}>{stats.totalNews || 0}</h3>
              <p style={{ margin: 0, color: '#6c757d' }}>Total Articles</p>
            </div>
            <div className="stat-card" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ color: '#28a745', margin: '0 0 0.5rem 0' }}>{stats.publishedNews || 0}</h3>
              <p style={{ margin: 0, color: '#6c757d' }}>Published</p>
            </div>
            <div className="stat-card" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ color: '#ffc107', margin: '0 0 0.5rem 0' }}>{stats.draftNews || 0}</h3>
              <p style={{ margin: 0, color: '#6c757d' }}>Drafts</p>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
            style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FaPlus /> Add New Article
          </button>
        </div>

        {/* News List */}
        <div className="news-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
              No news articles found. Create your first article!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {news.map((item) => (
                <div key={item._id} className="news-item" style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  background: '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#212529' }}>{item.title}</h3>
                      <p style={{ margin: '0 0 1rem 0', color: '#6c757d', fontSize: '0.9rem' }}>{item.summary}</p>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#6c757d' }}>
                        <span><strong>Category:</strong> {item.category}</span>
                        <span><strong>Author:</strong> {item.author}</span>
                        <span style={{ color: getPriorityColor(item.priority) }}>
                          <strong>Priority:</strong> {item.priority}
                        </span>
                        <span><FaEye /> {item.views} views</span>
                      </div>

                      {item.tags.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <FaTags style={{ marginRight: '0.5rem', color: '#6c757d' }} />
                          {item.tags.map((tag, index) => (
                            <span key={index} style={{
                              background: '#e9ecef',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              marginRight: '0.5rem'
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.isPublished ? (
                        <GoCheckCircleFill style={{ color: '#28a745', fontSize: '1.2rem' }} />
                      ) : (
                        <AiFillCloseCircle style={{ color: '#dc3545', fontSize: '1.2rem' }} />
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn btn-sm"
                      style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => togglePublishStatus(item._id)}
                      className="btn btn-sm"
                      style={{ 
                        background: item.isPublished ? '#ffc107' : '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '4px' 
                      }}
                    >
                      {item.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-sm"
                      style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: 'white',
              borderRadius: '8px',
              padding: '2rem',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ marginBottom: '1.5rem' }}>
                {editingNews ? 'Edit News Article' : 'Create News Article'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label>Summary * (Max 200 characters)</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    required
                    maxLength={200}
                    rows={2}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                  />
                  <small style={{ color: '#6c757d' }}>{formData.summary.length}/200 characters</small>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label>Content *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label>Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="health, medical, hospital"
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label>Publish Date</label>
                    <input
                      type="date"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>

                  <div>
                    <label>Expiry Date (Optional)</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label>Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                    />
                    Publish immediately
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{ padding: '0.75rem 1.5rem', border: '1px solid #ddd', borderRadius: '4px', background: 'white' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', background: '#007bff', color: 'white' }}
                  >
                    {loading ? 'Saving...' : editingNews ? 'Update Article' : 'Create Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default NewsManagement;
