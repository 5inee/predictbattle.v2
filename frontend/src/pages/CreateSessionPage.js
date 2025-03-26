import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Header from '../components/layout/Header';
import Alert from '../components/layout/Alert';

const CreateSessionPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    maxPlayers: 2,
    secretCode: '',
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { title, maxPlayers, secretCode } = formData;
  
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'maxPlayers' ? parseInt(e.target.value) : e.target.value,
    });
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!title.trim()) {
      setError('الرجاء إدخال سؤال التحدي');
      return;
    }
    
    if (secretCode !== '021') {
      setError('الرمز السري غير صحيح');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/sessions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // التوجيه إلى صفحة الجلسة
      navigate(`/session/${res.data.code}`);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في إنشاء الجلسة');
      setLoading(false);
    }
  };

  return (
    <div className="page create-session-page">
      <Header />
      
      <div className="page-header">
        <h1 className="page-title">إنشاء جلسة جديدة</h1>
      </div>
      
      <div className="card create-session-card">
        {error && <Alert type="danger" message={error} />}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              <i className="fas fa-question-circle icon"></i>
              سؤال التحدي
            </label>
            <textarea
              className="form-control"
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="مثال: ما هو سعر البيتكوين بعد شهر من الآن؟"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="maxPlayers" className="form-label">
              <i className="fas fa-users icon"></i>
              عدد اللاعبين (2-20)
            </label>
            <input
              type="number"
              className="form-control"
              id="maxPlayers"
              name="maxPlayers"
              value={maxPlayers}
              onChange={onChange}
              min="2"
              max="20"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="secretCode" className="form-label">
              <i className="fas fa-lock icon"></i>
              الرمز السري
            </label>
            <input
              type="text"
              className="form-control"
              id="secretCode"
              name="secretCode"
              value={secretCode}
              onChange={onChange}
              placeholder="أدخل الرمز السري لإنشاء الجلسة"
              required
            />
            <small className="form-text">ملاحظة: الرمز السري هو 021</small>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'جاري الإنشاء...' : 'ابدأ الجلسة'}
          </button>
          
          <Link to="/dashboard" className="btn btn-text">
            العودة إلى لوحة التحكم
          </Link>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;