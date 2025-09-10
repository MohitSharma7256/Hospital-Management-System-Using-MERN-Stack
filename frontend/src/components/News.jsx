import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';
import { FaCalendarAlt, FaUser, FaTag, FaEye, FaHeart, FaArrowRight } from 'react-icons/fa';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'All',
    'Health Tips',
    'Hospital Updates', 
    'Medical Research',
    'Events',
    'Announcements',
    'Emergency Alerts'
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 6
      };
      
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const response = await API.get('/api/v1/news/published', { params });
      setNews(response.data.news);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (newsId) => {
    try {
      await API.post(`/api/v1/news/like/${newsId}`);
      // Update the likes count locally
      setNews(prevNews => 
        prevNews.map(item => 
          item._id === newsId 
            ? { ...item, likes: item.likes + 1 }
            : item
        )
      );
      toast.success('Article liked!');
    } catch (error) {
      console.error('Error liking article:', error);
      toast.error('Failed to like article');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Health Tips': '#28a745',
      'Hospital Updates': '#007bff',
      'Medical Research': '#6f42c1',
      'Events': '#fd7e14',
      'Announcements': '#20c997',
      'Emergency Alerts': '#dc3545'
    };
    return colors[category] || '#6c757d';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'Urgent': '#dc3545',
      'High': '#fd7e14',
      'Medium': '#ffc107',
      'Low': '#28a745'
    };
    return colors[priority] || '#6c757d';
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <section className="news-section" style={{ padding: '4rem 0', background: '#f8f9fa' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#271777', 
            marginBottom: '1rem' 
          }}>
            Latest News & Updates
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#6c757d', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            Stay informed with the latest healthcare news, medical research, and hospital updates
          </p>
        </div>

        {/* Category Filter */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category === 'All' ? '' : category);
                setCurrentPage(1);
              }}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '25px',
                background: (selectedCategory === category || (category === 'All' && !selectedCategory)) 
                  ? '#271777' : 'white',
                color: (selectedCategory === category || (category === 'All' && !selectedCategory)) 
                  ? 'white' : '#271777',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                fontWeight: '500',
                border: '2px solid #271777'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px' 
          }}>
            <div style={{ 
              fontSize: '1.2rem', 
              color: '#6c757d',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div className="spinner" style={{
                width: '30px',
                height: '30px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #271777',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Loading news...
            </div>
          </div>
        ) : news.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#6c757d',
            fontSize: '1.1rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>No news articles found</h3>
            <p>Check back later for updates or try selecting a different category.</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {news.map((article) => (
                <article 
                  key={article._id} 
                  className="news-card"
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Image */}
                  {article.image && (
                    <div style={{ 
                      height: '200px', 
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img 
                        src={article.image.url} 
                        alt={article.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {/* Priority Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: getPriorityBadge(article.priority),
                        color: 'white',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {article.priority}
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '1.5rem' }}>
                    {/* Category and Date */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <span style={{
                        background: getCategoryColor(article.category),
                        color: 'white',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {article.category}
                      </span>
                      <span style={{ 
                        color: '#6c757d', 
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <FaCalendarAlt />
                        {formatDate(article.publishDate)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: '#212529',
                      marginBottom: '0.8rem',
                      lineHeight: '1.4'
                    }}>
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p style={{
                      color: '#6c757d',
                      lineHeight: '1.6',
                      marginBottom: '1rem',
                      fontSize: '0.95rem'
                    }}>
                      {truncateText(article.summary, 120)}
                    </p>

                    {/* Author and Stats */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      fontSize: '0.85rem',
                      color: '#6c757d'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FaUser />
                        {article.author}
                      </span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FaEye />
                          {article.views}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FaHeart />
                          {article.likes}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              display: 'inline-block',
                              background: '#e9ecef',
                              color: '#495057',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              marginRight: '0.5rem',
                              marginBottom: '0.3rem'
                            }}
                          >
                            <FaTag style={{ marginRight: '0.3rem' }} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <button
                        onClick={() => handleLike(article._id)}
                        style={{
                          background: 'none',
                          border: '1px solid #dc3545',
                          color: '#dc3545',
                          padding: '0.5rem 1rem',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#dc3545';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'none';
                          e.target.style.color = '#dc3545';
                        }}
                      >
                        <FaHeart /> Like
                      </button>

                      <button
                        style={{
                          background: '#271777',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#1a0f5c';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#271777';
                        }}
                      >
                        Read More <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '1rem'
              }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #271777',
                    background: currentPage === 1 ? '#f8f9fa' : 'white',
                    color: currentPage === 1 ? '#6c757d' : '#271777',
                    borderRadius: '5px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>

                <span style={{ color: '#6c757d' }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #271777',
                    background: currentPage === totalPages ? '#f8f9fa' : 'white',
                    color: currentPage === totalPages ? '#6c757d' : '#271777',
                    borderRadius: '5px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default News;
