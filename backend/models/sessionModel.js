const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'الرجاء إدخال عنوان الجلسة'],
    },
    code: {
      type: String,
      required: [true, 'الرجاء تحديد كود الجلسة'],
      unique: true,
      length: 6,
    },
    maxPlayers: {
      type: Number,
      required: [true, 'الرجاء تحديد عدد اللاعبين'],
      min: 2,
      max: 20,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        joined: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// دالة مساعدة لإنشاء كود جلسة عشوائي
sessionSchema.statics.generateSessionCode = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;