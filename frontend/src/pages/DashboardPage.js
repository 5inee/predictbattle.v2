import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Header from '../components/layout/Header';
import Alert from '../components/layout/Alert';
import SessionCard from '../components/prediction/SessionCard';

const DashboardPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('join');
  const [sessions, setSessions] = useState([]);
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // تحميل جلسات المستخدم
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/sessions/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessions(res.data);
      } catch (err) {
        setError('فشل في تحميل الجلسات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [token]);
  
  // التبديل بين التبويبات
  const switchTab = (tab) => {
    setActiveTab(tab);
    setError(null);
  };
  
  // الانضمام إلى جلسة
  const joinSession = async (e) => {
    e.preventDefault();
    
    if (!sessionCode.trim()) {
      setError('الرجاء إدخال كود الجلسة');
      return;
    }
    
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/sessions/join`,
        { code: sessionCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // التوجيه إلى صفحة الجلسة
      navigate(`/session/${sessionCode}`);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في الانضمام إلى الجلسة');
    }
  };

  return (
    <div className="page dashboard-page">
      <Header />
      
      <div className="page-header">
        <h1 className="page-title">لوحة التحكم</h1>
      </div>
      
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => switchTab('join')}
        >
          انضم/أنشئ جلسة
        </div>
        <div
          className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => switchTab('sessions')}
        >
          جلساتي
        </div>
      </div>
      
      {error && <Alert type="danger" message={error} />}
      
      {activeTab === 'join' && (
        <div className="card join-session-card">
          <h2>جلسات التوقعات</h2>
          <p>شارك في جلسات أو استعرض جلساتك</p>
          
          <form onSubmit={joinSession}>
            <div className="form-group">
              <label htmlFor="sessionCode" className="form-label">
                <i className="fas fa-key icon"></i>
                كود الجلسة
              </label>
              <input
                type="text"
                className="form-control"
                id="sessionCode"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="أدخل كود من 6 أحرف"
                maxLength="6"
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              انضم إلى الجلسة
            </button>
          </form>
          
          <div className="divider">
            <span>أو</span>
          </div>
          
          <Link to="/create-session" className="btn btn-secondary btn-block">
            إنشاء جلسة جديدة
          </Link>
        </div>
      )}
      
      {activeTab === 'sessions' && (
        <div className="sessions-list">
          <h2>جلساتي السابقة</h2>
          
          {loading ? (
            <p>جاري تحميل الجلسات...</p>
          ) : sessions.length === 0 ? (
            <div className="card empty-state">
              <p>لا توجد أي جلسات حتى الآن</p>
              <Link to="/create-session" className="btn btn-primary">
                إنشاء جلسة جديدة
              </Link>
            </div>
          ) : (
            sessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;