const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'الرجاء إدخال اسم المستخدم'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'الرجاء إدخال كلمة المرور'],
    },
    isGuest: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  // لا نقوم بتشفير كلمة المرور للمستخدمين الضيوف
  if (this.isGuest) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// التحقق من كلمة المرور
userSchema.methods.matchPassword = async function (enteredPassword) {
  // المستخدمين العاديين يتم التحقق من كلمة المرور الخاصة بهم
  if (!this.isGuest) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  
  // المستخدمين الضيوف لا يمكنهم تسجيل الدخول بالطريقة العادية
  // يجب عليهم استخدام مسار تسجيل دخول الضيوف فقط
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;