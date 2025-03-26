const mongoose = require('mongoose');

const predictionSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'الرجاء إدخال نص التوقع'],
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Session',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;