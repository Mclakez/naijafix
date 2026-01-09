import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Fast lookups by userId
  },
  
  token: {
    type: String,
    required: true,
    unique: true // Each token must be unique
  },
  
  expiresAt: {
    type: Date,
    required: true
  },
  
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: Date.now }
});

// Auto-delete expired tokens (MongoDB TTL index)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
