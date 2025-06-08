import mongoose from 'mongoose'

const activeUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['online', 'away', 'idle'],
    default: 'online',
  },
  location: {
    type: String,
    default: 'Unknown',
  },
  ipAddress: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    default: 'Unknown',
  },
  device: {
    type: String,
    default: 'Unknown',
  },
  sessionDuration: {
    type: Number, // in minutes
    default: 0,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  sessionStart: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Update lastActivity before saving
activeUserSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.lastActivity = new Date();
    // Calculate session duration
    const now = new Date();
    const start = this.sessionStart || now;
    this.sessionDuration = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
  }
  next();
});

export default mongoose.models.ActiveUser || mongoose.model('ActiveUser', activeUserSchema) 