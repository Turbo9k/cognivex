import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const workerUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: 'worker',
    enum: ['worker', 'senior_worker', 'supervisor']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  permissions: [{
    type: String,
    enum: [
      'quotes_view',
      'quotes_process',
      'reports_view',
      'analytics_view',
      'tasks_manage'
    ]
  }],
  department: {
    type: String,
    enum: ['quotes', 'support', 'sales', 'general'],
    default: 'general'
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Hash password before saving
workerUserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error as any)
  }
})

// Update the updatedAt field before saving
workerUserSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Method to check password
workerUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Method to update login info
workerUserSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date()
  this.loginCount = (this.loginCount || 0) + 1
  return this.save()
}

export default mongoose.models.WorkerUser || mongoose.model('WorkerUser', workerUserSchema) 