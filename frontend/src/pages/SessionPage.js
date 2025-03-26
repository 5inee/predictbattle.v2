import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Layout from '../components/layout/Layout';
import Alert from '../components/layout/Alert';
import SessionStatus from '../components/session/SessionStatus';
import PredictionCard from '../components/prediction/PredictionCard';
import Loader from '../components/common/Loader';

const SessionPage = () => {
  const { code } = useParams();
  const { user, token } = useContext(AuthContext);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const predictionContainerRef = useRef(null);
  
  const [session, setSession] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [myPrediction, setMyPrediction] = useState(null);
  const [predictionText, setPredictionText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // تحميل بيانات الجلسة
  useEffect(() => {
    const fetchSession = async () => {
        try {
          setError(null);
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
          
          // الحصول على عدد التوقعات، سواء كان المستخدم قدم توقعه أم لا
          try {
            const countRes = await axios.get(`${process.env.REACT_APP_API_URL}/predictions/session/${res.data._id}/count`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            const predictionsCount = countRes.data.count;
            
            // إذا كان المستخدم قد قدم توقعه أو كانت الجلسة مكتملة، قم بتحميل محتوى التوقعات
            if (myPredRes.data || res.data.isComplete) {
              try {
                const predsRes = await axios.get(`${process.env.REACT_APP_API_URL}/predictions/session/${res.data._id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                setPredictions(predsRes.data);
              } catch (error) {
                console.error('فشل في تحميل التوقعات:', error);
                toastError('فشل في تحميل التوقعات');
                // في حالة الفشل، نريد على الأقل تعيين عدد التوقعات في الحالة
                setSession(prev => ({ ...prev, predictionsCount }));
              }
            } else {
              // تعيين عدد التوقعات في كائن الجلسة دون تحميل محتوى التوقعات
              setSession(prev => ({ ...prev, predictionsCount }));
              setPredictions([]); // لا نعرض أي توقعات إذا لم يقدم المستخدم توقعه بعد
            }
          } catch (error) {
            console.error('فشل في تحميل عدد التوقعات:', error);
          }
        } catch (err) {
          setError(err.response?.data?.message || 'فشل في تحميل بيانات الجلسة');
          toastError('فشل في تحميل بيانات الجلسة');
          console.error(err);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      };
    
    fetchSession();
    
    // تحميل البيانات كل 30 ثانية للتحديث التلقائي
    const intervalId = setInterval(() => {
      if (session && !submitting) {
        fetchSession();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [code, token, refreshing]);
  
  // تقديم توقع جديد
  const submitPrediction = async (e) => {
    e.preventDefault();
    
    if (!predictionText.trim()) {
      setError('الرجاء إدخال توقعك');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
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
      success('تم تقديم توقعك بنجاح');
      
      // إعادة تحميل البيانات بعد تقديم التوقع
      setRefreshing(true);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تقديم التوقع');
      toastError('فشل في تقديم التوقع');
    } finally {
      setSubmitting(false);
    }
  };
  
  // نسخ كود الجلسة
  const copySessionCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    success('تم نسخ كود الجلسة');
    setTimeout(() => setCopied(false), 2000);
  };
  
  // تحديث البيانات يدويًا
  const handleRefresh = () => {
    setRefreshing(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="page">
          <div className="container">
            <div className="loading-container">
              <Loader text="جاري تحميل بيانات الجلسة..." />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !session) {
    return (
      <Layout>
        <div className="page">
          <div className="container">
            <div className="error-container">
              <Alert type="danger" message={error} />
              <Link to="/dashboard" className="btn btn-primary">
                العودة إلى لوحة التحكم
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page session-page">
        <div className="container">
          <div className="card session-details-card">
            <div className="session-header">
              <h1 className="session-title">{session?.title}</h1>
              <div className="session-actions-top">
                <button 
                  className="btn btn-text btn-icon"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  title="تحديث"
                >
                  <i className={`fas fa-sync-alt ${refreshing ? 'fa-spin' : ''}`}></i>
                </button>
                <Link 
                  to="/dashboard" 
                  className="btn btn-text btn-icon"
                  title="العودة للوحة التحكم"
                >
                  <i className="fas fa-home"></i>
                </Link>
              </div>
            </div>
            
            <div className="session-meta">
              <div className="session-meta-item session-code">
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
              
              <div className="session-meta-item">
                <i className="fas fa-users icon"></i>
                المشاركين: {session?.participants.length} / {session?.maxPlayers}
              </div>
              
              <div className="session-meta-item">
                <i className="fas fa-calendar-alt icon"></i>
                تاريخ الإنشاء: {new Date(session?.createdAt).toLocaleDateString('ar-SA')}
              </div>
              
              <div className="session-meta-item">
                <i className="fas fa-user icon"></i>
                المنشئ: {session?.creator?.username || 'غير معروف'}
              </div>
            </div>
            
            <SessionStatus session={session} predictions={predictions} />
            
            {error && <Alert type="danger" message={error} />}
            
            <div className="session-content">
              {!myPrediction ? (
                <div className="prediction-form-container">
                  <h2 className="section-title">أدخل توقعك</h2>
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
                        <i className="fas fa-eraser"></i>
                        مسح
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <><Loader size="small" text="" /> جاري الإرسال...</>
                        ) : (
                          <><i className="fas fa-paper-plane"></i> إرسال التوقع</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="predictions-section">
                  <h2 className="section-title">التوقعات</h2>
                  
                  {predictions.length > 0 ? (
  <div className="predictions-container" ref={predictionContainerRef}>
    {predictions.map((prediction) => (
      <PredictionCard key={prediction._id} prediction={prediction} />
    ))}
  </div>
) : (
  <div className="empty-predictions">
    {refreshing ? (
      <Loader text="جاري تحميل التوقعات..." />
    ) : (
      <div className="waiting-predictions">
        <i className="fas fa-clock waiting-icon"></i>
        <p>في انتظار توقعات المشاركين...</p>
      </div>
    )}
  </div>
)}
                </div>
              )}
            </div>
            
            <div className="session-share">
              <h3 className="section-title">مشاركة الجلسة</h3>
              <p>يمكنك دعوة أصدقائك للانضمام إلى هذه الجلسة بمشاركة كود الجلسة معهم</p>
              
              <div className="share-code">
                <div className="share-code-text">
                  <span>كود الجلسة: </span>
                  <strong>{code}</strong>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={copySessionCode}
                >
                  {copied ? 'تم النسخ!' : 'نسخ الكود'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SessionPage;