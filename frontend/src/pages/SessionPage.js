import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Header from '../components/layout/Header';
import Alert from '../components/layout/Alert';
import SessionStatus from '../components/session/SessionStatus';
import PredictionCard from '../components/prediction/PredictionCard';

const SessionPage = () => {
  const { code } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [myPrediction, setMyPrediction] = useState(null);
  const [predictionText, setPredictionText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // تحميل بيانات الجلسة
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/sessions/code/${code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSession(res.data);
        
        // تحميل توقع المستخدم الحالي
        const myPredRes = await axios.get(`${process.env.REACT_APP_API_URL}/predictions/my/${res.data._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyPrediction(myPredRes.data);
        
        // إذا كان المستخدم قد قدم توقعًا، قم بتحميل جميع التوقعات
        if (myPredRes.data) {
          try {
            const predsRes = await axios.get(`${process.env.REACT_APP_API_URL}/predictions/session/${res.data._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setPredictions(predsRes.data);
          } catch (error) {
            console.error('فشل في تحميل التوقعات:', error);
          }
        }
      } catch (err) {
        setError('فشل في تحميل بيانات الجلسة');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [code, token]);
  
  // تقديم توقع جديد
  const submitPrediction = async (e) => {
    e.preventDefault();
    
    if (!predictionText.trim()) {
      setError('الرجاء إدخال توقعك');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/predictions`,
        {
          text: predictionText,
          sessionId: session._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setMyPrediction(res.data);
      setPredictionText('');
      
      // إعادة تحميل التوقعات بعد تقديم توقع
      try {
        const predsRes = await axios.get(`${process.env.REACT_APP_API_URL}/predictions/session/${session._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPredictions(predsRes.data);
      } catch (error) {
        console.error('فشل في تحميل التوقعات:', error);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تقديم التوقع');
    } finally {
      setSubmitting(false);
    }
  };
  
  // نسخ كود الجلسة
  const copySessionCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="page">
        <Header />
        <div className="loading">جاري التحميل...</div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="page">
        <Header />
        <div className="error-container">
          <Alert type="danger" message={error} />
          <Link to="/dashboard" className="btn btn-primary">
            العودة إلى لوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page session-page">
      <Header />
      
      <div className="card session-details-card">
        <h1 className="session-title">{session?.title}</h1>
        
        <div className="session-meta">
          <div className="session-code">
            <span>
              <i className="fas fa-key icon"></i>
              كود الجلسة: <strong>{code}</strong>
            </span>
            <button
              className="btn btn-text copy-btn"
              onClick={copySessionCode}
              title="نسخ الكود"
            >
              {copied ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
            </button>
          </div>
          
          <div className="session-participants">
            <i className="fas fa-users icon"></i>
            المشاركين: {session?.participants.length} / {session?.maxPlayers}
          </div>
        </div>
        
        <SessionStatus session={session} predictions={predictions} />
        
        {error && <Alert type="danger" message={error} />}
        
        {!myPrediction ? (
          <div className="prediction-form-container">
            <h2>أدخل توقعك</h2>
            <form onSubmit={submitPrediction}>
              <div className="form-group">
                <textarea
                  className="prediction-input"
                  value={predictionText}
                  onChange={(e) => setPredictionText(e.target.value)}
                  placeholder="اكتب توقعك هنا..."
                  required
                ></textarea>
              </div>
              
              <div className="prediction-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPredictionText('')}
                >
                  مسح
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال التوقع'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="predictions-container">
            <h2>التوقعات</h2>
            
            {predictions.length > 0 ? (
              predictions.map((prediction) => (
                <PredictionCard key={prediction._id} prediction={prediction} />
              ))
            ) : (
              <div className="loading">جاري تحميل التوقعات...</div>
            )}
          </div>
        )}
        
        <Link to="/dashboard" className="btn btn-text">
          العودة إلى لوحة التحكم
        </Link>
      </div>
    </div>
  );
};

export default SessionPage;