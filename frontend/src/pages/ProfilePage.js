import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';
import Alert from '../components/layout/Alert';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [error, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { currentPassword, newPassword, confirmPassword } = formData;

  useEffect(() => {
    // يمكن إضافة تحميل بيانات المستخدم هنا إذا كان هناك حاجة لمزيد من البيانات
  }, []);
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError(null);
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من تطابق كلمات المرور
    if (newPassword !== confirmPassword) {
      setLocalError('كلمات المرور الجديدة غير متطابقة');
      return;
    }
    
    setLoading(true);
    
    try {
      // يمكن إضافة طلب API لتغيير كلمة المرور
      // هذا نموذج فقط - يتطلب إضافة الوظيفة في الباكند
      
      /*
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      */
      
      // تأخير مزيف للتمثيل (يجب إزالته في التطبيق الفعلي)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      success('تم تغيير كلمة المرور بنجاح');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setLocalError(err?.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور');
      toastError('حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="page profile-page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">الملف الشخصي</h1>
            <p className="page-description">إدارة بيانات حسابك الشخصي</p>
          </div>
          
          <div className="profile-content">
            <div className="row">
              <div className="col-md-4">
                <div className="card profile-card">
                  <div className="profile-header">
                    <div className="avatar avatar-large">{user.username.charAt(0)}</div>
                    <h2 className="profile-name">{user.username}</h2>
                    {user.isGuest && <span className="badge badge-info">حساب ضيف</span>}
                  </div>
                  
                  <div className="profile-info">
                    <div className="info-item">
                      <span className="info-label">تاريخ الانضمام</span>
                      <span className="info-value">
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('ar-SA') 
                          : 'غير متوفر'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-8">
                <div className="card">
                  <h3 className="card-title">تغيير كلمة المرور</h3>
                  
                  {error && <Alert type="danger" message={error} />}
                  
                  {user.isGuest ? (
                    <div className="guest-warning">
                      <Alert 
                        type="info" 
                        message="حسابات الضيوف لا يمكنها تغيير كلمة المرور. قم بإنشاء حساب كامل للوصول إلى جميع المميزات." 
                      />
                      <button 
                        className="btn btn-primary" 
                        onClick={() => navigate('/register')}
                      >
                        إنشاء حساب كامل
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit}>
                      <div className="form-group">
                        <label htmlFor="currentPassword" className="form-label">
                          كلمة المرور الحالية
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={currentPassword}
                          onChange={onChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">
                          كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={newPassword}
                          onChange={onChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                          تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={onChange}
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? <Loader size="small" text="" /> : 'تغيير كلمة المرور'}
                      </button>
                    </form>
                  )}
                </div>
                
                <div className="card account-actions">
                  <h3 className="card-title">إعدادات إضافية</h3>
                  
                  <button className="btn btn-secondary">
                    <i className="fas fa-download"></i>
                    تصدير بياناتك
                  </button>
                  
                  {!user.isGuest && (
                    <button className="btn btn-danger">
                      <i className="fas fa-trash-alt"></i>
                      حذف الحساب
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;