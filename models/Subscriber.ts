import mongoose from 'mongoose'

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  source: {
    type: String,
    enum: ['website', 'social', 'referral', 'direct'],
    default: 'website',
  },
  tags: [{
    type: String,
  }],
  lastEmailSent: {
    type: Date,
    default: null,
  },
  emailCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
subscriberSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema) 